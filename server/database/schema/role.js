
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let roleSchema = new mongoose.Schema({
  roleName:String,   //角色名称
  roleCode:String,   //角色编码
                     // 000超级管理员 拥有所有权限
                     // 111自定义用户 无默认菜单模块
                     // A01销售部
                     // B01物流部
                     // C01诊所医生
                     // D01样本接收员
  modularId:[String],//该角色默认拥有的菜单模块
});
let roleModel = mongodb.model('role',roleSchema,'role');
module.exports = roleModel;


