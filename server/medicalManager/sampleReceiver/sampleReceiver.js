import networkModel from '../../database/schema/network'
import loginModel from '../../database/schema/login'
import sampleReceiverModel from '../../database/schema/sampleReceiver'
import roleModel from '../../database/schema/role'
import examinationModel from '../../database/schema/examination'
import crypto from 'crypto';
import config from '../../util/config'
import api from '../../util/api'

module.exports = function (app) {
    //查询未分配接收员的医疗网点
    app.get('/medicalManager/sampleReceiver/sampleReceiver/queryNetWork',async function (req,res,next) {
        try{
          let region = req.query.region;
          let query = {region:{$regex:region},'receiver._id':{$exists:false},status:{$nin:[0,1]}};
          let networks = await networkModel.find(query,{name:1});
          res.status(200).send(networks);
          api.writeInfo(req,networks);
        }catch(e){
          let data = {};
          data.name = e.name;
          data.message = e.message;
          res.send(data);
          api.writeErr(req,data)
        }
    });
    //新增样本接收员并分配医疗网点
    app.post('/medicalManager/sampleReceiver/sampleReceiver/addSampleReceiver',async function (req,res,next) {
       try{
         let params = req.body.params;
         let role = await roleModel.findOne({roleCode:config.roleCode.sampleReceiver});
         let userId = req.cookies.userId;
         let login = await loginModel.findOne({_id:userId},{realName:1,userName:1}).lean();
         login.createTime = new Date();
         let password = crypto.createHash('md5').update(config.defaultPassword).digest('hex');
         let loginEntity = new loginModel({
           userName:params.tel,
           tel:params.tel,           //电话号码
           password:password,      //密码 加密后密码
           realName:params.name,      //真实姓名
           role:role,          //角色
           createBy:login,
           status:1,        // 1 正常 2 停用
         });
         let result = await loginEntity.save();
         params._id = result._id;
         params.createBy = login;
         console.log(params);
         let sampleReceiver = new sampleReceiverModel(params);
         await sampleReceiver.save();
         for(let n of params.network){
           await networkModel.update({_id:n._id},{$set:{receiver:result}});
         }
         let data = {};
         data.result = config.success;
         data.message = config.createSuccess+config.defaultPassword;
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
  //查询样本接收员
  app.get('/medicalManager/sampleReceiver/sampleReceiver/querySampleReceiver',async function (req,res,next) {
     try{
       let params = req.query;
       let query = {};
       if(params.name){
         query.name = {$regex:params.name}
       }
       if(params.tel){
         query.tel = {$regex:params.tel}
       }
       if(params.region){
         query.region = {$regex:params.region}
       }
       if(params.network){
         let networks = await networkModel.find({name:{$regex:params.network}});
         let _ids = [];
         for(let n of networks){
           if(n.receiver&&n.receiver._id){
             _ids.push(n.receiver._id)
           }
         }
         query._id = {$in:_ids}
       }
       let totalCount = await sampleReceiverModel.count(query);
       let sampleReceivers = await sampleReceiverModel.find(query)
         .skip((params.pageNo-1)*params.pageSize).limit(parseInt(params.pageSize)).lean();
       for(let s of sampleReceivers){
         let networks = await networkModel.find({'receiver._id':s._id},{name:1});
         s.networks = networks;
         let login = await loginModel.findOne({_id:s._id});
         s.status = login.status;
       }
       let data = {};
       data.totalCount = totalCount;
       data.sampleReceivers = sampleReceivers;
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

  // 查询样本接收员单条记录
  app.get('/medicalManager/sampleReceiver/sampleReceiver/querySampleReceiverById',async function (req,res,next) {
    try{
      let _id = req.query._id;
      let data = {};

      // 参数校验
      if (!_id) {
        throw new Error("参数 _id 不存在！");
      }
      let sampleReceiver = await sampleReceiverModel.find({_id: _id});
      let networks = await networkModel.find({'receiver._id': _id},{name:1});

      data.sampleReceiver = sampleReceiver;
      data.networks = networks;
      data.result = config.success;
      data.message = config.successMsg;
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

  // 修改样本接收员单条记录
  app.post('/medicalManager/sampleReceiver/sampleReceiver/modifySampleReceiverById',async function (req,res,next) {
    try{
      let params = req.body.params;
      let data = {};
      let role = await roleModel.findOne({roleCode:config.roleCode.sampleReceiver});

      let userId = req.cookies.userId;
      let login = await loginModel.findOne({_id:userId},{realName:1,userName:1}).lean();

      // 更新 loginModel
      let param1 = {
        $set: {tel: params.tel, userName: params.tel, realName: params.name}
      };
      await loginModel.update({_id: params._id}, param1);

      // 更新 sampleReceiverModel
      let param2 = {
        $set: {
          name: params.name,
          sex: params.sex,
          region: params.region,
          IDNo: params.IDNo,
          tel: params.tel
        }
      };
      await sampleReceiverModel.update({_id: params._id}, param2);

      // 更新 networkModel
      let param3 = {
        $set: {
          receiver: {
            _id: params._id,
            userName: params.tel,
            realName: params.name
          }
        }
      };
      await networkModel.updateMany({'receiver._id': params._id}, {$set: {receiver: {}}});

      let _ids = [];
      if (!(params.network === undefined || params.network.length === 0)) {
        for (let o of params.network) {
          _ids.push(o._id);
        }
        await networkModel.updateMany({'_id': {$in: _ids}}, param3);
      }

      data.result = config.success;
      data.message = config.successMsg;
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
  //重置密码
  app.post('/medicalManager/sampleReceiver/sampleReceiver/resetPwd',async function (req,res,next) {
     try{
       let _ids = req.body._ids;
       let password = crypto.createHash('md5').update(config.defaultPassword).digest('hex');
       await loginModel.updateMany({_id:{$in:_ids}},{$set:{password:password}});
       let data = {};
       data.result = config.success;
       data.message = config.successMsg;
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
  app.post('/medicalManager/sampleReceiver/sampleReceiver/disable',async function (req,res,next) {
      try{
        let _ids = req.body._ids;
        await loginModel.updateMany({_id:{$in:_ids}},{$set:{status:2}});
        await networkModel.updateMany({'receiver._id':{$in:_ids}},{$set:{receiver:{}}});
        let data = {};
        data.result = config.success;
        data.message = config.successMsg;
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
  app.post('/medicalManager/sampleReceiver/sampleReceiver/enable',async function (req,res,next) {
     try{
       let _ids = req.body._ids;
       await loginModel.updateMany({_id:{$in:_ids}},{$set:{status:1}});
       let data = {};
       data.result = config.success;
       data.message = config.successMsg;
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
  app.post('/medicalManager/sampleReceiver/sampleReceiver/remove',async function (req,res,next) {
      try{
        let _id = req.body._id;
        console.log(_id);
        let examination = await examinationModel.findOne({'receiver._id':_id});
        if(examination){
          let data = {};
          data.result = config.fail;
          data.message = config.unableDeleteReceiver;
          return res.status(200).send(data);
        }else{
          await networkModel.updateMany({'receiver._id':_id},{$set:{receiver:{}}});
          await loginModel.remove({_id:_id});
          await sampleReceiverModel.remove({_id:_id});
          let data = {};
          data.result = config.success;
          data.message = config.successMsg;
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
