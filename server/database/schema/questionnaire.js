
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let questionnaireSchema = new mongoose.Schema({
  name:String,  //问题名称
  values:[String],  //可选择的值
  type:Number, //1 单选  2多选

});
let questionnaireModel = mongodb.model('questionnaire',questionnaireSchema,'questionnaire');
module.exports = questionnaireModel;

