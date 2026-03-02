const QualificationAgent = require('./qualificationAgent');
const FollowUpAgent = require('./followUpAgent');
const ReactivationAgent = require('./reactivationAgent');
const VoiceAgent = require('./voiceAgent');
const ScoringAgent = require('./scoringAgent');
const AnalyticsAgent = require('./analyticsAgent');

class AgentOrchestrator {
  constructor() {
    this.qualificationAgent = new QualificationAgent();
    this.followUpAgent = new FollowUpAgent();
    this.reactivationAgent = new ReactivationAgent();
    this.voiceAgent = new VoiceAgent();
    this.scoringAgent = new ScoringAgent();
    this.analyticsAgent = new AnalyticsAgent();
  }

  async onLeadCreated(lead) {
    const qualification = await this.qualificationAgent.execute({ leadId: lead.id });
    const scoring = await this.scoringAgent.execute({ lead });
    const actions = [];

    if (scoring.score >= 80) {
      actions.push(await this.voiceAgent.execute({ leadId: lead.id }));
    }

    actions.push(await this.followUpAgent.execute({ leadId: lead.id }));

    return { qualification, scoring, actions };
  }

  async onLeadUpdated(lead) {
    return this.scoringAgent.execute({ lead });
  }

  async onScheduleTriggered(payload) {
    return this.followUpAgent.execute(payload);
  }

  async onOldLeadsUploaded(payload) {
    const react = await this.reactivationAgent.execute(payload);
    return { react };
  }

  async onAnomalyDetected(payload) {
    return this.analyticsAgent.execute(payload);
  }
}

module.exports = new AgentOrchestrator();
