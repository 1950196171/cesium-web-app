<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useCesium } from './uesCesium'
// import { TileMapServiceImageryProvider } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { addArcGisMapImageryLayers } from '../../config/mapLayer.config'
window.CESIUM_BASE_URL = 'node_modules/cesium/Build/Cesium/'


const { containerRef, mount, unmount } = useCesium()



onMounted( async () => {

  try {

    mount()
    // 加载ArcGis
    const esri = await addArcGisMapImageryLayers()
    const cesiumInstance = useCesium().getInstance()

    if (cesiumInstance) {
      cesiumInstance.viewer.imageryLayers.addImageryProvider(esri)
    }

  } catch (error) {
    console.error(error)
  }

})

onUnmounted(() => {
    unmount()
})

</script>

<template>
  <div id="cesium-viewer" ref="containerRef"></div>
</template>

<style scoped>
#cesium-viewer {
  width: 100%;
  height: 100%;
}
</style>