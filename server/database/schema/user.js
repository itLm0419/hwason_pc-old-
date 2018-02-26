
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');
//体检用户表
let userSchema = new mongoose.Schema({
   name:String,   //姓名
   userType:Number, // 1 医疗网点录入 2 保险机构录入
   sex:String,    //性别
   createBy:{_id:String,userName:String,realName:String,createTime:Date},  //创建人
   IDNo:String, //身份证号
   tel:String,  //手机号码
   region:String,   // 居住地
   address:String,  //详细地址
   weight:Number,   //体重
   height:Number,   //身高
   regularExamination:String,  //是否定期体检 是或否
   liveArea:String,            //近期居住地   城镇或农村
   disease:[{name:String,hasDisease:[String]}],  //疾病  疾病类型  所患疾病
   healthStatus:[{name:String,value:String,}],           //健康状态  问题名称 所选值
   otherDesc:String, //其他说明
   interrogation:[{//问诊
     illness:String,//病情
     advice:String,//建议
     prescription:String,//处方
     userName:String,
     realName:String,
     createTime:Date
   }]
});
let userModel = mongodb.model('user',userSchema,'user');
module.exports = userModel;
