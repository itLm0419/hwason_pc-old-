import fs from 'fs'
import logHelper from '../util/logHelper';
let logger = logHelper.helper;
module.exports = {
  writeInfo:function (req,data) {
    if(req.method=="GET"){
      logger.writeInfo(`${req.method} ${req.url}? params=${JSON.stringify(req.query)} data=${JSON.stringify(data)}`);
    }else if(req.method=="POST"){
      logger.writeInfo(`${req.method} ${req.url}? params=${JSON.stringify(req.body)} data=${JSON.stringify(data)}`);
    }
  },
  writeErr:function (req,data) {
    console.log(req);
    if(req.method=="GET"){
      logger.writeErr(`${req.method} ${req.url}? params=${JSON.stringify(req.query)} data=${JSON.stringify(data)}`);
    }else if(req.method=="POST"){
      logger.writeErr(`${req.method} ${req.url}? params=${JSON.stringify(req.body)} data=${JSON.stringify(data)}`);
    }
  },
  dateFormat: function(date,num) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    if(num==1){
      return y + '-' + m + '-' + d+' '+ h +':'+ minute;
    }else if(num==2){
      return y + '-' + m + '-' + d
    }else if(num==3){
      return y + '/' + m + '/' + d
    }else{
      return y + '年' + m + '月' + d
    }
  },
  //通过身份证号码获取年龄
  getAgeByIDNo:function(IDNo) {
    if(IDNo.length == 18){
      let birthdayYear = parseInt(IDNo.substr(6,4))
      let nowYear = (new Date()).getFullYear()
      return nowYear - birthdayYear
    }else if(IDNo.length == 15){
      let birthdayYear = parseInt(19+IDNo.substr(6,2))
      let nowYear = (new Date()).getFullYear()
      return nowYear - birthdayYear
    }
  },
  //获取两个日期的天数差
  dateDiff:function (sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
    var dateSpan,
      iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
  },
  //获取省市区对应的编码
  getRegionCode:function (val) {
    if(!val||val<10) return val||0;
    else return String.fromCharCode(parseInt(val)+55)
  },
  //删除过时的（48小时）临时文件和移动刚上传的文件
  removeTempFile:function (protocolAttach) {
    let files = fs.readdirSync("temp")
    for(let p of protocolAttach){
      for(let f of files){
        if(p.path.indexOf(f)>=0){
           fs.rename(`temp/${f}`,`public/img/${f}`,function (err) {})
        }else{
           let  fileInfo = fs.statSync(`temp/${f}`)
           if(parseInt(new Date() - fileInfo.atime)/3600000>48){
             fs.unlink(`temp/${f}`,function (err) {})
           }
        }
      }
    }
  }
};


