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
      <el-tree
        :data="allRightsList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="defaultKeys"
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
import { TreeData } from "common/utils";

export default {
  name: "roles",
  data() {
    return {
      //所有的角色信息
      allRolesData: [],
      //所有的权限
      allRightsList: [],
      dialogMsg: "",
      dialogAddVisible: false,
      dialogAllotVisible: false,
      //保存当前选择的角色信息
      currentRole: null,
      //默认选中的节点
      defaultKeys: [],
      treeData: new TreeData(),
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
      this.treeData.treeArr = currentRole.children;
      this.defaultKeys = [];
      this.defaultKeys.push(...this.treeData.getSomeKeys("id", true));
      this.dialogAllotVisible = true;
    },
    beforeCloseRightsDialog(done) {
      this.$refs.tree.setCheckedKeys([]);
      done();
    },
    //确定修改权限的点击
    handleAllotConfirm() {
      let rightsStr = this.checkedIdList.join(",");
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
    handleTagClose(tagId, currentRole) {
      this.$confirm("是否删除该权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let rolesIndex = this.allRolesData.indexOf(currentRole);
          deleteRoleRights(currentRole.id, tagId)
            .then(({ data, meta }) => {
              if (meta.status !== 200) {
                return this.$message.error("删除权限失败");
              }
              // meta.status !== 200 && this.$message.error("删除权限失败");
              // this.treeData.treeArr = this.allRolesData[rolesIndex].children;
              // this.treeData.deleteTreeNode("id", tagId);
              // console.log(res);
              currentRole.children = data;
            })
            .catch(() => this.$message.error("删除权限失败"));
        })
        .catch(() => {});
    }
  },
  computed: {
    //获取当前选中的所有权限ID数组
    checkedIdList() {
      return [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ];
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
  display: flex;
  align-items: center;
}
.row1-role:last-child {
  border-bottom: 1px solid rgb(238, 238, 238);
}
.row2-role {
  display: flex;
  align-items: center;
}
.row2-role + .row2-role {
  border-top: 1px solid rgb(238, 238, 238);
}
.tag-roles {
  margin: 10px 5px;
}
</style>