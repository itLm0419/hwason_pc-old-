<template>
  <div ref="registInfo" class="mian-box">
    <div style="" class="mian-title">客户信息登记</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="main-form">
      <el-form-item label="客户姓名" prop="name" class="font-bold">
        <el-input  v-model="ruleForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="客户性别" prop="sex" class="font-bold">
        <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
        <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="身份证号" prop="IDNo" class="font-bold">
        <el-input v-model="ruleForm.IDNo"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="tel" class="font-bold">
        <el-input v-model="ruleForm.tel"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" class="font-bold">
        <!--<el-input v-model="ruleForm"></el-input>-->
        <el-cascader style="width: 400px;"
          :options="CityInfo"
          v-model="selectedOptions"
          :change-on-select="true"
          :clearable="true"
          :filterable="true"
          @change="handleChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" class="font-bold">
        <el-input type="textarea" :rows="2" v-model="ruleForm.address" class="detail-address"></el-input>
      </el-form-item>
      <el-form-item style="margin-left:200px;">
        <el-button type="success" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import  CityInfo from '../../../../static/js/city-data';
  export default {
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名字不能为空！'));
        }
        callback()
      };
      var checkId = (rule, value, callback) => {

        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
          let reg = this.config.success;
          if (!value) {
            return callback(new Error('身份证号码不能为空！'));
          }else{
//            return callback(new Error('此用户已存在'));
              let vm  = this;
              vm.axios.get('/network/examination/userSearch/userSearch',{params:{searchContent:value}}).then(function (data) {
                if(data.data.result === vm.config.success){
                  vm.idCheck = true;
                  console.log('此用户已存在',vm.idCheck,data.data.result);
                  vm.$message('身份证已创建档案！');
                }
              }).catch(function (err) {
                console.log(err);
              });
            if(reg.test(value) === false) {
              return callback(new Error('身份证号码不正确！'));
            }
          };
        callback()
      };
      var checkTel = (rule, value, callback) => {

       let reg = this.config.telReg;
        if (!value) {
          return callback(new Error('手机号码不能为空！'));
        }else{
          let vm  = this;
          vm.axios.get('/network/examination/userSearch/userSearch',{params:{searchContent:value}}).then(function (data) {
              if(data.data.result === vm.config.success){
                vm.telCheck = true;
                vm.$message('手机号码已存在！');
              }
          }).catch(function (err) {
            console.log(err)
          });
          if(vm.telCheck&&reg.test(value)){
//            return callback(new Error('手机号码已存在！'));
          }else if(reg.test(value) === false){
            return callback(new Error('手机号码格式不正确！'));
          }
        }
        callback()
      };
      return {
        lock:true,
        idCheck:false,
        telCheck:false,
        getAddress:'',
        ruleForm: {
          name: '',
          sex: '1',
          IDNo: '',
          tel: '',
          region:'',
          address:'',
        },
        rules: {
          name: [
            {
               validator: checkName,
                trigger: 'blur',
                required:true,
            },
          ],
          IDNo:[
              {
                validator: checkId,
                required:true,
                trigger: 'blur',
          }
          ],
          tel:[
              {
               validator: checkTel,
               required:true,
               trigger: 'blur',
          }
          ],
        },
        CityInfo: CityInfo,//地区数据
          selectedOptions: [],//地区筛选数组
      };
    },
    mounted:function(){
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      this.$refs.registInfo.style.height = (h - 114) + "px";
    },
    methods: {
      submitForm(formName) {
        if(!this.provice){
              this.$message('请选择地区！')
          }else{
              if(this.city&&this.area){
                this.region = this.provice+'/'+this.city+'/'+this.area;
              }else{
                this.region = this.provice+'/'+this.city;
              }
          }
        this.ruleForm.region = this.region;
        this.$refs[formName].validate((valid) => {
          let vm = this;
          if (valid&&this.region) {
              if(vm.lock){
                vm.lock  = false;
                vm.axios.post('/network/createRecord/registInfo/registInfo',{params:{user:vm.ruleForm}}).then(function (data) {
                  console.log('data:::::::',data.data);
                  if(data.data.result === "00"){
                    vm.$confirm('需要建立详细的健康档案吗?', '提示', {
                      confirmButtonText: '需要',
                      cancelButtonText: '暂时不用',
                      type: 'warning'
                    }).then(() => {

                      window.location.href = '#/createRecord/createSuccess?_id='+data.data._id;
//                     vm.$router.push('createRecord?id='+data.data._id);
                      console.log('to createRecord page');
                    }).catch(() => {
                      window.location.href = '#/examination/customerDetails?_id='+data.data._id;
//                     vm.$router.push('customerDetails?id='+data.data._id);
                      console.log('to customerDetails page');
                    });
                  }
                }).catch(function (err) {
                  console.log('errData::::::::',err)
                });
                console.log(this.ruleForm);
              }else{
                vm.$message({message: '已提交成功，不能重复提交！',});
              }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getProvice(value){
        for(let y in CityInfo){
          if(CityInfo[y].value == value){
            return value = CityInfo[y].label
          }
        }
      },
      getCity(value){
        for(let y in CityInfo){
          for(let z in CityInfo[y].children){
            if(CityInfo[y].children[z].value == value && value!=undefined){
              return value = CityInfo[y].children[z].label;
            }
          }
        }
      },
      getArea(value){
        for(let y in CityInfo){
          for(let z in CityInfo[y].children){
            for(let i in CityInfo[y].children[z].children){
              if(CityInfo[y].children[z].children[i].value == value && value!=undefined){
                return value = CityInfo[y].children[z].children[i].label
              }
            }
          }
        }
      },
      handleChange(value) {
        if(this.selectedOptions[0]){
            this.provice = this.getProvice(this.selectedOptions[0])
        }
        if(this.selectedOptions[1]){
            this.city = this.getCity(this.selectedOptions[1])
        }
        if(this.selectedOptions[2]){
            this.area = this.getArea(this.selectedOptions[2])
        }
      }
    }
  }
</script>
<style scoped>
  .mian-box{
    padding:20px 0 10px 0;
    background: #fff;
    overflow-y: auto;
    border-top:4px solid #2d99d7;
  }
  .mian-title{
    width: 95%;
    font-weight: bold;
    font-size:16px;
    margin:0 10px 15px 25px;
    padding-bottom:10px;
    border-bottom:1px solid #ddd;
  }
  .main-form{
    max-width: 500px;
    margin-left:70px;
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
