<template>
  <div class="el-main-container">
    <div class="title">产品项目列表</div>
    <div class="line"></div>
    <div style="padding-left: 30px">
      <el-form :inline="true"  class="form-inline">
        <el-form-item label="项目名称:">
          <el-input v-model="name" ></el-input>
        </el-form-item>
        <el-form-item label="项目编号:">
          <el-input v-model="code" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="init(pageNo=1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="padding-bottom: 20px">
        <el-button icon="el-icon-download" size="small"  type="primary" @click="downloadSelection">下载选中</el-button>
        <el-button icon="el-icon-download" size="small"  type="success" @click="downloadAll">下载全部</el-button>
        <el-button icon="el-icon-delete"   size="small"  type="danger"  @click="removeData">删除</el-button>
      </div>
      <el-table
        :data="tableData"
        ref="multipleTable"
        max-height="645"
        border
        class="el-table-style"
        row-class-name="rowStyle"
        style="overflow-x:hidden;">
        <el-table-column
          type="selection"
          >
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
         >
        </el-table-column>
        <el-table-column
          prop="categoryCode"
          label="项目编号"
        >
        </el-table-column>
        <el-table-column
          prop="category"
          label="项目名称"
         >
        </el-table-column>
        <el-table-column
          prop="createBy.createTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push(`/packageList/itemDetail?_id=${scope.row._id}`)"
              >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[5, 10, 30, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    components: {

    },
    data() {
      return {
        rowStyle:'rowStyle',
        moment:moment,
         name:'',
         code:'',
         pageNo:1,
         pageSize:10,
         totalCount:0,
         tableData: [],
         selectionData:[],
         key:"aaa",
         value:"bbb"
      }
    },
    created(){
        this.init();
    },
    mounted() {

    },
    methods: {
        init(){
          var vm = this;
          vm.selectionData = [];
          this.axios.get('/package/packageList/packageList/queryPackageList', {params:{
            name:vm.name,
            code:vm.code,
            pageNo:vm.pageNo,
            pageSize:vm.pageSize,
          }}).then(res=>{
              vm.totalCount = res.data.count;
              vm.tableData=res.data.package;
              for(let td of vm.tableData){
                  td.createBy.createTime = vm.moment(td.createBy.createTime).format('YYYY/MM/DD HH:mm')
              }
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
        downloadSelection(){
          let _ids = this.getSelectionData();
          if(!_ids.length){
              return
          }
          this.api.download('/package/packageList/packageList/downloadPackage',{_ids:_ids})
        },
        downloadAll(){
          this.api.download('/package/packageList/packageList/downloadPackage')
        },
        removeData(){
          let _ids = this.getSelectionData();
          if(!_ids.length){
            return
          }
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
             this.confirmRemoveData(_ids)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        confirmRemoveData(_ids){
            var vm = this;
            this.axios.post('/package/packageList/packageList/removePackage',{params:{_ids:_ids}})
              .then(res=>{
                  if(res.data.result === vm.config.success){
                    vm.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    vm.init();
                  }
              })
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
        }
    }
  }
</script>
<style scoped>
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
  .form-inline{
    margin-top: 30px;
  }
  .el-table td{
    padding: 2px 2px 2px 2px !important;
  }
</style>
