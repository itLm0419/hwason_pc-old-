<template>
    <div>
      <div style="width: 100%;height: 50px">
        <div style="float: left;height: 100%;width: 50%">
          <span class="subTitleBGColor">{{baseInfo.name}}</span>
          <span style="line-height: 40px" v-if="baseInfo.createBy">建档日期：{{moment(baseInfo.createBy.createTime).format('YYYY/MM/DD HH:mm')}}</span>
        </div>
        <div style="float: right;margin-right: 20px">
          <el-button type="primary" icon="el-icon-edit" @click="editBaseInfo">修改完善</el-button>
          <el-button type="danger" @click="toExamination">健康体检</el-button>
        </div>
      </div>
      <el-collapse class="el-collapse-container" v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <span class="collapse-item">基本信息</span>
          </template>
          <el-row>
            <el-col :span="7">性别：{{baseInfo.sex}}</el-col>
            <el-col :span="17">身份证号：{{baseInfo.IDNo}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="7">联系方式：{{baseInfo.tel}}</el-col>
            <el-col :span="17">区域：{{baseInfo.region}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="7">详细地址：{{baseInfo.address}}</el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <span class="collapse-item">疾病史</span>
          </template>
          <el-row v-for="(dis,index) in baseInfo.disease" v-if="dis.hasDisease.length" :key="index">
            <el-col :span="24">{{dis.name}}：<span v-for="hd in dis.hasDisease" style="padding-right: 20px">{{hd}}</span></el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item  name="3">
          <template slot="title">
            <span class="collapse-item">个人健康状态</span>
          </template>
          <el-col v-for="(hs,index) in baseInfo.healthStatus" :key="index" :span="12">{{hs.name}}：{{hs.value}}</el-col>
        </el-collapse-item>
        <el-collapse-item  name="4">
          <template slot="title">
            <span class="collapse-item">其他说明</span>
          </template>
          <div>{{baseInfo.otherDesc}}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>
<script>
  import moment from 'moment'
  export default {
    data() {
      return {
        activeNames:['1'],
        baseInfo:{},
        moment:moment,
        _id:''
      }
    },
    created(){

      let UrlSearch = new this.api.UrlSearch();
      this._id = UrlSearch._id;
      this.init();
    },
    methods: {
        init(){
            var vm = this;
            this.axios.get('/network/examination/customerBaseInfo/queryCustomerBaseInfo',{params:{_id:vm._id}})
              .then((response)=>vm.baseInfo = response.data)
        },
        editBaseInfo(){
             this.$router.push('/createRecord/createRecord?_id='+this._id)
        },
        toExamination(){
           this.$router.push(`/examination/examination?_id=${this._id}`)
        }
    },
  }
</script>
<style scoped>
  .subTitleBGColor {
    background-color: #686868;
    font-weight: bold;
    color: #FFFFFF;
    width:60px;
    margin-bottom: 5px;
    margin-left: 10px;
    text-align: center;
  }
  .el-collapse-container{
    width: 95%;
    margin: 0 auto;
  }
  .collapse-item{
    color: #2D99D7;
  }
</style>
