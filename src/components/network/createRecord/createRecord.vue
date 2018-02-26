<template>
    <div id="elMain" ref="elMain" class="main-container">
        <div class="title">客户健康问卷调查</div>
        <div class="top-line"></div>
        <div class="med-history">个人病史</div>
        <el-form :model="validateForm" ref="form"  label-width="80px">
          <el-form-item label="身高"
                        prop="height"
                        :rules="heightRules"
          >
            <el-input type="height" v-model.number="validateForm.height" style="width: 10%" auto-complete="off">
              <template slot="append">cm</template></el-input>
          </el-form-item>
          <el-form-item label="体重"
                        prop="weight"
                        :rules="weightRules"

          >
            <el-input v-model.number="validateForm.weight" style="width: 10%"><template slot="append">kg</template></el-input>
          </el-form-item>
          <el-form-item label="定期健康体检习惯" label-width="160px" prop="regularExamination" :rules="[ { required: true}]">
            <el-radio v-model="validateForm.regularExamination" label="是">是</el-radio>
            <el-radio v-model="validateForm.regularExamination" label="否">否</el-radio>
          </el-form-item>
          <el-form-item label="近五年居住的区域" label-width="160px" prop="liveArea" :rules="[ { required: true}]">
            <el-radio v-model="validateForm.liveArea" label="城镇">城镇</el-radio>
            <el-radio v-model="validateForm.liveArea" label="农村">农村</el-radio>
          </el-form-item>
          <div v-for="(ds,index) in diseases">
            <p><i>{{index+1}}、</i>{{ds.name}}</p><p style="color: red">（是否患有以下疾病，可多选）</p><br/>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group  v-model="ds.hasDisease" >
              <i style="margin-left: 10px"></i><el-checkbox style="margin-bottom: 20px" border size="medium" v-for="(value,idx) in ds.values" :label="value" :key="value">{{value}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="med-history"><p>个人健康状态</p><p style="color: red">（单选）</p></div>
          <br/>
          <div v-for="(hs,index) in healthStatus">
            <p>
              <svg class="icon icon-required" aria-hidden="true" >
                <use xlink:href="#icon-required"></use>
              </svg>
              <i>{{index+1}}、</i>
              {{hs.name}}
            </p><br/>
            <div style="margin: 15px 0;"></div>
            <el-radio v-for="(value,idx) in hs.values" :key="idx" v-model="hs.value" style="margin-bottom: 20px"  :label="value">{{value}}</el-radio>
          </div>
          <div class="med-history"><p>其他说明</p></div><br/>
          <el-input type="textarea" v-model="otherDesc" style="width: 50%"></el-input>
          <div style="height: 40px"></div>
          <el-row>
            <el-col :span="10"><div style="height: 1px"></div></el-col>
            <el-col :span="2"><el-button type="primary" @click="submitForm">提交</el-button></el-col>
            <el-col :span="10"><div style="height: 1px"></div></el-col>
          </el-row>
        </el-form>
    </div>
</template>
<script>
  export default {
    data() {

      return {
        _id:'',
        validateForm:{
          height:'',
          weight:'',
          regularExamination:'',
          liveArea:''
        },
        diseases:[],
        healthStatus:[],
        otherDesc:'',
        heightRules:[
          { required: true, message: '身高不能为空'},
          { type: 'number', message: '身高必须为数字值'}
        ],
        weightRules:[
          { required: true, message: '体重不能为空'},
          { type: 'number', message: '体重必须为数字值'}
        ]
      };
    },
    computed:{

    },
    created() {
      let UrlSearch = new this.api.UrlSearch();
      this._id = UrlSearch._id;
      this.queryQuestionnaire();
    },
    mounted() {

    },
    methods: {
      //页面加载时查询单选和复选的问卷问题
      queryQuestionnaire(){
        var vm = this;
        vm.axios.get('/network/createRecord/createRecord/createRecord/queryQuestionnaire',{params:{_id:vm._id}}).then((response)=>{
          vm.diseases = response.data.diseases;
          vm.healthStatus = response.data.healthStatus;
          vm.validateForm.height = response.data.user.height;
          vm.validateForm.weight = response.data.user.weight;
          vm.validateForm.regularExamination = response.data.user.regularExamination;
          vm.validateForm.liveArea = response.data.user.liveArea;
          vm.otherDesc = response.data.user.otherDesc
        })
        },
      submitForm(){
          var vm = this;
          if(!vm.validateForm.height||isNaN(vm.validateForm.height)){
            this.$alert('身高必填且为数字','提示',{type:'info'});
            return
          }
          if(!vm.validateForm.weight||isNaN(vm.validateForm.weight)){
            this.$alert('体重必填且为数字','提示',{type:'info'});
            return
          }
          if(!vm.validateForm.regularExamination){
            this.$alert('请选择定期健康体检习惯','提示',{type:'info'});
            return
          }
          if(!vm.validateForm.regularExamination){
            this.$alert('请选择定近五年居住的区域','提示',{type:'info'});
            return
          }
          for(let hs of vm.healthStatus){
              if(!hs.value){
                this.$alert('请选择'+ hs.name,'提示',{type:'info'});
                return
              }
          }
         vm.axios.post('/network/createRecord/createRecord/createRecord',
           {params:{
             _id:vm._id,
             height:vm.validateForm.height,
             weight:vm.validateForm.weight,
             regularExamination:vm.validateForm.regularExamination,
             liveArea:vm.validateForm.liveArea,
             diseases:vm.diseases,
             healthStatus:vm.healthStatus,
             otherDesc:vm.otherDesc,
           }}).then((response)=>{
           vm.$message({
             message: '恭喜你，档案创建成功',
             type: 'success'
           });
           vm.$router.push('/examination/customerDetails?_id='+vm._id)
         })
      },
    }
  }
</script>
<style scoped>
  .main-container{
    padding-left: 20px;
    height: 100%;
    background-color:#FFFFFF;
    border-top: 4px solid  #2D99D7;
    min-width: 660px;

  }
  .title{
    font-weight: bold;
    padding: 30px 0 10px 0px;
  }
  .med-history{
    font-weight: bold;
    padding: 10px 0 10px 0px;
  }
  .top-line{
     width: 98%;
     height: 1px;
     border-bottom: 1px solid #E5E5E5;
     margin: 0px auto;
  }
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  p{
    float: left;
  }
  .icon-required{
    color:#F66C6C;
    width: 0.4em; height: 0.4em;
    /*vertical-align: -2em;*/
    margin:0px 0px 4px 0px ;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
</style>
