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
          <el-input clearable v-model="searchUser" placeholder="请输入搜索的用户名" size="large">
            <el-button slot="append" icon="el-icon-search" @click="_usersRequest()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogAddVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息 -->
      <el-table :data="users" border style="width: 100%;margin-top:15px" stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="auto"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="auto"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="auto"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="auto"></el-table-column>
        <el-table-column label="状态" width="70">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userChangeState($event,scope.row.id)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="290">
          <template slot-scope="operation">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEditUser(operation.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteUser(operation.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="handleUserRole(operation.row)"
            >角色分配</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[2,5,10,15]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogAddVisible"
      @close="$refs.addForm.resetFields()"
      @opened="$refs.userInput.focus()"
    >
      <el-form :model="userData" :rules="addUserRules" ref="addForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model.trim="userData.username" autocomplete="off" ref="userInput"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model.trim="userData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model.trim="userData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model.number="userData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogEditVisible"
      @close="$refs.editUserForm.resetFields()"
    >
      <el-form :model="editData" :rules="addUserRules" ref="editUserForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input disabled v-model.trim="editData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model.trim="editData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model.number="editData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog
      width="500px"
      title="角色分配"
      :visible.sync="dialogUserRoleVisible"
      @close="selectRole=''"
    >
      <el-row class="row-role">
        <el-col :span="5">用户名:</el-col>
        <el-col :span="8">{{userRole.username}}</el-col>
      </el-row>
      <el-row class="row-role">
        <el-col :span="5">角色:</el-col>
        <el-col :span="8">{{userRole.role_name}}</el-col>
      </el-row>
      <el-row class="row-role">
        <el-col :span="5" class="col-newrole">分配新角色:</el-col>
        <el-col :span="8">
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option label="普通管理员" value="1"></el-option>
            <el-option label="员工" value="2"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="dialogUserRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUserRoleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  usersRequest,
  addUserRequest,
  deleteUserRequest,
  alterUserState,
  queryUserInfo,
  editUserInfo,
  allotUserRole
} from "network/users";

export default {
  name: "Users",
  data() {
    return {
      users: [],
      searchUser: "",
      currentPage: 1,
      total: 1,
      pageSize: 5,
      formLabelWidth: "80px",
      selectRole: "",
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogUserRoleVisible: false,
      userData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "必须输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "必须输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        email: [
          {
            validator: (rule, value, callback) => {
              value || callback();
              let emailReg = /^([a-zA-Z]|\d)(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
              emailReg.test(value)
                ? callback()
                : callback(new Error("邮箱格式错误"));
            },
            trigger: "blur"
          }
        ],
        mobile: [
          {
            validator: (rule, value, callback) => {
              value || callback();
              let mobileReg = /^1[3-9]\d{9}$/;
              mobileReg.test(value)
                ? callback()
                : callback(new Error("电话格式错误"));
            },
            trigger: "blur"
          }
        ]
      },
      editData: {
        username: "",
        email: "",
        mobile: ""
      },
      userRole: {}
    };
  },
  methods: {
    _usersRequest() {
      usersRequest(this.currentPage, this.pageSize, this.searchUser).then(
        ({ data, meta }) => {
          this.users.length = 0;
          this.users.push(...data.users);
          this.total = data.total;
          meta.status !== 200 && this.$message.error("获取用户信息失败");
        }
      );
      this.searchUser = "";
    },
    //修改每页显示数据条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this._usersRequest();
    },
    //修改当前页码
    handleCurrentChange(page) {
      this.currentPage = page;
      this._usersRequest();
    },
    //添加用户
    handleAddConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUserRequest(this.userData).then(({ data, meta }) => {
            if (meta.status === 201) {
              this._usersRequest();
              this.$message.success(meta.msg);
            } else {
              this.$message.error(meta.msg);
            }
          });
          this.dialogAddVisible = false;
        } else {
          return false;
        }
      });
    },
    //删除用户
    handleDeleteUser(id) {
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        () => {
          deleteUserRequest(id).then(({ meta }) => {
            if (meta.status === 200) {
              this.$message.success(meta.msg);
              this._usersRequest();
            } else {
              this.$message.error(meta.msg);
            }
          });
        },
        err => {}
      );
    },
    //修改用户状态
    userChangeState(state, id) {
      // let loadingInstance = this.$loading({
      //   target: "#network-loading",
      //   background: "transparent"
      // });
      alterUserState(id, state);
      // .finally(() => {
      //   loadingInstance.close();
      // });
    },
    //编辑用户信息
    handleEditUser(id) {
      queryUserInfo(id).then(({ data }) => {
        this.editData = data;
        this.dialogEditVisible = true;
      });
      // .finally(() => {
      // });
    },
    handleEditConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editUserInfo(this.editData).then(({ data, meta }) => {
            if (meta.status === 200) {
              this._usersRequest();
              this.$message.success(meta.msg);
            } else {
              this.$message.error(meta.msg);
            }
          });
          this.dialogEditVisible = false;
        } else {
          return false;
        }
      });
    },
    //角色分配
    handleUserRole(data) {
      this.userRole = data;
      this.dialogUserRoleVisible = true;
    },
    handleUserRoleConfirm() {
      if (!this.selectRole) {
        console.log(this.userRole);
        this.$message.error("请选择要分配的角色");
        return;
      }
      let rid = 0;
      switch (this.selectRole) {
        case "普通管理员":
          rid = 1;
          break;
        case "员工":
          rid = 2;
          break;
      }
      allotUserRole(this.userRole.id, rid)
        .then(({ meta }) => {
          if (meta.status === 200) {
            this.$message.success(meta.msg);
            this.dialogUserRoleVisible = false;
            // this._usersRequest();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => this.$message.error("操作失败"));
    }
  },
  created() {
    this._usersRequest();
  }
};
</script>

<style lang="less" scoped>
.row-role + .row-role {
  margin-top: 10px;
  .col-newrole {
    margin-top: 10px;
  }
}
</style>