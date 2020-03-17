<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px">
      <!-- 用户信息 -->
      <el-table :data="rightsData" border style="width: 100%;margin-top:15px" stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="auto"></el-table-column>
        <el-table-column prop="path" label="路径" width="auto"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="auto">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'" disable-transitions>一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success" disable-transitions>二级</el-tag>
            <el-tag v-else type="warning" disable-transitions>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/rights";

export default {
  name: "RightsList",
  data() {
    return {
      rightsData: []
    };
  },
  created() {
    getRightsList().then(({ data }) => {
      this.rightsData = data;
    });
  }
};
</script>
<style scoped>
</style>