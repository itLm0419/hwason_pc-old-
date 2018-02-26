
'use strict';

let dbSetting = {
  db:'mongodb',
  //host:'127.0.0.1',
  host:'139.196.254.191',
  //host:'192.168.0.156', 医疗网点
  port:'28097',
  dbname:'Hwasontest',
  password:'Hwason2016-',
  username:'sa2'
};
let mongoose = require('mongoose');
 let dbStr = dbSetting.db+'://'+dbSetting.username+":"+dbSetting.password+"@"+dbSetting.host+':'+dbSetting.port+'/'+dbSetting.dbname;
//let dbStr = dbSetting.db+'://'+dbSetting.host+':'+"27017"+'/'+dbSetting.dbname;
mongoose.Promise = global.Promise;
console.log(dbStr);
let db = mongoose.createConnection(dbStr);
db.on('error',function(error){
  console.log(error);
});
module.exports = db;
