<template>
  <div class="main-container">
    <div class="title">新账号申请</div>
    <div class="line"></div>
    <div style="padding: 30px 30px 0 30px">
      <div>新合作医疗服务中心信息填写</div>
      <div class="line2"></div>
      <p class="warn">请根据合作协议事项仔细填写以下信息</p>
      <el-row style="margin: 20px 0 20px 0;">
        <el-col :span="6"><div class="steps" :class="{'steps-active': 1 == indexActive}">1.项目信息</div></el-col>
        <el-col :span="6"><div class="steps" :class="{'steps-active': 2 == indexActive}">2.申请</div></el-col>
        <el-col :span="6"><div class="steps" :class="{'steps-active': 3 == indexActive}">3.完成</div></el-col>
      </el-row>
      <div class="step-box">
        <div v-if="indexActive==1">
          <div class="title">基础信息</div>
          <div class="item-box">
             <p class="item-label">所属地区</p>
            <el-cascader style="width: 300px;"
                         :options="cityInfo"
                         placeholder="请选择省/市/区"
                         @change="handleChange">
            </el-cascader>
          </div>
          <div class="item-box">
            <p class="item-label">医疗服务中心名称</p>
            <el-input  v-model="name" style="width: 500px" ></el-input>
          </div>
          <div class="item-box">
            <p class="item-label">详细地址</p>
            <el-input  v-model="address" style="width: 500px" ></el-input>
          </div>
          <div class="item-box">
            <p class="item-label">负责人姓名 - 身份证号 - 电话</p>
            <el-input  v-model="supervisor.name" style="width: 150px" ></el-input> -
            <el-input  v-model="supervisor.IDNo" style="width: 300px" ></el-input> -
            <el-input  v-model="supervisor.tel" style="width: 200px" ></el-input>
          </div>
        </div>
        <div v-if="indexActive==2">
          <div class="title">相关负责信息</div>
          <div class="item-box">
            <p class="item-label">合作时间</p>
            <el-date-picker
              v-model="beginTime"
              type="date"
              placeholder="开始时间">
            </el-date-picker> -
            <el-date-picker
              v-model="endTime"
              type="date"
              placeholder="结束时间">
            </el-date-picker>
          </div>

          <div class="item-box">
            <p class="item-label">按协议上传照片</p>
            <el-upload action="/medicalManager/accountApplication/accountApplication/agreementUpload"
                       list-type="picture-card"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove"
                       :on-success="handleSuccess"
                       :before-upload="beforeUpload"
                       multiple
                       >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog width="25%" :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </div>

          <div class="item-box">
            <p class="item-label">项目折扣</p>
            <el-input  v-model="discount" placeholder="0~100之间" style="width: 200px" >
              <template slot="append">%</template>
            </el-input>
          </div>
        </div>
        <div v-if="indexActive==3" class="item-box-success">
            <h2>{{name}}</h2>
            <h3 class="success-info">编号：{{code}}</h3>
            <h3 class="success-info await-check">提交已成功，等待审核...</h3>
            <p><span style="color: #DF0C0C">{{second}}&nbsp;</span>秒后自动跳转</p>
        </div>
      </div>
      <div style="margin-top: 12px;float: right">
        <el-button  v-if="indexActive==2" type="primary" @click="indexActive--">上一步</el-button>
        <el-button  v-if="indexActive==1" type="primary" @click="next">下一步</el-button>
        <el-button  v-if="indexActive==2" type="primary" @click="application">申请</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import  cityInfo from '../../../../static/js/city-data';
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        indexActive:1,
        second:5,
        cityInfo: cityInfo,
        region:'',
        name:'',
        code:"",
        address:'',
        supervisor:{},
        codeIndexArr:[],
        beginTime:'',
        endTime:'',
        discount:'',
        fileList:[],
        submit:false
      };
    },
    created(){

    },
    methods:{
      next(){
          if(!this.region||!this.address||!this.name||!this.supervisor.name||!this.supervisor.IDNo||!this.supervisor.tel){
            this.$message({
              message: '请正确填写所有信息',
              type: 'warning'
            });
            return
          }
          if(!this.config.IDNoReg.test(this.supervisor.IDNo)){
            this.$message({
              message: '身份证号码输入不正确',
              type: 'warning'
            });
            return
          }
          if(!this.config.telReg.test(this.supervisor.tel)){
            this.$message({
              message: '手机号码输入不正确',
              type: 'warning'
            });
            return
          }
          this.indexActive++
      },
      handleChange(value) {
        this.api.getRegion(value,this);
      },
      beforeUpload(file){
        let index = file.name.lastIndexOf(".");
        let suffix = file.name.substring(index);
        const isImg= suffix==".bmp"||suffix==".png"||suffix==".gif"||suffix==".jpg"||suffix==".jpeg";
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isImg) {
          this.$message.error('上传头像图片只能是 JPG,PNG,JPEG,BMP 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isImg && isLt5M;
      },
      handleSuccess(res,file){
          this.fileList.push(res);
      },
      handleRemove(file) {
          for(let i in this.fileList){
              if(this.fileList[i].path == file.response.path){
                this.fileList.splice(i,1);
                break
              }
          }
      },
      handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
      },
      application(){
          if(this.submit){
              return;
          }
          if(!this.endTime) return this.$message.error('请选择结束时间');
          if(!this.beginTime) return this.$message.error('请选择开始时间');
          if(!this.fileList.length) return this.$message.error('请上传协议照片');
          if(!this.discount||isNaN(this.discount)||this.discount>100||this.discount<0){
              return this.$message.error('折扣为0~100之间的数字')
          }
          this.submit = true;
          var vm = this;
          this.axios.post("/medicalManager/accountApplication/saveNetwork",{
              params:{
                region:vm.region,           //地区
                address:vm.address,      // 详细地址
                name:vm.name,          //诊所名称
                discount: vm.discount, // 项目折扣
                cooperationTime: {startTime: new Date(vm.beginTime), endTime: new Date(vm.endTime)}, // 合作时间
                protocolAttach: vm.fileList, // 协议图片附件
                supervisor:vm.supervisor,  //负责人信息
                codeIndexArr:vm.codeIndexArr
              }
          }).then(res=>{
              if(res.data.result == vm.config.success){
                  vm.code = res.data.code;
                  vm.indexActive = 3;
                  let timer = setInterval(()=>{
                      vm.second--;
                      if(vm.second === 0){
                          vm.dialogImageUrl= '';
                          vm.dialogVisible= false;
                          vm.indexActive=1;
                          vm.second=5;
                          vm.cityInfo= cityInfo;
                          vm.region='';
                          vm.name='';
                          vm.code="";
                          vm.address='';
                          vm.supervisor={};
                          vm.codeIndexArr=[];
                          vm.beginTime='';
                          vm.endTime='';
                          vm.discount='';
                          vm.fileList=[];
                          vm.submit=false;
                          clearTimeout(timer)
                      }
                  },1000)
              }
          });
      }
    }
  }
</script>
<style scpoed>
  .main-container{
    min-height: 100%;
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
  .line2{
    margin-top:10px;
    border-top: 1px solid #EFEFEF;
    width: 100%
  }
  .warn{
    font-size: 13px;
    color: #F16E69;
    margin: 20px 0 10px 0;
  }
  .steps {
    background-color: #EEEEEE;
    color: #CDCDCD;
    display: inline-block;
    padding: 10px;
    width: 50%;
    text-align: center;
    border-radius: 5px;
  }

  .steps-active {
    background-color: #2E99D7;
    color: #DCEEF8;
    display: inline-block;
    padding: 10px;
    width: 50%;
    text-align: center;
    border-radius: 5px;
  }

  .step-box{
    width: 98%;
    background-color: #EFEFEF;
    padding: 20px
  }
  .item-box{
    margin-bottom: 15px
  }
  .item-label{
    font-size: 13px;
    font-weight: bold;
    padding-bottom: 5px
  }
  .item-box-success{
    padding: 100px 200px 100px 350px;
    text-align: center
  }
  .success-info{
    padding: 14px 0 14px 0
  }
  .await-check{
    color: #0EA018
  }
</style>
