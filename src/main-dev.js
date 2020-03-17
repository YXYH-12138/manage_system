import Vue from 'vue'
import App from './App.vue'
import router from './router'

import "common/element.js"
//css样式
import "assets/css/base.css"
//字体图标
import "assets/fonts/iconfont.css"

import ZkTable from 'vue-table-with-tree-grid'

Vue.component("tree-table", ZkTable)

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// require styles 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
