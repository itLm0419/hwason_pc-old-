var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');
let networkSchema = new mongoose.Schema({
  createBy:{_id:String,userName:String,realName:String,createTime:Date}, //创建人信息
  region:String,           //地区
  address:String,      // 详细地址
  name:String,          //诊所名称
  code:String,         //编码
  discount: String, // 项目折扣
  status:Number, // 0 首次创建 1 创建被驳回  2 修改   3 修改被驳回  10 通过
  cooperationTime: {startTime: Date, endTime: Date}, // 合作时间
  protocolAttach: [{name:String,path:String,fileType:String}], // 协议图片附件
  supervisor:{IDNo:String,tel:String,name:String},  //负责人信息
  receiver:{_id:String,userName:String,realName:String}    // 接收员信息
});
let networkModel = mongodb.model('network',networkSchema,'network');
module.exports = networkModel;
