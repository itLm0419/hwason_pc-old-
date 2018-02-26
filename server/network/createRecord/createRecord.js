import questionnaireModel from '../../database/schema/questionnaire'
import userModel from '../../database/schema/user'
import config from '../../util/config'
import api from '../../util/api'
module.exports = function (app) {
  //创建档案和修改档案页面初始化查询问卷题目
  app.get('/network/createRecord/createRecord/queryQuestionnaire',async function (req,res,next) {
     try{
       let _id = req.query._id;
       let user = await userModel.findOne({_id:_id},
         {height:1,weight:1,regularExamination:1,liveArea:1,disease:1,healthStatus:1,otherDesc:1});
       let diseases = await questionnaireModel.find({type:2}).lean();
       let healthStatus = await questionnaireModel.find({type:1}).lean();
       for(let dis of diseases){
         dis.hasDisease = [];
         for(let ds of user.disease){
           if(ds.name == dis.name){
             dis.hasDisease = ds.hasDisease
           }
         }
       }
       for(let hs of healthStatus){
         hs.value = "";
         for(let HS of user.healthStatus){
           if(HS.name==hs.name){
             hs.value = HS.value
           }
         }
       }
       let data = {};
       data.user = user;
       data.diseases = diseases;
       data.healthStatus = healthStatus;
       data.status = config.success;
       res.status(200).send(data);
       api.writeInfo(req,data);
     }catch(e){
       let data = {};
       data.name = e.name;
       data.message = e.message;
       res.send(data);
       api.writeErr(req,data)
     }
  });
  /*创建档案
  params:
    _id
    height
    weight
    regularExamination
    liveArea
    diseases
    healthStatus
    otherDesc*/
  app.post('/network/createRecord/createRecord/createRecord',async function (req,res,next) {
     try{
       let params = req.body.params;
       await userModel.update({_id:params._id},
         {$set:
           {
             height:params.height,
             weight:params.weight,
             regularExamination:params.regularExamination,
             liveArea:params.liveArea,
             disease:params.diseases,
             healthStatus:params.healthStatus,
             otherDesc:params.otherDesc,
           }
         });
       let data = {};
       data.result = config.success;
       res.status(200).send(data);
       api.writeInfo(req,data);
     }catch(e){
       let data = {};
       data.name = e.name;
       data.message = e.message;
       res.send(data);
       api.writeErr(req,data)
     }
  })
};
