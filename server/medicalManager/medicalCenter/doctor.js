import doctorModel from '../../database/schema/doctor'
import loginModel from '../../database/schema/login'
import roleModel from '../../database/schema/role'
import networkModel from '../../database/schema/network'
import crypto from 'crypto';
import config from '../../util/config'
import {defaultPassword,roleCode} from '../../util/config'
import api from '../../util/api'
module.exports = function (app){
  //通过Id查询医生
  app.get('/medicalManager/medicalCenter/doctor/queryDoctorById',async function (req,res,next) {
    try{
      let doctor = await doctorModel.findOne({_id:req.query._id},{
        name:1,sex:1,IDNo:1,tel:1,doctorTime:1,education:1,beGoodAt:1
      });
      res.status(200).send(doctor);
      api.writeInfo(req,doctor)
    }catch(e){
      let data = {};
      data.name = e.name;
      data.message = e.message;
      res.send(data);
      api.writeErr(req,data)
    }
  });
  //添加医生
  app.post('/medicalManager/medicalCenter/doctor/addDoctor',async function (req,res,next) {
    try{
      let params = req.body.params;
      let userId = req.cookies.userId;
      let login = await loginModel.findOne({_id:userId},{userName:1,realName:1}).lean();
      let role = await roleModel.findOne({roleCode:roleCode.doctor});
      login.createTime = new Date();
      let password = crypto.createHash('md5').update(defaultPassword).digest('hex');
      let loginEntity = new loginModel({
        userName:params.tel,
        tel:params.tel,
        password:password,
        realName:params.name,
        role:role,
        modularId:role.modularId,
        createBy:login,
        status:2,
      });
      let result = await loginEntity.save();
      params._id = result._id;
      params.createBy = login;
      let doctorEntity = new doctorModel(params);
      await doctorEntity.save();
      let data = {};
      data.result = config.success;
      data.password = defaultPassword;
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
  //通过医疗网点id查询医生列表
  app.get('/medicalManager/medicalCenter/doctor/doctorList',async function (req,res,next) {
      try{
        let networkId = req.query.networkId;
        let pageNo = req.query.pageNo||1;
        let pageSize = req.query.pageSize||10;
        let network = await networkModel.findOne({_id:networkId},{status:1})
        let count = await doctorModel.count({networkId:networkId});
        let doctors = await doctorModel.find({networkId:networkId})
          .skip((pageNo-1)*pageSize).limit(parseInt(pageSize));
        let data = {};
        data.count = count;
        data.doctors = doctors;
        data.isNoPass = network.status == 0||network.status == 1;
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
  //修改医生信息
  app.post('/medicalManager/medicalCenter/doctor/modifyDoctorInfo',async function (req,res,next) {
     try{
       let params = req.body.params;
       let _id = params._id;
       delete params._id;
       await doctorModel.update({_id:_id},{$set:params});
       await loginModel.update({_id:_id},{$set:{
         userName:params.tel,
         realName:params.name,
         tel:params.tel
       }});
       let data = {};
       data.result = config.success;
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
  app.post('/medicalManager/medicalCenter/doctor/removeDoctor',async function (req,res,next) {
     try{
       let _id = req.body._id;
       await loginModel.remove({_id:_id});
       await doctorModel.remove({_id:_id});
       let data = {};
       data.result = config.success;
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

