import Vue from 'vue'
import App from './App.vue'
import router from './router'

//css样式
import "assets/css/base.css"
//字体图标
import "assets/fonts/iconfont.css"

import ZkTable from 'vue-table-with-tree-grid'

Vue.component("tree-table", ZkTable)

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
