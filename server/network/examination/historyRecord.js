// 客户历史记录逻辑层
import usersModel from '../../database/schema/user'
import api from '../../util/api'
import config from '../../util/config'
module.exports = function (app) {

  // 查询问诊记录
  app.get('/network/examination/historyRecord/queryHistoryRecord', async function (req, res, next) {
    try{
      let data = {};
      let _id = req.query._id;
      let userModels = await usersModel.find({"_id": _id});
      if (userModels.length != 0) {

        let age = 0;
        if (userModels[0].IDNo && userModels[0].IDNo !== "") {
          age = api.getAgeByIDNo(userModels[0].IDNo.toString());
        }

        let userDetail = {
          _id: userModels[0]._id,
          name: userModels[0].name,
          sex: userModels[0].sex,
          IDNo: userModels[0].IDNo,
          tel: userModels[0].tel,
          age: age,
          interrogation: userModels[0].interrogation
        };

        data.result = config.successMsg;
        data.resultCode = config.success;
        data.userModelOne = userDetail;
      } else {
        data.result = config.noUser;
        data.resultCode = config.fail;
        data.userModels = userModels;
      }
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

  // 保存问诊记录
  app.post('/network/examination/historyRecord/saveHistoryRecord', async function (req, res, next) {
    try{
      let _id = req.body.params._id;
      let illness = req.body.params.illness;
      let advice = req.body.params.advice;
      let prescription = req.body.params.prescription;

      // cookies
      let username = req.cookies.username;
      let realname = req.cookies.realname;
      let createTime = new Date();

      let count = 0;

      // 参数校验
      if (!_id || _id === "") {
        let data = {};
        data.result = config.fail;
        data.name = config.parameterVerFail;
        return res.status(200).send(data);
      } else {
        count = await usersModel.find({_id: _id}).count();
        if (count === 0) {
          let data = {};
          data.result = config.fail;
          data.name = config.noUser;
          return res.status(200).send(data);
        }
      }

      let interrogation = {
        illness: illness,
        advice: advice,
        prescription: prescription,
        username: username,
        realname: realname,
        createTime: createTime
      };
      await usersModel.update({_id: _id},{$addToSet:{interrogation: interrogation}},function (err) {
        if(err){
          let data = {};
          data.result = config.fail;
          data.name = config.failMsg;
          res.status(200).send(data);
          api.writeInfo(req,data);
        }
      });

      let data = {};
      data.result = config.successMsg;
      data.resultCode = config.success;
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

};
