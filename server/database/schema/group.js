
var mongoose = require('mongoose');
let mongodb = require('../mongodb.js');

let groupSchema = new mongoose.Schema({
    name:String,
    createBy:{_id:String,realName:String,userName:String,createTime:Date},
});
let groupModel = mongodb.model('group',groupSchema,'group');
module.exports = groupModel;
