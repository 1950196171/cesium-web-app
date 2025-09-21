<template>
  <div id="footer">
        <div style="display:flex;">
            <div class="data_update_time" style="margin-left:20px;">
            <span>数据更新时间：</span>
            <span class="time" style="margin-left: 5px;">{{ dataUpdateTime }}</span>
            </div>
            <div class="show-lon-lat-tip">
            <span>经度：</span>
            <span class="label">{{ longitude }}</span>
            <span>纬度：</span>
            <span class="label">{{ latitude }}</span>
            </div>
        </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useCesium } from "@/components/map/uesCesium";
// import * as Cesium from "cesium";

const { getEventMoudels } = useCesium();


const dataUpdateTime = ref("");

const longitude = ref("");

const latitude = ref("");

onMounted(() => {
  // 设置鼠标移动 右下角底部 显示经纬度
  setMouseMove();
});


const setMouseMove = () => {
    const eventModules = getEventMoudels();

    if (eventModules) {

      eventModules.event.onMouseMoveEvent( (movement) => {

        const position = eventModules.sceneInteraction.screenToCartesian(movement.endPosition)

        if (position) {

          const cartographic = eventModules.sceneInteraction.cartesianToGeographic(position)
          longitude.value = String(cartographic!.longitude)
          latitude.value = String(cartographic!.latitude)

        }
      })
    }
}

</script>

<style scoped>
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-image: url("../../../assets/image/footer.png");
  z-index: 1000;
  color: white;
  font-size: 14px;
}

.show-lon-lat-tip {
  width: 400px;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  align-content: center;
  position: absolute;
  right: 210px;
}
</style>