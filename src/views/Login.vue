<template>
  <div>
    <el-form
      label-width="70px"
      :model="form"
      :rules="rules"
      class="login_container"
      inline
      ref="form"
    >
      <h3 class="login_title">系统登陆</h3>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit" style="margin-left: 122px" type="primary"
          >登陆</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Mock from "mockjs";
import Cookie from "js-cookie";
import { getMenu } from "@/api";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 登陆的回调
    submit() {
      // 确定表单校验通过
      this.$refs.form.validate((valid) => {
        if (valid) {
          getMenu(this.form).then((res) => {
            console.log(res);
            if (res.data.code == 20000) {
              // 保存token到cookie
              Cookie.set("token", res.data.data.token);
                // 获取菜单的数据存入store中
                // res.data.data.menu
                this.$store.commit("setMenu", res.data.data.menu);
                // 传递动态路由（路由实例）
                this.$store.commit("addMenu", this.$router);
















              //   跳转到首页
              this.$router.push("/");
            } else {
              this.$message.error(res.data.data.message);
            }
          });
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.login_container {
  width: 350px;
  margin: 180px auto;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 0 25px #cac6c6;
  box-sizing: border-box;
  .login_title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .el-input {
    width: 198px;
  }
}
</style>
