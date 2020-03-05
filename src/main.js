import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {
  Message,
  MessageBox,
  Loading,
} from "element-ui";

import "assets/css/base.css"
import "assets/fonts/iconfont.css"

Vue.config.productionTip = false

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading.service

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
