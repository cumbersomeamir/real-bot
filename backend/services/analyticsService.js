function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '-';
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m <= 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

async function getOverview(prisma, organizationId) {
  const baseWhere = {
    organizationId,
    OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
  };

  const [totalLeads, hotLeads, qualifiedLeads, siteVisits, deals, campaigns] = await Promise.all([
    prisma.lead.count({ where: baseWhere }),
    prisma.lead.count({ where: { ...baseWhere, status: 'HOT' } }),
    prisma.lead.count({ where: { ...baseWhere, isQualified: true } }),
    prisma.siteVisit.count({ where: { lead: { organizationId } } }),
    prisma.deal.findMany({ where: { lead: { organizationId } }, select: { dealValue: true, status: true } }),
    prisma.campaign.findMany({ where: { project: { organizationId } }, select: { adSpend: true } })
  ]);

  const spend = campaigns.reduce((acc, c) => acc + (c.adSpend || 0), 0);
  const dealsCount = deals.length;
  const pipelineForecast = deals.reduce((acc, d) => acc + (d.dealValue || 0), 0);

  // Average response time: lead.createdAt -> first outbound communication.createdAt
  const leadsWithFirstOutbound = await prisma.lead.findMany({
    where: baseWhere,
    take: 200,
    orderBy: { createdAt: 'desc' },
    select: {
      createdAt: true,
      communications: {
        where: { direction: 'OUTBOUND' },
        take: 1,
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true }
      }
    }
  });
  const responseDeltas = leadsWithFirstOutbound
    .map((l) => {
      const first = l.communications?.[0]?.createdAt;
      if (!first) return null;
      return new Date(first).getTime() - new Date(l.createdAt).getTime();
    })
    .filter((x) => Number.isFinite(x) && x > 0);
  const avgResponseMs = responseDeltas.length
    ? responseDeltas.reduce((a, b) => a + b, 0) / responseDeltas.length
    : 0;

  const hotLeadsPct = totalLeads ? Number(((hotLeads / totalLeads) * 100).toFixed(1)) : 0;
  const qualifiedLeadsPct = totalLeads ? Number(((qualifiedLeads / totalLeads) * 100).toFixed(1)) : 0;
  const costPerLead = totalLeads ? Math.round(spend / totalLeads) : 0;
  const costPerDeal = dealsCount ? Math.round(spend / dealsCount) : 0;

  const leakage = await getLeakage(prisma, organizationId);

  return {
    totalLeads,
    hotLeadsPct,
    qualifiedLeadsPct,
    avgResponseTime: formatDuration(avgResponseMs),
    siteVisits,
    costPerLead,
    costPerDeal,
    pipelineForecast,
    leakagePct: leakage.leakagePct
  };
}

async function getFunnel(prisma, organizationId) {
  const baseWhere = {
    organizationId,
    OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
  };

  const [total, qualified, hot, siteVisit, negotiation, closed] = await Promise.all([
    prisma.lead.count({ where: baseWhere }),
    prisma.lead.count({ where: { ...baseWhere, isQualified: true } }),
    prisma.lead.count({ where: { ...baseWhere, status: 'HOT' } }),
    prisma.siteVisit.count({ where: { lead: { organizationId } } }),
    prisma.lead.count({ where: { ...baseWhere, status: 'NEGOTIATION' } }),
    prisma.deal.count({ where: { lead: { organizationId }, status: { in: ['CLOSED', 'BOOKING_DONE', 'AGREEMENT', 'REGISTRATION'] } } })
  ]);

  return {
    stages: [
      ['Captured', total],
      ['Qualified', qualified],
      ['Hot', hot],
      ['Site Visit', siteVisit],
      ['Negotiation', negotiation],
      ['Closed', closed]
    ]
  };
}

async function getRevenue(prisma, organizationId) {
  const now = new Date();
  const buckets = [30, 15, 0].map((days) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - days);
    return dt;
  });

  const sums = await Promise.all(
    buckets.map((since) =>
      prisma.deal.aggregate({
        where: { lead: { organizationId }, createdAt: { gte: since } },
        _sum: { dealValue: true }
      })
    )
  );

  return {
    trend: [
      { day: 'D-30', revenue: sums[0]?._sum?.dealValue || 0 },
      { day: 'D-15', revenue: sums[1]?._sum?.dealValue || 0 },
      { day: 'Today', revenue: sums[2]?._sum?.dealValue || 0 }
    ]
  };
}

async function getCampaigns(prisma, organizationId) {
  const campaigns = await prisma.campaign.findMany({
    where: { project: { organizationId } },
    select: { id: true, name: true, adSpend: true }
  });

  // Leads and deals linked to campaigns are optional; ROI falls back to lead/deal proxies.
  const dealCount = await prisma.deal.count({ where: { lead: { organizationId } } });
  const avgDealValueAgg = await prisma.deal.aggregate({ where: { lead: { organizationId } }, _avg: { dealValue: true } });
  const avgDealValue = avgDealValueAgg?._avg?.dealValue || 0;

  const items = await Promise.all(
    campaigns.map(async (c) => {
      const leads = await prisma.lead.count({ where: { organizationId, campaignId: c.id } });
      const estimatedDeals = Math.round((leads || 0) * 0.03);
      const deals = c.adSpend ? Math.min(dealCount || estimatedDeals, estimatedDeals || dealCount) : estimatedDeals;
      const roi = c.adSpend ? Number((((deals * avgDealValue) / (c.adSpend || 1)) || 0).toFixed(2)) : 0;
      return { campaign: c.name, spend: c.adSpend || 0, deals, roi };
    })
  );

  return { items };
}

async function getSources(prisma, organizationId) {
  const baseWhere = {
    organizationId,
    OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
  };
  const total = await prisma.lead.count({ where: baseWhere });
  const grouped = await prisma.lead.groupBy({
    by: ['source'],
    where: baseWhere,
    _count: { _all: true }
  });

  const items = grouped
    .sort((a, b) => (b._count?._all || 0) - (a._count?._all || 0))
    .map((g) => {
      const leads = g._count?._all || 0;
      const conversion = total ? Number(((leads / total) * 100).toFixed(1)) : 0;
      return { source: g.source, leads, conversion };
    });

  return { items };
}

async function getBrokers(prisma, organizationId) {
  const brokers = await prisma.user.findMany({
    where: { organizationId, role: 'BROKER', isActive: true },
    select: { id: true, name: true }
  });

  const items = await Promise.all(
    brokers.map(async (b) => {
      const [assignedLeads, closedDeals, firstOutbound] = await Promise.all([
        prisma.lead.count({
          where: {
            organizationId,
            assignedBrokerId: b.id,
            OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
          }
        }),
        prisma.deal.count({ where: { lead: { organizationId, assignedBrokerId: b.id } } }),
        prisma.communication.findMany({
          where: {
            lead: { organizationId, assignedBrokerId: b.id },
            direction: 'OUTBOUND'
          },
          take: 200,
          orderBy: { createdAt: 'asc' },
          select: { leadId: true, createdAt: true }
        })
      ]);

      const leadCreated = await prisma.lead.findMany({
        where: { organizationId, assignedBrokerId: b.id },
        take: 200,
        select: { id: true, createdAt: true }
      });
      const createdByLead = new Map(leadCreated.map((l) => [l.id, l.createdAt]));
      const deltas = firstOutbound
        .map((c) => {
          const createdAt = createdByLead.get(c.leadId);
          if (!createdAt) return null;
          return new Date(c.createdAt).getTime() - new Date(createdAt).getTime();
        })
        .filter((x) => Number.isFinite(x) && x > 0);
      const avg = deltas.length ? deltas.reduce((a, b2) => a + b2, 0) / deltas.length : 0;

      const conversion = assignedLeads ? Number(((closedDeals / assignedLeads) * 100).toFixed(1)) : 0;
      return { broker: b.name, responseTime: formatDuration(avg), conversion };
    })
  );

  return { items };
}

async function getForecast(prisma, organizationId) {
  const [hot, qualified, total, pipeline] = await Promise.all([
    prisma.lead.count({ where: { organizationId, status: 'HOT', OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
    prisma.lead.count({ where: { organizationId, isQualified: true, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
    prisma.lead.count({ where: { organizationId, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
    prisma.deal.aggregate({ where: { lead: { organizationId } }, _sum: { dealValue: true } })
  ]);

  const base = pipeline?._sum?.dealValue || 0;
  const confidence = total ? Math.min(0.95, Math.max(0.2, (qualified + hot) / (2 * total))) : 0.2;
  const projection = Math.round(base * (0.7 + confidence));
  const lowerBound = Math.round(projection * 0.83);
  const upperBound = Math.round(projection * 1.2);

  return { projection, confidence: Number(confidence.toFixed(2)), lowerBound, upperBound };
}

async function getLeakage(prisma, organizationId) {
  const baseWhere = {
    organizationId,
    OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
  };

  const total = await prisma.lead.count({ where: baseWhere });
  const noFollowUpLeads = await prisma.lead.count({
    where: {
      ...baseWhere,
      status: { in: ['NEW', 'CONTACTED', 'QUALIFIED', 'HOT', 'WARM', 'COLD', 'NEGOTIATION'] },
      OR: [{ nextFollowUpAt: null }, { nextFollowUpAt: { isSet: false } }]
    }
  });

  const leakagePct = total ? Number(((noFollowUpLeads / total) * 100).toFixed(1)) : 0;
  const estimatedRecoverable = Math.round(noFollowUpLeads * 250000); // heuristic for demo

  return { leakagePct, noFollowUpLeads, estimatedRecoverable };
}

module.exports = {
  getOverview,
  getFunnel,
  getRevenue,
  getCampaigns,
  getSources,
  getBrokers,
  getForecast,
  getLeakage
};
