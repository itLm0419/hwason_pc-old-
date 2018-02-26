<template>
  <div ref="userSearch" class="main-box">
    <div class="main-title">关键词</div>
    <div class="clearfix">
      <el-input v-model="searchContent" placeholder="请输入身份证/电话号码" style="width:30%;"></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-left:30px;" @click.enter="search">搜索</el-button>
    </div>
  </div>
</template>
<script>
   export default{
       data (){
           return {
             searchContent:'',
           }
      },
     mounted(){
       let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
       this.$refs.userSearch.style.height = (h - 96) + "px";
     },
     methods:{
       search(){
         let vm = this;
          if(!vm.searchContent){
            vm.$message('搜索内容不能为空！');
          }else{
            vm.axios.get('/network/examination/userSearch/userSearch',{params:{searchContent:vm.searchContent}}).then(function (data) {

              if(data.data.result === vm.config.success){
                  vm.$router.push("/examination/customerDetails?_id=" + data.data.queryCon._id)
              }else if(data.data.result === vm.config.fail){
                vm.$confirm('未查询到此客户,此客户需要建立个人健康档案么?', '提示', {
                  confirmButtonText: '需要',
                  cancelButtonText: '暂时不用',
                  type: 'warning'
                }).then(() => {
                  // 跳转页面
                  vm.$router.push('/createRecord/registInfo');
                  console.log('跳转添加用户健康档案页面');
                }).catch(() => {
                  console.log('暂时不用');
                });
              }
            }).catch(function (err) {

            })
          }
       }
     }
  }
</script>
<style scoped>
  .main-box{
    padding:20px 0 0 20px;
    background: #fff;
    border-top:4px solid #2d99d7;
  }
  .main-title{
    font-weight:bold;padding-bottom:20px;
  }
  .clearfix:after{display:block;content:"";clear:both;}
  .clearfix{zoom:1;}
  .fl{float:left;}
  .fr{float:right;}
</style>
