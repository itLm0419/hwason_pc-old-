<template>
  <div style="padding:0 30px">
      <!--<el-tooltip class="item" effect="dark"  content="添加医生" placement="top">-->
        <!--<svg  class="icon-add-doctor" aria-hidden="true" @click="modifyDoctorId = '';doctorDialogVisible = true;title='添加医生'">-->
          <!--<use xlink:href="#icon-add"></use>-->
        <!--</svg>-->
      <!--</el-tooltip>-->
    <div style="padding-bottom: 20px">
      <el-button
        :disabled="isNoPass"
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="modifyDoctorId = '';doctorDialogVisible = true;title='添加医生'"
      >新增</el-button>
    </div>
    <el-table
      :data="doctors"
      border
      max-height="600"
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
             <el-form-item label="年龄">
              <span>{{api.getAgeByIDNo(props.row.IDNo)}}</span>
            </el-form-item>
             <el-form-item label="联系方式">
              <span>{{props.row.tel}}</span>
            </el-form-item>
             <el-form-item label="从医时间">
              <span>{{api.moment(props.row.doctorTime).format('YYYY/MM/DD')}}</span>
            </el-form-item>
             <el-form-item label="最高学历">
              <span>{{props.row.education}}</span>
            </el-form-item>
             <el-form-item label="擅长">
              <span>{{props.row.beGoodAt}}</span>
             </el-form-item>
             <el-form-item label="创建人">
              <span>{{props.row.createBy.userName}}</span>
             </el-form-item>
             <el-form-item label="创建时间">
              <span>{{api.moment(props.row.createBy.createTime).format('YYYY/MM/DD HH:mm')}}</span>
             </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="医生姓名">
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
          <el-tooltip class="item" effect="dark"  content="修改" placement="top">
            <el-button type="text" @click="modifyDoctorId = scope.row._id;doctorDialogVisible = true;title='医生信息修改'">
              <i class="el-icon-edit" style="color:#409EFF"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark"  content="删除" placement="top">
            <el-button type="text" @click="removeDoctor(scope.row._id)">
              <i class="el-icon-delete" style="color:#409EFF"></i>
            </el-button>
          </el-tooltip>
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
      :title="title"
      :visible.sync="doctorDialogVisible"
      width="550px"
    >
      <create-doctor-account :doctorId="modifyDoctorId" @addDoctorSuccess="doctorDialogVisible = false;init()"></create-doctor-account>
    </el-dialog>
  </div>

</template>
<script>
  import createDoctorAccount from './createDoctorAccount.vue'
  export default{
      data(){
          return{
            title:"",
            networkId:"",
            doctors:[],
            pageSize:10,
            pageNo:1,
            totalCount:0,
            closeOnClickModal:false,
            doctorDialogVisible:false,
            modifyDoctorId:'',
            isNoPass:false,
        }
      },
      components:{
        createDoctorAccount
      },
      created(){
        let UrlSearch = new this.api.UrlSearch();
        this.networkId = UrlSearch._id;
        this.init();
      },
      methods:{
          init(){
              var vm = this;
             this.axios.get("/medicalManager/medicalCenter/doctor/doctorList",{
                   params:{
                     networkId:vm.networkId,
                     pageNo:vm.pageNo,
                     pageSize:vm.pageSize,
                   }
               }).then(res=>{
                   vm.doctors = res.data.doctors;
                   vm.totalCount = res.data.count;
                   vm.isNoPass = res.data.isNoPass

               })
          },
          handleSizeChange(val){
            this.pageNo = 1;
            this.pageSize = val;
            this.init();
          },
          handleCurrentChange(val){
            this.pageNo = val;
            this.init();
          },
          removeDoctor(id){
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
              this.axios.post('/medicalManager/medicalCenter/doctor/removeDoctor',{_id:id})
                .then(res=>{
                    if(res.data.result === vm.config.success){
                      vm.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      vm.init();
                    }
                })
          }
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
