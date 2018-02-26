<template>
  <div class="container">

    <div class="mainContent">
      <div style="padding: 15px">
        <el-form  label-width="100px" class="main-form">
          <el-form-item label="地区"  class="font-bold">
            <el-cascader style="width: 300px;"
                         :options="cityInfo"
                         placeholder="请选择省/市/区"
                         change-on-select
                         clearable
                         @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-form>
        <el-checkbox-group v-model="checkNetwork" size="small">
          <el-checkbox v-for="(n,index) in network" :key="index"  :label="n" border>{{n.name}}</el-checkbox>
        </el-checkbox-group>
        <el-button style="margin:10px 40px 0 200px" type="primary" @click="confirm">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import  cityInfo from '../../../../static/js/city-data';
  export default {
    props:['addSampleReceiveSuccess'],
    data() {
      return {
        cityInfo:cityInfo,
        region:'',
        network:[],
        checkNetwork:[]
      };
    },
    created(){
      this.queryNetWork()
    },
    mounted(){

    },
    methods: {
      handleChange(value) {
        this.api.getRegion(value,this);
        this.queryNetWork();
      },
      queryNetWork(){
        var vm = this;
        this.axios.get('/medicalManager/sampleReceiver/sampleReceiver/queryNetWork',
          {params:{region:vm.region}})
          .then(res=>{
            this.network = res.data;
            this.checkNetwork = []
          })
      },
      confirm(){
        this.$emit('handleConfirmNetwork',this.checkNetwork)
      }
    },
    watch:{
      addSampleReceiveSuccess(){
          this.queryNetWork();
      }
    }
  }
</script>
<style scoped>
  .container {
    background-color: white;
  }
  .main-form{
    width: 500px;
    margin: 0 auto;
  }
</style>
