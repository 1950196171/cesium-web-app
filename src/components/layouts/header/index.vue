<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { type MenuItem, type Props } from './index.ts'

const props = withDefaults(defineProps<Props>(), {
    menu: () => [],
    title: '',
    isShowTop: true,
    simulatingTime: ''
})

const isShow = ref(false)

const subTitle = ref('')

// 时间相关数据
const combatDateTime = ref({
  date: '',
  time: ''
})

const astronomicalDateTime = ref({
  date: '',
  time: ''
})

const simulateDateTime = ref({
  date: '',
  time: ''
})

const route = useRoute()

// 计算属性优化标题显示
const displayTitle = computed(() => {
  if (props.menu && props.menu.length > 0) {
    const currentItem = props.menu.find((item: MenuItem) => item.route === route.path)
    return currentItem?.title ?? ''
  }
  return ''
})

const show = () => {
  isShow.value = true
}

const hide = () => {
  isShow.value = false
}

const formatNumber = (num: number): string => {
  return num < 10 ? '0' + num : num.toString()
}

// 获取系统时间
let timeInterval: number | null = null
let simulateInterval: number | null = null

const updateSystemTime = () => { 
    const now = new Date()
    const year = now.getFullYear()
    const month = formatNumber(now.getMonth() + 1)
    const day = formatNumber(now.getDate())
    const hours = formatNumber(now.getHours())
    const minutes = formatNumber(now.getMinutes())
    const seconds = formatNumber(now.getSeconds())
    
    const dateStr = `${year}-${month}-${day}`
    const timeStr = `${hours}:${minutes}:${seconds}`
    
    combatDateTime.value = { date: dateStr, time: timeStr }
    astronomicalDateTime.value = { date: dateStr, time: timeStr }
}

const updateSimulateTime = () => {
  if (window.viewer?.animation?.viewModel) {
    let dateLabel = window.viewer.animation.viewModel.dateLabel
    dateLabel = dateLabel.replace("年","-").replace("月","-").replace("日","")
    simulateDateTime.value = {
      date: dateLabel,
      time: window.viewer.animation.viewModel.timeLabel
    }
  }
}

// 初始化时间更新
const initTimeUpdate = () => {
  // 立即执行一次
  updateSystemTime()
  
  // 设置系统时间更新定时器
  timeInterval = setInterval(() => {
    updateSystemTime()
  }, 1000)

  // 如果需要模拟时间，设置模拟时间更新定时器
  if (props.simulatingTime) {
    // 立即执行一次
    updateSimulateTime()
    
    simulateInterval = setInterval(() => {
      updateSimulateTime()
    }, 50)
  }
}


// 监听模拟时间属性变化
watch(() => props.simulatingTime, (newVal) => {
  if (newVal) {
    updateSimulateTime()
    if (simulateInterval) clearInterval(simulateInterval)
    simulateInterval = setInterval(() => {
      updateSimulateTime()
    }, 50)
  } else if (simulateInterval) {
    clearInterval(simulateInterval)
    simulateInterval = null
  }
})


// 组件挂载时初始化
onMounted(() => {
  initTimeUpdate()
})

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
  if (simulateInterval) {
    clearInterval(simulateInterval)
    simulateInterval = null
  }
})
</script>

<template>
  <div class="header up" :style="{ top: props.isShowTop ? '0px' : '-70px' }">
    <slot name="nav">
      <div class="menu" @mouseenter="show" @mouseleave="hide">
        <ul class="menu-content" v-show="isShow" @mouseenter="show" @mouseleave="hide">
          <li v-for="(item, index) in props.menu" :key="index">
            <div class="top">
              <a :href="item.route" target="_blank">
                <!-- <img src="@image/setting.png" alt="setting" /> -->
                <span>{{ item.name }}</span>
                <i class="el-icon-d-arrow-left arrow-down" v-cloak></i>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </slot>
    
    <slot name="title">
      <div class="sub-title">{{ displayTitle }}</div>
    </slot>
    
    <slot name="title">
      <div class="title" v-cloak>
        <div class="sysTime" v-if="!props.simulatingTime">
          <div class="date">
            <p>实际时间</p>
            <span>{{ combatDateTime.date }}</span>
          </div>
          <div class="time">{{ combatDateTime.time }}</div>
        </div>
        
        <div class="sysTime" v-if="props.simulatingTime">
          <div class="date">
            <p>场景时间</p>
            <span>{{ simulateDateTime.date }}</span>
          </div>
          <div class="time">{{ simulateDateTime.time }}</div>
        </div>
        
        <!-- <img src="@image/logo.png" alt="logo" /> -->
        
        <div class="sysTitle">
          <div class="appName">{{ props.title }}</div>
        </div>
        
        <div class="sysTime">
          <div class="date">
            <p>天文时间</p>
            <span>{{ astronomicalDateTime.date }}</span>
          </div>
          <div class="time">{{ astronomicalDateTime.time }}</div>
        </div>
      </div>
    </slot>
    
    <slot></slot>
  </div>
</template>

<style scoped>
.header {
  position: absolute;
  display: flex;
  top: -70px;
  width: 100%;
  height: 70px;
  background: url("../../../assets/image/header-bg.png") top center no-repeat;
  color: white;
  justify-content: space-between;
  z-index: 1100;
  transition: top 0.3s ease-in-out;
}

.header .menu {
  width: 42px;
  height: 42px;
  background-image: url("../../../assets/image/menu.png");
  cursor: pointer;
  background-size: contain;
}

.header .menu:hover {
  background-image: url("../../../assets/image/menu-over.png");
}

.header .menu-content {
  width: 260px;
  background-color: #1d1d1d;
  padding: 4px;
  position: relative;
  margin-top: 42px;
  z-index: 1100;
  border-radius: 4px;
}

.header .menu-content li {
  position: relative;
  width: 100%;
  color: #999;
  font-size: 18px;
}

.header .menu-content li .top {
  height: 56px;
  line-height: 56px;
  display: flex;
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  align-items: center;
  padding: 0 15px;
}

.header .menu-content li .top a {
  color: #999;
  margin-left: 15px;
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
}

.header .menu-content li .top span {
  margin-left: 15px;
  flex: 1;
}

.header .menu-content li .top img {
  width: 20px;
  height: 20px;
}

.header .menu-content li .top i {
  position: absolute;
  top: 40px;
  right: 5px;
}

.header .menu-content li:hover {
  background-color: rgba(62, 189, 221, 0.5);
}

.header .sub-title {
  position: absolute;
  left: 52px;
  font-size: 20px;
  font-weight: bold;
  height: 42px;
  line-height: 42px;
}

.header .title {
  width: 800px;
  height: 55px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translate(-50%);
}

.header .title img {
  height: 60px;
  width: 60px;
  margin-top: 6px;
}

.header .title .sysTitle {
  height: 52px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 52px;
}

.header .title .appName {
  font-size: 30px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  padding-bottom: 1px;
}

.header .title .sysTime {
  width: 165px;
  height: 52px;
  background-image: url("../../../assets/image/time.png");
  text-align: center;
  margin-top: 8px;
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header .title .sysTime p {
  display: inline-block;
  width: 50px;
  height: 14px;
  line-height: 14px;
  background-color: #ff6326;
  color: black;
  font-family: "YaHei", sans-serif;
  font-size: 11px;
  margin: 0 auto 2px;
  border-radius: 2px;
}

.header .title .sysTime .date {
  font-family: "timeFont", monospace;
  font-size: 16px;
  color: #2691be;
  width: 145px;
  height: 14px;
  line-height: 14px;
  margin: 3px 10px -3px;
}

.header .title .sysTime .date span {
  padding: 0 3px;
  font-family: "timeFont", monospace;
}

.header .title .sysTime .time {
  font-family: "timeFont", monospace;
  font-size: 35px;
  width: 146px;
  height: 38px;
  line-height: 38px;
  color: #66badf;
  margin: 0 10px;
  text-align: center;
}

.arrow-up {
  transform: rotate(90deg);
}

.arrow-down {
  transform: rotate(-90deg);
}

@media (max-width: 1200px) {
  .header .title {
    width: 600px !important;
  }
  
  .header .title .appName {
    font-size: 24px !important;
  }
  
  .header .title .sysTime {
    width: 140px !important;
  }
  
  .header .title .sysTime .time {
    font-size: 28px !important;
  }
}
</style>