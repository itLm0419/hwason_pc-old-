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
          <el-checkbox v-for="(n,index) in network" :key="index"  :label="n"  border>{{n.name}}</el-checkbox>
        </el-checkbox-group>
        <el-button style="margin:10px 40px 0 200px" type="primary" @click="confirm">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import  cityInfo from '../../../../static/js/city-data';
  export default {
    props:['allotNetwork', 'checkNetworkFromModify'],
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
            vm.checkNetwork = vm.checkNetworkFromModify;

            if (res.data.length === 0) {
              if (vm.checkNetworkFromModify.length === 0) {
                this.network = [];
              } else {
                this.network = vm.checkNetworkFromModify;
              }
            } else {
              if (vm.checkNetworkFromModify.length === 0) {
                this.network = res.data;
              } else {
                this.network = vm.checkNetworkFromModify.push.apply(vm.checkNetworkFromModify, this.network);
              }
            }
          })
      },
      confirm(){
        this.$emit('handleConfirmNetwork',this.checkNetwork)
      }
    },
    watch:{
      allotNetwork(){
          this.queryNetWork();
      },
      checkNetworkFromModify() {

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
