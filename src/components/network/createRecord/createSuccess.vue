<template>
  <div ref="createSuccess" class="main-box">
    <div class="successTips">
      <div class="clearfix">
        <img src="../../../../static/img/network/cerateRecord/ok.png" alt="success" class="fl">
        <div class="fl">
          <div class="tip">恭喜您,健康档案创建成功！</div>
          <div class="sub-tip">请尽快完善您的档案资料</div>
        </div>
      </div>
      <div class="jump-tip"> <span style="color:#fc0000;">{{second}}</span> 秒后会自动跳转</div>
    </div>
  </div>
</template>
<script>
  export default {
      data(){
          return {
            second:5,
            _id:'',
          }
      },
    mounted(){
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      this.$refs.createSuccess.style.height = (h - 114) + "px";
      let UrlSearch = new this.api.UrlSearch();
      this._id = UrlSearch._id;
      let vm = this;
      let timer = setInterval(function () {
        vm.second -- ;
        if(vm.second === 0){
            clearInterval(timer);
            window.location.href = '#/examination/customerDetails?_id='+vm._id;
        }
      },1000)
    },
    methods:{

    }
  }
</script>
<style scoped>
  .successTips{
    width: 35%;
    height: 50%;
    margin:300px auto 0;
  }
  .main-box{
    padding:20px 0 10px 0;
    background: #fff;
    overflow-y: auto;
    border-top:4px solid #2d99d7;
  }
  .tip{
    font-size: 24px;
    color:#02a41d;
    padding:5px 0 0 20px;
  }
  .sub-tip{
    font-size: 16px;
    color:#686868;
    padding:5px 0 0 20px;
  }
  .jump-tip{
    color:#686868;
    font-size:16px;
    padding:50px 0 0 84px;
  }
  .clearfix:after{display:block;content:"";clear:both;}
  .clearfix{zoom:1;}
  .fl{float:left;}
  .fr{float:right;}
</style>
