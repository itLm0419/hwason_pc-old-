<template>
  <div class="el-main-container">
    <div class="title">创建用户</div>
    <div class="line"></div>
    <div style="padding: 30px 0 0 30px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="main-form">
        <el-form-item label="账号" prop="userName" class="font-bold">
          <el-input  v-model="ruleForm.userName" ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName" class="font-bold">
          <el-input  v-model="ruleForm.realName" ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="tel" class="font-bold">
          <el-input v-model="ruleForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" class="font-bold">
          <el-radio-group v-model="ruleForm.role" @change="handleRadioChange">
            <el-radio v-for="role in roles"  :key="role._id" :label="role">{{role.roleName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模块" prop="modularId" class="font-bold" v-show="showModular">
          <el-checkbox-group v-model="ruleForm.modularId">
            <el-checkbox v-for="m in modular" style="margin-left: 0px;margin-right: 30px" :key="m._id" :label="m._id" border>{{m.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item >
          <el-button style="margin-left: 30%" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      var checkUserName = async (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空！'));
        }else{
          let vm  = this;
          await vm.axios.get('/network/examination/userSearch/userSearch',{params:{searchContent:value}}).then(function (data) {
            if(data.data.result === vm.config.success){
              vm.userNameExist = true;
            }else{
              vm.userNameExist = false;
            }
          }).catch(function (err) {

          });
          if(vm.userNameExist){
            return callback(new Error('该账号已存在！'));
          }
        }
        callback()
      };
      var checkRealName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('真实姓名不能为空！'));
        }
        callback()
      };
      var checkTel = async (rule, value, callback) => {
        let reg = this.config.telReg;
        if (!value) {
          return callback(new Error('手机号码不能为空！'));
        }else{
          let vm  = this;
          await vm.axios.get('/network/examination/userSearch/userSearch',{params:{searchContent:value}}).then(function (data) {
            if(data.data.result === vm.config.success){
              vm.telCheck = true;
            }else{
              vm.telCheck = false;
            }
          }).catch(function (err) {

          });
          if(vm.telCheck&&reg.test(value)){
            return callback(new Error('手机号码已存在！'));
          }else if(reg.test(value) === false){
            return callback(new Error('手机号码格式不正确！'));
          }
        }
        callback()
      };
      return {
        showModular:true,
        isSubmit:false,
        roles:[],
        modular:[],
        ruleForm: {
          userName: '',
          realName:'',
          role: '',
          tel: '',
          modularId:[]
        },
        rules: {
          userName: [
            {
              validator: checkUserName,
              trigger: 'blur',
              required:true,
            },
          ],
          realName:[
            {
              validator: checkRealName,
              trigger: 'blur',
              required:true,
            },
          ],
          tel:[
            {
              validator: checkTel,
              required:true,
              trigger: 'blur',
            }
          ],
          role:[{
            required: true, message: '请选择用户角色', trigger: 'change'
          }],
          modularId: [
            { type: 'array', required: true, message: '请至少选择一个菜单模块', trigger: 'change' }
          ],
        },
      };
    },
    created(){
     this.init();
    },
    mounted:function(){
    },
    methods: {
      init(){
          var vm = this;
        this.axios.get("/userManage/createUser/createUser/queryRoles")
          .then(res=>{
              vm.roles = res.data.roles;
              vm.modular = res.data.modular
          })
      },
      handleRadioChange(){
        if(this.ruleForm.role.roleCode === vm.config.success){
          this.showModular = false;
          this.rules.modularId = [];
        }else{
          this.showModular = true;
          this.rules.modularId = [
            { type: 'array', required: true, message: '请至少选择一个菜单模块', trigger: 'change' }
          ];
        }
        this.ruleForm.modularId = this.ruleForm.role.modularId
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createUser();
          } else {
            this.$message({
              message: '请正确填写所有信息',
              type: 'warning'
            });
            return false;
          }
        });
      },
      createUser(){
        var vm = this;
        if(vm.isSubmit){
          return false;
        }
          vm.isSubmit = true;
          this.axios.post('/userManage/createUser/createUser/createUser',{params:vm.ruleForm})
            .then(res=>{
                vm.isSubmit = false;
                if(res.data.result === vm.config.success){
                  vm.$message({
                    message: res.data.message,
                    type: 'warning'
                  });
                  return false;
                }else if(res.data.result === vm.config.success){
                  vm.$msgbox({title:'成功',message:"恭喜，创建成功，初始密码为123456",type:'success'});
//                  vm.$message({
//                    message: res.data.message,
//                    type: 'success'
//                  });
                  vm.$msgbox({title:'提示',message:res.data.message,type:'success'});
                  vm.$refs.ruleForm.resetFields();
                  return false;
                }
            })
      }
    }
  }
</script>
<style scope>
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
  .main-form{
    max-width: 500px;
  }
  .font-bold{
    font-size: 14px;
    font-weight: bold
  }
  .detail-address{
    font-family: "Microsoft YaHei";
    color: #dddddd;
  }
</style>
