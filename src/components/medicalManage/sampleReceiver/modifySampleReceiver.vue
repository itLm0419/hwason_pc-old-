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
          <el-form-item label="地区" prop="region" class="font-bold">
            <el-cascader style="width: 300px;"
                         :options="cityInfo"
                         placeholder="请选择省/市/区"
                         change-on-select
                         @change="handleChange"
                         v-model="selectedOption">
            </el-cascader>
          </el-form-item>
          <el-form-item label="身份证号码" prop="IDNo" class="font-bold">
            <el-input  v-model="ruleForm.IDNo" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel" class="font-bold">
            <el-input  v-model="ruleForm.tel" style="width: 400px"></el-input>
          </el-form-item>

          <el-form-item label="分配网点" prop="network" class="font-bold">
            <el-tag
              :key="index"
              v-for="(tag,index) in checkNetwork1"
              :disable-transitions="false"
              @close="handleClose(tag)"
              style="float: left"
            >
              {{tag.name}}
            </el-tag>

            <el-tooltip class="item" effect="dark"  content="修改负责网点" placement="top">
              <svg style="float: left;margin-left: 10px;" @click="$emit('allotNetworkFromModify', checkNetwork1)" class="icon-add-doctor"
                   aria-hidden="true">
                <use xlink:href="#icon-edit"></use>
              </svg>
            </el-tooltip>
          </el-form-item>

          <el-form-item >
            <el-button style="margin-left: 30%" type="primary" @click="submitForm('ruleForm')">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import  cityInfo from '../../../../static/js/city-data';
  export default {
    props:['sampleReceiverId', 'checkNetwork', 'uuid'],
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
        let reg = this.config.telReg;
        if (!value) {
          return callback(new Error('手机号码不能为空！'));
        }else{
          let vm  = this;

          if (vm.origionTel === value) {
            return false;
          }

          await vm.axios.get('/network/examination/userSearch/userSearch',{params:{searchContent:value,_id:vm.doctorId}})
            .then(function (data) {
              if(data.data.result === vm.config.success){
                vm.telCheck = true;
              }else{
                vm.telCheck = false;
              }
          }).catch(function (err) {});

          if(vm.telCheck&&reg.test(value)){
            return callback(new Error('该手机号码已被使用！'));
          }else if(reg.test(value) === false){
            return callback(new Error('手机号码格式不正确！'));
          }
        }
        callback()
      };
      return {
        selectedOption: [],
        cityInfo:cityInfo,
        submit:false,
        ruleForm: {},
        rules: {
          name: [{trigger: 'blur',message: '请输入姓名',required:true}],
          sex:  [{trigger: 'blur',message: '请选择性别',required:true}],
          region:  [{trigger: 'change',message: '请选择地区',required:true}],
          IDNo: [{trigger: 'blur', validator: checkIDNo,required:true}],
          tel:  [{trigger: 'blur',validator: checkTel,required:true}],
          network:  [{trigger: 'blur',message: '请分配网点',required:false}],
        },
        checkNetwork1: [],
        origionTel: ""
      };
    },
    created(){
      let vm = this;

      vm.initPage();
    },
    mounted(){
      let vm = this;

    },
    methods: {
      // 初始化页面
      initPage() {
        let vm = this;

        vm.axios.get('/medicalManager/sampleReceiver/sampleReceiver/querySampleReceiverById', {params: {_id: vm.sampleReceiverId}})
          .then(function (res) {
            if (res.data.result === vm.config.success) {
              let sampleReceiver = res.data.sampleReceiver[0];
              let networks = res.data.networks;
              let region = sampleReceiver.region;
              vm.selectedOption = vm.api.getRegionValue(region, cityInfo);
              vm.checkNetwork1 = networks;
              vm.ruleForm = sampleReceiver;
              vm.origionTel = sampleReceiver.tel;
            }
          })
      },
      handleChange(value) {
        this.api.getRegion(value,this);
        this.ruleForm.region = this.region;
      },

      // 删除 tag
      handleClose(tag){
        let index = this.checkNetwork1.indexOf(tag);
        this.checkNetwork1.splice(index,1);
        console.log(this.checkNetwork1)
      },

      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.modifySampleReceiver();
          } else {
            this.$message({
              message: '请正确填写所有信息',
              type: 'warning'
            });
            return false;
          }
        });
      },

      // 修改
      modifySampleReceiver(){
        let vm = this;

        if (vm.ruleForm.network === undefined) {
          vm.ruleForm.network = vm.checkNetwork1;
        }

        vm.axios.post('/medicalManager/sampleReceiver/sampleReceiver/modifySampleReceiverById', {params: vm.ruleForm})
          .then(res=>{
            if(res.data.result === vm.config.success){
              vm.$emit('handleSuccess',res.data.message);
              vm.submit = true;
              vm.ruleForm = {};
            }
          })
      }
    },
    watch:{
      checkNetwork(){
        this.ruleForm.network = this.checkNetwork;
        this.checkNetwork1 = this.checkNetwork;
      },
      uuid() {
        this.initPage();
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
  .icon-add-doctor{
    color:#409EFF;
    width: 2.5em;
    height: 2.5em;
    float: right;
    padding: 0 15px 5px 0;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
