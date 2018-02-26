/**
 * Created by win7 on 2017/12/8.
 */

var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let itemSchema = new mongoose.Schema({
  category:String,
  hsName:String,
  hsCode:String,
  lcName:String,
  lcCode:String,
  unit:String,
  range:[{sex:String,minAge:String,maxAge:String,range:String}],
});

let itemModel = mongodb.model('item',itemSchema,'item');
module.exports = itemModel;
