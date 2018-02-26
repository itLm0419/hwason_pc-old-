<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
      <div style="margin-bottom: 10px;font-weight: bold;">新项目申请</div>

      <div class="newProjApply">

        <div style="width: 95%;margin: 0 auto;">
          <div class="add-actcalendar">新项目信息填写</div>

          <div style="border-top: 2px solid #DCDCDC;padding-top: 10px;">
            <div style="color: red;margin-top: 30px;">请根据事项仔细填写一下信息。</div>

            <el-row style="margin-top: 20px;">
              <el-col :span="6"><div class="steps" :class="{'steps-active': 1 == indexActive}">1.项目信息</div></el-col>
              <el-col :span="6"><div class="steps" :class="{'steps-active': 2 == indexActive}">2.申请</div></el-col>
              <el-col :span="6"><div class="steps" :class="{'steps-active': 3 == indexActive}">3.完成</div></el-col>
            </el-row>

            <!--Main Content-->
            <!--step 1-->
            <div class="mainContent" v-show="1 == indexActive">
              <div class="width95">
                <div class="marginTop20 paddingContent">项目信息</div>

                <div class="labelTitle"><span style="color: red;">*</span>项目名称</div>
                <el-input v-model="categoryName" placeholder="请填写项目名称"></el-input>

                <div style="font-weight: bold;font-size: 13px;padding-bottom: 0" class="paddingContent">
                  项目套餐-价格-临床意义-检测指标</div>

                <div>
                  <div class="paddingContent itemArr" style="vertical-align: bottom;">
                    <i class="el-icon-plus iconPlus cursorPointer" @click="jumpAddItem"></i>
                  </div>

                  <div class="paddingContent" style="display: inline-block;">
                    <div class="paddingContent itemArr textCenter projItems marginRight10 cursorPointer"
                         style="background-color:white;position: relative;"
                         v-for="(item, index) in resArrs" :key="index" @click="modifyProj(item.uuid)">
                      <i class="el-icon-minus positionStyle" @click.stop="deleteProj(item.uuid)"></i>

                      <div style="padding-left: 10px;padding-bottom: 10px;" class="ellipsisFont"
                           :title="item.name">{{item.name}}</div>
                      <div class="ellipsisFont" :title="item.price">￥ {{item.price}}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!--step 2-->
            <div class="mainContent marginTop20" v-show="2 == indexActive">
              <div class="width95 gutter">
                <div class="projectTitle marginTop20">项目名称：{{categoryName}}</div>

                <div v-for="(item, index) in resArrs" class="marginTop20">
                  <div><span class="fontWeight">{{index+1}}.套餐名称：</span>{{item.name}}</div>
                  <div><span class="fontWeight">套餐价格：</span>￥{{item.price}}</div>
                  <div><span class="fontWeight">临床意义：</span>{{item.significance}}</div>
                  <div><span class="fontWeight">检测指标：</span>
                    <span v-for="itemCon in item.content">{{itemCon.hsName}}  </span>
                  </div>
                </div>
              </div>
            </div>

            <!--step 3-->
            <div class="mainContent marginTop20" v-show="3 == indexActive">
              <div class="width95 gutter" >
                <table cellpadding="0" cellspacing="0" border="1" width="80%" class="tableCls" bordercolor="#ccc">
                  <tr>
                    <td  style="min-width: 100px;">项目</td>
                    <td >{{categoryName}}</td>
                    <td >项目编码</td>
                    <td >{{categoryCode}}</td>
                  </tr>

                  <tr v-for="(proj, index) in projects" :key="index">
                    <td >套餐</td>
                    <td >{{proj.name}}</td>
                    <td >套餐编码</td>
                    <td >{{proj.code}}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="nextStep marginTop20">
              <el-button type="primary" @click="lastStep" v-show="2 == indexActive">上一步</el-button>
              <el-button type="primary" @click="nextStep" v-show="1 == indexActive">下一步</el-button>
              <el-button type="primary" @click="toComplete2" v-show="2 == indexActive" :disabled="disabled">申请</el-button>
              <el-button type="primary" @click="complete" v-show="3 == indexActive">完成</el-button>
            </div>
          </div>
        </div>

      </div>

    </div>
</template>
<script>

	export default {
		data() {
			return {
			  uuids: [],
        categoryName: '',
        categoryCode: '',
        indexActive: 1, // 默认值
        prouuid: '',
        resArrs: [],
        projects: [],
        fullscreenLoading: false,
        disabled: false
      }
		},
		methods: {
		  /********************************************step 1 START*************************************************/
      // 初始化页面step1和step2
      initPage () {
        let vm = this;

        let urlSearch = new this.api.UrlSearch();
        vm.indexActive = localStorage.getItem("indexActive") || vm.indexActive; // 初始化步骤变量

        if (urlSearch.prouuid) {  // prouuid已存在
          if ("undefined" !== decodeURI(urlSearch.title)) {
            vm.categoryName = decodeURI(urlSearch.title);
          }

          vm.prouuid = urlSearch.prouuid;

          let params = {
            prouuid: vm.prouuid
          };

          // 根据prouuid查询子类别uuids数组
          this.axios.get('/package/createPackage/createHsPackage/queryuuids', {params: params})
            .then(function(data){
              let params2 = {};

              if (data.data.result) {
                vm.uuids = JSON.parse(data.data.result);

                if (urlSearch.uuid && !(vm.uuids.indexOf(urlSearch.uuid) > -1)) {  // 去重
                  vm.uuids.push(urlSearch.uuid);

                  params2 = {
                    prouuid: urlSearch.prouuid,
                    uuids: vm.uuids
                  };
                }
              } else {
                if (urlSearch.uuid) {
                  vm.uuids.push(urlSearch.uuid);

                  params2 = {
                    prouuid: urlSearch.prouuid,
                    uuids: vm.uuids
                  };
                }
              }

              vm.axios.post('/package/createPackage/createHsPackage/saveuuids', {params: params2})
                .then(function(data){})
                .catch(function (error) {});

              vm.fullscreenLoading = true;
              vm.axios.post('/package/createPackage/createHsPackage/queryCacheProjs',{params: {uuids: vm.uuids}})
                .then(function (data) {
                  vm.fullscreenLoading = false;
                  vm.resArrs = data.data.resArr;
                })
                .catch(function (error){});

            })
            .catch(function (error) {})
        } else {  // 都不存在
          vm.prouuid = 'pro' + this.api.guid();

          // 清空数据
          vm.uuids = [];
          vm.categoryName = '';
          vm.categoryCode = '';
          vm.resArrs = [];
          vm.projects = [];
        }

      },

		  // 跳转到新增Item页面
      jumpAddItem() {
        let vm = this;

        // 非空校验
        if (!vm.categoryName || vm.categoryName === '') {
          this.api.msgTips(vm, '请填写项目名称', 'error');
          return false;
        }

        // 判断大项目类别是否重复
        vm.axios.get('/package/createPackage/createHsPackage/checkProjectName',{params:{category:vm.categoryName}})
          .then(function (data) {
            if(data.data){
              vm.api.msgTips(vm, '该项目名称已经添加！', 'error');
              return false;
            }else{
              vm.$router.push('/createPackage/addItem?title='+encodeURI(vm.categoryName)+'&prouuid='+vm.prouuid);
            }
        }).catch(function (error){});
      },

      // 修改项目小类别
      modifyProj(uuid) {
        let vm = this;

        vm.$router.push('/createPackage/addItem?title='+decodeURI(vm.categoryName)+'&prouuid='+vm.prouuid+'&uuid='+uuid);
      },

      // 下一步
      nextStep() {
        let vm = this;

        // 校验必填项
        if (!vm.categoryName) {
          this.api.msgTips(vm, '请填写项目名称', 'error');
          return false;
        }

        if (vm.resArrs.length === 0) {
          this.api.msgTips(vm, '请选择项目套餐', 'error');
          return false;
        }

        if (vm.indexActive <= 2) {
          vm.indexActive++;
        }

        localStorage.setItem("indexActive", vm.indexActive);
      },

      // 删除单个
      deleteProj(uuid) {
        let vm = this;

        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let urlSearch = new vm.api.UrlSearch();

          let index = vm.uuids.indexOf(uuid);
          if (index > -1) {
            vm.uuids.splice(index, 1);
          }

          let params = {
            prouuid: urlSearch.prouuid,
            uuids: vm.uuids
          };

          vm.axios.post('/package/createPackage/createHsPackage/saveuuids', {params: params})
            .then(function(data){
              // 提示
              vm.$message({
                type: 'success',
                message: '删除成功!'
              });

              vm.$router.push('/createPackage/itemsApply?title='+vm.categoryName+'&prouuid='+vm.prouuid);
              vm.initPage();
            })
            .catch(function (error) {

            });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      /***********************************step 1 END******************************************/

      /***********************************step 2 START******************************************/
      // 上一步
      lastStep() {
        let vm = this;

        vm.indexActive--;

        localStorage.setItem("indexActive", vm.indexActive);
      },

      // 申请
      toComplete2(){
        let vm = this;

        // 判断大项目类别是否重复
        vm.axios.get('/package/createPackage/createHsPackage/checkProjectName',{params:{category:vm.categoryName}})
          .then(function (data) {
            if(data.data){
              vm.api.msgTips(vm, '该项目名称已经添加！', 'error');
              return false;
            }else{
              vm.addProject();
            }
          }).catch(function (error){});
      },

      // 新增大项目类别
      addProject () {
        let vm = this;

        let project = {};
        project.category = vm.categoryName;
        project.projects = vm.resArrs;

        vm.disabled = true;
        vm.axios.post('/package/createPackage/createHsPackage/addProject',{params:project}).
        then(function (data) {
            vm.disabled = false;
            vm.nextStep();

            vm.categoryName = data.data.category;
            vm.categoryCode = data.data.categoryCode;
            vm.projects = data.data.projects;

            let object = {};
            object.categoryName = vm.categoryName;
            object.categoryCode = vm.categoryCode;
            object.projects = vm.projects;

            localStorage.setItem("objectResult", JSON.stringify(object));
        }).catch(function (error) {});
      },
      /***********************************step 2 END******************************************/

      /***********************************step 3 START******************************************/
      // 初始化页面3
      initPage3 () {
        let vm = this;

        let obj = JSON.parse(localStorage.getItem("objectResult"));

        vm.categoryName = obj.categoryName;
        vm.categoryCode = obj.categoryCode;
        vm.projects = obj.projects;
      },

      // 完成
      complete() {
        let vm = this;

        vm.api.msgTips(vm, '新项目创建成功！', 'success');

        localStorage.setItem("indexActive", 1);
        vm.$router.push('/createPackage/itemsApply');
        vm.initPage();
      }
      /***********************************step 3 END******************************************/
    },mounted() {
      let vm = this;

      if (parseInt(vm.indexActive) === 3) {
        vm.initPage3();
      }
    },
    created() {
      let vm = this;

      vm.initPage();
    }
	}
</script>
<style scoped>
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

.mainContent {
  background-color: #EEEEEE;
}

.width95 {
  width: 95%;
  margin: 0 auto;
}

.marginTop20 {
  margin-top: 20px;
}

.marginBotton20 {
  margin-bottom: 20px;
}

.paddingContent {
  padding: 20px 10px 20px 0px;
}

.iconPlus {
  font-size: 90px;
  border-radius: 10px;
  background-color: white;
  color: #E5E5E5;
}

.cursorPointer {
  cursor: pointer;
}

.nextStep {
  float: right;
}

.itemArr {
  display: inline-block;
}

.textCenter {
  text-align: center;
}

.projItems {
  border-radius: 10px;
  vertical-align: text-bottom;
  width: 70px;
  height: 50px;
  padding-right:20px;
  text-align: center;
  margin-top: 30px;
}

.add-actcalendar {
  font-weight: bold;
  font-size: 16px;
  color: #080808;
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 0 10px 0;
  text-indent: 30px;
}

.newProjApply {
  border-top: 4px solid #2D99D7;
  background-color: white;
  height: 1200px;
}

.labelTitle {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 13px;
}

.marginRight10 {
  margin-right: 10px;
}

.ellipsisFont {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.projectTitle {
  font-size: 18px;
}

.fontWeight {
  font-weight: bold;
}

.tableCls {
  background-color: white;
  text-align: center;
}

.tableCls td {
  padding: 10px 5px 10px 5px;
}

.gutter {
  padding: 20px 0 20px 0;
}

.positionStyle {
  position: absolute;
  left: -7px;
  top: -4px;
  background-color: #ccc;
  border-radius: 10px;
  color: black;
}
</style>
