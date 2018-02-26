/**
 * Created by win7 on 2017/4/5.
 */
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let projectSchema = new mongoose.Schema({
  category:String,   //类别
  categoryCode:String,  //类别编码
  level:Number,// 1.一级套餐  2.二级套餐 如HC
  createBy:{_id:String,name:String,userName:String,createTime:Date},  //创建人信息
  projects:[{
    createBy:{_id:String,name:String,userName:String,createTime:Date},
    name:String,         //套餐名
    price:Number,        //价格
    significance:String,  //临床意义
    code:String,         //套餐编码
    content:[{hsName:String,hsCode:String,lcName:String,lcCode:String}],
    // hsName  检测项目名称（华晟名称）
    // hsCode  检测项目编码（华晟编码）
    // lcName  检测项目编码（良辰名称）
    // lcCode  检测项目编码（良辰编码）
    sampleNum:Number,    //需要抽几管血
    sampleType:String,   //采样类型
    remark:String        //标记
    }
  ]
});

let projectModel = mongodb.model('project',projectSchema,'project');

module.exports = projectModel;
