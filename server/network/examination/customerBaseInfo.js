import userModel from '../../database/schema/user'
import api from '../../util/api'
module.exports = function (app) {
  app.get('/network/examination/customerBaseInfo/queryCustomerBaseInfo',async function (req,res,next) {
     try{
       let _id = req.query._id;
       let customerBaseInfo = await userModel.findOne({_id:_id});
       res.status(200).send(customerBaseInfo);
       api.writeInfo(req,customerBaseInfo);
     }catch(e){
       let data = {};
       data.name = e.name;
       data.message = e.message;
       res.send(data);
       api.writeErr(req,data)
     }
  })
};
