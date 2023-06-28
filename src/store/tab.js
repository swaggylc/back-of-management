import Cookies from "js-cookie";
export default {
  state: {
    isCollapse: false, //侧边栏是否折叠
    tabsList: [
      //面包屑的数组
      {
        path: "/",
        name: "home",
        label: "首页",
        icon: "s-home",
        url: "Home/Home",
      },
    ],
    menu: [],
  },
  mutations: {
    // 修改菜单折叠状态
    changeCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    // 更新面包屑数据
    selectMenu(state, val) {
      // console.log(val);
      // 判断添加到数据是否是首页
      if (val.name !== "home") {
        // 判断数组中是否有该数据
        let result = state.tabsList.findIndex((item) => item.name == val.name);
        if (result == -1) {
          state.tabsList.push(val);
        }
      }
    },
    // 删除指定数据
    closeTag(state, val) {
      const itemIndex = state.tabsList.findIndex(
        (item) => item.name == val.name
      );
      state.tabsList.splice(itemIndex, 1);
    },

    // 设置menu的数据
    setMenu(state, val) {
      state.menu = val;
      // 存入cookie中
      Cookies.set("menu", JSON.stringify(val));
    },

    // 动态注册路由
    addMenu(state, router) {
      // 判断缓存中是否有数据
      if (!Cookies.get("menu")) {
        return;
      }
      // 获取缓存中的数据
      let menu = JSON.parse(Cookies.get("menu"));
      state.menu = menu;
      // 处理动态路由的数据
      const menuArray = [];
      // 对menu数据进行遍历
      menu.forEach((item) => {
        // 若有子菜单
        if (item.children) {
          item.children = item.children.map((item) => {
            item.component = () => import(`@/views/${item.url}`);
            return item;
          });
          menuArray.push(...item.children);
        } else {
          // 若没有子菜单
          item.component = () => import(`@/views/${item.url}`);
          menuArray.push(item);
        }
      });
      // console.log(menuArray);
      //路由的动态添加
      menuArray.forEach((item) => {
        router.addRoute("Main", item);
      });
    },
  },
};
