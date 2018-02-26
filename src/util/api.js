import cityInfo from '../../static/js/city-data'
import moment from 'moment'
export default  {
  //时间格式化
  moment,
  //去除字符串前后空格
  Trim:function(str){ return str.replace(/(^\s*)|(\s*$)/g, ""); },
  //获取url参数
  UrlSearch:function () {
    var name,value;
    var str=location.href; //取得整个地址栏
    var num=str.indexOf("?");
    str=str.substr(num+1); //取得所有参数
    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
      num=arr[i].indexOf("=");
      if(num>0){
        name=arr[i].substring(0,num);
        value=arr[i].substr(num+1);
        this[name]=value;
      }
    }
  },
  //下载文件
  download:function (url,obj) {
    let keyArr = [];
    if(obj){
      keyArr = Object.keys(obj);
    }
    let form =  document.createElement('form');
    form.id = 'formId';
    form.style.display = "none";
    form.setAttribute("method","post");
    form.setAttribute("action",url);
    document.getElementsByTagName("body")[0].appendChild(form);
    for(let k of keyArr){
      var input=document.createElement("input");
      input.setAttribute("name",k);
      input.setAttribute("value",obj[k]);
      document.getElementById("formId").appendChild(input);
    }
    form.submit();
    document.getElementsByTagName("body")[0].removeChild(form);
  },
  getRegion(value,vm){
    if(value[0]){
      for(let y in cityInfo){
        if(cityInfo[y].value == value[0]){
          vm.codeIndexArr = [y];
          vm.region = cityInfo[y].label
          break;
        }
      }
    }else{
      vm.region = '';
    }
    if(value[1]){
      for(let y in cityInfo){
        for(let z in cityInfo[y].children){
          if(cityInfo[y].children[z].value == value[1] && value[1]!=undefined){
            vm.codeIndexArr = [y,z];
            vm.region += "/"+cityInfo[y].children[z].label;
            break;
          }
        }
      }
    }
    if(value[2]) {
      for (let y in cityInfo) {
        for (let z in cityInfo[y].children) {
          for (let i in cityInfo[y].children[z].children) {
            if (cityInfo[y].children[z].children[i].value == value[2] && value[2] != undefined) {
              vm.codeIndexArr = [y, z, i];
              vm.region += "/"+cityInfo[y].children[z].children[i].label
              break;
            }
          }
        }
      }
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
  // cast RegionLabel to RegionValue
  getRegionValue(label, cityInfo1){
    let labelArr = label.split("/");
    for (let y in cityInfo1) {
      if (labelArr[0] !== undefined && labelArr[0] === cityInfo1[y].label) {
        for (let z in cityInfo1[y].children) {
          if (labelArr[1] !== undefined && labelArr[1] === cityInfo1[y].children[z].label) {
            for (let i in cityInfo1[y].children[z].children) {
              if (labelArr[2] !== undefined && cityInfo1[y].children[z].children[i].label === labelArr[2]) {
                return [parseInt(cityInfo1[y].value), parseInt(cityInfo1[y].children[z].value), parseInt(cityInfo1[y].children[z].children[i].value)];
              }
            }
          }
        }
      }
    }
  },

  // get uuid
  guid: ()=> {
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  },
  // 消息提示
  msgTips: (vm, msg, type) => {
    vm.$message({
      message: msg,
      type: type
    });
  },

  // 获取文件的根路径
  getRootPath: () => {
    let pathName = window.location.pathname.substring(1);
    let webName = pathName === '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    if (webName === "") {
      return window.location.protocol + '//' + window.location.host;
    } else {
      return window.location.protocol + '//' + window.location.host + '/' + webName;
    }
  }
};
