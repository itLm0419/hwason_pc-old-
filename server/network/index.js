
module.exports = function (app) {
   require('./createRecord/createRecord')(app);
   require('./createRecord/registInfo')(app);
   require('./examination/customerBaseInfo')(app);
   require('./examination/historyRecord')(app);
   require('./examination/userSearch')(app);
   require('./examination/examination')(app);
   require('./examination/choicePackage')(app);
};
