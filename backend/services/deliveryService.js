const prisma = require('../config/database');
const { sendWhatsAppMessage } = require('../integrations/whatsapp/client');
const { sendSMS } = require('../integrations/twilio/smsClient');
const { sendEmail } = require('../integrations/email/sendgridClient');
const { triggerVoiceCall } = require('../integrations/twilio/voiceClient');

async function deliverCommunication(communicationId) {
  const comm = await prisma.communication.findUnique({
    where: { id: communicationId },
    include: { lead: true }
  });
  if (!comm) throw new Error('Communication not found');

  if (comm.status !== 'QUEUED') {
    return { skipped: true, status: comm.status };
  }

  await prisma.communication.update({
    where: { id: comm.id },
    data: { status: 'SENT', sentAt: new Date() }
  });

  const payload = {
    to: comm.lead?.phone,
    email: comm.lead?.email,
    leadId: comm.leadId,
    content: comm.content,
    metadata: comm.metadata || {}
  };

  try {
    let result;
    if (comm.channel === 'WHATSAPP') result = await sendWhatsAppMessage(payload);
    else if (comm.channel === 'SMS') result = await sendSMS(payload);
    else if (comm.channel === 'EMAIL') result = await sendEmail(payload);
    else if (comm.channel === 'VOICE') result = await triggerVoiceCall(payload);
    else if (comm.channel === 'IN_APP') result = { id: `inapp_${Date.now()}`, status: 'delivered', delivered: true };
    else throw new Error(`Unsupported channel: ${comm.channel}`);

    const delivered = String(result?.status || '').toLowerCase() === 'delivered' || Boolean(result?.delivered);

    const updated = await prisma.communication.update({
      where: { id: comm.id },
      data: {
        status: delivered ? 'DELIVERED' : 'SENT',
        deliveredAt: delivered ? new Date() : null,
        metadata: { ...(comm.metadata || {}), provider: result || null }
      }
    });

    return { delivered, communication: updated, providerId: result?.id || null };
  } catch (error) {
    await prisma.communication.update({
      where: { id: comm.id },
      data: { status: 'FAILED', failReason: error.message || 'Delivery failed' }
    });
    throw error;
  }
}

module.exports = { deliverCommunication };
