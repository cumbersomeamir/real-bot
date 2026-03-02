require('./leadWorker');
require('./followUpWorker');
require('./communicationWorker');
require('./reactivationWorker');
require('./scoringWorker');
require('./voiceCallWorker');

process.stdout.write('DealFlow queue workers running\n');
