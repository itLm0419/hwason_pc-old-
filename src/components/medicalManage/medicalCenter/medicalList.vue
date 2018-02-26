<template>
  <div class="">
    <!--关键词查询-->
    <el-row>
      <el-col :span="4"><span class="subTitle">医疗服务中心</span></el-col>
      <el-col :offset="11" :span="4">
        <el-cascader style="width: 300px;" :options="cityInfo" :change-on-select="true"
                     :clearable="true" :filterable="true" @change="handleChange"
                     placeholder="请选择省/市/区">
        </el-cascader>
      </el-col>
      <el-col :offset="1" :span="4" style="padding-right: 13px;">
        <el-input placeholder="服务中心编号/名称查询" v-model="keyword" class="input-with-select" @keyup.enter.native="keySearch">
          <el-button slot="append" icon="el-icon-search" class="searchBtn" @click="keySearch"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <!--列表-->
    <el-row>
      <!--暂无数据-->
      <el-col :span="24" class="noRecords" v-if="medicalCenterArr.length === 0">
        没有查询到相关数据
      </el-col>

      <el-col :span="4" class="medicalCell" v-for="(item, index) in medicalCenterArr" :key="index"

              @click.native="enterDetail(item._id,item.name)">
        <div
          :class="[item.status == 1 || item.status == 3 ? 'medicalCellRed' : (item.status == 0 || item.status == 2 ? 'medicalCellYellow' : 'medicalCellBlue')]"
              style="width: 95%;">
            <div class="medicalName">
              <span class="fontCls medicalNameSpan">{{item.name}}</span>
            </div>
            <div class="mainInfo">
              <div class="ellipsisFont" >
                <span class="fontCls" :title="item.code">医疗服务中心编号：{{item.code}}</span>
              </div>
              <div class="ellipsisFont" >
                <span class="fontCls" :title="item.name">{{item.name}}</span>
              </div>
              <div class="ellipsisFont" >
                <span class="fontCls" :title="item.time">{{item.time}}</span>
              </div>
              <div class="ellipsisFont" >
                <span class="fontCls" :title="item.address">{{item.address}}</span>
              </div>
              <!--<div>
                <el-button type="primary" size="mini" @click="enter">进入</el-button>
              </div>-->
            </div>
            <img src="../../../../static/img/pending.png" alt="icon" class="sealIcon"
                 v-show="item.status == 0 || item.status == 2">
            <img src="../../../../static/img/reject.png" alt="icon" class="sealIcon"
                 v-show="item.status == 1 || item.status == 3">
        </div>
      </el-col>
    </el-row>

    <!--分页-->
    <el-row>
      <el-col :span="24" class="pagination">
        <div style="float: right;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="12"
            layout="total, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import  cityInfo from '../../../../static/js/city-data';

  export default {
    data() {
      return {
        medicalCenterArr: [],
        cityInfo: cityInfo,
        keyword: '',
        currentPage: 1,
        currentSize: 12,
        region: '',
        codeIndexArr: [],
        totalCount: 0
      };
    },
    created(){
      let vm = this;

      vm.init();
    },
    methods:{
      // 页面初始化
      init() {
        let vm = this;

        vm.queryMedicalList();
      },

      // 查询卫生服务中心
      queryMedicalList() {
        let vm = this;

        let params = {
          currentPage: vm.currentPage,
          currentSize: vm.currentSize,
          region: vm.region,
          key: vm.keyword
        };

        vm.axios.get('/medicalManager/medicalCenter/medicalCenter/queryMedicalList', {params: params})
          .then(function (response) {
            console.log('/medicalManager/medicalCenter/medicalCenter/queryMedicalList:', response);

            if (response.data.resultCode === vm.config.success) {
              // 总条数
              vm.totalCount = response.data.count;

              // 填充数据
              vm.medicalCenterArr = response.data.networks;
            } else {
              vm.api.msgTips(vm, '服务器请求失败', 'error');
              return false;
            }

          })
          .catch(function (error) {})
      },

      // 进入详情页面（分三种状态：reject、pending、pass）
      enterDetail(_id,name) {
        this.$router.push(`/medicalCenter/medicalInfoContainer?_id=${_id}&name=${name} `);

      },

      // 地区下拉框改变
      handleChange(value) {
        let vm = this;

        if (value.length === 0) {
          vm.region = '';
        } else {
          vm.api.getRegion(value, vm);
        }

        vm.queryMedicalList();
      },

      // 关键词查询
      keySearch() {
        let vm = this;

        vm.queryMedicalList();
      },

      // 分页
      handleCurrentChange(val) {
        let vm = this;

        console.log(`当前页：${val} `);

        vm.currentPage = val;

        vm.queryMedicalList();
      }
    }
  }
</script>
<style scpoed>
  .subTitle {
    font-weight: bold;
  }

  .medicalCellRed {
    background-color: #FFFFFF;
    border-top: 3px solid red;
  }

  .medicalCellYellow {
    background-color: #FFFFFF;
    border-top: 3px solid #F29600;
  }

  .medicalCellBlue {
    background-color: #FFFFFF;
    border-top: 3px solid #008E00;
  }

  .medicalCell {
    cursor: pointer;
    position: relative;
    min-width: 266px;
    padding: 0 !important;
    margin-top: 10px;
  }

  .medicalName {
    background-color: rgb(249, 249, 249);
    text-align: center;
    height: 250px;
  }

  .medicalNameSpan {
    line-height: 250px;
    color: #CCCCCC;
  }

  .mainInfo {
    padding-left: 10px;
    padding-bottom: 10px;
  }

  .fontCls{
    text-align: center !important;
    font-size: 14px !important;
    font-weight: bold;
  }

  .ellipsisFont {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .searchBtn {
    border: 1px solid #409EFF !important;
    background-color: #409EFF !important;
    color: white !important;
    -webkit-border-radius: 0px !important;
    -moz-border-radius: 0px !important;
    border-radius: 0px !important;
  }

  .pagination {
    margin:20px 0 10px 0;
  }

  .sealIcon {
    position: absolute;
    top: 176px;
    left: 149px;
    width: 6.1rem;
    height: 4.2rem;
  }

  .noRecords {
    text-align: center !important;
    font-size: 16px;
  }
</style>
