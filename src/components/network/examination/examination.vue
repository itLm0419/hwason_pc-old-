<template>
    <div ref="packPage" class="el-main-container">
      <div class="title">健康检查</div>
      <div class="line"></div>
      <div class="packTabs">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="健康体检" name="first">
            <choice-package/>
          </el-tab-pane>
          <el-tab-pane label="体检跟踪" name="second">
            <exam-record></exam-record>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>
<script>
  import choicePackage from './choicePackage.vue'
  import examRecord from './examRecord.vue'
  export default{
    data (){
      return {
        activeTab:"first"
      }
    },
    components:{
      choicePackage,
      examRecord
    },
    mounted(){

    },
    methods:{

    }
  }
</script>
<style scoped>
  .el-main-container{
    height: 100%;
    width: 100%;
    background-color: #FFFFFF
  }
  .title{
    padding-bottom: 10px;
    font-weight: bold;
    width: 100%;
    background-color: #EEEEEE
  }
  .line{
    border-top: 3px solid #2D99D7;
    width: 100%
  }
  .packTabs{
    padding: 20px 20px 0 20px;
  }
</style>
