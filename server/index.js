module.exports = function (app) {
   require('./network/index')(app);
   require('./package/index')(app);
   require('./userManage/index')(app);
   require('./common/common')(app);
   require('./medicalManager/index')(app);
};
