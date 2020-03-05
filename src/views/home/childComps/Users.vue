<template>
  <div class="home-users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" size="large">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="users" border style="width: 100%;margin-top:15px" stripe>
        <el-table-column type="index" label="#" width="57"></el-table-column>
        <el-table-column prop="username" label="姓名" width="195"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="195"></el-table-column>
        <el-table-column label="状态" width="195">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip class="item" content="角色分配" placement="top-start">
              <el-button size="mini" type="warning" icon="el-icon-s-tools"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--  @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[2,5,10,15]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { usersRequest } from "network/users";
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
  pagination
} from "element-ui";

export default {
  name: "Users",
  components: {
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
    [pagination.name]: pagination
  },
  data() {
    return {
      users: [],
      currentPage: 1,
      total: 1
    };
  },
  methods: {
    _usersRequest(pagenum, pagesize) {}
  },
  beforeCreate() {
    usersRequest(1, 5).then(({ data, meta }) => {
      this.users.push(...data.users);
      this.total = data.total;
      meta.status !== 200 && this.$message("获取用户信息失败");
    });
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  .el-pagination {
    margin-top: 15px;
  }
}
</style>