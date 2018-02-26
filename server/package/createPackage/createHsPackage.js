/*
* HS健康套餐业务逻辑层
* */
import loginModel from '../../database/schema/login'
import projectModel from "../../database/schema/project";
import client from '../../database/redis'
import config from '../../util/config'
import api from '../../util/api'
module.exports = function (app) {
  //创建体检套餐时查询体检套餐名是否已存在
  app.get("/package/createPackage/createHsPackage/checkProjectName",async function (req,res,next) {
   try{
     let category = req.query.category;
     let count = await projectModel.count({category:category});
     let flag = count==0?false:true;
     res.status(200).send(flag);
     api.writeInfo(req,flag);
   }catch(e){
     let data = {};
     data.name = e.name;
     data.message = e.message;
     res.send(data);
     api.writeErr(req,data)
   }
  });

  // 项目小类别缓存
  app.post("/package/createPackage/createHsPackage/cacheProjs",async function (req,res,next) {
   try{
     let params = req.body.params;

     let key = params.key;

     let _id = req.cookies.userId;
     let createBy = {};
     if (_id) {
       let login = await loginModel.findOne({_id:_id});
       createBy = {_id:_id,name:login.realName,userName:login.userName,createTime:new Date()};
     }

     let value = {
       name: params.name,
       price: params.price,
       significance: params.significance,
       content: params.selectedItems,
       createBy: createBy
     };

     client.set(key, JSON.stringify(value),function (err, response) {
       console.log(err, response);
     });

     let data = {};
     data.result = config.cachingSuccess;
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

  // 查询项目小类别缓存
  app.post("/package/createPackage/createHsPackage/queryCacheProjs",async function (req,res,next) {
    try{
      let data = {};
      let uuids = req.body.params.uuids;

      let resArr = [];
      for (let i=0; i<uuids.length;i++) {
        let obj = JSON.parse(await client.get(uuids[i]));
        obj.uuid = uuids[i];
        resArr.push(obj);
      }
      data.result = "查询queryCacheProjs"+config.cachingSuccess;
      data.resultCode = config.success;
      data.resArr = resArr;
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

  // 查询uuids
  app.get("/package/createPackage/createHsPackage/queryuuids",async function (req,res,next) {
    try{
      let prouuid = req.query.prouuid;
      console.log("queryuuids result:", prouuid);

      let data = {};
      let obj = await client.get(prouuid);
      data.result = obj;
      console.log("23132",data);
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

  // 缓存uuids
  app.post("/package/createPackage/createHsPackage/saveuuids",async function (req,res,next) {
   try{
     let prouuid = req.body.params.prouuid;
     let uuids = req.body.params.uuids;

     if (!uuids[0]) {
       client.del(prouuid);
     } else {
       client.set(prouuid, JSON.stringify(uuids));
     }

     let data = {};
     data.result = "queryuuids"+config.successMsg;
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

  //创建新的体检套餐并进行编码
  app.post("/package/createPackage/createHsPackage/addProject",async function (req,res,next) {
    try{
      let project = req.body.params;

      let projects = await projectModel.find({}).sort({"createBy.createTime":-1}).limit(1);
      let categoryCode = "";
      if(!projects.length){
        categoryCode = "HSPN100001";
      }else{
        categoryCode = "HSPN"+(parseInt(projects[0].categoryCode.substr(4,6))+1);
      }

      for(let pro of project.projects){
        let index = project.projects.indexOf(pro)+1;
        pro.code = categoryCode + "." + (index>=10?index:"0"+index)
      }

      let _id = req.cookies.userId;
      let createBy = {};
      if (_id) {
        let login = await loginModel.findOne({_id:_id});
        createBy = {_id:_id,name:login.realName,userName:login.userName,createTime:new Date()};
      }

      for(let pro of project.projects){
        pro.content = pro.content;
      }
      let projectEntity = new projectModel({
        category:project.category,   //类别
        categoryCode:categoryCode,  //类别编码
        level:1,// 1.一级套餐  2.二级套餐 如HC
        createBy:createBy,  //创建人信息
        projects:project.projects
      });
      let data = await projectEntity.save();
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

  /*
  * 新增项目套餐
  * */
  app.post("/package/createPackage/createHsPackage/saveItem",async function (req,res,next) {
    try{
      let query = {};
      let params = req.body.params;
      query = {
        _id: params.projectId
      };

      console.log(params);

      // 查询数据
      let project = await projectModel.find(query,{categoryCode: 1, projects: 1});

      let lastestProCodePre = project[0].categoryCode;
      let lastestProNo = config.success;
      for (let item of project[0].projects){
        // 处理套餐编码
        let codeNo = parseInt(item.code.split(".")[1]);
        lastestProNo = parseInt(lastestProNo) < codeNo ? codeNo : lastestProNo;
      }

      lastestProNo = parseInt(lastestProNo) + 1;

      lastestProNo = lastestProNo < 10 ? "0"+lastestProNo : lastestProNo;

      let code = lastestProCodePre + "." + lastestProNo;

      let userId = req.cookies.userId;
      let login = await loginModel.findOne({_id: userId});
      let createBy = {_id: userId,name: login.realName,userName: login.userName,createTime: new Date()};

      let projectOne = {
        createBy: createBy,
        name: params.name,         //套餐名
        price: params.price,        //价格
        significance: params.significance,  //临床意义
        code: code,         //套餐编码
        content: params.content
      };

      await projectModel.update({_id: params.projectId},{$push:{projects:projectOne}});

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
  });
};
