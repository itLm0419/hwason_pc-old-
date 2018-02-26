// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from './util/api'
import config from './util/config'
import axios from './config/axios.config'
Vue.prototype.api = api;
Vue.prototype.config = config;
Vue.prototype.axios = axios;
String.prototype.trim = function() {return this.replace(/(^\s*)|(\s*$)/g,"")}
Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
