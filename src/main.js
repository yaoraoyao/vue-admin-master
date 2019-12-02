import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//要让请求发送出去，注释Mockjs
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//全局配置axios
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:80"
//将axios作为Vue的一个属性,在任意的组件中可以使用this.$http调用axios发送请求了
Vue.prototype.$http = axios

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes:routes
})

//每次路由之前做的事情
//to  跳转的路径
//from  当前路径
//next  函数   根据路径做跳转
//Html5新特性->前端也有session对象    sessionStorage
//session中以key-value形式存储数据
//removeItem（key）  删除session中的数据
//这部分代码就是前端的认证！！！！
router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  //如果session中user不存在
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

