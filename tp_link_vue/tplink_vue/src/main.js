import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3030' 
Vue.prototype.axios = axios;
Vue.config.productionTip = false

//导入Mint UI
import MintUI from 'mint-ui';

//导入样式表文件
import "mint-ui/lib/style.min.css";

//通过Vue.ues()方法使用插件
Vue.use(MintUI);

//csspx——>rem
import 'lib-flexible'


import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
