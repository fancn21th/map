<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import * as echarts from "echarts";
import { shallowRef, onMounted, onBeforeMount } from "vue";
import json from "./assets/geoJson";
import { calcBoundingCoords } from "./utils/calc";
import merge from "lodash/mergeWith";
import bgImg from "./assets/bg.png";

// const designWidth = 800;
// const designHeight = 800;
// const designWidthPx = `1400px`;
// const designHeightPx = `1200px`;

onBeforeMount(() => {
  // document.documentElement.style.setProperty("--design-width", designWidthPx);
  // document.documentElement.style.setProperty("--design-height", designHeightPx);
});

echarts.registerMap("china", json.china);
echarts.registerMap("hubei", json.hubei);
echarts.registerMap("wuhan", json.wuhan);

// 辅助数据
const chinaBoundingCoordsMap = json.china.features.reduce((acc, feature) => {
  return {
    ...acc,
    [feature.properties.name]: {
      boundingCoords: calcBoundingCoords(feature),
    },
  };
}, {});

const hubeiBoundingCoordsMap = json.hubei.features.reduce((acc, feature) => {
  return {
    ...acc,
    [feature.properties.name]: {
      boundingCoords: calcBoundingCoords(feature),
    },
  };
}, {});

// 坐标的字典
const coordsMap = merge(chinaBoundingCoordsMap, hubeiBoundingCoordsMap);

const chartRef = shallowRef(null);

// echarts 实例
let chart = null;

const debug = (stage) => {
  console.log(stage, "chart.getOption()", chart.getOption());
};

// 渲染图表
const renderChart = async () => {
  chart = echarts.init(chartRef.value);

  const option = {
    grid: {
      show: true,
    },
    geo: [
      {
        id: "L1",
        zlevel: 1,
        roam: true,
        map: "china",
        label: {
          normal: {
            show: true,
          },
        },
        boundingCoords: coordsMap["湖北省"].boundingCoords,
        itemStyle: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      {
        id: "L2",
        zlevel: 2,
        roam: true,
        map: "hubei",
        label: {
          normal: {
            show: true,
          },
        },
        boundingCoords: coordsMap["湖北省"].boundingCoords,
        itemStyle: {
          color: {
            image: bgImg,
            repeat: "no-repeat",
          },
          borderWidth: 3,
          borderColor: "#fff",
          opacity: 0.5,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
          shadowOffsetX: 15,
          shadowOffsetY: 15,
        },
      },
      {
        id: "L3",
        zlevel: 3,
        show: false,
        roam: true,
        map: "wuhan",
        label: {
          normal: {
            show: true,
          },
        },
        boundingCoords: coordsMap["湖北省"].boundingCoords,
        itemStyle: {
          borderWidth: 3,
          borderColor: "#fff",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          color: {
            image: bgImg,
            repeat: "no-repeat",
          },
        },
      },
    ],
  };

  // 移动事件
  chart.on("georoam", function (params) {
    console.log("georoam", params);
    debug("拖动事件");
  });

  // 点击事件
  chart.on("click", function (params) {
    console.log("click", params);

    chart.setOption({
      geo: chart.getOption().geo.map((item) => ({
        ...item,
        zoom: 2,
      })),
    });

    debug("点击事件");
  });

  chart.setOption(option);

  debug("初始化完成");
};

onMounted(() => {
  renderChart();
});
</script>

<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  /* width: var(--design-width);
  height: var(--design-height); */
}
</style>
./hubei ./assets/geoJson