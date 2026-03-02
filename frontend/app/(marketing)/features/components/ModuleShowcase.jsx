'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/constants';
import { getAuthToken, setAuthToken } from '@/lib/authClient';
import { Button, Card, Input, Select } from '@/components/ui';
import { notifyError, notifySuccess } from '@/components/ui/Toast';

const DEFAULT_CREDS = {
  email: 'owner@dealflow.ai',
  password: 'Password@123'
};

const MODULE_ROUTES = {
  'Lead Intake Engine': '/leads',
  'AI Qualification Engine': '/ai-agents/qualification',
  'Automated Follow-Up Engine': '/communications',
  'Broker Accountability System': '/brokers',
  'Reactivation Engine': '/ai-agents/reactivation',
  'Revenue Intelligence Dashboard': '/analytics',
  'Admin & Compliance Layer': '/settings'
};

const MOCK_BROKERS = [
  { id: 'mock-broker-1', name: 'Aman Shah', responseTimeMins: 4, conversionPct: 12.5, monthlyClosures: 7 },
  { id: 'mock-broker-2', name: 'Ritu Singh', responseTimeMins: 6, conversionPct: 10.4, monthlyClosures: 5 }
];

const MOCK_PROJECTS = [
  { id: 'mock-project-1', name: 'Skyline Heights', city: 'Pune', totalUnits: 160, availableUnits: 42 }
];

function randomId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function pickLead(items = []) {
  return items.find((item) => item?.status !== 'CLOSED_WON' && item?.status !== 'DEAD') || items[0] || null;
}

function makeInitialMockState() {
  return {
    leads: [
      {
        id: 'mock-lead-1',
        name: 'Rahul Verma',
        phone: '+919999111111',
        email: 'rahul@example.com',
        source: 'GOOGLE_ADS',
        status: 'NEW',
        score: 42,
        assignedBrokerId: null,
        createdAt: new Date().toISOString()
      }
    ],
    brokers: MOCK_BROKERS,
    projects: MOCK_PROJECTS,
    templates: [],
    messages: [],
    rules: [],
    campaigns: [],
    apiKeys: [],
    settings: { timezone: 'Asia/Kolkata', currency: 'INR' },
    auditLogs: [{ id: 'audit-1', action: 'SYSTEM_INIT', createdAt: new Date().toISOString() }]
  };
}

const INITIAL_MOCK_STATE = makeInitialMockState();

function makeInitialOutputs(state) {
  const lead = state.leads[0];
  const broker = state.brokers[0];
  const now = new Date().toISOString();

  return {
    'Lead Intake Engine': {
      mode: 'mock',
      preloaded: true,
      ingestedLead: lead,
      recentLeads: state.leads.slice(0, 1),
      importJob: { imported: 50, deduped: 8, validated: true }
    },
    'AI Qualification Engine': {
      mode: 'mock',
      preloaded: true,
      leadId: lead.id,
      qualification: { status: 'qualified', channel: 'WHATSAPP', latencySeconds: 22 },
      scoring: { score: 84, scoreBreakdown: { budget: 30, urgency: 25, engagement: 29 } },
      leadSnapshot: { ...lead, score: 84, status: 'HOT', isQualified: true, qualifiedAt: now }
    },
    'Automated Follow-Up Engine': {
      mode: 'mock',
      preloaded: true,
      leadId: lead.id,
      template: { id: 'tpl-initial', name: 'initial_template', status: 'approved' },
      queued: { id: 'msg-initial', channel: 'WHATSAPP', status: 'QUEUED' },
      queueReport: { queued: 1, delivered: 0, failed: 0 },
      delivery: { whatsappDeliveryRate: 96.2, smsDeliveryRate: 93.1, emailOpenRate: 42.8 }
    },
    'Broker Accountability System': {
      mode: 'mock',
      preloaded: true,
      leadId: lead.id,
      brokerId: broker.id,
      assignedLead: { ...lead, assignedBrokerId: broker.id, lastContactAt: now },
      performance: {
        responseTime: '4m 12s',
        conversionRate: 12.5,
        firstCallRate: 83,
        monthlyClosures: 7
      },
      leaderboard: {
        items: state.brokers.map((item, index) => ({ rank: index + 1, broker: item.name, score: Math.max(95 - index * 6, 70) }))
      }
    },
    'Reactivation Engine': {
      mode: 'mock',
      preloaded: true,
      campaign: { campaignId: 'react-initial', status: 'started', uploadedLeads: 200, matchedToCurrentInventory: 47 },
      agentState: { type: 'reactivation', active: true, successRate: 0.83 },
      logs: [
        { at: now, action: 'cross_project_match', leadsMatched: 47 },
        { at: now, action: 'sequence_queued', leadsQueued: 47 }
      ]
    },
    'Revenue Intelligence Dashboard': {
      mode: 'mock',
      preloaded: true,
      overview: { totalLeads: 50, hotLeadPct: 18, leakagePct: 34, pipelineForecast: 84000000 },
      funnel: { captured: 50, qualified: 42, hot: 9, siteVisits: 20, closed: 4 },
      campaigns: {
        items: [
          { campaign: 'Meta-Pune-Luxury', spend: 1200000, revenue: 8200000, roi: 6.8 },
          { campaign: 'Google-Search-2BHK', spend: 650000, revenue: 3900000, roi: 6.0 }
        ]
      },
      sources: {
        items: [
          { source: 'META_ADS', leads: 38, conversion: 9.4 },
          { source: 'GOOGLE_ADS', leads: 12, conversion: 11.8 }
        ]
      },
      forecast: { projection: 93000000, confidence: 0.79 },
      leakage: { leadsWithoutFollowUp: 17, leakagePct: 34 }
    },
    'Admin & Compliance Layer': {
      mode: 'mock',
      preloaded: true,
      settings: state.settings,
      teamCount: state.brokers.length + 3,
      apiKeyCount: 1,
      recentAuditLogs: state.auditLogs
    }
  };
}

export default function ModuleShowcase({ modules = [] }) {
  const [creds, setCreds] = useState(DEFAULT_CREDS);
  const [selectedModule, setSelectedModule] = useState(modules[0]?.title || 'Lead Intake Engine');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(() => makeInitialOutputs(INITIAL_MOCK_STATE));
  const [context, setContext] = useState({ leadId: null, brokerId: null, projectId: null, ruleId: null });
  const [runAt, setRunAt] = useState(() => new Date().toISOString());
  const [mode, setMode] = useState('mock');
  const [mockState, setMockState] = useState(INITIAL_MOCK_STATE);

  const options = useMemo(() => modules.map((m) => ({ label: m.title, value: m.title })), [modules]);
  const hasToken = Boolean(getAuthToken());
  const canRun = mode === 'mock' || hasToken;

  const fetchWithTimeout = async (url, init = {}, timeoutMs = 6000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  };

  const request = async (path, method = 'GET', body) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please connect a demo account first.');
    }

    const response = await fetchWithTimeout(`${API_URL}/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const payload = await response.json();
    if (!response.ok || payload?.success === false) {
      throw new Error(payload?.error?.message || payload?.message || `Request failed: ${response.status}`);
    }
    return payload?.data ?? payload;
  };

  const connectDemo = async () => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.email, password: creds.password })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message || 'Login failed');
      }
      setAuthToken(payload.data.accessToken);
      setMode('api');
      notifySuccess('Connected to demo account');
    } catch (error) {
      setMode('mock');
      notifyError(`Backend unavailable. Switched to local demo mode. (${error.message || 'Connection error'})`);
    } finally {
      setLoading(false);
    }
  };

  const switchToMockMode = () => {
    setMode('mock');
    notifySuccess('Local demo mode enabled');
  };

  const ensureContext = async () => {
    const [leadsRes, brokersRes, projectsRes] = await Promise.all([
      request('/leads?limit=10'),
      request('/brokers'),
      request('/projects')
    ]);
    const lead = pickLead(leadsRes?.items || []);
    const broker = (brokersRes?.items || [])[0];
    const project = (projectsRes?.items || [])[0];

    const next = {
      leadId: context.leadId || lead?.id || null,
      brokerId: context.brokerId || broker?.id || null,
      projectId: context.projectId || project?.id || null,
      ruleId: context.ruleId || null
    };

    setContext(next);
    return next;
  };

  const ensureMockContext = () => {
    const lead = pickLead(mockState.leads);
    const broker = mockState.brokers[0];
    const project = mockState.projects[0];
    const next = {
      leadId: context.leadId || lead?.id || null,
      brokerId: context.brokerId || broker?.id || null,
      projectId: context.projectId || project?.id || null,
      ruleId: context.ruleId || null
    };
    setContext(next);
    return next;
  };

  const runLeadIntake = async () => {
    const random = Date.now();
    const leadPayload = {
      name: `Feature Demo Lead ${String(random).slice(-5)}`,
      phone: `+9199${String(random).slice(-8)}`,
      email: `feature+${random}@dealflow.ai`,
      source: 'META_ADS',
      sourceDetail: 'Feature Page Demo',
      utmSource: 'meta',
      utmMedium: 'cpc',
      utmCampaign: 'feature-module-live',
      status: 'NEW'
    };

    const created = await request('/leads', 'POST', leadPayload);
    const leads = await request('/leads?limit=5');
    const imported = await request('/leads/import', 'POST', {});

    setContext((prev) => ({ ...prev, leadId: created?.id || prev.leadId }));

    return {
      mode: 'api',
      ingestedLead: created,
      recentLeads: (leads?.items || []).slice(0, 5),
      importJob: imported
    };
  };

  const runQualification = async () => {
    const ctx = await ensureContext();
    if (!ctx.leadId) throw new Error('No lead found. Run Lead Intake first.');

    const qualification = await request(`/leads/${ctx.leadId}/qualify`, 'POST', {});
    const scoring = await request(`/leads/${ctx.leadId}/score`, 'POST', {});
    const lead = await request(`/leads/${ctx.leadId}`);

    return {
      mode: 'api',
      leadId: ctx.leadId,
      qualification,
      scoring,
      leadSnapshot: lead
    };
  };

  const runFollowUp = async () => {
    const ctx = await ensureContext();
    if (!ctx.leadId) throw new Error('No lead found. Run Lead Intake first.');

    const template = await request('/communications/templates', 'POST', {
      name: `feature_template_${Date.now()}`,
      category: 'marketing',
      content: 'Hi {{name}}, your project brochure is ready.',
      variables: ['name']
    });

    const queued = await request('/communications/send', 'POST', {
      leadId: ctx.leadId,
      channel: 'WHATSAPP',
      content: 'Feature page demo follow-up message'
    });

    const queueReport = await request('/communications/queue');
    const delivery = await request('/communications/delivery-report');

    return {
      mode: 'api',
      leadId: ctx.leadId,
      template,
      queued,
      queueReport,
      delivery
    };
  };

  const runBrokerAccountability = async () => {
    const ctx = await ensureContext();
    if (!ctx.leadId || !ctx.brokerId) {
      throw new Error('Need at least one lead and one broker in your demo data.');
    }

    const assigned = await request(`/leads/${ctx.leadId}/assign`, 'POST', { brokerId: ctx.brokerId });
    const performance = await request(`/brokers/${ctx.brokerId}/performance`);
    const leaderboard = await request('/brokers/leaderboard');

    return {
      mode: 'api',
      leadId: ctx.leadId,
      brokerId: ctx.brokerId,
      assignedLead: assigned,
      performance,
      leaderboard
    };
  };

  const runReactivation = async () => {
    const campaign = await request('/agents/reactivation/campaign', 'POST', {
      name: `Feature Reactivation ${Date.now()}`,
      source: 'feature-page'
    });
    const agentState = await request('/agents/reactivation');
    const logs = await request('/agents/reactivation/logs');

    return {
      mode: 'api',
      campaign,
      agentState,
      logs: (logs?.items || []).slice(0, 10)
    };
  };

  const runRevenueIntelligence = async () => {
    const [overview, funnel, campaigns, sources, forecast, leakage] = await Promise.all([
      request('/analytics/overview'),
      request('/analytics/funnel'),
      request('/analytics/campaigns'),
      request('/analytics/sources'),
      request('/analytics/forecast'),
      request('/analytics/leakage')
    ]);

    return {
      mode: 'api',
      overview,
      funnel,
      campaigns,
      sources,
      forecast,
      leakage
    };
  };

  const runAdminCompliance = async () => {
    const settings = await request('/settings');
    const team = await request('/team');
    const auditLogs = await request('/audit-logs');
    const apiKeys = await request('/api-keys');

    const touched = await request('/settings', 'PUT', {
      ...settings,
      featureConsoleLastRunAt: new Date().toISOString()
    });

    return {
      mode: 'api',
      settings: touched,
      teamCount: (team?.items || []).length,
      apiKeyCount: (apiKeys?.items || []).length,
      recentAuditLogs: (auditLogs?.items || []).slice(0, 10)
    };
  };

  const runLeadIntakeMock = () => {
    const lead = {
      id: randomId('mock-lead'),
      name: `Mock Lead ${mockState.leads.length + 1}`,
      phone: `+9198${String(Date.now()).slice(-8)}`,
      email: `mock+${Date.now()}@dealflow.ai`,
      source: 'META_ADS',
      status: 'NEW',
      score: 35,
      assignedBrokerId: null,
      createdAt: new Date().toISOString()
    };
    const nextLeads = [lead, ...mockState.leads].slice(0, 20);
    setMockState((prev) => ({ ...prev, leads: nextLeads }));
    setContext((prev) => ({ ...prev, leadId: lead.id }));
    return {
      mode: 'mock',
      ingestedLead: lead,
      recentLeads: nextLeads.slice(0, 5),
      importJob: { imported: 50, deduped: 8, validated: true }
    };
  };

  const runQualificationMock = () => {
    const ctx = ensureMockContext();
    if (!ctx.leadId) throw new Error('No mock lead available.');
    const nextLeads = mockState.leads.map((lead) =>
      lead.id === ctx.leadId
        ? { ...lead, score: 84, status: 'HOT', isQualified: true, qualifiedAt: new Date().toISOString() }
        : lead
    );
    setMockState((prev) => ({ ...prev, leads: nextLeads }));
    const lead = nextLeads.find((item) => item.id === ctx.leadId);
    return {
      mode: 'mock',
      leadId: ctx.leadId,
      qualification: { status: 'qualified', channel: 'WHATSAPP', latencySeconds: 22 },
      scoring: { score: lead?.score || 84, scoreBreakdown: { budget: 30, urgency: 25, engagement: 29 } },
      leadSnapshot: lead
    };
  };

  const runFollowUpMock = () => {
    const ctx = ensureMockContext();
    if (!ctx.leadId) throw new Error('No mock lead available.');
    const template = {
      id: randomId('tpl'),
      name: `mock_template_${Date.now()}`,
      content: 'Hi {{name}}, book your site visit this week.',
      status: 'approved'
    };
    const message = {
      id: randomId('msg'),
      leadId: ctx.leadId,
      channel: 'WHATSAPP',
      status: 'QUEUED',
      createdAt: new Date().toISOString()
    };
    setMockState((prev) => ({
      ...prev,
      templates: [template, ...prev.templates].slice(0, 20),
      messages: [message, ...prev.messages].slice(0, 50)
    }));
    return {
      mode: 'mock',
      leadId: ctx.leadId,
      template,
      queued: message,
      queueReport: {
        queued: mockState.messages.length + 1,
        delivered: Math.max(mockState.messages.length - 2, 0),
        failed: 1
      },
      delivery: { whatsappDeliveryRate: 96.2, smsDeliveryRate: 93.1, emailOpenRate: 42.8 }
    };
  };

  const runBrokerAccountabilityMock = () => {
    const ctx = ensureMockContext();
    if (!ctx.leadId || !ctx.brokerId) throw new Error('No mock lead or broker available.');
    const nextLeads = mockState.leads.map((lead) =>
      lead.id === ctx.leadId ? { ...lead, assignedBrokerId: ctx.brokerId, lastContactAt: new Date().toISOString() } : lead
    );
    setMockState((prev) => ({ ...prev, leads: nextLeads }));
    return {
      mode: 'mock',
      leadId: ctx.leadId,
      brokerId: ctx.brokerId,
      assignedLead: nextLeads.find((lead) => lead.id === ctx.leadId),
      performance: {
        responseTime: '4m 12s',
        conversionRate: 12.5,
        firstCallRate: 83,
        monthlyClosures: 7
      },
      leaderboard: {
        items: mockState.brokers.map((broker, index) => ({
          rank: index + 1,
          broker: broker.name,
          score: Math.max(95 - index * 6, 70)
        }))
      }
    };
  };

  const runReactivationMock = () => {
    const campaign = {
      campaignId: randomId('react'),
      status: 'started',
      uploadedLeads: 200,
      matchedToCurrentInventory: 47
    };
    setMockState((prev) => ({
      ...prev,
      campaigns: [campaign, ...prev.campaigns].slice(0, 20)
    }));
    return {
      mode: 'mock',
      campaign,
      agentState: { type: 'reactivation', active: true, successRate: 0.83 },
      logs: [
        { at: new Date().toISOString(), action: 'cross_project_match', leadsMatched: 47 },
        { at: new Date().toISOString(), action: 'sequence_queued', leadsQueued: 47 }
      ]
    };
  };

  const runRevenueIntelligenceMock = () => {
    const totalLeads = mockState.leads.length;
    const hotLeads = mockState.leads.filter((lead) => lead.score >= 80).length;
    const leaked = mockState.leads.filter((lead) => !lead.assignedBrokerId).length;
    return {
      mode: 'mock',
      overview: {
        totalLeads,
        hotLeadPct: totalLeads ? Number(((hotLeads / totalLeads) * 100).toFixed(1)) : 0,
        leakagePct: totalLeads ? Number(((leaked / totalLeads) * 100).toFixed(1)) : 0,
        pipelineForecast: 84000000
      },
      funnel: {
        captured: totalLeads,
        qualified: Math.max(totalLeads - 8, 0),
        hot: hotLeads,
        siteVisits: Math.max(Math.floor(totalLeads * 0.4), 1),
        closed: Math.max(Math.floor(totalLeads * 0.08), 1)
      },
      campaigns: {
        items: [
          { campaign: 'Meta-Pune-Luxury', spend: 1200000, revenue: 8200000, roi: 6.8 },
          { campaign: 'Google-Search-2BHK', spend: 650000, revenue: 3900000, roi: 6.0 }
        ]
      },
      sources: {
        items: [
          { source: 'META_ADS', leads: Math.max(totalLeads - 12, 0), conversion: 9.4 },
          { source: 'GOOGLE_ADS', leads: 12, conversion: 11.8 }
        ]
      },
      forecast: { projection: 93000000, confidence: 0.79 },
      leakage: { leadsWithoutFollowUp: leaked, leakagePct: totalLeads ? Number(((leaked / totalLeads) * 100).toFixed(1)) : 0 }
    };
  };

  const runAdminComplianceMock = () => {
    const nextSettings = { ...mockState.settings, featureConsoleLastRunAt: new Date().toISOString() };
    const key = {
      id: randomId('key'),
      name: `feature-key-${mockState.apiKeys.length + 1}`,
      key: `df_${Math.random().toString(36).slice(2)}`
    };
    const log = { id: randomId('audit'), action: 'SETTINGS_UPDATED', createdAt: new Date().toISOString() };
    setMockState((prev) => ({
      ...prev,
      settings: nextSettings,
      apiKeys: [key, ...prev.apiKeys].slice(0, 20),
      auditLogs: [log, ...prev.auditLogs].slice(0, 50)
    }));
    return {
      mode: 'mock',
      settings: nextSettings,
      teamCount: mockState.brokers.length + 3,
      apiKeyCount: mockState.apiKeys.length + 1,
      recentAuditLogs: [log, ...mockState.auditLogs].slice(0, 10)
    };
  };

  const runModule = async (moduleTitle) => {
    const apiRunners = {
      'Lead Intake Engine': runLeadIntake,
      'AI Qualification Engine': runQualification,
      'Automated Follow-Up Engine': runFollowUp,
      'Broker Accountability System': runBrokerAccountability,
      'Reactivation Engine': runReactivation,
      'Revenue Intelligence Dashboard': runRevenueIntelligence,
      'Admin & Compliance Layer': runAdminCompliance
    };

    const mockRunners = {
      'Lead Intake Engine': runLeadIntakeMock,
      'AI Qualification Engine': runQualificationMock,
      'Automated Follow-Up Engine': runFollowUpMock,
      'Broker Accountability System': runBrokerAccountabilityMock,
      'Reactivation Engine': runReactivationMock,
      'Revenue Intelligence Dashboard': runRevenueIntelligenceMock,
      'Admin & Compliance Layer': runAdminComplianceMock
    };

    const apiRunner = apiRunners[moduleTitle];
    const mockRunner = mockRunners[moduleTitle];
    if (!apiRunner || !mockRunner) {
      notifyError(`No runner found for ${moduleTitle}`);
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === 'api') {
        try {
          result = await apiRunner();
        } catch (error) {
          setMode('mock');
          notifyError(`API run failed for ${moduleTitle}. Falling back to local mode. (${error.message})`);
          result = mockRunner();
        }
      } else {
        result = mockRunner();
      }

      setOutput((prev) => ({ ...prev, [moduleTitle]: result }));
      setRunAt(new Date().toISOString());
      notifySuccess(`${moduleTitle} is functional (${result.mode})`);
    } catch (error) {
      notifyError(error.message || `Failed to run ${moduleTitle}`);
    } finally {
      setLoading(false);
    }
  };

  const runAllModules = async () => {
    for (const module of modules) {
      // eslint-disable-next-line no-await-in-loop
      await runModule(module.title);
    }
  };

  return (
    <Card className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg">Live Capability Console</h4>
          <p className="mt-1 text-sm text-slate-400">Run each feature module from this page. Uses API mode, then auto-falls back to local demo mode if backend is unavailable.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs ${mode === 'api' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {mode === 'api' ? (hasToken ? 'API mode connected' : 'API mode not connected') : 'Local demo mode'}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Input
          value={creds.email}
          onChange={(e) => setCreds((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="Demo email"
        />
        <Input
          type="password"
          value={creds.password}
          onChange={(e) => setCreds((prev) => ({ ...prev, password: e.target.value }))}
          placeholder="Demo password"
        />
        <Button onClick={connectDemo} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Demo Account'}
        </Button>
        <Button variant="ghost" onClick={switchToMockMode} disabled={loading}>
          Use Local Demo Mode
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} options={options} />
        <Button variant="secondary" onClick={() => runModule(selectedModule)} disabled={loading || !canRun}>
          {loading ? 'Running...' : 'Run Selected Module'}
        </Button>
        <Button variant="ghost" onClick={runAllModules} disabled={loading || !canRun}>
          Run All 7 Modules
        </Button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {modules.map((module) => {
          const route = MODULE_ROUTES[module.title] || '/dashboard';
          const resultExists = Boolean(output[module.title]);
          return (
            <div key={module.title} className="rounded-lg border border-border bg-surface-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{module.title}</p>
                <span className={`rounded-full px-2 py-1 text-[11px] ${resultExists ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                  {resultExists ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => runModule(module.title)} disabled={loading || !canRun}>
                  Test
                </Button>
                <Button asChild size="sm">
                  <Link href={route}>Open Module</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface-secondary p-4">
        <p className="text-sm text-slate-300">Latest run: {runAt ? new Date(runAt).toLocaleString('en-IN') : 'Not run yet'}</p>
        <pre className="mt-3 max-h-[420px] overflow-auto rounded-md border border-border bg-surface p-3 text-xs text-slate-200">
          {JSON.stringify(output[selectedModule] || { message: 'Run a module to view output' }, null, 2)}
        </pre>
      </div>
    </Card>
  );
}
