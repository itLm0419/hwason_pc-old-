<template>
    <div class="main-container">
      <div class="title">支付账单</div>
      <div class="line"></div>
      <div style="padding: 30px 30px 0 30px">
        <div v-if="hsPackage.length" style="background-color: #FACD89;padding: 6px;width: 90px">HS健康套餐</div>
        <el-table
          v-if="hsPackage.length"
          :data="hsPackage"
          :span-method="spanMethod"
          border
          max-height="400"
          show-summary
          style="width: 100%; margin-top: 20px;overflow-x: hidden">
          <el-table-column
            prop="name"
            label="套餐"
            width="180">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格（元）">
          </el-table-column>
          <el-table-column
            prop="content.hsName"
            label="检测项目">
          </el-table-column>
          <el-table-column
            prop="content.hsCode"
            label="编码">
          </el-table-column>
        </el-table>
        <div style="height: 10px"></div>
        <div v-if="customPackage.length" style="background-color: #FACD89;padding: 6px;width: 85px">自定义套餐</div>
        <el-table
          v-if="customPackage.length"
          :data="customPackage"
          :span-method="customSpanMethod"
          border
          max-height="400"
          show-summary
          style="width: 100%; margin-top: 20px;overflow-x: hidden">
          <el-table-column
            prop="name"
            label="套餐"
            width="180">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格（元）">
          </el-table-column>
          <el-table-column
            prop="hsName"
            label="检测项目">
          </el-table-column>
          <el-table-column
            prop="hsCode"
            label="编码">
          </el-table-column>
        </el-table>
        <div style="padding: 40px">
          <div style="margin-bottom:20px">总计缴费金额：<span style="color: #028207">￥{{totalMoney}}</span></div>
          <div style="padding-bottom:20px">保险机构代缴金额：<span style="color: #028207">￥{{totalMoney*(1-discount/100)}}</span></div>
          <div>个人缴费金额：<span style="color: #028207">￥{{totalMoney*discount/100}}</span></div>
        </div>
        <div style="float: right;padding: 40px;">
          <el-button>返回</el-button>
          <el-button type="primary" @click="confirmPay">确认支付</el-button>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        hsPackage:[],
        customPackage:[],
        totalMoney:0,
        discount:100,
        submit:false
      };
    },
    created(){
      this.init();
      this.queryDiscount()
    },
    methods: {
      init(){
        let projects = JSON.parse(localStorage.getItem('projects'));
        let itemsTags = JSON.parse(localStorage.getItem('itemsTags'));
        let customPackage = [];
        for (let items of itemsTags) {
          for (let item of items.selectedItems) {
            let obj = {};
            obj.name = items.name;
            obj.price = item.price || 10;
            this.totalMoney += obj.price;
            obj.hsName = item.hsName;
            obj.hsCode = item.hsCode;
            obj.length = items.selectedItems.length;
            customPackage.push(obj)
          }
        }
        this.customPackage = customPackage;
        let hsPackage = [];
        for (let pro of projects) {
          if (pro.value) {
            this.totalMoney += pro.price;
            for (let i in pro.content) {
              let hp = {};
              hp.type = 1;
              hp.name = pro.value;
              hp.code = pro.categoryCode;
              hp.price = i == 0 ? pro.price : 0;
              hp.content = pro.content[i];
              hp.length = pro.content.length;
              hsPackage.push(hp)
            }
          }
        }
        this.hsPackage = hsPackage;
      },
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
            let flag = false;
            if(rowIndex!=0){
              flag = this.hsPackage[rowIndex].name === this.hsPackage[rowIndex-1].name
            }

          if (!flag) {
            return {
              rowspan: this.hsPackage[rowIndex].length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
        if (columnIndex === 1) {
            let flag = false;
            if(rowIndex!=0){
              flag = this.hsPackage[rowIndex].name === this.hsPackage[rowIndex-1].name
            }

          if (!flag) {
            return {
              rowspan: this.hsPackage[rowIndex].length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 1
            };
          }
        }
      },
      customSpanMethod({ row, column, rowIndex, columnIndex }){
        if (columnIndex === 0) {
          let flag = false;
          if(rowIndex!=0){
            flag = this.customPackage[rowIndex].name === this.customPackage[rowIndex-1].name
          }

          if (!flag) {
            return {
              rowspan: this.customPackage[rowIndex].length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      queryDiscount(){
          var vm = this;
          this.axios.get("/network/examination/examination/queryDiscount").
            then(res=>vm.discount = res.data);
      },
      confirmPay(){
          if(this.submit){
              return false
          }
        let hsProjects = JSON.parse(localStorage.getItem('projects'));
        let itemsTags = JSON.parse(localStorage.getItem('itemsTags'));
        let examinationUserId = localStorage.getItem('examinationUserId');
        let projects = [];
        for(let hp of hsProjects){
            if(hp.value){
                let obj = {};
                obj.projectType = 1;
                obj.category = hp.category;
                obj.name = hp.value;
                obj.originalPrice = hp.price;
                obj.actualPayment = hp.price*this.discount/100;
                obj.content = hp.content;
                projects.push(obj);
            }
        }
        for(let it of itemsTags){
            let obj = {};
            obj.projectType = 2;
            obj.name = it.name;
            let originalPrice = 0;
            for(let con of it.selectedItems){
              originalPrice += con.price||10
            }
            obj.originalPrice = originalPrice;
            obj.actualPayment = originalPrice*this.discount/100;
            obj.content = it.selectedItems;
            projects.push(obj);
        }
        this.submit = true;
        this.axios.post('/network/examination/examination/payment',
          {params:{projects:projects,examinationUserId:examinationUserId}})
          .then(res=>{
              if(res.data.result === this.config.success){
                localStorage.removeItem("projects");
                localStorage.removeItem("itemsTags");
                localStorage.removeItem("examinationUserId");
                vm.$message({
                  message: res.data.message,
                  type: 'success'
                });
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
</style>
