
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let staffSchema = new mongoose.Schema({
  _id:String,            //引用员工表_id
  department:String,     //部门
  realName:String,       //真实姓名
  role:String,           //角色
  superiorId:String,     //上司的Id
});
let staffModel = mongodb.model('staff',staffSchema,'staff');
module.exports = staffModel;
