# back-of-management（后台管理系统）

##### 技术栈：Vue2+ElementUI+vuex+Vue-router+ECharts
1. 项目搭建，使用element实现首页布局
2. 顶部导航菜单与左侧联动的面包屑的实现
3. 封装一个echarts组件
4. 封装一个from表单和table表格
5. 登陆权限的管理

##### element的使用

```vue
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

##### 面包屑的实现

面包屑是在head部分组件里,Tag标签虽然不再head部分组件里,但是它在整个管理后台系统中是会一直存在的，所以需要在Main.vue中。

这两块功能的实现,主要依赖Element-ui两个样式 Breadcrumb 面包屑 + Tag 标签

整个大致逻辑是这样的,首先是面包屑 首页 一定要存在的,接下来 侧边组件 点击某菜单,把这个数据存到vuex中，然后 头部组件 来获取vuex中这个数据并展示。

##### echarts的基本使用

```html
<body>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div id="main" style="width: 600px;height:400px;"></div>
</body>
```

生成echarts实例

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>ECharts</title>
    <!-- 引入刚刚下载的 ECharts 文件 -->
    <script src="echarts.js"></script>
  </head>
  <body>
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
    <script type="text/javascript">
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    </script>
  </body>
</html>
```

##### form表单的封装

由于新增和编辑的表单其实内容是一致的，点击新增按钮并确定后调用新增接口，点击编辑时表单会回显个人信息，且确定后调用编辑（更新）接口，那么我们可以想到这个表单是否可以复用？

我们应该添加一个状态来区分用户点击的是新增还是编辑

```js
      modalType: 0, // 0 新增  1 编辑
```

```js
if (this.modalType == 0) {
            addUser(this.form).then((res) => {
              // 重新获取用户列表
              this.getUserList();
            });
          } else {
            // 编辑
            editUser(this.form).then((res) => {
              // 重新获取用户列表
              this.getUserList();
            });
          }
```

```js
    // 新增按钮的回调
    handleAdd() {
      this.dialogVisible = true;
      this.modalType = 0;
    },
```

```js
// 编辑按钮的回调
    handleEdit(row) {
      // 1. 将表单数据回显
      //   this.form = { ...row };
      //   将表单进行深拷贝
      this.form = JSON.parse(JSON.stringify(row));

      // 2. 打开弹窗
      this.dialogVisible = true;
      // 3. 将modalType设置为1
      this.modalType = 1;
    },
```



##### 登陆权限的管理

我们给系统添加一个登录凭证叫"token"，这个token在登录的时候通过接口请求将用户名和密码传给后端，后端再数据库中匹配成功后返回一个凭证，前端将token缓存起来，再调用接口时传给后端验证就建立了登录权限校验
