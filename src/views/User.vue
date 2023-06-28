<template>
  <div class="manage">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 新增用户的表单信息 -->
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input
            v-model.number="form.age"
            placeholder="请输入年龄"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框的确定与取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增按钮 -->
    <div class="manage-header">
      <el-button type="primary" @click="handleAdd">+新增</el-button>
      <!-- form搜索区 -->
      <el-form inline :model="userForm">
        <el-form-item>
          <el-input v-model="userForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="common-table">
      <!-- 用户信息表格 -->
      <el-table :data="tableData" style="width: 100%" height="90%" stripe>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="age" label="年龄"> </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.sex == 1 ? "男" : "女"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="birth" label="出生日期"> </el-table-column>
        <el-table-column prop="addr" label="地址"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <!-- 分页栏 -->
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, addUser, editUser, delUser } from "../api";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: "",
        age: "",
        sex: "",
        birth: "",
        addr: "",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birth: [{ required: true, message: "请选择出生日期", trigger: "blur" }],
        addr: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      tableData: [],
      modalType: 0, // 0 新增  1 编辑
      total: 0, // 总条数
      pageData: {
        //分页参数
        page: 1,
        limit: 20,
      },
      userForm: {
        name: "",
      },
    };
  },
  methods: {
    // 提交表单的回调
    submit() {
      // 1. 表单校验
      this.$refs.form.validate((valid) => {
        //    当valid为true时，说明校验通过
        if (valid) {
          // 对表单数据处理
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

          // 关闭弹窗前，重置表单
          this.$refs.form.resetFields();
          //关闭弹窗
          this.dialogVisible = false;
        }
      });
    },
    // 关闭弹窗的回调
    handleClose() {
      // 重置表单
      this.$refs.form.resetFields();
      // 关闭弹窗
      this.dialogVisible = false;
    },
    // 取消按钮的回调
    cancle() {
      // 重置表单
      this.$refs.form.resetFields();
      // 关闭弹窗
      this.dialogVisible = false;
    },
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
    // 删除按钮的回调
    handleDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除
          delUser({ id: row.id }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 重新获取用户列表
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 新增按钮的回调
    handleAdd() {
      this.dialogVisible = true;
      this.modalType = 0;
    },

    // 分页栏的回调
    handlePage(val) {
      this.pageData.page = val;
      this.getUserList();
    },

    // 搜索按钮的回调
    onSubmit() {
      this.getUserList();
    },

    // 封装获取用户列表的方法
    getUserList() {
      getUser({ params: { ...this.userForm, ...this.pageData } }).then(
        (res) => {
          // console.log(res);
          this.tableData = res.data.list;
          this.total = res.data.count || 0;
        }
      );
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.manage {
  height: 90%;
  .manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form {
      display: flex;
      width: 300px;
      align-items: center;
      .el-form-item {
        display: flex;
        margin-right: 20px;
      }
    }
  }
  .common-table {
    position: relative;
    height: calc(100% - 62px);
    .pager {
      position: absolute;
      bottom: 0;
      right: 20px;
    }
  }
}
</style>
