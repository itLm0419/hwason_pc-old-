
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let doctorSchema = new mongoose.Schema({
    _id:String,  //登录表id
    name:String,
    sex:String,
    IDNo:String,
    tel:String,
    doctorTime:Date, //从医时间
    education:String,
    beGoodAt:String,
    createBy:{_id:String,realName:String,userName:String,createTime:Date}, //创建人信息
    networkId:String, //所属医疗网点id
});
let doctorModel = mongodb.model('doctor',doctorSchema,'doctor');
module.exports = doctorModel;
