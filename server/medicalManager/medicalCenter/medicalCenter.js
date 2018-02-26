import networkModel from '../../database/schema/network';
import client from '../../database/redis'
import doctorModel from '../../database/schema/doctor'
import loginModel from '../../database/schema/login'
import roleModel from '../../database/schema/role'
import crypto from 'crypto'
import config from '../../util/config'
import api from '../../util/api'
import {defaultPassword,roleCode,tempPath, imgPath} from '../../util/config'
module.exports = function (app) {
  // 查询卫生服务中心列表
  app.get('/medicalManager/medicalCenter/medicalCenter/queryMedicalList',async function (req,res,next) {
   try{
     let currentPage = req.query.currentPage || 1;
     let currentSize = req.query.currentSize || 12;  // 查询固定条数
     let keyword = req.query.key;
     let region = req.query.region;
     let data = {};
     data.resultCode = config.success;

     let param = {};

     if (!region) {
       if (!keyword) {
         param = {};
       } else {
         param = {
           $or: [
             {name: {$regex: keyword}},
             {code: {$regex: keyword}}
           ]
         };
       }
     } else {
       if (!keyword) {
         param = {
           region: {$regex: region}
         };
       } else {
         param = {
           $and: [
             {region: {$regex: region}},
             {
               $or: [
                 {name: {$regex: keyword}},
                 {code: {$regex: keyword}}
               ]
             }
           ]
         };
       }
     }

     let count = await networkModel.count(param);

     let networks = await networkModel.find(param).skip((currentPage-1)*currentSize).limit(parseInt(currentSize));

     /*let networks2 = [];
      for (let i = 0; i<networks.length; i++) {
      let o = await client.get(networks[i]._id);
      if (o) {
      networks2.push(JSON.parse(o));
      }
      }

      // 合并
      networks.push.apply(networks, networks2);*/

     data.count = count;
     data.networks = networks;
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

  // 查询卫生服务中心单条数据
  /*
  * 思想：先从redis缓存数据库查询，如果不存在（返回null），则从mongoDB数据库获取；
  * */
  app.get('/medicalManager/medicalCenter/medicalCenter/queryMedicalDetail',async function (req,res,next) {
   try{
     let _id = req.query._id;
     let status = req.query.status || -1;

     let network = {};

     let arr = await networkModel.find({_id: _id});
     if (parseInt(status) === 10) {
       network = arr;
     } else {
       let networkStr = await client.get(_id);

       console.log("networkStr: ", networkStr);

       if (!networkStr) {
         network = arr;
       } else {
         network = [JSON.parse(networkStr)];
       }
     }

     let data = {};

     if (network.length === 0) {
       data.resultCode = config.fail;
     } else {
       data.resultCode = config.success;
       data.network = network;
     }
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

  app.get('/medicalManager/medicalCenter/medicalCenter/queryViewModify',async function (req,res,next) {
   try{
     let _id = req.query._id;
     let networkStr = await client.get(_id);
     let network = [JSON.parse(networkStr)];

     let data = {};
     data.resultCode = config.success;
     data.network = network;
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

  // 上传协议照片附件
  app.post('/medicalManager/medicalCenter/medicalCenter/cacheProtocolAttach', async function (req,res,next) {
    try{
      let _id = req.body._id;

      let files = req.files;

      let obj = {
        name: files.file.name,
        path: files.file.path,
        fileType: files.file.type
      };

      let sourceFile = obj.path;
      let destPath = obj.path.replace(tempPath, imgPath);

      console.log(sourceFile, destPath);

      fs.rename(sourceFile, destPath, function (err) {
        if (err) throw err;
        fs.stat(destPath, function (err, stats) {
          if (err) throw err;
          console.log('stats: ' + JSON.stringify(stats));
        });
      });

      // 获取其他attach
      let medicalCenter = JSON.parse(await client.get(_id));

      obj.path = obj.path.replace(tempPath, imgPath.split("/")[1]);
      medicalCenter.protocolAttach.push(obj);

      console.log(medicalCenter);

      // 缓存文件信息
      /*await networkModel.update({_id: _id}, {$push: {protocolAttach: obj}});*/
      client.set(_id, JSON.stringify(medicalCenter), function (err, response) {
        console.log(err, response);
      });

      let data = {};
      data.resultCode = config.success;
      data.result = "缓存图片"+config.successMsg;
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

  // 修改医疗服务中心（暂存redis）
  app.post('/medicalManager/medicalCenter/medicalCenter/cacheMedicalCenter', async function(req, res, next) {
    try{
      let params = req.body.params;

      // 1.仅首次提交被驳回进行的修改，直接操作MongoDB；其余操作 redis 缓存数据库；
      let statusArr = await networkModel.find({_id: params._id}, {status: 1});
      let status = statusArr[0].status;
      console.log("status: ",status);
      if (status === 1) {
        await networkModel.update({_id: params._id}, params);
      } else {
        params.status = 2;
        client.set(params._id, JSON.stringify(params), function (err, response) {
          console.log(err, response);
        });
      }

      let data = {};
      data.resultCode = config.success;
      data.result = config.successMsg+"_缓存";
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

  // 判断医疗服务中心是否正在审批
  app.get('/medicalManager/medicalCenter/medicalCenter/isPending',async function (req,res,next) {
    try{
      let _id = req.query._id;
      let data = {};

      let o = await client.get(_id);

      if (!o) {
        let arr = await networkModel.find({_id: _id}, {status: 1});

        data.isPending = (parseInt(arr[0].status) === 0 || parseInt(arr[0].status) === 2);
      } else {
        data.isPending = true;
      }

      data.resultCode = config.success;
      data.result = config.successMsg;
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

  // 修改医疗服务中心（数据同步）
  /*
  * 思想：等待审核通过后，将数据同步到MongoDB数据库；
  * */
  /*app.post('/medicalCenter/saveMedicalCenter', async function (req,res,next) {
    let params = req.body.params;

    let param = {
      $set: {
        region: params.region,
        address: params.address,
        name: params.name,
        discount: params.discount,

        cooperationTime: {
          "startTime": params.cooperationStartTime,
          "endTime": params.cooperationEndTime
        },
        supervisor:{
          "IDNo": params.supervisorIDNo,
          "tel": params.supervisorTel,
          "name": params.supervisorName
        }
      }
    };

    // 保存文件信息
    await networkModel.update({_id: params._id}, param);

    let data = {};
    data.resultCode = "00";
    res.status(200).send(data);
  });*/

  // 首次被驳回，直接 MongoDB 中修改 medicalCenter
  /*app.post('/medicalCenter/saveMedicalCenter', async function (req,res,next) {
    let params = req.body.params;

    let param = {
      $set: {
        region: params.region,
        address: params.address,
        name: params.name,
        discount: params.discount,

        cooperationTime: {
          "startTime": params.cooperationStartTime,
          "endTime": params.cooperationEndTime
        },
        supervisor:{
          "IDNo": params.supervisorIDNo,
          "tel": params.supervisorTel,
          "name": params.supervisorName
        }
      }
    };

    // 保存文件信息
    await networkModel.update({_id: params._id}, param);

    let data = {};
    data.resultCode = "00";
    res.status(200).send(data);
  })*/
};

