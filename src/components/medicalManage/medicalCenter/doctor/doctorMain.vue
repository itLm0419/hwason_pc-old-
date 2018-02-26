<template>
  <div class="container">
    <div>医生账号管理</div>

    <!--选项卡-->
    <el-tabs v-model="tabSelected" type="card" @tab-click="tabClick">
      <el-tab-pane label="填写医生信息" name="create">
        <create-doctor-account></create-doctor-account>
      </el-tab-pane>

      <el-tab-pane label="已申请医生信息" name="doctorList">

      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import createDoctorAccount from './createDoctorAccount.vue'

	export default {
    components: {
      createDoctorAccount
    },
    data() {
      return {
        tabSelected: "create",

      }
    },
    methods: {
      // 初始化页面
      init() {
        let vm = this;


      },

      // 切换tab页
      tabClick() {
        let vm = this;


      }

    },
    mounted() {
      let vm = this;

      vm.init();
    }
	}
</script>

<style scoped>
  .container {
    background-color: white;
  }
</style>
