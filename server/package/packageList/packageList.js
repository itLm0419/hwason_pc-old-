import projectModel from '../../database/schema/project';
import JSZip from "jszip";
import xlsx from 'node-xlsx';
import fs from 'fs'
import config from '../../util/config'
import api from '../../util/api'
module.exports = function (app) {
  /*
  查看套餐列表
  params pageNo
         pageSize
         name
         code
  */
  app.get('/package/packageList/packageList/queryPackageList',async function (req,res,next) {
     try{
       let pageNo = req.query.pageNo||1;
       let pageSize = req.query.pageSize||10;
       let category = req.query.name;
       let categoryCode = req.query.code;
       let query = {};
       if(category){
         query.category = {$regex:category}
       }
       if(categoryCode){
         query.categoryCode = {$regex:categoryCode};
       }
       console.log(query);
       let count = await projectModel.count(query);

       let projects = await projectModel.find(query).skip((pageNo-1)*pageSize).limit(parseInt(pageSize));
       let data = {};
       data.count = count;
       data.package = projects;
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
  // 导出套餐Excel表格
  // params _ids
  app.post('/package/packageList/packageList/downloadPackage',async function (req,res,next) {
     try{
       let _ids = req.body._ids;
       let query = {};
       if(_ids&&_ids.length){
         query._id = {$in:_ids};
       }
       let projects = await projectModel.find(query);
       let data = [];
       let header = ["类别","类别编码","套餐名","套餐编码","价格","临床意义","检测项","创建人"];
       data.push(header);
       for(let project of projects){
         for(let pro of project.projects){
           let content = [];
           for(let con of pro.content){
             content.push(con.hsName)
           }
           data.push([project.category,project.categoryCode,pro.name,pro.code,
             pro.price,pro.significance,content,pro.createBy.name])
         }
       }
       let buffer = xlsx.build([
         {
           name: 'sheet1',
           data: data
         }
       ]);
       await fs.writeFileSync('/home/hwason/download/华晟体检套餐.xlsx', buffer);
       res.download('/home/hwason/download/华晟体检套餐.xlsx');
       api.writeInfo(req,{})
     }catch(e){
       let data = {};
       data.name = e.name;
       data.message = e.message;
       res.send(data);
       api.writeErr(req,data)
     }
  });
  // 删除套餐
  // params _ids
  app.post('/package/packageList/packageList/removePackage',async function (req,res,next) {
     try{
       let _ids = req.body.params._ids;
       await projectModel.remove({_id:{$in:_ids}});
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
/*
  * 查看单个项目套餐详情
  * @Param _id 项目ID
  * */
  app.get("/package/packageList/packageList/queryProject",async function (req,res,next) {
    try{
      let _id = req.query._id;

      // 查询数据
      let project = await projectModel.find({_id: _id},{category:1, categoryCode:1, level:1, projects:1});

      // 返回数据封装
      let data = {};
      data.project = project;
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

  app.get("/package/packageList/packageList/queryItem",async function (req,res,next) {
    try{
      let projectId = req.query.projectId;
      let itemId = req.query.itemId;

      // 查询数据
      let project = await projectModel.find({"projects._id": itemId});

      // 返回数据封装
      let data = {};
      data.project = project;
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

  // 删除套餐item
  app.post("/package/packageList/packageList/deleteItem",async function (req,res,next) {
    try{
      let query = {};
      let itemId = req.body.params.itemId;
      let projectId = req.body.params.projectId;

      // 查询数据
      await projectModel.update({_id: projectId}, {$pull: {"projects": {"_id": itemId}}});

      // 返回数据封装
      let data = {};
      data.result = config.deleteMsg;
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

  // 修改套餐item
  app.post("/package/packageList/packageList/modifyItem",async function (req,res,next) {
   try{
     let params = req.body.params;
     let projectId = req.body.params.projectId;
     let itemId = req.body.params.itemId;

     let project = await projectModel.find({"projects._id": itemId}).lean();

     project[0].projects.forEach(item => {
       if (item._id.toString() === itemId) {
         item.name = params.name;
         item.price = params.price;
         item.significance = params.significance;
         item.content = params.content;
       }
     });

     // 查询数据
     await projectModel.update({"projects._id": itemId},{$set:{projects: project[0].projects}});

     // 返回数据封装
     let data = {};
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
