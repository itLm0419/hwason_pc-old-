<template>
    <div class="height100">
      <div class="title1">项目套餐详情</div>

      <div class="divTop bgcWhite">
        <div class="divBottom width95">
          <el-row>
            <el-col :span="16">
              <span class="fontWeight marginRight">项目编号：
                <span class="fontColor">{{project.categoryCode}}</span></span>
              <span class="fontWeight marginRight">项目名称：{{project.category}}</span>
            </el-col>

            <el-col :span="8" class="material">
              <!--<router-link :to="{path: ''}" tag="div">
                <span style="margin-right: 10px;">查看配套资料</span>
              </router-link>

              <span style="margin-right: 10px;">配套资料上传</span>-->
              <el-button type="primary" @click="addItem">新增套餐</el-button>
            </el-col>
          </el-row>
        </div>

        <div class="divTop2 width95">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column label="套餐编号" width="180" class="fontColor" align="center">
              <template slot-scope="scope">
                <span style="color: #7AA686;font-weight: bold;">{{scope.row.code}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="套餐姓名" width="180" align="center"></el-table-column>
            <el-table-column label="套餐价格" width="180" align="center">
              <template slot-scope="scope">
                <span style="font-weight: bold;">{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="检测指标" header-align="center"></el-table-column>
            <el-table-column prop="significance" label="临床意义" header-align="center"> </el-table-column>
            <el-table-column prop="operate" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="modifyItem(scope.row._id)" size="small" >编辑</el-button>
                <el-button @click="deleteItem(scope.row._id)" size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
</template>
<script>
	export default {
		data() {
			return {
			  tableData: [],
        project: {
			    category: '',
          categoryCode: ''
        }
      }
		},
		methods: {
		  // 初始化页面
      initPage() {
        let vm = this;

        vm.queryProject();
      },

      // 查询单个项目套餐详情
      queryProject() {
        let vm = this;

        let urlSearch = new vm.api.UrlSearch();

        if (!urlSearch._id) {
          return false;
        }

        vm.axios.get('/package/packageList/packageList/queryProject', {params: {_id: urlSearch._id}})
          .then(function(response) {
            console.log(response);

            let project = response.data.project[0];
            vm.project.category = project.category;
            vm.project.categoryCode = project.categoryCode;

            let items = project.projects;

            items.forEach(item => {
              let content1 = '';

              item.content.forEach(content => {
                content1 += ' ' + content.hsName+"；";
              });

              item.content = content1;
            });

            vm.tableData = items;
          }).catch(function() {})
      },

      // 新增套餐
      addItem() {
        let vm = this;

        vm.$router.push('/createPackage/addItem?from=itemDetail&projectId=' + (new vm.api.UrlSearch())._id);
      },

      // 删除套餐
      deleteItem(_id) {
        let vm = this;

        let projectId = (new vm.api.UrlSearch())._id;

        if (!_id || !projectId) {
          return false;
        }

        vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.axios.post('/package/packageList/packageList/queryItem', {params: {itemId: _id, projectId: projectId}})
            .then(function(response) {
              console.log(response);

              vm.$message({
                type: 'success',
                message: '删除成功!'
              });

              vm.queryProject();

            }).catch(function(error) {})
        }).catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // 修改套餐
      modifyItem(_id) {
        let vm = this;

        let projectId = (new vm.api.UrlSearch())._id;

        if (!_id || !projectId) {
          return false;
        }

        vm.$router.push('/createPackage/addItem?from=itemDetail&itemId=' + _id + '&projectId=' + projectId);

      }

    },
    mounted() {
		  let vm = this;

		  vm.initPage();
    }
	}
</script>
<style scoped>

.bgcWhite {
  background-color: white;
  min-height: 750px;
}

.height100 {
  height: 100%;
}

.title1 {
  font-weight: bold;
  font-size: 16px;
}

.divTop {
  border-top: 4px solid #2D99D7;
}

.divTop2 {
  border-top: 2px solid #CCC;
  padding-top: 20px;
}

.divBottom {
  padding: 20px 0 20px 0;
}

.fontWeight {
  font-weight: bold;
}

.fontColor {
  color: #7AA686;
}

.marginRight {
  margin-right:60px;
}

.material {
  font-size: 13px;
  color: #86B7FF;
}

.width95 {
  width: 95%;
  margin: 0 auto;
}

</style>
