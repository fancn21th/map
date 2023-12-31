<!-- eslint-disable no-unused-vars vue/multi-word-component-names -->
<script setup>
// 地图上的 图表数据
const props = defineProps({
  option: {
    type: Object,
    default: null,
  },
});

import * as echarts from 'echarts';
// 可以根据需要选用只用到的渲染器
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
import gasp from 'gsap';
import { shallowRef, onMounted, watch, unref, defineProps } from 'vue';
import { registerMap, getCoordsMap } from './assets/geoJson';
import { useOption } from './hooks/useOption';

echarts.use([SVGRenderer, CanvasRenderer]);
// 注册地图
registerMap(echarts);

// chart 实例
let chart = null;
// chart ref
const chartRef = shallowRef(null);
// 坐标元数据
const coordsMap = getCoordsMap();
// hook
const { option, updateOption, goUp, goMultiple, lastName } = useOption({
  coordsMap,
});

// 地图动画
const startAnimation = (last, next) => {
  const lastBoundingCoords = coordsMap[last]?.boundingCoords;
  const nextBoundingCoords = coordsMap[next]?.boundingCoords;

  console.log({
    lastBoundingCoords,
    nextBoundingCoords,
  });

  const origin = {
    x1: lastBoundingCoords[0][0],
    y1: lastBoundingCoords[0][1],
    x2: lastBoundingCoords[1][0],
    y2: lastBoundingCoords[1][1],
  };

  gasp.to(origin, {
    duration: 2.5,
    // repeat: -1,
    // yoyo: true,
    ease: 'power1.out',
    x1: nextBoundingCoords[0][0],
    y1: nextBoundingCoords[0][1],
    x2: nextBoundingCoords[1][0],
    y2: nextBoundingCoords[1][1],
    onUpdate: () => {
      const dx = Math.abs(origin.x1 - nextBoundingCoords[0][0]);

      updateOption({
        ...(dx < 0.1 ? { name: next } : {}),
        boundingCoords: [
          [origin.x1, origin.y1],
          [origin.x2, origin.y2],
        ],
      });
    },
  });
};

// 统一调用 updateOption
const call_updateOption = (params) => {
  const last = lastName.value;
  const next = params?.name || '';

  if (last && last !== next) {
    startAnimation(last, next);
    return;
  }

  updateOption(params);
};

// 监听数据变化
watch(
  () => props.option,
  (option) => {
    const { data } = option || {};

    const unrefData = unref(data);

    call_updateOption({
      option: {
        ...option,
        data: unrefData,
      },
    });
  },
  {
    immediate: true,
    // TODO: 深度监听是否合理??
    deep: true,
  },
);

// 监听 echarts option 变化
watch(
  option,
  () => {
    if (option?.value) {
      // TODO: 更新策略
      // https://echarts.apache.org/zh/api.html#echartsInstance.setOption
      setTimeout(() => {
        chart.setOption(option.value, true);
      }, 0);
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

const drillDown = (params) => {
  // console.log('地图调试数据', '点击下钻', params);

  // 更新 echarts 地图的 option
  call_updateOption({
    name: params.name || '湖北省',
  });
};

onMounted(() => {
  chart = echarts.init(chartRef.value, null, { renderer: 'canvas' });
  // chart = echarts.init(chartRef.value, null, { renderer: 'svg' });

  // 移动事件
  // chart.on("georoam", function (params) {
  //   console.log('地图调试数据', "georoam", params);
  // });

  // 点击事件
  chart.on('click', function (params) {
    drillDown(params);
  });

  call_updateOption({
    name: '湖北省',
  });
});
</script>

<template>
  <div class="wrapper">
    <div class="chart-container" ref="chartRef"></div>
    <div class="background"></div>
  </div>
  <div class="control">
    <button @click="goUp">Up</button>
    <button @click="goMultiple">混合</button>
  </div>
</template>

<style scoped>
.wrapper,
.chart-container,
.background {
  width: 100%;
  height: 100%;
}

.wrapper {
  position: relative;
}

.background {
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url('./assets/bg.png');
  background-size: cover;
  opacity: 0.5;
}

.control {
  width: 200px;
  height: 200px;
  position: absolute;
  z-index: 999;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #efefef;
}
</style>
