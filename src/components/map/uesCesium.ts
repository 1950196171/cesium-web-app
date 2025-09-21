import { ref } from 'vue';
import CesiumFactory, { type CesiumInstance } from './cesiumFactory';
import * as Cesium from 'cesium';

import { useCesiumCamera } from './modules/useCesiumCamera';
// Cesium 公共事件
import { useCesiumEvent } from './modules/event/useCesiumEvent';
// Cesium 实体事件
import { useCesiumEntityInteraction } from './modules/event/useCesiumEntityInteraction';
// Cesium 场景事件
import { useCesiumSceneInteraction } from './modules/event/useCesiumSceneInteraction';


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
    const getEventMoudels = () => { 
        // 优先使用当前实例，如果没有则从工厂获取已存在的实例
        const instance = cesiumInstance.value || getInstance();

        if (!instance) return null;
        return {
            camera: useCesiumCamera(cesiumInstance.value),
            event: useCesiumEvent(cesiumInstance.value),
            entityInteraction: useCesiumEntityInteraction(cesiumInstance.value),
            sceneInteraction: useCesiumSceneInteraction(cesiumInstance.value)
        }
    }

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

        // 模块化
        // 事件模块
        getEventMoudels
    }
}