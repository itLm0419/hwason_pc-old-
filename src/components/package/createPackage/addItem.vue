<template>
      <div class="el-main-container">
        <div class="marginTop20 fontBold">添加项目套餐</div>

        <div class="bgc">

          <div class="width100">
            <el-collapse v-model="activeNames" @change="handleChange">

              <!--套餐基本信息-->
              <el-collapse-item title="套餐基本信息" name="baseInfo">

                <el-form :model="categoryForm" :rules="categoryNameRules" ref="categoryForm" label-width="100px" class="">
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="套餐名称" prop="name">
                        <el-input v-model="categoryForm.name" placeholder="请填写套餐名称"></el-input>
                      </el-form-item>

                      <el-form-item label="套餐价格" prop="price">
                        <el-input-number v-model="categoryForm.price" controls-position="right" :min="1"
                                         placeholder="请填写套餐价格" style="width: 100%;"></el-input-number>
                      </el-form-item>
                    </el-col>

                    <el-col :span="10">
                      <el-form-item label="临床意义" prop="significance">
                        <el-input type="textarea" :rows="4" v-model="categoryForm.significance" placeholder="请填写临床意义"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>

              <el-collapse-item title="检测项目" name="projects">
                <select-contents :selected-items="selectedItems" :hs-code="hsCode" ref="custompack"></select-contents>
              </el-collapse-item>
            </el-collapse>

            <div class="btnGroup" v-show="'itemDetail' !== from">
              <el-button type="info" @click="cancer">取消</el-button>
              <el-button type="primary" @click="confirm('categoryForm')">{{confirmType}}</el-button>
            </div>

            <div class="btnGroup" v-show="'itemDetail' === from">
              <el-button type="info" @click="goBack()">取消</el-button>
              <el-button type="primary" @click="confirm2('categoryForm')">确定</el-button>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
  import selectContents from './selectContents.vue'

	export default {
    components: {
      selectContents
    },
		data() {
			return {
        activeNames: ['baseInfo', 'projects'],
        categoryForm: {
          name: '',
          price: '',
          significance: ''
        },
        selectedItems: [],
        hsCode: [],
        categoryNameRules: {
          name: [
            { required: true, message: '请输入套餐名称', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入套餐价格', trigger: 'blur' }
          ],
          significance: [
            { required: true, message: '请输入临床意义', trigger: 'blur' }
          ]
        },
        confirmType: "添加",
        from: ''
      }
		},
		methods: {
      /***********************************from itemsApply START**************************************/
		  // 折叠面板change
      handleChange(val) {
      },

      // 取消
      cancer() {
        let vm = this;

        let uri = '';

        let urlSearch = new vm.api.UrlSearch();
        if (urlSearch.uuid) { // 修改
          uri = '/createPackage/itemsApply?title=' + urlSearch.title + '&prouuid=' + urlSearch.prouuid +
            '&uuid=' + urlSearch.uuid;
        } else {
          uri = '/createPackage/itemsApply?title=' + urlSearch.title + '&prouuid=' + urlSearch.prouuid;
        }
        vm.$router.push(uri);
      },

      // confirm 新增、修改
      confirm(formName) {
        let vm =this;

        let selectedItems = this.$refs.custompack.selectedItems;

        // 参数校验
        vm.$refs[formName].validate((valid) => {
          if (valid) {
            if (selectedItems.length > 0) {
              // 生成uuid
              let urlSearch = new this.api.UrlSearch();

              let uuid = '';
              if (!urlSearch.uuid) {  //新增
                uuid = 'projs' + this.api.guid();
              } else {  // 修改
                uuid = urlSearch.uuid;
              }

              let params = {
                key: uuid,
                name: vm.categoryForm.name,
                price: vm.categoryForm.price,
                significance: vm.categoryForm.significance,
                selectedItems: selectedItems
              };

              vm.axios.post('/package/createPackage/createHsPackage/cacheProjs', {params: params})
                .then(function (data) {
                  vm.$router.push('/createPackage/itemsApply?title=' + urlSearch.title + '&uuid='+uuid+'&prouuid='+ urlSearch.prouuid);
                })
                .catch(function (error) {

                })
            } else {
              this.api.msgTips(vm, '请选择检测项目！', 'error');
              return false;
            }
          } else {
            this.api.msgTips(vm, '请完善基本信息！', 'error');
            return false;
          }
        });
      },

      // 初始化页面 from 从itemsApply页面跳转过来
      initPage () {
        let vm = this;

        let urlSearch = new this.api.UrlSearch();

        if (urlSearch.uuid) {  // 已存在说明是修改
          // 修改按钮类型
          vm.confirmType = "修改";

          // 查询proj
          vm.axios.post('/package/createPackage/createHsPackage/queryCacheProjs',{params: {uuids: [urlSearch.uuid]}})
            .then(function (data) {
              let oProj = data.data.resArr[0];

              vm.categoryForm.name = oProj.name;
              vm.categoryForm.price = oProj.price;
              vm.categoryForm.significance = oProj.significance;

              vm.selectedItems = oProj.content;

              vm.hsCode = [];
              vm.selectedItems.forEach(item => {
                vm.hsCode.push(item.hsCode);
              });
            }).catch(function (error){
          });

        } else {

        }
      },
      /***********************************from itemsApply END**************************************/

      /********************************************from itemDetail START***************************/
      // 初始化页面 from itemDetal页面
      initPageFromDetail() {
        let vm = this;

        let urlSearch = new this.api.UrlSearch();

        if (!urlSearch.projectId || !urlSearch.itemId) {
          return false;
        }

        vm.axios.get('/package/packageList/packageList/queryItem', {params: {projectId: urlSearch.projectId, itemId: urlSearch.itemId}})
          .then(function(response) {
            console.log("response: ",response);
            let projeccts = response.data.project[0].projects;

            let oProj = {};

            projeccts.forEach(item => {
              if (item._id === urlSearch.itemId) oProj = item;
            });

            vm.categoryForm.name = oProj.name;
            vm.categoryForm.price = oProj.price;
            vm.categoryForm.significance = oProj.significance;

            vm.selectedItems = oProj.content;

            vm.hsCode = [];
            vm.selectedItems.forEach(item => {
              vm.hsCode.push(item.hsCode);
            });
            console.log(vm.categoryForm, vm.selectedItems, vm.hsCode);
          }).catch(function() {})

      },

      // 确定2
      confirm2(formName) {
        let vm = this;
        let urlSearch = new vm.api.UrlSearch();

        if (!urlSearch.projectId) {
          return false;
        }

        let selectedItems = this.$refs.custompack.selectedItems;

        vm.$refs[formName].validate((valid) => {
          if (valid) {
            if (selectedItems.length > 0) {

              if (urlSearch.itemId) {  // 修改
                let params = {
                  projectId: urlSearch.projectId,
                  itemId: urlSearch.itemId,
                  name: vm.categoryForm.name,
                  price: vm.categoryForm.price,
                  significance: vm.categoryForm.significance,
                  content: selectedItems
                };

                vm.axios.post('/package/packageList/packageList/queryItem', {params: params})
                  .then(function (data) {
                    console.log(data);
                    vm.$router.push('/packageList/itemDetail?_id=' + urlSearch.projectId);
                  })
                  .catch(function (error) {})
              } else {  // 新增
                let params = {
                  projectId: urlSearch.projectId,
                  name: vm.categoryForm.name,
                  price: vm.categoryForm.price,
                  significance: vm.categoryForm.significance,
                  content: selectedItems
                };

                vm.axios.post('/package/createPackage/createHsPackage/saveItem', {params: params})
                  .then(function (data) {
                    console.log(data);
                    vm.$router.push('/packageList/itemDetail?_id=' + urlSearch.projectId);
                  })
                  .catch(function (error) {})
              }
            } else {
              this.api.msgTips(vm, '请选择检测项目！', 'error');
              return false;
            }
          } else {
            this.api.msgTips(vm, '请完善基本信息！', 'error');
            return false;
          }
        })
      },

      // 返回到itemDetail
      goBack() {
        window.history.go(-1);
      }

      /******************************************************from itemDetail END*****************/
    },
    mounted() {
      let vm = this;

      let urlSearch = new this.api.UrlSearch();
      vm.from = urlSearch.from;

      if (vm.from === 'itemDetail') {
        vm.initPageFromDetail();
      } else {
        vm.initPage();
      }
    }
	}
</script>
<style scoped>
.btnGroup {
  margin-top: 20px;
  float: right;
}

.bgc {
  background-color: white;
  border-top: 3px solid #2D99D7;
  padding-top: 10px;
}

.width100 {
  width: 98%;
  margin: 0 auto;
  padding: 20px;
}
.el-main-container{
  width: 100%;
  margin: 0 auto;
}
.fontBold {
  font-weight: bold;
}
</style>
