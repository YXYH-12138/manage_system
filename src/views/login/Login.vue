<template>
  <div class="login-box">
    <div class="login-container">
      <div class="logo">
        <img src="~assets/img/logo.png" alt />
      </div>
      <el-form :model="login" :rules="loginRules" ref="loginForm" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="user">
          <el-input v-model="login.user" ref="loginUserInput">
            <span slot="prefix" class="iconfont icon-user"></span>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pwd" ref="loginPwd">
          <el-input type="password" v-model="login.pwd" ref="loginPwdInput">
            <span slot="prefix" class="iconfont icon-pwd"></span>
          </el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="login-button">
          <el-button type="primary" @click="btnLogin('loginForm')">登录</el-button>
          <el-button type="info" @click="btnReset('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginRequest } from "network/login";

export default {
  name: "login",
  data() {
    return {
      login: {
        user: "",
        pwd: ""
      },
      loginRules: {
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    btnLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          loginRequest(this.login.user, this.login.pwd).then(res => {
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg);
              //保存token
              sessionStorage.setItem("token", res.data.token);
              this.$router.push("/home");
            } else {
              this.$message.error(res.meta.msg);
              this.$refs.loginPwd.resetField();
              this.$refs.loginPwdInput.focus();
            }
          });
        } else {
          return false;
        }
      });
    },
    btnReset(formName) {
      this.$refs[formName].resetFields();
      this.$refs.loginUserInput.focus();
    }
  },
  mounted() {
    this.$refs.loginUserInput.focus();
  }
};
</script>

<style lang="less" scoped>
.login-box {
  width: 100%;
  height: 100%;
  background-color: rgb(38, 74, 107);
  display: flex;
  justify-content: center;
  align-items: center;
  .login-container {
    width: 450px;
    height: 330px;
    background-color: #fff;
    position: relative;
    padding: 140px 0 10px;
    .logo {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      height: 150px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-form {
      padding: 0 20px;
    }
    .login-button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>