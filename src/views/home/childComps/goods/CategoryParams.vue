<template>
  <div class="category-params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <el-row :gutter="20">
        <el-col :span="24">
          选择商品分类：
          <el-cascader
            :options="optionsCategory"
            v-model="cascaderValue"
            @change="handleSelectCategory"
            :props="{  expandTrigger: 'hover', label: 'cat_name', value: 'cat_id'}"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane label="动态参数" name="many" @click="dialogAddVisible = true">
          <el-button
            :disabled="!cascaderValue.length"
            size="small"
            type="primary"
            @click="handleAddParams('添加动态参数')"
          >添加参数</el-button>
          <el-table
            :data="dynamicParams"
            style="width: 100%;margin-top: 20px;"
            row-key="attr_id"
            border
            stripe
          >
            >
            <el-table-column type="expand" label width="auto">
              <template slot-scope="{row}">
                <el-tag
                  :key="index"
                  v-for="(tag,index) in attrVals(row.attr_vals)"
                  @close="closeTag(row,index)"
                  closable
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible(row.attr_id)"
                  v-model="tagInputValue"
                  ref="saveTagInput"
                  size="small"
                  @click="tagInputClick(row.attr_id)"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showTagInput(row.attr_id)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="auto"></el-table-column>
            <el-table-column label="操作" width="auto">
              <template slot-scope="{row}">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleEditParams(row,'编辑动态参数')"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDeleteParams(row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="!cascaderValue.length"
            size="small"
            type="primary"
            @click="handleAddParams('添加静态属性')"
          >添加参数</el-button>
          <el-table
            :data="dynamicParams"
            style="width: 100%;margin-top: 20px;"
            row-key="attr_id"
            border
            stripe
          >
            >
            <el-table-column type="expand" label width="auto">
              <template slot-scope="{row}">
                <el-tag
                  :key="index"
                  v-for="(tag,index) in attrVals(row.attr_vals)"
                  @close="closeTag(row,index)"
                  closable
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible(row.attr_id)"
                  v-model="tagInputValue"
                  ref="saveTagInput"
                  size="small"
                  @click="tagInputClick(row.attr_id)"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showTagInput(row.attr_id)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="auto"></el-table-column>
            <el-table-column label="操作" width="auto">
              <template slot-scope="{row}">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleEditParams(row,'编辑静态属性')"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDeleteParams(row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog @close="closeDialog('addForm')" :title="dialogText" :visible.sync="dialogAddVisible">
      <el-form :model="paramsData" :rules="addRules" ref="addForm">
        <el-form-item :label="dialogText.slice(2)" label-width="80px" prop="paramsName">
          <el-input v-model.trim="paramsData.paramsName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddtConfirm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      @close="closeDialog('editForm')"
      :title="dialogText"
      :visible.sync="dialogEditVisible"
    >
      <el-form :model="paramsData" :rules="addRules" ref="editForm">
        <el-form-item :label="dialogText.slice(2)" label-width="80px" prop="paramsName">
          <el-input v-model.trim="paramsData.paramsName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
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
  cascader,
  tabs,
  TabPane,
  Tag
} from "element-ui";

import {
  getGoodsCategory,
  getCategoryParams,
  editParams,
  addCategoryParams,
  deleteParams,
  getParamsById
} from "network/goods";

export default {
  name: "CategoryParams",
  components: {
    [Breadcrumb.name]: Breadcrumb,
    [Tag.name]: Tag,
    [TabPane.name]: TabPane,
    [tabs.name]: tabs,
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
    [cascader.name]: cascader
  },
  data() {
    return {
      optionsCategory: [],
      cascaderValue: [], //保存了商品分类的ID
      activeName: "many", //当前标签的选择
      dynamicParams: [], //保存动态参数
      tagInputValue: "",
      dialogText: "",
      id: -999,
      dialogAddVisible: false,
      dialogEditVisible: false,
      currentParams: {},
      paramsData: {
        paramsName: ""
      },
      addRules: {
        paramsName: [
          { required: true, message: "请添加参数名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    _getGoodCategory() {
      getGoodsCategory(null, null, 3).then(({ data }) => {
        this.optionsCategory = data;
      });
    },
    //动态参数或静态属性的请求
    _getCategoryParams() {
      getCategoryParams(this.cascaderLastValue, this.activeName)
        .then(({ data, meta }) => {
          if (meta.status !== 200) return Promise.reject(meta.msg);
          this.dynamicParams = data;
        })
        .catch((msg = "网络错误") => {
          this.$message.error(msg);
        });
    },
    //商品分类选择 发生改变请求数据
    handleSelectCategory() {
      this._getCategoryParams();
    },
    //动态参数或静态属性的切换
    handleTabChange() {
      if (!this.cascaderValue.length) return;
      this._getCategoryParams();
    },
    showTagInput(id) {
      this.id = id;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 按下enter 或 input失去焦点 则添加标签
    handleInputConfirm(data) {
      let value = this.tagInputValue.trim();
      if (value) {
        let vals = data.attr_vals;
        if (vals.split(" ").includes(value))
          return this.$message.error("请不要添加相同标签");
        //添加新参数
        data.attr_vals = vals ? vals + " " + value : value;
        editParams(data)
          .then(({ data: pdata, meta }) => {
            if (meta.status !== 200) return Promise.reject(meta.status);
            data = pdata;
          })
          .catch(msg => {
            this.$message.error(msg);
          });
      }
      this.id = -999;
      this.tagInputValue = "";
    },
    //删除标签
    closeTag(data, index) {
      let valArr = data.attr_vals.split(" ");
      valArr.splice(index, 1);
      data.attr_vals = valArr.join(" ");
      editParams(data)
        .then(({ data: pdata, meta }) => {
          if (meta.status !== 200) return Promise.reject(meta.status);
          data = pdata;
        })
        .catch(msg => {
          this.$message.error(msg);
        });
    },
    //点击标签是保存 参数ID
    tagInputClick(id) {
      this.id = id;
    },
    //添加参数
    handleAddParams(text) {
      this.dialogText = text;
      this.dialogAddVisible = true;
    },
    handleAddtConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false;
        addCategoryParams(
          this.cascaderLastValue,
          this.paramsData.paramsName,
          this.activeName
        )
          .then(({ data, meta }) => {
            if (meta.status !== 201) return Promise.reject(meta.msg);
            this.$message.success(meta.msg);
            this.dialogAddVisible = false;
            this._getCategoryParams();
          })
          .catch(mes => {
            this.$message.error(mes);
          });
      });
    },
    //删除参数
    handleDeleteParams({ attr_id, cat_id }) {
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        () => {
          deleteParams(cat_id, attr_id)
            .then(({ meta }) => {
              if (meta.status !== 200) return Promise.reject(meta.msg);
              this.$message.success(meta.msg);
              this._getCategoryParams();
            })
            .catch(msg => {
              this.$message.error(msg);
            });
        },
        res => {}
      );
    },
    //编辑参数
    handleEditParams(data, text) {
      this.dialogText = text;
      getParamsById(data).then(({ data, meta }) => {
        this.currentParams = data;
        this.paramsData.paramsName = data.attr_name;
        this.dialogEditVisible = true;
      });
    },
    handleEditConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false;
        this.currentParams.attr_name = this.paramsData.paramsName;
        editParams(this.currentParams)
          .then(({ meta }) => {
            if (meta.status !== 200) return Promise.reject(meta.msg);
            this.$message.success(meta.msg);
            this.dialogEditVisible = false;
            this._getCategoryParams();
          })
          .catch(msg => {
            this.$message.error(msg);
          });
      });
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.paramsData.paramsName = "";
    }
  },
  computed: {
    inputVisible() {
      return function(id) {
        return id === this.id;
      };
    },
    cascaderLastValue() {
      return this.cascaderValue[this.cascaderValue.length - 1];
    },
    attrVals() {
      return function(valStr) {
        return valStr ? valStr.split(" ") : [];
      };
    }
  },
  created() {
    this._getGoodCategory();
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  .el-row {
    margin-top: 15px;
  }
  .el-tag {
    margin-right: 10px;
  }
  .el-cascader-menu {
    height: 200px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>