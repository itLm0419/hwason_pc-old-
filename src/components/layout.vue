<template>
    <el-container>
      <!--左边-->
      <div ref="sideInitHeight" id="sideInitHeight" style=";background: #545c64;">
          <!--头像-->
         <div style="margin-top:10px;height:150px;color: #fff;font-size:12px;text-align: center" v-show="!isCollapse">
           <img src="../../static/img/user0.jpg" alt="用户头像"
                style="
               width:80px;
               height:80px;
               border-radius: 50%;
               display:block;
               margin:0 auto;" />
           <div style="height:25px; line-height: 25px;">{{roleName}}</div>
           <div style="height:25px; line-height: 25px;">{{date}}</div>
         </div>
            <!--左侧菜单-->
        <el-menu :collapse="isCollapse"
                 :default-active="activePath"
                 background-color="#545c64"
                 text-color="#fff"
                 :router="routerFlag"
                 id="menu"
                 class="el-menu-vertical-demo"
                 v-if="modularArr.length"
                 active-text-color="#ffd04b">
          <div v-for="(m,index) in modularArr" style="background: #545c64;">
            <el-submenu v-if="m.level=='1'" :index="(index+1)+''">
              <template slot="title">
                <!--<i :class="m.icon" style="color:#fff;"></i>-->
                <svg class="icon2 fl">
                  <use :xlink:href="m.icon"></use>
                </svg>
                <span>{{isCollapse? '':m.name}}</span>
              </template>
              <div  v-for="(c,idx) in m.children">
                <el-menu-item  :index="c.path">{{c.name}}</el-menu-item>
              </div>
            </el-submenu>
            <div v-else>
              <el-menu-item :index="m.path">
                <i :class="m.icon"></i>
                <span slot="title">{{m.name}}</span>
              </el-menu-item>
            </div>
          </div>
        </el-menu>
      </div>
      <!--右边-->
      <el-main style="min-width: 1000px">
        <!--头部-->
        <el-header class="clearfix" ref="elHeader" >
          <svg class="icon fl" aria-hidden="true" @click="hideOrShowSide">
            <use :xlink:href="openOrClose"></use>
          </svg>
          <div class="fl welcome">欢迎您登录华晟医学运营管理平台！</div>
          <div class="fr" style="cursor: pointer;margin:0 20px 0 50px;">
            <svg class="icon2 fl" aria-hidden="true" @click="hideOrShowSide">
              <use xlink:href="#icon-loginout">1</use>
            </svg>
            <div class="fl" style="font-size: 14px;">退出系统</div>
          </div>
          <div class="fr" style="cursor: pointer;">
            <svg class="icon2 fl" aria-hidden="true" @click="hideOrShowSide" >
              <use xlink:href="#icon-modify-password"></use>
            </svg>
            <div class="fl" style="font-size: 14px;">修改密码</div>
          </div>
        </el-header>
        <!--主体-->
        <div class="el-right-main"  ref="rightContainer" id="rightContainer" >
            <router-view></router-view>
        </div>
      </el-main>
    </el-container>
</template>
<script>
  export default {
    data() {
      return {
          routerFlag:true,
          modularArr:[],
          openOrClose:'#icon-menu-open',
          isCollapse:false,
          activePath:'',
          roleName:''
      }
    },
    created(){
        this.init();
        this.queryModular();


    },
    mounted(){
      window.onresize = function(){
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        document.getElementById("sideInitHeight").style.height=h+'px';
        document.getElementById("rightContainer").style.height = (h - 80) + "px"
      };
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.$refs.sideInitHeight.style.height=h+'px';
        this.$refs.rightContainer.style.height = (h - 80) + "px"

    },
    methods: {
        init(){
          var vm = this;
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth()+1;
          let day = date.getDate();
          let week = date.getDay();
          switch (week){
            case 1:
              week = "一";
              break;
            case 2:
              week = "二";
              break;
            case 3:
              week = "三";
              break;
            case 4:
              week = "四";
              break;
            case 5:
              week = "五";
              break;
            case 6:
              week = "六";
              break;
            case 0:
              week = "日";
              break;
          }
          this.date =  year+"年"+month+"月"+day+"日"+" 星期"+week
        },
      queryModular(){
        var vm = this;
        this.axios.get("/common/queryModular").then((response)=> {
          vm.modularArr = response.data.modular;
          vm.roleName = response.data.roleName;
          this.getActivePath();
        })
        },
      hideOrShowSide(){
            if(this.openOrClose === '#icon-menu-close'){
              this.openOrClose = '#icon-menu-open';

            }else{
              this.openOrClose = '#icon-menu-close';
            }
            this.isCollapse = !this.isCollapse;
      },
      getActivePath(){
        let urlStrArr = location.hash.split("/");
        let firstUrl = '';
        for(let usa of urlStrArr){
          if(usa&&usa!='#'){
            firstUrl = usa;
            for(let ma of this.modularArr){
              if(ma.path&&ma.path.split("/")[0]==firstUrl){
                this.activePath = ma.path;
              }else{
                for(let mc of ma.children){
                  if(mc.path&&mc.path.split("/")[1]==firstUrl){
                    this.activePath = mc.path;
                  }
                }
              }
            }
            break;
          }
        }

      }
    },
    watch:{
      $route(value){
          this.getActivePath();
      }
    }
  };
</script>
<style scoped>
  .icon{
    color:#fff;
    width: 2em; height: 2em;
    /*vertical-align: -2em;*/
    margin:13px 30px 0 10px ;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
  .icon2{
    color:#fff;
    width: 1em; height: 1em;
    /*vertical-align: -2em;*/
    margin:22px 5px 0 10px ;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
  .el-right-main{
    padding: 10px;
    min-width: 650px;
    background-color: #EEEEEE;
    overflow-y: auto;
  }
  /*.el-main-route{
    height: 100%;
    background-color:#FFFFFF;
    overflow-y: scroll;
  }*/
  .welcome{
    font-size:22px;
  }
  .clearfix:after{display:block;content:"";clear:both;}
  .clearfix{zoom:1;}
  .fl{float:left;}
  .fr{float:right;}
  .el-header{
    background-color: #2d99d7;
    color: #fff;
    line-height: 60px;
    padding:0;
    margin: 0;
  }
  .el-aside {
    background-color: #545c64;
    color: #333;
    /*line-height: 200px;*/
  }

  .el-main {
    background-color: #eee;
    color: #333;
    /*line-height: 160px;*/
    padding:0;
    overflow-y: hidden;

  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

</style>
