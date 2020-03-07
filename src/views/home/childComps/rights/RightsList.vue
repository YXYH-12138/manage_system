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
        <el-table-column type="index" label="#" width="auto"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="auto"></el-table-column>
        <el-table-column prop="path" label="路径" width="auto"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="auto">
          <template slot-scope="scope">
            <el-tag
              :type="levelTag(scope.row.level).type"
              disable-transitions
            >{{levelTag(scope.row.level).text}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/rights";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Tag
} from "element-ui";

export default {
  name: "RightsList",
  components: {
    [Breadcrumb.name]: Breadcrumb,
    [BreadcrumbItem.name]: BreadcrumbItem,
    [Card.name]: Card,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tag.name]: Tag
  },
  data() {
    return {
      rightsData: []
    };
  },
  computed: {
    levelTag() {
      return function(level) {
        let levelObj = {};
        switch (level) {
          case "0":
            levelObj.type = "";
            levelObj.text = "一级";
            break;
          case "1":
            levelObj.type = "success";
            levelObj.text = "二级";
            break;
          case "2":
            levelObj.type = "warning";
            levelObj.text = "三级";
            break;
        }
        return levelObj;
      };
    }
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