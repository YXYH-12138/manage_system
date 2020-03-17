<template>
  <div class="goods-list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable v-model="searchGoods" placeholder="请输入内容" size="large">
            <el-button slot="append" icon="el-icon-search" @click="_getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/home/addgoods')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品信息 -->
      <el-table :data="goodsList" border style="width: 100%;margin-top:15px" stripe>
        <el-table-column type="index" label="#" width="auto"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="auto"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="65"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="65"></el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope_time">
            <span>{{ dateTimeFormat(scope_time.row.add_time*1000,'yyyy/MM/dd HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="operation">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEditGoods(operation.row.goods_id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteGoods(operation.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[2,5,10,15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGoodsRequest } from "network/goods";
import { dateTimeFormat } from "common/utils";

export default {
  name: "GoodsList",
  data() {
    return {
      searchGoods: "",
      goodsList: [],
      currentPage: 1,
      pagesize: 5,
      pageTotal: 0
    };
  },
  methods: {
    async _getGoodsList() {
      let { data, meta } = await getGoodsList(
        this.currentPage,
        this.pagesize,
        this.searchGoods
      );
      if (meta.status !== 200) {
        return this.$message.error("获取商品信息错误");
      }
      this.pageTotal = data.total;
      this.goodsList = data.goods;
    },
    handleEditGoods(data) {},
    //删除商品
    async handleDeleteGoods(id) {
      let clueRes = await this.$confirm("是否删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!clueRes) return;
      let { meta } = await deleteGoodsRequest(id);
      if (meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this._getGoodsList();
    },
    dateTimeFormat(date, str) {
      return dateTimeFormat(date, str);
    },
    //修改每页显示数据条数
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this._getGoodsList();
    },
    //修改当前页码
    handleCurrentChange(page) {
      this.currentPage = page;
      this._getGoodsList();
    }
  },
  created() {
    this._getGoodsList();
  }
};
</script>

<style scoped>
.el-pagination {
  margin-top: 15px;
}
.el-table {
  font-size: 12px;
}
</style>