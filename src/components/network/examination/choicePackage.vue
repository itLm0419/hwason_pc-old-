<template>
  <div class="main-box">
    <div class="title">◆套餐选择</div>
    <div class="list-box">
      <div class="list">
        <!--<span style="padding-top:10px" @click="hwasonPackageVisible=true">HS健康套餐</span>-->
        <el-button type="text" class="el-button-style choice-package" @click="hwasonPackageVisible=true">HS健康套餐</el-button>
        <!--<el-button type="info" class="el-button-style"  plain v-for="pro in projects" :key="pro._id" v-if="pro.value">-->
          <!--{{pro.value}}-->
          <!--<i class="el-icon-circle-close" @click="pro.value=''"></i>-->
        <!--</el-button>-->
        <el-tag v-for="pro in projects" class="el-tag-style" :key="pro._id" closable :type="'info'" v-if="pro.value" @close="pro.value=''"> {{pro.value}} </el-tag>
      </div>
      <div class="list">
        <el-button type="text" class="el-button-style choice-package" @click="customPackageVisible=true">自定义套餐</el-button>
        <el-tag v-for="tag in itemsTags" class="el-tag-style" :key="tag.name" closable :type="'info'" @close="handleClose(tag)"> {{tag.name}} </el-tag>
      </div>
    </div>
    <!--华晟套餐选择弹出框-->
    <el-dialog title="华晟健康套餐" class="hwasonPackageDialog" :close-on-click-modal="closeOnClickModal" :visible.sync="hwasonPackageVisible">
      <div style="padding: 0px 10px 0px 15px">
         <div style="margin-bottom: 15px">
           <el-button type="text" class="el-button-style"> 已选择套餐：</el-button>
           <el-tag v-for="pro in projects" class="el-tag-style" :key="pro._id" closable :type="'info'" v-if="pro.value" @close="pro.value=''"> {{pro.value}} </el-tag>
         </div>
        <el-collapse class="el-collapse-container">
          <el-collapse-item v-for="pro in projects" :key="pro._id" :name="pro._id">
            <template slot="title">
              <span class="collapse-item">{{pro.category}}</span>
            </template>
            <el-radio-group v-model="pro.value" >
              <el-radio v-for="(pjt,index) in pro.projects" @change="pro.price = pjt.price;pro.content = pjt.content" border style="margin-top: 10px" :key="index"  :label="pjt.name">{{pjt.name}}</el-radio>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-col :span="19"><div style="height: 1px"></div></el-col>
          <el-button @click="hwasonPackageVisible = false">取 消</el-button>
          <el-button type="primary" @click="hwasonPackageVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="自定义套餐" class="hwasonPackageDialog" :visible.sync="customPackageVisible">
      <div class="tags" style="font-weight: bold;">已生成套餐：</div>
      <el-tag v-for="tag in itemsTags" closable :type="'info'" :key="tag.name" class="tags" @close="handleClose(tag)"
      @click.native="modifyContents(tag)">
        {{tag.name}}
      </el-tag>

      <div class="selecteContent">
        <!--搜索-->
        <el-row>
          <el-col :span="8">
            <span class="searchTitle">按检测项目类别</span>
            <el-select v-model="form.category" placeholder="请选择检测项目类别" style="width: 70% !important;" @change="categoryChange">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>

          <el-col :offset="8" :span="8">
            <el-button type="primary" style="margin-top: 31px;" @click="keySearch">搜索</el-button>
          </el-col>
        </el-row>

        <!--主题内容-->
        <div style="width: 100%;margin: 0 auto;margin-top: 20px;">
          <el-row :gutter="30">
            <!--别选中的检测项目-->
            <el-col :span="8">
              <div style="font-weight: bold;margin-bottom: 10px;">已选择检测项目</div>
              <div style="border: 1px solid #dcdfe6;height: 430px;width: 100%;overflow: hidden;overflow-y: auto;" >
                <div v-for="(item,index) in selectedItems">
                  <div class="ellipsisFont selectedRow">
                    <i class="el-icon-delete el-icon--left" style="cursor: pointer;"
                       @click="deleteItem(index, item.hsCode)"></i>
                    <span style="padding-right: 20px;">{{item.hsCode}}</span>
                    <span :title="item.hsName">{{item.hsName}}</span>
                  </div>
                </div>
              </div>
            </el-col>

            <!--检测项目列表-->
            <el-col :span="16">
              <div>
                <el-row>
                  <el-col :span="6" class="tableTitle tableTile2">编码</el-col>
                  <el-col :span="6" class="tableTile2">检测项目</el-col>
                  <el-col :span="6" class="tableTitle tableTile2">编码</el-col>
                  <el-col :span="6" class="tableTile2">检测项目</el-col>
                </el-row>
              </div>

              <!--遍历数据-->
              <div style="border-top: 1px solid rgb(220, 223, 230);margin-top: 11px;">
                <div v-for="(item,index) in tableData" style="display: inline-block;width: 50%;height: 36px;">
                  <div style="display: inline-block;" class="checkBg" @click="isChoice($event,item)"
                       :class="{checkBgImg:hsCode.indexOf(item.hsCode)>=0}"></div>
                  <div style="display: inline-block;width: 40%;vertical-align: super;">{{item.hsCode}}</div>
                  <div style="display: inline-block;width: 40%;vertical-align: super;" class="ellipsisFont"
                       :title="item.hsName">
                    {{item.hsName}}</div>
                </div>
              </div>

              <el-pagination style="float: right;margin-top: 40px;"  @current-change="handleCurrentChange"
                             :current-page="currentPage" :page-sizes="[20, 30, 50, 100]" :page-size="20"
                             layout="total, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
            </el-col>
          </el-row>
        </div>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="clear('cancer')">取 消</el-button>
        <el-button type="success" @click="generatePackage" >生成套餐</el-button>
        <el-button type="primary" @click="clear('sure')">确 定</el-button>
      </div>
    </el-dialog>
    <el-button class="next-step-btn" @click="nextStep" type="primary">下一步</el-button>
  </div>
</template>
<script>
  import moment from 'moment'
  import selectContents from '../../package/createPackage/selectContents.vue'

  export default {
    data() {
      return {
        _id:'',
        closeOnClickModal:false,
        hwasonPackageVisible:false,
        customPackageVisible: false,
        projects:[],

        itemsTags: [],
        selectedItems: [],
        hsCode: [],
        form: {
          category: '基因多态性检测项目',
          hsName: ''
        },
        tableData: [],
        currentPage: 1,
        currentSize: 20,
        totalCount: 0,
        categoryArr: []
      }
    },
    created(){
        let UrlSearch = new this.api.UrlSearch();
        this._id = UrlSearch._id;
        var vm = this;
        if(this._id == localStorage.getItem('examinationUserId')){
            this.projects = JSON.parse(localStorage.getItem('projects'));
            this.itemsTags = JSON.parse(localStorage.getItem('itemsTags'))
        }else{
          this.axios.get('/network/examination/choicePackage/queryProjects').then(res=>vm.projects=res.data)

        }
        this.initPage();
    },
    methods: {
      // 初始化页面
      initPage() {
        let vm = this;

        vm.queryItems();
      },

      // 生成套餐
      generatePackage() {
        let vm = this;

        let selectedItems = [...vm.selectedItems];
        let hsCode = [...vm.hsCode];

        if (selectedItems.length === 0) {
          vm.api.msgTips(vm, '请选择检查项目！', 'error');
          return false;
        }

        if (vm.isDisabled() > -1) {// 判断同类型是否存在
          if (vm.itemsTags[vm.isDisabled()].hsCode.sort().toString() == hsCode.sort().toString()) {  // 检测项是否改变
            vm.api.msgTips(vm, '同类型不可重复生成！', 'error');
            return false;
          } else {  // 修改
            vm.itemsTags[vm.isDisabled()].selectedItems = selectedItems;
            vm.itemsTags[vm.isDisabled()].hsCode = hsCode;

            vm.api.msgTips(vm, '修改套餐成功！', 'success');
          }
        } else {
          let obj = {
            name: selectedItems[0].category,
            selectedItems: selectedItems,
            hsCode: hsCode
          };
          vm.itemsTags.push(obj);
          vm.api.msgTips(vm, '生成套餐成功！', 'success');
        }
      },
      // 下拉框改变
      categoryChange (){
        let vm = this;

        let i = -1;
        vm.itemsTags.forEach((item, index) => {
          if (item.name.toString() === vm.form.category) i = index;
        });

        // 未生成套餐的类别清空数据
        if (!(i > -1)) {
          vm.selectedItems.splice(0, vm.selectedItems.length);
          vm.hsCode.splice(0, vm.hsCode.length);
        } else { // 生成套餐的初始化数据
          vm.selectedItems = [...vm.itemsTags[i].selectedItems];
          vm.hsCode = [...vm.itemsTags[i].hsCode];
        }
        vm.queryItems(1, 20);
      },

      // 当前页改变
      handleCurrentChange(val) {
        let vm = this;

        vm.currentPage = val;

        vm.queryItems(vm.currentPage, vm.currentSize);
      },

      // 查询检测项目
      queryItems(currentPage, currentSize) {
        let vm = this;

        let param = {
          currentPage: currentPage ? currentPage : vm.currentPage,
          currentSize: currentSize ? currentSize : vm.currentSize,
          hsName: vm.form.hsName,
          category: vm.form.category
        };

        vm.axios.get('/package/createPackage/selectContent/queryPackages', {params: param})
          .then(function (response) {
            // 分页数据展示
            vm.tableData = response.data.ItemModels;
            // 分页数据
            vm.totalCount = parseInt(response.data.totalCount);
            // 项目类型数组
            vm.categoryArr = response.data.categoryArr;
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      // 搜索
      keySearch() {
        let vm = this;

        vm.queryItems(1, 20);
      },

      // 选中多选框
      isChoice(event,item){
        let vm = this;
        if(event.target.className === 'checkBg'){
          vm.selectedItems.push(item);
          vm.hsCode.push(item.hsCode)
        }else{
          let index = vm.selectedItems.indexOf(item);
          let hsCodeIndex = vm.hsCode.indexOf(item.hsCode);
          vm.selectedItems.splice(index,1);
          vm.hsCode.splice(hsCodeIndex,1);

        }
      },

      // 删除选中项
      deleteItem(index, hsCode) {
        let vm = this;

        vm.selectedItems.splice(index,1);
        let hsCodeIndex = vm.hsCode.indexOf(hsCode);
        vm.hsCode.splice(hsCodeIndex,1);
      },

      // 清空数据
      clear() {
        let vm = this;
        vm.customPackageVisible = false;
      },

      // 删除标签
      handleClose(tag) {
        let vm = this;
        debugger;
        vm.itemsTags.splice(vm.itemsTags.indexOf(tag), 1);

      },

      // 修改content
      modifyContents(tag) {
        let vm = this;

        // 初始化
        vm.form.category = tag.name;

        vm.queryItems(1, 20);

        vm.selectedItems = [...tag.selectedItems];
        vm.hsCode = [...tag.hsCode];
      },

      // 判断'生成套餐'按钮是否可用
      isDisabled() {
        let vm = this;

        let arr = [];
        vm.itemsTags.forEach(item => {
          arr.push(item.name);
        });

        return arr.indexOf(vm.form.category);
      },
      nextStep(){
          let flag = false;
          for(let pro of this.projects){
              if(pro.value){
                  flag = true;
              }
          }
          if(!flag&&!this.itemsTags.length){
            this.$message({
              message: '请至少选择一个套餐',
              type: 'warning'
            });
            return false;
          }
          debugger;
          localStorage.setItem('projects',JSON.stringify(this.projects));
          localStorage.setItem('itemsTags',JSON.stringify(this.itemsTags));
          localStorage.setItem('examinationUserId',this._id);
          this.$router.push(`/examination/examinationBill?_id${this._id}`)
       }
    },
  }
</script>
<style scoped>
  .main-box{
    padding:25px 0 0 16px;
  }
  .title{
    color: #f77778;
    font-size:14px;
    padding-bottom:46px;
  }
  .choice-package{
    color:#2f98da;
    font-size:16px;
    cursor: pointer;
  }
  .list-box .list{
    padding-bottom:45px;
  }
  .collapse-item{
    color: #2D99D7;
  }
  .el-collapse{
    padding: 0;
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-icon-circle-close:hover {
    color:red
  }
  .el-icon-circle-close :hover{
    border: 1px solid red;
  }
  .dialog-footer{
    padding: 20px;
  }
  .el-button-style{
    margin-top: 10px;
  }

  .tags {
    cursor: pointer;
    margin-left: 21px;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .hiddenTable {
    display: none;
  }

  .tableTitle {
    text-align: center;
  }

  .checkBg{
    width: 24px;
    height: 24px;
    border:1px solid #ccc;
    margin-top:6px;
    border-radius: 6px;
    cursor: pointer;
    margin-right:5px;
  }

  .checkBgImg{
    border:1px solid white;
    background: url("../../../../static/img/network/packages/check2.png");
    background-size: 100%;
  }

  .searchTitle {
    display: block;
    margin-bottom: 10px;
    font-weight: 800;
  }

  .ellipsisFont {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .tableTile2 {
    font-weight:bold;
  }

  .selectedRow {
    width: 80%;
    margin: 0 auto;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 16px;
  }

  .selecteContent {
    border-top: 1px solid #ccc;
    margin: 0 20px 0 20px;
  }
  .el-tag-style{
    margin: 10px 10px 0 0;
  }
  .next-step-btn{
    margin:20px 0 0 0
  }
</style>
