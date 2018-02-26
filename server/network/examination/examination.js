import projectModel from '../../database/schema/project'
import doctorModel from '../../database/schema/doctor'
import networkModel from '../../database/schema/network'
import userModel from '../../database/schema/user'
import loginModel from '../../database/schema/login'
import examinationModel from '../../database/schema/examination'
import config from '../../util/config'
import api from '../../util/api'
module.exports = function (app) {
  //华晟套餐查询
  app.get('/network/examination/examination/queryProjects',async function (req,res,next) {
    try{
      let projects = await projectModel.find({},{category:1,projects:1});
      res.status(200).send(projects);
      api.writeInfo(req,projects)
    }catch(e){
      let data = {};
      data.name = e.name;
      data.message = e.message;
      res.send(data);
      api.writeErr(req,data)
    }
  });
  //查询折扣
  app.get('/network/examination/examination/queryDiscount',async function (req,res,next) {
     try{
       let userId = req.cookies.userId;
       let doctor = await doctorModel.findOne({_id:userId});
       let network = await networkModel.findOne({_id:doctor.networkId},{discount:1});
       res.status(200).send(network.discount);
       api.writeInfo(req,network.discount)
     }catch(e){
       let data = {};
       data.name = e.name;
       data.message = e.message;
       res.send(data);
       api.writeErr(req,data)
     }
  });
  //用户支付
  app.post('/network/examination/examination/payment',async function (req,res,next) {
      try{
        let params = req.body.params;
        let examinationUserId = params.examinationUserId;
        let user = await userModel.findOne({_id:examinationUserId},{_id:0,name:1,sex:1,IDNo:1,region:1}).lean();
        user.userId = examinationUserId;
        let userId = req.cookies.userId;
        let login = await loginModel.findOne({_id:userId},{userName:1,realName:1}).lean();
        login.createTime = new Date();
        let doctor = await doctorModel.findOne({_id:userId})
        let network = await networkModel.findOne({_id:doctor.networkId},{name:1})
        let model = {...user,createBy:login,network:network,infoSource:1,status:5,projects:params.projects}
        let examinationEntity = new examinationModel(model);
        await examinationEntity.save();
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
  app.get('/network/examination/examination/examRecord',async function (req,res,next) {
     try{
       let _id = req.query._id;
       console.log(_id);
       let exams = await examinationModel.find({userId:_id},{
         'createBy.createTime':1,
         'projects.name':1,
         abnormal:1,
         status:1
       },function (err) {
         console.log(err);
       });
       res.status(200).send(exams);
       api.writeInfo(req,exams);
     }catch(e){
       let data = {};
       data.name = e.name;
       data.message = e.message;
       res.send(data);
       api.writeErr(req,data)
     }
  })
};
