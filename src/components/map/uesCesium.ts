import { ref } from 'vue';
import CesiumFactory, { type CesiumInstance } from './cesiumFactory';
import * as Cesium from 'cesium';

import { useCesiumCamera } from './modules/useCesiumCamera';


export const useCesium = (options?: Cesium.Viewer.ConstructorOptions) => {

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTE0NmFmMC0yODk5LTQ5MzctYTIxOS1kNWNmMWI5Y2Q2NjIiLCJpZCI6Mjk5NTY2LCJpYXQiOjE3NTczMzcyNDB9.EjLC74mSql-iQQJNnAjoGOiNu8R59RwYDMEQ-l_-7x0';

    const containerRef = ref<HTMLElement | null>(null);
    
    const cesiumInstance = ref<CesiumInstance | null>(null);

    const factory = CesiumFactory.getInstance();

    const initializeCesium = () => {
        if (containerRef.value) {
            cesiumInstance.value = factory.initialized(containerRef.value, options);
        }
    }

    const mount = () => {
        initializeCesium();
    }

    const unmount = () => {
        if (cesiumInstance.value) {
            cesiumInstance.value.viewer.destroy();
            cesiumInstance.value = null;
        }
    }

    // 获取Cesium实例
    const getInstance = () => {
        return factory.getInstanceIfExists();
    }


    // 模块化 功能
    const camera = useCesiumCamera(cesiumInstance.value);

    return {
        // 基础引用
        containerRef,
        // Cesium单例
        cesiumInstance,
        // 获取Cesium实例
        getInstance,

        // 生命周期
        mount,
        unmount,

        // 相机操作
        camera
    }
}