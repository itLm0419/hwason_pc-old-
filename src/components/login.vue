<template>
  <el-form   label-width="100px" class="demo-ruleForm">
    <el-form-item label="账号：">
      <el-input v-model="userName"></el-input>
    </el-form-item>
    <el-form-item label="密码：">
      <el-input type="password" v-model="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
          userName:'',
          password:'',
      };
    },
    methods: {
      submitForm() {
          var vm = this;
          this.axios.post("/common/login",{userName:vm.userName,password:vm.password}).then(res=>{
              if(res.data.result === vm.config.fail){
                vm.$message({
                  message: res.data.message,
                  type: 'warning'
                });
                return false;
              }else if (res.data.result === vm.config.success){
                  vm.$router.push(res.data.path)
              }
          })
      }
    }
  }
</script>
<style scoped>

</style>
