/*
* 自定义套餐业务逻辑
* */
import ItemModel from "../../database/schema/item"
import api from '../../util/api'
import config from '../../util/config'

module.exports = function (app) {
  // 查询套餐
  app.get('/package/createPackage/selectContent/queryPackages', async function(req, res, next) {
    try{
      let currentPage = parseInt(req.query.currentPage);
      let currentSize = parseInt(req.query.currentSize);

      let searchParams = {};
      if (req.query.hsName && req.query.hsName !== '') {
        searchParams.hsName = {$regex: req.query.hsName};
      }

      if (req.query.category && req.query.category !== '') {
        searchParams.category = {$regex: req.query.category};
      }

      console.log(searchParams);

      let skipNum = parseInt((currentPage-1)*currentSize);
      let limitNum = parseInt(currentSize);

      let totalCount = await ItemModel.find(searchParams).count();

      console.log(totalCount);

      let ItemModels = [];
      if (totalCount > 0) {
        // 超出范围后的控制
        if ((currentPage-1)*currentSize >= totalCount) {
          let lastPage = parseInt(totalCount/currentSize);
          let lastPageSize = parseInt(totalCount%currentSize);

          skipNum = parseInt((lastPage-1)*currentSize);
          limitNum = parseInt(lastPageSize);
        }

        ItemModels = await ItemModel.find(searchParams).skip(skipNum).limit(limitNum);
      }

      let categoryArr = await ItemModel.distinct("category", {"category": {$ne: null}});

      let data = {};
      data.totalCount = totalCount;
      data.ItemModels = ItemModels;
      data.categoryArr = categoryArr;
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
  })
};

