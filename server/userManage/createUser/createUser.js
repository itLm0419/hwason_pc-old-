import roleModel from '../../database/schema/role'
import modularModel from '../../database/schema/modular'
import loginModel  from '../../database/schema/login'
import crypto from 'crypto'
import config from '../../util/config'
import api from '../../util/api'
module.exports = function (app) {
    app.get("/userManage/createUser/createUser/queryRoles",async function (req,res,next) {
       try{
         let roles = await roleModel.find({});
         let modular = await modularModel.find({});
         let data = {};
         data.roles = roles;
         data.modular = modular;
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
    app.post('/userManage/createUser/createUser/createUser',async function (req,res,next) {
      try{
      let params = req.body.params;
      var md5 = crypto.createHash('md5');
      var password = md5.update('123456').digest('hex');
      params.password = password;
      let userNameCount = await loginModel.count({userName:params.userName});
      let telCount = await loginModel.count({tel:params.tel});
      if(userNameCount){
        let data = {};
        data.result = config.fail;
        data.message = config.hasUser;
        return res.status(200).send(data);
      }else if(telCount){
        let data = {};
        data.result = config.fail;
        data.message = config.hasTel;
        return res.status(200).send(data);
      } else{
        let userId = req.cookies.userId;
        let creator = await loginModel.findOne({_id:userId},function (err) {
          console.log(err)
        }).lean();
        creator.createTime = new Date();
        params.createBy = creator;
        params.status = 1;
        console.log(params);
        let loginEntity = new loginModel(params);
        await loginEntity.save(function (err) {
          console.log(1,err)
        });
        let data = {};
        data.result = config.success;
        data.message = config.createSuccess+config.defaultPassword;
        res.status(200).send(data);
        api.writeInfo(req,data);
      }
    }catch(e){
        let data = {};
        data.name = e.name;
        data.message = e.message;
        res.send(data);
        api.writeErr(req,data)
      }
  })
};
