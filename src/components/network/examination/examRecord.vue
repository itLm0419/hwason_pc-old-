<template>
  <div>
    <el-table
      :data="examRecords"
      border
      max-height="600"
      class="doctor-list-table"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="检测时间">
      </el-table-column>
      <el-table-column
        prop="projects"
        label="检测套餐">
      </el-table-column>
      <el-table-column
        prop="abnormal"
        label="检测结果">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark"  content="查看" placement="top">
            <el-button type="text" >
              <i class="el-icon-view" style="color:#409EFF"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark"  content="下载" placement="top">
            <el-button type="text">
              <i class="el-icon-download" style="color:#409EFF"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>
<script>
  import moment from 'moment'
  export default{
    data(){
      return{
        _id:"",
        examRecords:[],
        moment:moment
      }
    },
    components:{

    },
    created(){
      let UrlSearch = new this.api.UrlSearch();
      this._id = UrlSearch._id;
      this.init();
    },
    methods:{
      init(){
          var vm = this;
         this.axios.get("/network/examination/examination/examRecord",{params:{_id:vm._id}})
           .then(res=>{
             for(let e of res.data){
                   let obj = {};
                   obj.createTime = vm.moment(e.createBy.createTime).format("YYYY/MM/DD");
                   let projects = "";
                   for(let p of e.projects){
                       projects+=!projects?p.name:`+${p.name}`;
                   }
                   obj.projects = projects;
                   obj.abnormal = e.status<20?"/":(e.abnormal.length?"异常":"正常");
                   obj._id = e._id;
                   switch (e.status){
                      case 5:
                           obj.status = "待收件";
                           break;
                      case 10:
                           obj.status = "待发货";
                           break;
                      case 15:
                           obj.status = "已发货";
                           break;
                      case 20:
                           obj.status = "已收货";
                           break;
                      case 25:
                           obj.status = "报告已生成";
                           break;
                      case 30:
                           obj.status = "等待专家建议";
                           break;
                      case 35:
                           obj.status = "建议已完成";
                           break;
                      case 35:
                           obj.status = "已下载";
                         break;
                   }
                   vm.examRecords.push(obj);
             }
           });
      },

    }

  }
</script>
<style>
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
  .icon-add-doctor{
    color:#409EFF;
    width: 2.5em; height: 2.5em;
    float: right;
    padding: 0 15px 5px 0;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
</style>
