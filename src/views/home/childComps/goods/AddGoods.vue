<template>
  <div class="goods-list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="active" align-center space="300px" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs tab-position="left" :before-leave="beforeLeaveTab">
        <el-tab-pane label="基本信息">
          <el-form label-position="top" label-width="80px" :model="formLabelAlign">
            <el-form-item label="商品名称">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model.number="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="formLabelAlign.price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model.number="formLabelAlign.number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-input v-model="formLabelAlign.category"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数">配置管理</el-tab-pane>
        <el-tab-pane label="商品属性">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Input,
  Button,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  tooltip,
  pagination,
  dialog,
  form,
  FormItem,
  select,
  option,
  alert,
  steps,
  step,
  tabs,
  TabPane
} from "element-ui";

export default {
  name: "AddGoods",
  components: {
    [TabPane.name]: TabPane,
    [tabs.name]: tabs,
    [step.name]: step,
    [Breadcrumb.name]: Breadcrumb,
    [BreadcrumbItem.name]: BreadcrumbItem,
    [Input.name]: Input,
    [Button.name]: Button,
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Switch.name]: Switch,
    [tooltip.name]: tooltip,
    [pagination.name]: pagination,
    [dialog.name]: dialog,
    [form.name]: form,
    [FormItem.name]: FormItem,
    [select.name]: select,
    [option.name]: option,
    [alert.name]: alert,
    [steps.name]: steps
  },
  data() {
    return {
      active: 0,
      formLabelAlign: {
        name: "",
        price: "",
        number: "",
        category: ""
      }
    };
  },
  methods: {
    beforeLeaveTab(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName);
      typeof oldActiveName == "undefined" && (oldActiveName = 1);
      if (Math.abs(activeName - oldActiveName) != 1) return false;
    }
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  .el-steps,
  .el-tabs {
    margin-top: 15px;
  }
}
</style>