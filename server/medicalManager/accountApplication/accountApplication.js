import networkModel from '../../database/schema/network'
import loginModel from '../../database/schema/login'
import api from '../../util/api'
import config from '../../util/config'
module.exports = function (app) {
   app.post("/medicalManager/accountApplication/accountApplication/agreementUpload",async function (req,res,next) {
     try{
       let file = req.files.file;
       let data = {};
       data.name = file.name;
       data.path = file.path.replace("temp","img");
       data.fileType = file.type;
       res.status(200).send(data);
       api.writeInfo(req,data)
     }catch(e){
       let data = {};
       data.name = e.name;
       data.message = e.message;
       res.send(data);
       api.writeErr(req,data)
     }
   });
   app.post("/medicalManager/accountApplication/saveNetwork",async function (req,res,next) {
       try{
         let params = req.body.params;
         let code = "";
         let codeIndexArr = params.codeIndexArr;
         //通过下标获取省市区编码
         let preCode = "HSC"+api.getRegionCode(codeIndexArr[0])
           +api.getRegionCode(codeIndexArr[1])
           +api.getRegionCode(codeIndexArr[2]);
         //查询省市区编码相同最大编码的网点
         let maxCodeNetwork = await networkModel.aggregate([{$match:{code:{$regex:"^"+preCode}}},
           {$group:{_id:null,code:{$max:"$code"}}}]);
         //获取完整编码
         if(!maxCodeNetwork.length){
           code = preCode + "000";
         }else{
           let  suffixNum = parseInt(maxCodeNetwork[0].code.substr(6))+1;
           if(suffixNum.toString().length==1) code = preCode + "00" +suffixNum;
           else if(suffixNum.toString().length==2) code = preCode + "0" +suffixNum;
           else if(suffixNum.toString().length==3) code = preCode  +suffixNum
         }
         //生成Entity
         params.code = code;
         let userId = req.cookies.userId;
         let login = await loginModel.findOne({_id:userId},{userName:1,realName:1}).lean();
         login.createTime = new Date();
         params.createBy = login;
         params.status = 0;
         let networkEntity = new networkModel(params);
         //移动文件和删除存在temp下超过两天的文件
         api.removeTempFile(params.protocolAttach);
         //存入数据库
         await networkEntity.save();
         let data = {};
         data.result = config.success;
         data.code = code;
         res.status(200).send(data);
         api.writeInfo(req,data)
       }catch(e){
         let data = {};
         data.name = e.name;
         data.message = e.message;
         res.send(data);
         api.writeErr(req,data)
       }
   })
};
