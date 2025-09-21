<script lang="ts" setup>
import { ref } from 'vue'
import Header from '@/components/layouts/header/index.vue'
import Map from '@/components/map/index.vue'
import Footer from '@/components/layouts/footer/index.vue'
// import { homeConf } from '@/config/home.config.ts'


import { homeConf } from '@/config/home.config.js'
// / 定义传递给 Header 组件的属性
const menu = ref([]) // 根据实际类型调整
const title = ref( homeConf.title ) // 根据实际类型调整
const isShowTop = ref(true) // 根据实际类型调整
const simulatingTime = ref('') // 根据实际类型调整


</script>

<template>
    <Header :menu="menu" :title="title" :isShowTop="isShowTop" :simulatingTime="simulatingTime">
    <div class="scaleBtn_Header" style="cursor: default" v-scaleBar>
        <i class="iconfont icon-down"></i>
      </div>
    </Header>

    <Map />

    <Footer />
</template>

<style scoped>
.scaleBtn_Header {
  width: 50px;
  height: 20px;
  background: url("../../assets/image/sourcebg.png");
  background-size: 100% 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  position: absolute;
  left: 50%;
  top: 70px;
  transform: translateX(-50%);
  color: #fff;
}
</style>