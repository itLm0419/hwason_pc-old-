<template>
  <div style="width: 95%;margin: 0 auto;margin-top: 20px;margin-bottom: 20px;">
    <!--<div style="font-weight: bold;margin-bottom: 10px;font-size: 18px;">自定义套餐</div>-->
    <div class="">
      <!--搜索-->
      <el-row>
        <el-col :span="8">
          <span class="searchTitle">按检测项目类别</span>
          <el-select v-model="form.category" placeholder="请选择检测项目类别" style="width: 70% !important;" @change="categoryChange" clearable>
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-col>

        <el-col :span="8">
          <span class="searchTitle">按检测项目名称</span>
          <el-input placeholder="请输入检测项目名称" v-model="form.hsName" style="width: 70% !important;"
                    @keyup.native.enter="keySearch">
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" style="margin-top: 31px;" @click="keySearch">搜索</el-button>
        </el-col>
      </el-row>

      <!--主题内容-->
      <div style="width: 100%;margin: 0 auto;margin-top: 20px;">
        <el-row :gutter="30">
          <!--别选中的检测项目-->
          <el-col :span="8">
            <div style="font-weight: bold;margin-bottom: 10px;">已选择检测项目</div>
            <div style="border: 1px solid #dcdfe6;height: 430px;width: 100%;overflow: hidden;overflow-y: auto;" >
              <div v-for="(item, index) in selectedItems">
                <div class="ellipsisFont selectedRow">
                  <i class="el-icon-delete el-icon--left" style="cursor: pointer;"
                     @click="deleteItem(index, item.hsCode)"></i>
                  <span style="padding-right: 20px;">{{item.hsCode}}</span>
                  <span :title="item.hsName">{{item.hsName}}</span>
                </div>
              </div>
            </div>
          </el-col>

          <!--检测项目列表-->
          <el-col :span="16">
            <div>
              <el-row>
                <el-col :span="6" class="tableTitle tableTile2">编码</el-col>
                <el-col :span="6" class="tableTile2">检测项目</el-col>
                <el-col :span="6" class="tableTitle tableTile2">编码</el-col>
                <el-col :span="6" class="tableTile2">检测项目</el-col>
              </el-row>
            </div>

            <!--遍历数据-->
            <div style="border-top: 1px solid rgb(220, 223, 230);margin-top: 11px;">
              <div v-for="(item, index) in tableData" style="display: inline-block;width: 50%;height: 36px;">
                <div style="display: inline-block;" class="checkBg" @click="isChoice($event,item)"
                     :class="{checkBgImg:hsCode.indexOf(item.hsCode)>=0}"></div>
                <div style="display: inline-block;width: 40%;vertical-align: super;">{{item.hsCode}}</div>
                <div style="display: inline-block;width: 40%;vertical-align: super;" class="ellipsisFont"
                     :title="item.hsName">
                  {{item.hsName}}</div>
              </div>
            </div>

            <el-pagination style="float: right;margin-top: 40px;" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-sizes="[20, 30, 50, 100]" :page-size="20"
                           layout="total, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>
<script>
  import moment from "moment"
  export default {
    props: [
      "selectedItems",
      "hsCode"
    ],
    data() {
      return {
        form: {
          category: '',
          hsName: ''
        },
        tableData: [],
        currentPage: 1,
        currentSize: 20,
        totalCount: 0,
        categoryArr: []
      }
    },
    methods: {
      // 选择框改变
      categoryChange (){
        let vm = this;

        vm.queryItems(1, 20);
      },

      // size change
      handleSizeChange(val) {
        console.log(`每页${val}条`);

        let vm = this;

        vm.currentSize = val;

        vm.queryItems(vm.currentPage, vm.currentSize);
      },

      // current change
      handleCurrentChange(val) {
        console.log(`当前页：${val}`);

        let vm = this;

        vm.currentPage = val;

        vm.queryItems(vm.currentPage, vm.currentSize);
      },

      // 查询检测项目
      queryItems(currentPage, currentSize) {
        let vm = this;

        let param = {
          currentPage: currentPage ? currentPage : vm.currentPage,
          currentSize: currentSize ? currentSize : vm.currentSize,
          hsName: vm.form.hsName,
          category: vm.form.category
        };

        vm.axios.get('/package/createPackage/selectContent/queryPackages', {params: param})
          .then(function (response) {
            console.log(response);

            // 分页数据展示
            vm.tableData = response.data.ItemModels;

            // 分页数据
            vm.totalCount = parseInt(response.data.totalCount);

            // 项目类型数组
            vm.categoryArr = response.data.categoryArr;

          })
          .catch(function (error) {
            console.log(error);
          });
      },

      // 搜索
      keySearch() {
        let vm = this;

        let category = vm.form.category;
        let hsName = vm.form.hsName;

        vm.queryItems(1, 20);
      },

      // 选中多选框
      isChoice(event,item){
        let vm = this;

        if(event.target.className === 'checkBg'){
          vm.selectedItems.push(item);
          vm.hsCode.push(item.hsCode)
        }else{
          let index = vm.selectedItems.indexOf(item);
          let hsCodeIndex = vm.hsCode.indexOf(item.hsCode);
          vm.selectedItems.splice(index,1);
          vm.hsCode.splice(hsCodeIndex,1);

        }
      },

      // 删除选中项
      deleteItem(index, hsCode) {
        let vm = this;

        vm.selectedItems.splice(index,1);
        let hsCodeIndex = vm.hsCode.indexOf(hsCode);
        vm.hsCode.splice(hsCodeIndex,1);
      }
    },
    mounted() {
      let vm = this;

      vm.queryItems();
    }
  }
</script>
<style scoped>
  .hiddenTable {
    display: none;
  }

  .tableTitle {
    text-align: center;
  }

  .checkBg{
    width: 24px;
    height: 24px;
    border:1px solid #ccc;
    margin-top:6px;
    border-radius: 6px;
    cursor: pointer;
    margin-right:5px;
  }

  .checkBgImg{
    border:1px solid white;
    background: url("../../../../static/img/network/packages/check2.png");
    background-size: 100%;
  }

  .searchTitle {
    display: block;
    margin-bottom: 10px;
    font-weight: 800;
  }

  .ellipsisFont {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .tableTile2 {
    font-weight:bold;
  }

  .selectedRow {
    width: 80%;
    margin: 0 auto;
    font-size: 18px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 16px;
  }
</style>
