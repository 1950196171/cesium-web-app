import * as Cesium from "cesium";
import { type CesiumInstance } from "../cesiumFactory";

export const useCesiumCamera = (cesiumInstance: CesiumInstance | null) => {

    // 获取相机位置和视角
    const getCameraPositionAndView = () => {
        if (!cesiumInstance) return {};

        return {
            destination: cesiumInstance.viewer.camera.position, // 相机位置
            orientation: {  // 相机角度
                heading: cesiumInstance.viewer.camera.heading, // 相机水平角度
                pitch: cesiumInstance.viewer.camera.pitch, // 相机垂直角度
                roll: cesiumInstance.viewer.camera.roll // 相机旋转角度
            }
        }
    }

    // 飞行到目标位置
    const flyTo = (target: Cesium.Cartesian3 | Cesium.Rectangle, options?: {
        duration?: number,
        orientantion?: any,
        complete?: () => void,
        cancel?: () => void
    }) => {
        
        if (!cesiumInstance) return;

        cesiumInstance.viewer.camera.flyTo({
            destination: target, // 目标位置 
            duration: options?.duration || 3, // 飞行过渡 持续时间 
            orientation: options?.orientantion, // 相机旋转角度
            complete: options?.complete, // 飞行完成回调
            cancel: options?.cancel, // 飞行取消回调
            ...options 
        })
    }

    return {
        getCameraPositionAndView,
        flyTo
    }
}