'use strict';
import loginModel from '../../database/schema/login';
import userModel from '../../database/schema/user';
import config from '../../util/config'
import api from '../../util/api'
module.exports  = function (app) {

  app.post('/network/createRecord/registInfo/registInfo', async function (req, res, next) {
    try{
      let userId = req.cookies.userId;
      let login = await loginModel.findOne({_id:userId},{userName:1,realName:1}).lean();
      login.createTime = new Date();
      let name = req.body.params.user.name;
      let sex = req.body.params.user.sex;
      let IDNo = req.body.params.user.IDNo;
      let tel = req.body.params.user.tel;
      let region = req.body.params.user.region;
      let address = req.body.params.user.address;
      let userEntity = new userModel({
        name: name,
        sex: sex,
        createBy: login,
        // createBy:{_id:String,userName:String,realName:String,createTime:Date},  //创建人
        IDNo: IDNo,
        tel: tel,
        region: region,
        address: address,
      });
      let data = {};
      data.result = config.success;
      let result = await userEntity.save();
      data._id = result._id;
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
