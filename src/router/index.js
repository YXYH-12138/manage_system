import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")

const Users = () => import("views/home/childComps/users/Users")
const RoleList = () => import("views/home/childComps/rights/RoleList")
const RightsList = () => import("views/home/childComps/rights/RightsList")
const GoodsList = () => import("views/home/childComps/goods/GoodsList")
const AddGoods = () => import("views/home/childComps/goods/AddGoods")
const GoodsCategory = () => import("views/home/childComps/goods/GoodsCategory")
const CategoryParams = () => import("views/home/childComps/goods/CategoryParams")

Vue.use(VueRouter)

const routes = [{
  path: "/",
  redirect: "/login"
}, {
  path: '/login',
  component: Login
}, {
  path: "/home",
  component: Home,
  children: [{
      path: "users",
      component: Users
    }, {
      path: "roles",
      component: RoleList
    }, {
      path: "rights",
      component: RightsList
    }, {
      path: "goods",
      component: GoodsList,
      // children: []
    }, {
      path: "addgoods",
      component: AddGoods
    }, {
      path: "categories",
      component: GoodsCategory
    },
    {
      path: "params",
      component: CategoryParams

    }
  ]
}]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // if (to.path.includes(from.path)) return
  if (to.path === "/home") {
    const token = sessionStorage.getItem('token');
    token ? next() : next("/login")
  } else {
    next()
  }
})

export default router
