<template>
  <el-container class="home-container">
    <el-header class="home-header">
      <span class="header-text">后台管理系统</span>
      <el-button class="exit-button" type="info" @click="exitClick">退出</el-button>
      <div id="network-loading"></div>
    </el-header>
    <el-container>
      <!--侧边-->
      <el-aside :width="isCollapse?'60px':'200px'" class="home-aside">
        <div class="toggle-bar" @click="toggleCollapse">|||</div>
        <!-- 菜单栏  -->
        <el-menu
          class="menu-vertical"
          background-color="#333744"
          :default-active="activePath"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          @select="handleSelect"
        >
          <el-submenu
            v-for="(menuItem,menuIndex) in menuData"
            :key="menuItem.id"
            :index="`${menuIndex}`"
          >
            <template slot="title">
              <i class="iconfont" :class="iconMenus[menuIndex]"></i>
              <span>{{menuItem.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="childenItem in menuItem.children"
              :index="`/home/${childenItem.path}`"
              :key="childenItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{childenItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menusRequest } from "network/home";

export default {
  name: "Home",
  data() {
    return {
      menuData: [],
      activePath: "",
      isCollapse: false,
      iconMenus: [
        "icon-yonghuguanli",
        "icon-quanxianguanli",
        "icon-shangpinguanli",
        "icon-dingdanguanli",
        "icon-icon-"
      ]
    };
  },
  methods: {
    exitClick() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleSelect(index) {
      if (this.$route.path.includes(index)) return;
      this.$router.push(index);
      //保存路径
      sessionStorage.setItem("activePath", index);
    }
  },
  created() {
    menusRequest().then(({ data }) => {
      this.menuData.push(...data);
    });
    this.activePath = sessionStorage.getItem("activePath");
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .home-header {
    height: 60px;
    background-color: #373d41;
    text-align: right;
    .header-text {
      color: #fff;
      font-size: 22px;
      line-height: 60px;
      user-select: none;
      position: absolute;
      left: 20px;
    }
    .exit-button {
      margin-top: 10px;
    }
    #network-loading {
      width: 60px;
      height: 60px;
      position: fixed;
      right: 10px;
      top: 0;
    }
  }
  .home-main {
    background-color: #eaedf1;
  }
  .home-aside {
    background-color: #333744;
    .toggle-bar {
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 25px;
      background-color: #4a5064;
      cursor: pointer;
      user-select: none;
    }
    .menu-vertical {
      border: none;
      .iconfont {
        padding-right: 10px;
      }
    }
  }
}
</style>