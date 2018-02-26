<template>
    <div style="border: 0px;">
        <div class="subTitleBGColor">客户基本信息</div>
        <!--客户基本信息-->
        <div class="baseInfo">
          <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">姓名：{{userInfo.name}}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">性别：{{userInfo.sex}}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">年龄：{{userInfo.age}}</div></el-col>

          </el-row>

          <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">身份证号：{{userInfo.IDNo}}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">电话号码：{{userInfo.tel}}</div></el-col>
          </el-row>
        </div>

        <!--问诊详情-->
        <div class="illness-record" v-for="(item, index) in userInfo.interrogation" :key="index"
             style="padding: 10px;background-color: #F3F3F3;margin-bottom:10px;">
          <!--病情-->
          <div >
            <span class="" style="font-weight: bold;">病情{{index+1}}
              <span style="float: right;font-weight: 100">{{moment(item.createTime).format('YYYY/MM/DD HH:mm')}}</span>
            </span>
            <div style="padding: 10px;">{{item.illness}}</div>
          </div>

          <!--问诊建议-->
          <div>
            <div style="font-weight: bold;">医生建议</div>
            <div style="padding: 10px;">{{item.advice}}</div>
          </div>

          <div>
            <div style="font-weight: bold;">用药处方</div>
            <div style="padding: 10px;">{{item.prescription}}</div>
          </div>
        </div>

    </div>
</template>

<script>
  import moment from "moment"
	export default {
    name:"historyRecord",
    props: [
      "userId",
      "vueNew"
    ],
		data() {
		  return {
		    moment: moment,
        userInfo: {}
      }
		},
		methods: {
		  // 查询历史记录
      queryHistoryRecord() {
        let vm = this;
        let params = {
          _id: vm.userId
        };
        this.axios.get('/network/examination/historyRecord/queryHistoryRecord', {params: params})
          .then(function (response) {
            console.log(response);

            if (response.resultCode === vm.config.fail) {
              return;
            } else {
              // 数据展示
              vm.userInfo = response.data.userModelOne;
            }

          })
          .catch(function (error) {
            console.log(error);
          });
      },

      // 刷新页面
      refreshHistory() {
        console.log("123");
        let vm = this;

        vm.queryHistoryRecord();
      }
    },
    filters: {
      formatTime: function (value) {
        /*let hours = value.replace('T', ' ').substr(11, 2);
        hours = (parseInt(hours) + 8) < 10 ? '0'+(parseInt(hours) + 8) : (parseInt(hours) + 8);
        return value.replace('T', ' ').substr(0, 11) + hours + value.substr(13, 3);*/
        return ;
      }
    },
    mounted() {
      let vm = this;

      vm.queryHistoryRecord();

      vm.vueNew.$on('refresh', function () {
        console.log("refresh start");

        vm.queryHistoryRecord();
      });
    }
	}
</script>

<style scoped>
  .subTitleBGColor {
    background-color: #E4E4E4;
    padding: 10px;
    font-weight: bold;
    width:100px;
    margin-bottom: 5px;
    margin-left: 10px;
  }

  .contentBGColor {
    background-color: #F3F3F3;
  }
  .baseInfo{
    background-color: #F3F3F3;
    padding: 10px;
    margin: 0px auto;
    margin-bottom: 5px;
    width: 97%;
  }
  .illness-record{
    width: 97%;
    margin: 0px auto;
  }
</style>
