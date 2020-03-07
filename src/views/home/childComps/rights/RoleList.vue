<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top: 15px">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="handleAddRole">添加角色</el-button>
      <!-- 用户信息 -->
      <el-table :data="allRolesData" border style="width: 100%;margin-top:15px" stripe>
        <el-table-column type="expand" label width="auto">
          <template slot-scope="roles">
            <el-row
              class="row1-role"
              :gutter="15"
              v-for="rights1 in roles.row.children"
              :key="rights1.id"
            >
              <!-- 第一层权限 -->
              <el-col :span="5">
                <el-tag
                  @close="handleTagClose(rights1.id, roles.row)"
                  closable
                  class="tag-roles"
                  disable-transitions
                >{{rights1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  class="row2-role"
                  :gutter="15"
                  v-for="rights2 in rights1.children"
                  :key="rights2.id"
                >
                  <!-- 第二层权限  -->
                  <el-col :span="5">
                    <el-tag
                      @close="handleTagClose(rights2.id, roles.row)"
                      closable
                      class="tag-roles"
                      type="success"
                      disable-transitions
                    >{{rights2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三层权限  -->
                  <el-col :span="19">
                    <el-tag
                      @close="handleTagClose(rights3.id,roles.row)"
                      closable
                      class="tag-roles"
                      type="warning"
                      disable-transitions
                      v-for="rights3 in rights2.children"
                      :key="rights3.id"
                    >{{rights3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="auto"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="auto"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="auto"></el-table-column>
        <el-table-column label="操作" width="290">
          <template slot-scope="operation">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editSoleInfo(operation.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteRole(operation.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="handleRightsAllot(operation.row)"
            >角色分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或编辑角色 -->
    <el-dialog
      :title="dialogMsg"
      :visible.sync="dialogAddVisible"
      @close="rolesData = {};$refs.addForm.resetFields()"
      @opened="$refs.userInput.focus()"
    >
      <el-form :model="rolesData" :rules="addRoleRules" ref="addForm">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model.trim="rolesData.roleName" autocomplete="off" ref="userInput"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model.trim="rolesData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :before-close="beforeCloseRightsDialog"
      :visible.sync="dialogAllotVisible"
    >
      <!-- :default-checked-keys="keys" -->
      <el-tree
        :data="allRightsList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @check="handleCheck"
      ></el-tree>
      <div slot="footer">
        <el-button @click="dialogAllotVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllotConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  addRoleRequest,
  queryRole,
  editRolePut,
  deleteRoleRequest,
  getRightsList,
  editRoleRights,
  deleteRoleRights
} from "network/rights";
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
  dialog,
  form,
  FormItem,
  tag,
  tree
} from "element-ui";
export default {
  name: "roles",
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
    [dialog.name]: dialog,
    [form.name]: form,
    [FormItem.name]: FormItem,
    [tag.name]: tag,
    [tree.name]: tree
  },
  data() {
    return {
      //所有的角色信息
      allRolesData: [],
      //所有的权限
      allRightsList: [],
      //角色默认的权限id数组
      defaultKeys: null,
      dialogMsg: "",
      dialogAddVisible: false,
      dialogAllotVisible: false,
      //保存当前选择的角色信息
      currentRole: null,
      tagId: 0,
      rolesData: {
        roleName: "",
        roleDesc: ""
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  methods: {
    _getRolesList() {
      getRolesList().then(({ data }) => {
        this.allRolesData = data;
      });
    },
    //添加角色
    handleAddRole() {
      this.dialogAddVisible = true;
      this.dialogMsg = "添加角色";
    },
    handleAddConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogMsg === "添加角色") {
            addRoleRequest(this.rolesData).then(({ meta }) => {
              if (meta.status === 201) {
                this.$message.success(meta.msg);
                this._getRolesList();
              } else {
                this.$message.error(meta.msg);
              }
            });
          } else {
            editRolePut(this.rolesData).then(({ meta }) => {
              if (meta.status === 200) {
                this.$message.success("修改成功");
                this._getRolesList();
              } else {
                this.$message.error("修改失败");
              }
            });
          }
          this.dialogAddVisible = false;
        } else {
          return false;
        }
      });
    },
    //编辑角色信息
    editSoleInfo(data) {
      this.dialogMsg = "编辑角色";
      queryRole(data.id)
        .then(({ data }) => {
          this.rolesData = data;
          this.dialogAddVisible = true;
        })
        .catch(() => this.$message.error("查询角色信息失败"));
    },
    //删除角色
    handleDeleteRole(id) {
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        () => {
          deleteRoleRequest(id).then(({ meta }) => {
            if (meta.status === 200) {
              this.$message.success(meta.msg);
              this._getRolesList();
            } else {
              this.$message.error(meta.msg);
            }
          });
        },
        err => {}
      );
    },
    //分配角色权限
    handleRightsAllot(currentRole) {
      this.currentRole = currentRole;
      this.dialogAllotVisible = true;
      this.defaultKeys = this.defaultCheckedKeys(currentRole.children);
      this.$nextTick(() => {
        //修改选择的节点
        this.$refs.tree.setCheckedKeys(this.defaultKeys);
      });
    },
    //权限节点选中状态发生变化
    handleCheck(currentNode, checkObj) {
      // console.log(this.getcheckedIdList());
      // let addRights = this.getcheckedIdList().filter(
      //   item => !this.defaultKeys.includes(item)
      // );
      // console.log(addRights);
    },
    beforeCloseRightsDialog(done) {
      this.$refs.tree.setCheckedKeys([]);
      done();
      // this.keys.splice(0, this.keys.length);
      // this.$tree.setCheckedKeys(keys => {
      //   console.log(keys);
      // });
    },
    //确定修改权限的点击
    handleAllotConfirm() {
      let rightsStr = this.getcheckedIdList().join(",");
      editRoleRights(this.currentRole.id, rightsStr)
        .then(({ meta }) => {
          if (meta.status === 200) {
            this.dialogAllotVisible = false;
            this.$message.success("更新成功");
            this._getRolesList();
          } else {
            this.$message.error("更新失败");
          }
        })
        .catch(() => {
          this.$message.error("更新失败");
        });
    },
    //返回包含当前选择角色的最后一层权限的id 的数组
    defaultCheckedKeys(arr) {
      return arr.reduce((acc, cur) => {
        return acc.concat(
          cur.children ? this.defaultCheckedKeys(cur.children) : cur.id
        );
      }, []);
    },
    //获取当前选中的所有权限ID数组
    getcheckedIdList() {
      let checkedIdList = this.$refs.tree.getCheckedKeys().join(",");
      if (checkedIdList) {
        checkedIdList += "," + this.$refs.tree.getCheckedNodes(true)[0].pid;
        return [...new Set(checkedIdList.split(","))].map(item =>
          parseInt(item)
        );
      } else {
        return [];
      }
    },
    handleTagClose(tagId, currentRole) {
      this.$confirm("是否删除该权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tagId = tagId;
          let rolesIndex = this.allRolesData.indexOf(currentRole);
          deleteRoleRights(currentRole.id, tagId)
            // .then(({ meta }) => {
            //   meta.status !== 200 && this.$message.error("删除权限失败");
            // })
            .catch(() => this.$message.error("删除权限失败"));
          this.deleteRights(this.allRolesData[rolesIndex].children);
        })
        .catch(() => {});
    },
    deleteRights(arr) {
      arr.find((item, index, thisArr) => {
        if (item.id === this.tagId) {
          thisArr.splice(index, 1);
          return true;
        }
        item.children && this.deleteRights(item.children);
      });
    }
  },
  created() {
    this._getRolesList();
    getRightsList("tree").then(({ data }) => {
      this.allRightsList = data;
    });
  }
};
</script>

<style lang="less" scoped>
.row1-role {
  border-top: 1px solid rgb(238, 238, 238);
}
.row1-role:last-child {
  border-bottom: 1px solid rgb(238, 238, 238);
}
.row2-role + .row2-role {
  border-top: 1px solid rgb(238, 238, 238);
}
.tag-roles {
  margin: 10px 5px;
}
</style>