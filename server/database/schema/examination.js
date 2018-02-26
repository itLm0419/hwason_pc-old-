
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let examinationSchema = new mongoose.Schema({
    barcode:String,
    userId:String,//引用user表_id
    name:String,//体检人姓名
    sex:String,//体检人性别
    IDNo:String,//体检人身份证号
    region:String,//体检人地区
    createBy:{_id:String,userName:String,realName:String,createTime:Date}, //创建人信息
    sender:{_id:String,userName:String,realName:String},     //发货人信息
    receiver:{_id:String,userName:String,realName:String},   //收货人信息
    sendTime:Date,        //发货时间
    receiverTime:Date,    //收货时间
    courierNo:String,     //快递单号
    examinationUnit:{_id:String,name:String},  //检测单位
    network:{_id:String,name:String},  //医疗网点
    infoSource:Number,   //1 医疗网店录入 2 保险机构体检录入
    status:Number,
                   // 5待收件
                   // 10待发货
                   // 15已发货
                   // 20已收货
                   // 20报告已生成
                   // 25等待专家建议
                   // 30建议已完成
                   // 35已完成（已下载）
    projects:[{
      projectType:Number, //1 华晟体检套餐  2 自定义套餐
      category:String,//套餐所属类别
      name:String,  //检测项目名称
      originalPrice:Number,  //原价
      actualPayment:Number,  //实际支付
      content:[{hsName:String,hsCode:String,lcName:String,lcCode:String}]
    }],
    abnormal:[String],//哪些检测项目出现异常
});
let examinationModel = mongodb.model('examination',examinationSchema,'examination');
module.exports = examinationModel;
