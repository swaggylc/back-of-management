<template>
  <el-row>
    <el-col :span="8" style="padding-right: 10px"
      ><el-card class="box-card">
        <div class="user">
          <img src="../assets//images//user.jpg" alt="" />
          <div class="user-info">
            <p class="name">LuCan</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>
            上次登录时间：<span>{{ loginTime }}</span>
          </p>
          <p>
            上次登录地点：<span>{{ randomName }}</span>
          </p>
        </div>
      </el-card>
      <!-- 左下方表格 -->
      <el-card style="margin-top: 20px; height: 460px">
        <el-table :data="tableData" style="width: 100%">
          <!-- 对象遍历 -->
          <el-table-column
            v-for="(val, key) in tableLable"
            :prop="key"
            :label="val"
          >
          </el-table-column>
          <!-- <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column> -->
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="padding-left: 10px">
      <div class="num">
        <!-- 右侧卡片数据区 -->
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: '0px' }"
        >
          <i
            class="icon"
            :class="`el-icon-${item.icon}`"
            :style="{ background: item.color }"
          >
          </i>
          <div class="num-info">
            <p class="name">{{ item.name }}</p>
            <p class="count" :style="{ color: item.color }">
              {{ item.value }}
            </p>
          </div>
        </el-card>
      </div>
      <el-card style="height: 280px">
        <!-- 右侧折线图 -->
        <div ref="echarts1" style="height: 280px; width: 100%"></div>
      </el-card>
      <div class="graph">
        <el-card style="height: 260px">
          <div ref="echarts2" style="height: 280px; width: 100%"></div>
        </el-card>
        <el-card style="height: 260px">
          <div ref="echarts3" style="height: 240px; width: 100%"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { randomCityName } from "random-china-city-name";
import { getData } from "@/api";
import * as echarts from "echarts";

export default {
  data() {
    return {
      // 生成登陆时间
      loginTime: new Date().toLocaleString(),
      // 生成登陆地点
      randomName: randomCityName(),
      // 表格数据
      tableData: [],
      // 遍历表头字段
      tableLable: {
        name: "品牌",
        todayBuy: "今日销售额",
        monthBuy: "月销售额",
        totalBuy: "总销售额",
      },
      // 数字卡片数据
      countData: [
        {
          name: "今日支付订单",
          value: 1234,
          icon: "success",
          color: "#67C23A",
        },
        {
          name: "今日收藏数",
          value: 1234,
          icon: "success",
          color: "#E6A23C",
        },
        {
          name: "今日新增用户",
          value: 1234,
          icon: "success",
          color: "#F56C6C",
        },
        {
          name: "今日下单用户",
          value: 1234,
          icon: "success",
          color: "#409EFF",
        },
        {
          name: "今日上新数量",
          value: 1234,
          icon: "success",
          color: "#909399",
        },
        {
          name: "今日已发货订单",
          value: 1234,
          icon: "success",
          color: "#303133",
        },
      ],
    };
  },
  mounted() {
    getData().then((res) => {
      const { tableData } = res.data.data;
      console.log("总数据", res);
      this.tableData = tableData;

      // 基于准备好的dom，初始化echarts实例
      // 折线图
      const echarts1 = echarts.init(this.$refs.echarts1);
      // 正在加载中
      echarts1.showLoading();
      // 指定图表的配置项和数据
      var echarts1Option = {};
      // 处理数据 xAxis(x轴)
      const { orderData, userData, videoData } = res.data.data;
      console.log("图表数据", res.data.data);
      const xAxis = Object.keys(orderData.data[0]);
      // console.log(xAxis);
      const xAxisData = {
        data: xAxis,
      };
      echarts1Option.xAxis = xAxisData;
      echarts1Option.yAxis = {};
      echarts1Option.legend = xAxisData;
      // 处理数据 series(数据)
      echarts1Option.series = [];
      xAxis.forEach((key) => {
        echarts1Option.series.push({
          name: key,
          data: orderData.data.map((item) => item[key]),
          type: "line",
        });
      });
      echarts1Option.tooltip = {
        trigger: "axis",
      };
      // 关闭加载中提示
      echarts1.hideLoading();
      // 根据配置项和数据显示图表
      echarts1.setOption(echarts1Option);

      // 柱状图
      const echarts2 = echarts.init(this.$refs.echarts2);
      // 正在加载中
      echarts2.showLoading();
      // 指定图表的配置项和数据
      const echarts2Option = {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: "#333",
          },
        },
        grid: {
          left: "20%",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category", // 类目轴
          data: userData.map((item) => item.date),
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#333",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          },
        ],
        color: ["#2ec7c9", "#b6a2de"],
        series: [
          {
            name: "新增用户",
            data: userData.map((item) => item.new),
            type: "bar",
          },
          {
            name: "活跃用户",
            data: userData.map((item) => item.active),
            type: "bar",
          },
        ],
      };
      // 关闭加载中提示
      echarts2.hideLoading();
      // 根据配置项和数据显示图表
      echarts2.setOption(echarts2Option);

      // 饼图
      const echarts3 = echarts.init(this.$refs.echarts3);
      // 正在加载中
      echarts3.showLoading();
      // 指定图表的配置项和数据
      const echarts3Option = {
        tooltip: {
          trigger: "item",
        },
        color: [
          "#0f78f4",
          "#dd536b",
          "#9462e5",
          "#a6a6a6",
          "#e1bb22",
          "#39c362",
          "#3ed1cf",
        ],
        series: [
          {
            data: videoData,
            type: "pie",
          },
        ],
      };
      // 关闭加载中提示
      echarts3.hideLoading();
      // 根据配置项和数据显示图表
      echarts3.setOption(echarts3Option);
    });
  },
};
</script>

<style lang="less" scoped>
.user {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }
  .user-info {
    .name {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .access {
      font-size: 16px;
    }
  }
}
.login-info {
  margin-top: 10px;
  p {
    line-height: 28px;
    font-size: 16px;
    margin-bottom: 10px;
    span {
      font-weight: bold;
      margin-left: 40px;
    }
  }
}
.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    line-height: 80px;
    text-align: center;
    color: #fff;
  }
  .num-info {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    justify-content: center;

    .name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .count {
      font-size: 16px;
    }
  }
  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
}
.graph {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .el-card {
    width: 48%;
  }
}
</style>
