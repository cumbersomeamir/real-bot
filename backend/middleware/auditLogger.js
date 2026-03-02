const prisma = require('../config/database');

async function auditLogger(req, res, next) {
  const methodsToTrack = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!methodsToTrack.includes(req.method)) return next();

  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    try {
      if (body?.success) {
        await prisma.auditLog.create({
          data: {
            action: `${req.method} ${req.path}`,
            entity: req.baseUrl || 'api',
            entityId: req.params.id || 'n/a',
            userId: req.user?.id || null,
            details: { body: req.body },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] || null
          }
        });
      }
    } catch (error) {
      // no-op to avoid breaking responses
    }
    return originalJson(body);
  };

  return next();
}

module.exports = auditLogger;
