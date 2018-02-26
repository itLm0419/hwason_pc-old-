'use strict';
import userModel from '../../database/schema/user';
import loginModel from '../../database/schema/login'
import config from '../../util/config'
import api from '../../util/api'
module.exports = function (app) {
  app.get('/network/examination/userSearch/userSearch',async function (req,res,next) {
      try{
        let searchContent = req.query.searchContent;
        let _id = req.query._id;
        if(searchContent){
          let queryCon = await userModel.findOne({"$or":[{IDNo:searchContent},{tel:searchContent}]});
          let login = await loginModel.findOne({$or:[{tel:searchContent},{userName:searchContent}]});
          let result;
          if(_id){
            result = await loginModel.findOne({_id:_id,tel:searchContent})
          }
          let data  = {};
          if((queryCon||login)&&!result){
            data.result = config.success;
            data.name = config.successMsg;
            data.queryCon = queryCon;
            res.status(200).send(data);
          }else{
            data.result = config.fail;
            data.name = config.failMsg;
            data.queryCon = queryCon;
            res.status(200).send(data);
            api.writeInfo(req,data);
          }
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
