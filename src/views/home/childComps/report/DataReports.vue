<template>
  <div class="report">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1. 导入 echarts
import echarts from "echarts";

import { getReports } from "network/report";

export default {
  name: "DataReports",
  data() {
    return {
      option: null,
      mergingOption: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      },
      myChart: null
    };
  },
  methods: {
    mergingObject(source, target) {
      for (const [key, value] of Object.entries(target)) {
        if (Array.isArray(source[key])) {
          source[key].includes(value) || source[key].push(value);
        } else source[key] = value;
      }
    }
  },
  async created() {
    let { data, meta } = await getReports();
    if (meta.status !== 200) return this.$message.error(meta.msg);
    this.option = data;
    this.mergingObject(this.option, this.mergingOption);
  },
  watch: {
    option: {
      handler(value) {
        this.option && this.myChart.setOption(value);
      }
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
    this.option && this.myChart.setOption(this.option);
  }
};
</script>

<style>
</style>