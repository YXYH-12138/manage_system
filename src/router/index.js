import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")

const Users = () => import("views/home/childComps/Users")
const Roles = () => import("views/home/childComps/rights/Roles")

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
    component: Roles
  }]
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
