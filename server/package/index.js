module.exports = function (app) {

   require('./createPackage/createHsPackage')(app);
   require('./createPackage/selectContents')(app);
   require('./packageList/packageList')(app);
};
