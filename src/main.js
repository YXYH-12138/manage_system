import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {
  Message
} from "element-ui";

import "assets/css/base.css"
import "assets/fonts/iconfont.css"

Vue.config.productionTip = false
Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
