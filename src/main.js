import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import store from "./store";
import "../src/api/mock";
import Cookies from "js-cookie";

Vue.config.productionTip = false;
Vue.use(ElementUI);

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
  // 判断token是否存在
  const token = Cookies.get("token");
  // token不存在
  if (!token && to.name !== "login") {
    next({ name: "login" });
  } else if (token && to.name === "login") {
    // token存在
    next({ name: "home" });
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    store.commit("addMenu", router);
  }
}).$mount("#app");
