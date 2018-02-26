module.exports = function (app) {
  require('./accountApplication/accountApplication')(app);
  require('./medicalCenter/doctor')(app);
  require('./medicalCenter/medicalCenter')(app);
  require('./sampleReceiver/sampleReceiver')(app);
};
