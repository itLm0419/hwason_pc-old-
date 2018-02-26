
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let sampleReceiverSchema = new mongoose.Schema({
  _id:String, //引用login表_id
  name:String,
  sex:String,
  region:String,
  IDNo:String,
  tel:String,
  createBy:{_id:String,realName:String,userName:String,createTime:Date},
});
let sampleReceiverModel = mongodb.model('sampleReceiver',sampleReceiverSchema,'sampleReceiver');
module.exports = sampleReceiverModel;

