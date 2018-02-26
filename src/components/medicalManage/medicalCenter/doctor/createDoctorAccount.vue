<template>
    <div class="container">

      <div class="mainContent">
        <div style="padding: 15px">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="main-form">
            <el-form-item label="姓名" prop="name" class="font-bold">
              <el-input  v-model="ruleForm.name" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex" class="font-bold">
              <el-radio-group v-model="ruleForm.sex">
                <el-radio  label="男">男</el-radio>
                <el-radio  label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证号码" prop="IDNo" class="font-bold">
              <el-input  v-model="ruleForm.IDNo" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel" class="font-bold">
              <el-input  v-model="ruleForm.tel" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="从医时间" prop="doctorTime" class="font-bold">
              <el-date-picker
                v-model="ruleForm.doctorTime"
                type="date"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="最高学历" prop="education" class="font-bold">
              <el-select v-model="ruleForm.education" placeholder="请选择最高学历">
                <el-option label="高中" value="高中"></el-option>
                <el-option label="大专" value="大专"></el-option>
                <el-option label="本科" value="本科"></el-option>
                <el-option label="硕士" value="硕士"></el-option>
                <el-option label="博士" value="博士"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="擅长" prop="beGoodAt" class="font-bold">
              <el-input type="textarea" v-model="ruleForm.beGoodAt" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button style="margin-left: 30%" type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    props:{
        doctorId:{type:String,default:''}
      },
    data() {

      var checkIDNo = (rule, value, callback) => {
          if(!value){
            return callback(new Error('身份证号码不能为空！'));
          }else if(!this.config.IDNoReg.test(value)){
            return callback(new Error('身份证号码输入有误'));
          }
          callback()
      };
      var checkTel = async (rule, value, callback) => {
        let reg = this.config.IDNoReg;
        if (!value) {
          return callback(new Error('手机号码不能为空！'));
        }else{
          let vm  = this;
          await vm.axios.get('/network/examination/userSearch/userSearch',{params:{searchContent:value,_id:vm.doctorId}}).then(function (data) {
            if(data.data.result === "00"){
              vm.telCheck = true;
            }else{
              vm.telCheck = false;
            }
            }).catch(function (err) {
          });
          if(vm.telCheck&&reg.test(value)){
            return callback(new Error('该手机号码已被使用！'));
          }else if(reg.test(value) === false){
            return callback(new Error('手机号码格式不正确！'));
          }
        }
        callback()
      };
      return {
          submit:false,
          ruleForm: {},
          rules: {
          name: [{trigger: 'blur',message: '请输入姓名',required:true}],
          sex:  [{trigger: 'blur',message: '请选择性别',required:true}],
          IDNo: [{trigger: 'blur', validator: checkIDNo,required:true}],
          tel:  [{trigger: 'blur',validator: checkTel,required:true}],
          doctorTime: [{trigger: 'blur',message: '请选择从医时间',required:true}],
          education: [{trigger: 'change',message: '请选择最高学历',required:true}],
        },
      };
    },
    created(){
      let UrlSearch = new this.api.UrlSearch();
      this.ruleForm.networkId = UrlSearch._id
    },
    mounted(){
       if(this.doctorId){
           this.init();
       }
    },
    methods: {
        init(){
            var vm = this;
           this.axios.get('/medicalManager/medicalCenter/doctor/queryDoctorById',{params:{_id:vm.doctorId}})
             .then(res=>vm.ruleForm={...vm.ruleForm,...res.data});
        },
      submitForm(formName) {
            console.log(this.ruleForm,this.doctorId)
        this.$refs[formName].validate((valid) => {
          if (valid) {
              if(!this.doctorId){
                this.addDoctor();
              }else{
                  this.modifyDoctorInfo();
              }
          } else {
            this.$message({
              message: '请正确填写所有信息',
              type: 'warning'
            });
            return false;
          }
        });
      },
      addDoctor(){
          var vm = this;
          if(vm.submit){
              return
          }
          vm.submit = true;
        this.axios.post('/medicalManager/medicalCenter/doctor/addDoctor',{params:vm.ruleForm})
          .then(res=>{
              vm.submit = false;
              vm.ruleForm = {networkId:vm.ruleForm.networkId};
              vm.$alert('恭喜，创建成功，初始密码为123456', '提示', {
              type: 'success',
               })
              vm.$emit('addDoctorSuccess');
          })
      },
      modifyDoctorInfo(){
         var vm = this;
         this.axios.post('/medicalManager/medicalCenter/doctor/modifyDoctorInfo',{params:vm.ruleForm})
           .then(res=>{
               if(res.data.result == "00") {
                 vm.$alert('恭喜，操作成功', '提示', {
                   type: 'success',
                 })
                 vm.$emit('addDoctorSuccess');
               }
           })
      }
    },
    watch:{
      doctorId(){
          debugger;
        if(this.doctorId){
          this.init();
        }else{
          this.ruleForm = {networkId:this.ruleForm.networkId};
        }
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
    margin: 0px auto;
  }
</style>
