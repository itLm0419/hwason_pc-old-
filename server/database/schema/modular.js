
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let modularSchema = new mongoose.Schema({
  name:String,  //模块名称
  level:String, //1.一级菜单  2.二级菜单
  path:String,  //路由路径 一级菜单不需要
  icon:String,  //图标
  children:[{
    name:String,  //模块名称
    path:String,
  }]
});
let modularModel = mongodb.model('modular',modularSchema,'modular');
module.exports = modularModel;

