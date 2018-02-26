<template>
    <div id="el-main" ref="el-main">


      <el-row :gutter="20" style="height: 100%">
        <el-col :span="18" style="height: 95%">
          <div class="el-title">客户详情</div>
          <hr class="left-top-line">
          <div class="el-cus-detail">

            <el-tabs  type="card">
              <el-tab-pane label="个人信息"><customerBaseInfo ></customerBaseInfo></el-tab-pane>
              <el-tab-pane label="历史记录"> <history-record :userId="_id" :vue-new="vueNew"></history-record></el-tab-pane>
            </el-tabs>
          </div>
        </el-col>

        <el-col :span="6" style="height: 100%">
          <div style="height: 100%;background-color: #FFFFFF">
            <div class="el-title-hidden"></div>
            <hr class="right-top-line" >

            <div class="right-illness-container">
              <consultation-advice class="right-illness"  :userId="_id" :vue-new="vueNew"></consultation-advice>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
</template>
<script>
  import consultationAdvice from './consultationAdvice.vue'
  import customerBaseInfo from './customerBaseInfo.vue'
  import historyRecord from './historyRecord.vue'
  import Vue from "vue"
	export default {
    components: {
      consultationAdvice,
      historyRecord,
      customerBaseInfo
    },
		data() {
			return {
        _id: '',
        vueNew: new Vue()
      }
		},
    created(){
      let UrlSearch = new this.api.UrlSearch();
      this._id = UrlSearch._id;
    },
    mounted(){

    },
		methods: {

    },

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
  }
  .el-title-hidden{
     height:41px;
    background-color:#EEEEEE;
  }
  .el-cus-detail{
    width: 100%;
    height: 100%;
    background-color:#FFFFFF;
    margin: 0 auto;
  }
  .left-top-line{
    height: 2px;
    background-color: #2D99D9;
  }
  .right-top-line{
    height: 2px;
    background-color: #2D99D9;
  }
  .right-illness-container{
    width: 100%;
    background-color:#FFFFFF;
    margin: 0 auto;
    padding-top: 20px;
  }
  .right-illness{
    width: 96%;
    margin: 0px auto
  }
</style>
