import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import User from "../views/User.vue";
import Main from "../views/Main.vue";
import Mall from "../views/Mall.vue";
import PageOne from "../views/PageOne.vue";
import PageTwo from "../views/PageTwo.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
}; //解决路由重复点击报错问题

// 1、创建路由组件
// 2、将路由与组件进行映射
// 3、创建路由实例
// 4、将路由挂载到根实例

const routes = [
  // 主路由
  {
    path: "/",
    name: "Main",
    component: Main,
    redirect: "/home", // 重定向,跳转到首页
    children: [
      // 子路由
      // {
      //   //首页
      //   path: "home",
      //   name: "home",
      //   component: Home,
      // },
      // {
      //   // 用户管理
      //   path: "user",
      //   name: "user",
      //   component: User,
      // },
      // {
      //   // 商品管理
      //   path: "mall",
      //   name: "mall",
      //   component: Mall,
      // },
      // {
      //   // 页面一
      //   path: "page1",
      //   name: "page1",
      //   component: PageOne,
      // },
      // {
      //   // 页面二
      //   path: "page2",
      //   name: "page2",
      //   component: PageTwo,
      // },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
