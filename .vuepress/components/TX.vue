<template>
  <span class="tx-text" :style="{ color: finalColor }">
    <slot>{{ text || '彩色文本' }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'TX'
})

const props = defineProps<{
  text?: string
  color?: string
  family?: string
}>()

// 全部颜色列表
const colors = [
  '#1456f0', '#e03c3c', '#00a870', '#722ed1', '#13c2c2', '#eb2f96', '#2f54eb', '#0050b3',
  '#a8071a', '#391085', '#00474f', '#092b00', '#c41d7f', '#d4380d', '#08979c', '#d46b08',
  '#531dab', '#096dd9', '#237804', '#ad2102', '#003a8c', '#5b8c00', '#006d75', '#9e1068',
  '#002329', '#061178', '#22075e', '#120338', '#52c41a', '#f5222d', '#fa541c', '#fa8c16',
  '#a0d911', '#1890ff', '#003366', '#330066', '#660033', '#663300', '#006633', '#336600',
  '#1d39c4', '#5910ad', '#b37feb', '#ff7875', '#ff9c6e', '#ffc069', '#add8e6', '#87cefa',
  '#00bfff', '#1e90ff', '#6495ed', '#4169e1', '#00008b', '#0000cd', '#0000ff', '#483d8b',
  '#6a5acd', '#7b68ee', '#8B4513', '#2F4F4F', '#556B2F', '#8B008B', '#B8860B', '#CD853F',
  '#D2691E', '#9ACD32', '#20B2AA', '#4682B4', '#5F9EA0', '#C71585'
]

// 颜色系列映射
const familyColors: Record<string, string[]> = {
  green: ['#00a870', '#237804', '#52c41a', '#006633', '#336600', '#092b00', '#5b8c00', '#9ACD32'],
  red: ['#e03c3c', '#a8071a', '#f5222d', '#ff7875', '#c41d7f', '#eb2f96', '#ff9c6e'],
  blue: ['#1456f0', '#1890ff', '#096dd9', '#003a8c', '#1d39c4', '#2f54eb', '#4169e1', '#6495ed', '#1e90ff', '#00bfff', '#87cefa', '#add8e6', '#0000ff', '#0000cd', '#00008b', '#483d8b', '#6a5acd', '#7b68ee'],
  purple: ['#722ed1', '#391085', '#531dab', '#22075e', '#120338', '#5910ad', '#b37feb', '#C71585', '#8B008B', '#9e1068', '#c41d7f'],
  yellow: ['#d46b08', '#fa8c16', '#ffc069', '#fa541c', '#d4380d', '#ad2102', '#ff9c6e'],
  orange: ['#fa541c', '#d4380d', '#ad2102', '#ff9c6e', '#ff7875'],
  cyan: ['#13c2c2', '#08979c', '#00474f', '#006d75', '#20B2AA', '#5F9EA0', '#4682B4', '#002329'],
  pink: ['#eb2f96', '#c41d7f', '#ff7875', '#ff9c6e', '#C71585', '#9e1068'],
  brown: ['#8B4513', '#CD853F', '#D2691E', '#B8860B']
}

// 最终颜色计算
const finalColor = computed(() => {
  if (props.color) return props.color
  if (props.family && familyColors[props.family]) {
    const arr = familyColors[props.family]
    return arr[Math.floor(Math.random() * arr.length)]
  }
  return colors[Math.floor(Math.random() * colors.length)]
})
</script>

<style scoped>
.tx-text {
  /* 可自定义基础样式，如字体粗细、大小等 */
}
</style>
