
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let loginSchema = new mongoose.Schema({
  userName:String,      //账号
  tel:String,           //电话号码
  password:String,      //密码 加密后密码
  realName:String,      //真实姓名
  role:{roleName:String,roleCode:String},          //角色
  modularId:[String],   //拥有的菜单模块
  createBy:{_id:String,realName:String,userName:String,createTime:Date},
  status:Number,        // 1 正常 2 停用
});
let loginModel = mongodb.model('login',loginSchema,'login');
module.exports = loginModel;
