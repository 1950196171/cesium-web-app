<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useCesium } from './uesCesium'
import { TileMapServiceImageryProvider } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

window.CESIUM_BASE_URL = 'node_modules/cesium/Build/Cesium/'


const { containerRef, mount, unmount } = useCesium()



onMounted( async () => {

  try {

    mount()

    const imageryProvider = await TileMapServiceImageryProvider.fromUrl(
      'node_modules/cesium/Build/cesium/Assets/Textures/NaturalEarthII'
    )

    const cesiumInstance = useCesium().getInstance()

    if (cesiumInstance) {
      cesiumInstance.viewer.imageryLayers.addImageryProvider(imageryProvider)
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