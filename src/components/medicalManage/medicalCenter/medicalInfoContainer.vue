<template>
  <div id="el-main" ref="el-main">
    <el-row :gutter="20" class="fh" >
      <el-col :span="18" class="fh">
        <div class="fh wc">
          <div class="el-title">{{name}}</div>
          <hr class="left-top-line">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="医生列表" name="first"><doctorList></doctorList></el-tab-pane>
          </el-tabs>
        </div>
      </el-col>

      <el-col :span="6" class="fh" >
        <div class="fh wc">
          <div class="el-title-hidden"></div>
          <hr class="right-top-line" >
          <medicalDetail></medicalDetail>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import addDoctor from './doctor/createDoctorAccount.vue'
  import doctorList from './doctor/doctorList.vue'
  import medicalDetail from './medicalDetail'
  export default {
    components: {
      addDoctor,
      doctorList,
      medicalDetail
    },
    data() {
      return {
        name:"",
        activeName:"first"
      }
    },
    created(){
      let UrlSearch = new this.api.UrlSearch();
      this.name = decodeURI(UrlSearch.name)
    },
    mounted(){

    },
    methods: {

    }
  }
</script>
<style scoped>
  #el-main{
    height: 100%;
  }
  .el-title{
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color:#EEEEEE;
  }
  .el-title-hidden {
    height: 41px;
    background-color: #EEEEEE;
  }
  .left-top-line{
    height: 2px;
    background-color: #2D99D9;
  }
  .right-top-line{
    height: 2px;
    background-color: #2D99D9;
  }
  .fh{
    height: 100%
  }
  .wc{
    background-color: #FFFFFF
  }
</style>
