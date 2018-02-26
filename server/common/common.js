
import modularModel from '../database/schema/modular'
import loginModel from '../database/schema/login'
import crypto from 'crypto';
import config from '../util/config'
import api from '../util/api'
module.exports=function (app) {
    app.post("/common/login",async function (req,res,next) {
      try {
        let userName = req.body.userName;
        let password = crypto.createHash('md5').update(req.body.password).digest('hex');
        let login  = await loginModel.findOne({$or:[{userName:userName},{tel:userName}],password:password});
        if(!login){
          let data = {};
          data.result = config.fail;
          data.message = config.loginTips;
          return res.status(200).send(data);
        }else{
          res.cookie("userId",login._id);
          let query = {};
          if(login.role.roleCode!="000"){
            query._id = {$in:login.modularId}
          }
          let modular = await modularModel.findOne(query);
          let data = {};
          data.result = config.success;
          data.path = modular.path||modular.children[0].path;
          res.status(200).send(data);
          api.writeInfo(req,data)
        }
      }catch(e){
         let data = {};
         data.name = e.name;
         data.message = e.message;
         res.send(data);
         api.writeErr(req,data)
      }
    });
    app.get('/common/queryModular',async function (req,res,next) {
       try {
         let userId = req.cookies.userId;
         let user = await loginModel.findOne({_id:userId});
         let query = {};
         if(user.role.roleCode!="000"){
           query._id = {$in:user.modularId}
         }
         let modular = await modularModel.find(query);
         let data = {};
         data.roleName = user.role.roleName;
         data.modular = modular;
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
