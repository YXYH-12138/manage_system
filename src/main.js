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

import ZkTable from 'vue-table-with-tree-grid'

Vue.component("tree-table", ZkTable)

import VueQuillEditor from "vue-quill-editor";

import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading.service

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
