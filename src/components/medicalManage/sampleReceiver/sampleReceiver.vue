<template>
  <div class="el-main-container">
    <div class="title">接收员管理</div>
    <div class="line"></div>
  <div style="padding:30px 30px 0 30px">
    <el-form :inline="true"  class="form-inline">
      <el-form-item label="姓名:">
        <el-input v-model="name" ></el-input>
      </el-form-item>
      <el-form-item label="账号:">
        <el-input v-model="userName" ></el-input>
      </el-form-item>
      <el-form-item label="地区:">
        <el-cascader style="width: 300px;"
                     :options="cityInfo"
                     placeholder="请选择省/市/区"
                     change-on-select
                     clearable
                     @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="负责网点:">
        <el-input v-model="network" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" icon="el-icon-search" @click="querySampleReceiver(pageNo=1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="padding-bottom: 20px">
      <el-button icon="el-icon-plus" size="small"  type="primary" @click="addSampleReceiver=true,action='add'">新增
      </el-button>
      <el-button icon="el-icon-refresh"   size="small"  type="primary" @click="resetPwd">重置密码</el-button>
      <el-button  size="small"  type="info" @click="disable">
        <svg  aria-hidden="true" class="icon">
          <use xlink:href="#icon-disable"></use>
        </svg>
        停用
      </el-button>
      <el-button icon="el-icon-caret-right" @click="enable"  size="small"  type="success" >启用</el-button>
    </div>
    <el-table
      :data="sampleReceivers"
      ref="multipleTable"
      border
      stripe
      max-height="620"
      class="doctor-list-table"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="姓名">
              <span>{{props.row.name}}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{props.row.sex}}</span>
            </el-form-item>
            <el-form-item label="身份证号">
              <span>{{props.row.IDNo}}</span>
            </el-form-item>
            <el-form-item label="地区">
              <span>{{props.row.region}}</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span>{{api.getAgeByIDNo(props.row.IDNo)}}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{props.row.tel}}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span v-if="props.row.status==1" style="color:#67C23A">正常</span>
              <span v-if="props.row.status==2" style="color:#F56C6C">停用</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{props.row.createBy.userName}}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{api.moment(props.row.createBy.createTime).format('YYYY/MM/DD HH:mm')}}</span>
            </el-form-item>
            <el-form-item label="负责网点">
              <span v-for="(n,index) in props.row.networks" :key="n._id">{{n.name}}；<br v-if="(index+1)%3==0"/></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
      >
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="tel"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="tel"
        label="联系电话">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <!--<el-tooltip class="item" effect="dark"  content="修改" placement="top">-->
            <el-button type="text" title="修改" @click="modify(scope.row)">
              <i class="el-icon-edit" style="color:#409EFF"></i>
            </el-button>
          <!--</el-tooltip>-->
          <!--<el-tooltip class="item" effect="dark"  content="删除" placement="top">-->
            <el-button type="text" title="删除" @click="removeSampleReceiver(scope.row._id)">
              <i class="el-icon-delete" style="color:#409EFF"></i>
            </el-button>
          <!--</el-tooltip>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[5, 10, 30, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>

    <el-dialog
      title="新增接收员"
      :visible.sync="addSampleReceiver"
      width="560px"
    >
      <add-sample-receiver
        :checkNetwork="checkNetwork"
        @handleSuccess = "handleSuccess"
        @allotNetwork="addSampleReceiver=false,allotNetwork=true"
      >
      </add-sample-receiver>
    </el-dialog>
    <el-dialog
      title="分配网点"
      @close="closeAllotNetwork"
      :close-on-click-modal="closeOnClickModal"
      :show-close="showClose"
      :visible.sync="allotNetwork"
      width="550px"
    >
      <allot-network
        :addSampleReceiveSuccess="addSampleReceiveSuccess"
        @handleConfirmNetwork="handleConfirmNetwork"
        @allotNetwork="addSampleReceiver=false,allotNetwork=true"
      >
      </allot-network>
    </el-dialog>

    <el-dialog title="修改接收员" :visible.sync="modifySampleReceiver" width="560px" >
      <modify-sample-receiver :uuid="uuid" :sample-receiver-id="sampleReceiverId" :check-network="checkNetwork"
                              @allotNetworkFromModify="allotNetworkFromModify"
                              @handleSuccess = "handleSuccess">
      </modify-sample-receiver>
    </el-dialog>

    <el-dialog
      title="分配网点修改"
      @close="closeAllotNetwork"
      :close-on-click-modal="closeOnClickModal"
      :show-close="showClose"
      :visible.sync="allotNetworkForModify"
      width="550px"
    >
      <allot-network-for-modify
        :allotNetwork="allotNetwork"
        :checkNetworkFromModify="checkNetworkFromModify"
        @handleConfirmNetwork="handleConfirmNetwork"
        @allotNetwork="addSampleReceiver=false,allotNetworkForModify=true"
      >
      </allot-network-for-modify>
    </el-dialog>
  </div>
</div>
</template>
<script>
  import  cityInfo from '../../../../static/js/city-data';
  import addSampleReceiver from './addSampleReceiver'
  import modifySampleReceiver from './modifySampleReceiver'
  import allotNetwork from './allotNetwork'
  import allotNetworkForModify from './allotNetworkForModify'
  export default{
    data(){
      return{
        name:'',
        userName:'',
        network:'',
        region:'',
        cityInfo:cityInfo,
        pageSize:10,
        pageNo:1,
        totalCount:0,
        sampleReceivers:[],
        closeOnClickModal:false,
        allotNetwork:false,
        allotNetworkForModify:false,
        addSampleReceiver:false,
        addSampleReceiveSuccess:false,
        showClose:true,
        checkNetwork:[],
        modifySampleReceiver:false,
        sampleReceiverId: "",
        action: '',
        uuid: '',
        checkNetworkFromModify: ""
      }
    },
    components:{
      addSampleReceiver,
      allotNetwork,
      modifySampleReceiver,
      allotNetworkForModify
    },
    created(){
       this.querySampleReceiver()
    },
    methods:{
      querySampleReceiver(){
        var vm = this;
        vm.axios.get('/medicalManager/sampleReceiver/sampleReceiver/querySampleReceiver',
        {params:{
            name:vm.name,
            tel:vm.userName,
            region:vm.region,
            network:vm.network,
            pageNo:vm.pageNo,
            pageSize:vm.pageSize
          }})
          .then(res=>{
            vm.totalCount = res.data.totalCount;
            vm.sampleReceivers = res.data.sampleReceivers;
          })
      },
      handleChange(value) {
        this.api.getRegion(value,this);
      },
      handleConfirmNetwork(val){
        if (this.action === 'modify') {
          this.modifySampleReceiver = true;
          this.allotNetworkForModify = false;
        } else {
          this.addSampleReceiver = true;
        }

        this.allotNetwork = false;
        this.checkNetwork = val
      },
      handleSuccess(msg){
        this.checkNetwork = [];
        if (this.action === 'modify') {
          this.modifySampleReceiver = false;
        } else {
          this.addSampleReceiveSuccess = !this.addSampleReceiveSuccess;
          this.addSampleReceiver = false;
        }

        this.$message({
          message: msg,
          type: 'success'
        });

        this.querySampleReceiver();
      },
      handleSizeChange(val){
        this.pageNo = 1;
        this.pageSize = val;
        this.querySampleReceiver();
      },
      handleCurrentChange(val){
        this.pageNo = val;
        this.querySampleReceiver();
      },
      getSelectionData(){
        let selectionArr = this.$refs.multipleTable.selection;
        if(!selectionArr.length){
          this.$message({
            message: '请至少选择一条数据',
            type: 'warning'
          });
          return [];
        }
        let _ids = [];
        for(let sa of selectionArr){
          _ids.push(sa._id)
        }
        return _ids;
      },
      resetPwd(){
        var vm = this;
        let _ids = this.getSelectionData();
        if(!_ids.length){
          return
        }
        this.axios.post('/medicalManager/sampleReceiver/sampleReceiver/resetPwd',{_ids:_ids})
        .then(res=>{
          if(res.data.result ===vm.config.success){
            vm.$message({
              message: res.data.message,
              type: 'success'
            });
            vm.querySampleReceiver()
          }
        })
      },
      disable(){
        var vm = this;
        let _ids = this.getSelectionData();
        if(!_ids.length){
          return
        }
        this.axios.post('/medicalManager/sampleReceiver/sampleReceiver/disable',{_ids:_ids})
          .then(res=>{
            if(res.data.result ===vm.config.success){
              vm.$message({
                message: res.data.message,
                type: 'success'
              });
              vm.querySampleReceiver()
            }
          })
      },
      enable(){
        var vm = this;
        let _ids = this.getSelectionData();
        if(!_ids.length){
          return
        }
        this.axios.post('/medicalManager/sampleReceiver/sampleReceiver/enable',{_ids:_ids})
          .then(res=>{
            if(res.data.result ===vm.config.success){
              vm.$message({
                message: res.data.message,
                type: 'success'
              });
              vm.querySampleReceiver()
            }
          })
      },
      removeSampleReceiver(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmDelete(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      confirmDelete(id){
        var vm = this;
        this.axios.post('/medicalManager/sampleReceiver/sampleReceiver/remove',{_id:id})
          .then(res=>{
              vm.$message({
                message: res.data.message,
                type: 'success'
              });
              if(res.data.result === vm.config.success){
                vm.querySampleReceiver()
              }
          })
      },
      modify(row) {
        let vm = this;

        vm.action = 'modify';

        vm.sampleReceiverId = row._id;
        vm.modifySampleReceiver = true;

        vm.uuid = vm.api.guid();
      },
      closeAllotNetwork() {
        let vm = this;

        if (vm.action === 'modify') {
          vm.modifySampleReceiver = true;
          vm.allotNetworkForModify = false;
          vm.allotNetwork = false;
        } else {
          vm.addSampleReceiver = true;
          vm.allotNetwork = false;
        }
      },
      allotNetworkFromModify(checkNetwork1) {
        let vm = this;

        vm.modifySampleReceiver=false;

        vm.allotNetwork = !vm.allotNetwork;

        vm.action='modify';

        vm.checkNetworkFromModify = checkNetwork1;

        vm.allotNetworkForModify=true;
      }
    }

  }
</script>
<style>
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
  .doctor-list-table td{
    padding:7px 0;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .icon{
    color:#fff;
    width: 0.9em; height: 0.9em;
    margin: -2px 2px -1px -2px;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
</style>
