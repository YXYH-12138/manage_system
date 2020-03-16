<template>
  <div class="goods-category">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" @click="handleAddCategory">添加分类</el-button>
      <!-- 商品信息 -->
      <tree-table
        ref="table"
        :data="goodsCategory"
        index-text="#"
        show-index
        border
        :columns="columns"
        style="width: 100%;margin-top:15px"
        :selection-type="false"
        :expand-type="false"
      >
        >
        <template slot="operation" slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            type="primary"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            @click="handleDeleteCategory(scope.row.cat_id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level=='0'" size="mini" disable-transitions>一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level=='1'"
            size="mini"
            type="success"
            disable-transitions
          >二级</el-tag>
          <el-tag v-else type="warning" size="mini" disable-transitions>三级</el-tag>
        </template>
        <template slot="isDelete" slot-scope="scope">
          <i style="color: rgb(32, 178, 170)" v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
          <i style="color: red" v-else class="el-icon-error"></i>
        </template>
      </tree-table>
      <!-- 页码 -->
      <el-pagination
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="pageTotal"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <!-- 添加商品 -->
      <el-dialog
        title="添加分类"
        @close="closeAddCategoryDialog"
        :visible.sync="dialogAddCategoryVisible"
      >
        <el-form :model="addCategory" ref="addForm" :rules="addRules">
          <el-form-item label="分类名称" prop="name" label-width="100px">
            <el-input v-model="addCategory.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" label-width="100px">
            <el-cascader
              :options="optionsCategory"
              :props="casecaderProps"
              v-model="addCategory.cascaderValue"
              clearable
              style="width:100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogAddCategoryVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddConfirm('addForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改商品分类信息 -->
      <el-dialog
        title="修改商品分类信息"
        :visible.sync="dialogEditVisible"
        @close="$refs.editCatForm.resetFields()"
      >
        <el-form :model="editData" :rules="addRules" ref="editCatForm">
          <el-form-item label="分类名称" label-width="80px" prop="cat_name">
            <el-input v-model.trim="editData.cat_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditConfirm('editCatForm')">确 定</el-button>
        </div>
      </el-dialog>
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
  pagination,
  dialog,
  form,
  FormItem,
  tag,
  option,
  cascader
} from "element-ui";
import {
  getGoodsCategory,
  addCategoryRequest,
  delCategoryRequest,
  getCategoryByid,
  editPutCategory
} from "network/goods";
export default {
  name: "GoodsCategory",
  components: {
    [Breadcrumb.name]: Breadcrumb,
    [BreadcrumbItem.name]: BreadcrumbItem,
    [Input.name]: Input,
    [Button.name]: Button,
    [Card.name]: Card,
    [pagination.name]: pagination,
    [dialog.name]: dialog,
    [form.name]: form,
    [FormItem.name]: FormItem,
    [tag.name]: tag,
    [option.name]: option,
    [cascader.name]: cascader
  },
  data() {
    return {
      goodsCategory: [],
      optionsCategory: [],
      currentPage: 1,
      pagesize: 5,
      pageTotal: 0,
      editData: {
        cat_name: ""
      },
      dialogAddCategoryVisible: false,
      dialogEditVisible: false,
      addCategory: {
        name: "",
        cascaderValue: []
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isDelete"
        },
        {
          label: "排序",
          type: "template",
          template: "sort"
        },
        {
          label: "操作",
          type: "template",
          template: "operation"
        }
      ],
      addRules: {
        name: [{ required: true, message: "请添加分类名称", trigger: "blur" }]
      },
      casecaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id"
      }
    };
  },
  methods: {
    _getGoodCategory() {
      getGoodsCategory(this.currentPage, this.pagesize).then(
        ({ data, meta }) => {
          this.goodsCategory = data.result;
          this.pageTotal = data.total;
        }
      );
    },
    rowKey(row, rowIndex) {
      rowIndex = row.cat_id;
    },
    //修改当前页码
    handleCurrentChange(page) {
      this.currentPage = page;
      this._getGoodCategory();
    },
    //添加分类
    handleAddConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { name, cascaderValue } = this.addCategory;
          let length = cascaderValue.length;
          let cat_pid = length ? cascaderValue[length - 1] : 0;
          addCategoryRequest(cat_pid, name, length).then(({ data, meta }) => {
            if (meta.status === 201) {
              this._getGoodCategory();
              this.$message.success(meta.msg);
            } else {
              this.$message.error(meta.msg);
            }
          });
          this.dialogAddCategoryVisible = false;
        } else {
          return false;
        }
      });
    },
    handleAddCategory() {
      getGoodsCategory(null, null, 2).then(({ data }) => {
        this.optionsCategory = data;
        this.dialogAddCategoryVisible = true;
      });
    },
    closeAddCategoryDialog() {
      this.addCategory = {
        name: "",
        cascaderValue: []
      };
    },
    //删除
    handleDeleteCategory(id) {
      this.$confirm("是否删除该分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        () => {
          delCategoryRequest(id).then(({ meta }) => {
            if (meta.status === 200) {
              this.$message.success(meta.msg);
              this._getGoodCategory();
            } else {
              this.$message.error(meta.msg);
            }
          });
        },
        err => {}
      );
    },
    //编辑
    handleEdit(data) {
      getCategoryByid(data.cat_id).then(({ data }) => {
        this.editData = data;
        this.dialogEditVisible = true;
      });
    },
    handleEditConfirm() {
      editPutCategory(this.editData.cat_id, this.editData.cat_name).then(
        ({ meta }) => {
          meta.status === 200
            ? this.$message.success(meta.msg)
            : this.$message.error(meta.msg);
          this._getGoodCategory();
          this.dialogEditVisible = false;
        }
      );
    },
    setRowKey(row, rowIndex) {}
  },
  created() {
    this._getGoodCategory();
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