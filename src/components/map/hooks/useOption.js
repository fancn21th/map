import { ref } from "vue";
import { resolveNextOption } from "../utils";

// // 底层地图配置
// const getLevel1Option = (coordsMap) => {
//   return {
//     id: "L1",
//     zlevel: 1,
//     roam: true,
//     map: "china",
//     label: {
//       normal: {
//         show: true,
//       },
//     },
//     boundingCoords: coordsMap["湖北省"].boundingCoords,
//     itemStyle: {
//       color: "rgba(0, 0, 0, 0.1)",
//     },
//   };
// };

// // 中层地图配置
// const getLevel2Option = (coordsMap) => {
//   return {
//     id: "L2",
//     zlevel: 2,
//     roam: true,
//     map: "hubei",
//     label: {
//       normal: {
//         show: true,
//       },
//     },
//     boundingCoords: coordsMap["湖北省"].boundingCoords,
//     itemStyle: {
//       color: {
//         image: bgImg,
//         repeat: "no-repeat",
//       },
//       borderWidth: 3,
//       borderColor: "#fff",
//       opacity: 0.5,
//       shadowColor: "rgba(0, 0, 0, 0.5)",
//       shadowBlur: 10,
//       shadowOffsetX: 15,
//       shadowOffsetY: 15,
//     },
//   };
// };

// // 顶层地图配置
// const getLevel3Option = (coordsMap) => {
//   return {
//     id: "L3",
//     zlevel: 3,
//     roam: true,
//     map: "wuhan",
//     label: {
//       normal: {
//         show: true,
//       },
//     },
//     boundingCoords: coordsMap["湖北省"].boundingCoords,
//     itemStyle: {
//       borderWidth: 3,
//       borderColor: "#fff",
//       shadowColor: "rgba(0, 0, 0, 0.5)",
//       shadowBlur: 10,
//       shadowOffsetX: 5,
//       shadowOffsetY: 5,
//       color: {
//         image: bgImg,
//         repeat: "no-repeat",
//       },
//     },
//   };
// };

export const useOption = ({ coordsMap = {} }) => {
  const option = ref(null);

  return {
    option,
    updateOption: (action) => {
      const nextOption = resolveNextOption({
        ...action,
        coordsMap,
      });

      console.log("nextOption", nextOption);

      option.value = nextOption;
    },
    goUp: () => {},
    goDown: () => {},
  };
};
