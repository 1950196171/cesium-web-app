import * as Cesium from 'cesium';
import CesiumFactory, { type CesiumInstance } from '../../cesiumFactory';
import { onUnmounted } from 'vue'; 

export const useCesiumEvent = (cesiumInstance: CesiumInstance | null) => { 

    const eventListeners: (()=> void)[] = [];

       // 获取有效的 Cesium 实例
    const getValidInstance = (): CesiumInstance | null => {
        if (cesiumInstance) return cesiumInstance;
        
        // 尝试从工厂获取全局实例
        const factory = CesiumFactory.getInstance();
        return factory.getInstanceIfExists();
    };
    // 暂时仅支持实体entity点击
    const onClickEvent = (callback: (entity: Cesium.Entity) => void) => {
        const instance = getValidInstance();
        if (!instance) return;
        const removeListener = instance.viewer.screenSpaceEventHandler.setInputAction(
            (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const pick = instance.viewer.scene.pick(click.position);
                if (Cesium.defined(pick) && pick instanceof Cesium.Entity) {
                    callback(pick);
                }
            },
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        )

        if (typeof removeListener === 'function') {
            eventListeners.push(removeListener);
        }

        return removeListener;

    }

    const onMouseMoveEvent = ( callback: (movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => void) => {

        const instance = getValidInstance();
        if (!instance) return;
        console.log('onMouseMoveEvent', instance);

        const removeListener = instance.viewer.screenSpaceEventHandler.setInputAction(
            (movement: Cesium.ScreenSpaceEventHandler.MotionEvent ) => {
                callback(movement)
            },
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        )

        if (typeof removeListener === 'function') {
            eventListeners.push(removeListener);
        }
    }

    const cleanup = () => { 
        eventListeners.forEach(listener => typeof listener === 'function' &&  listener());
        eventListeners.length = 0;
    }

    onUnmounted( () => {
        cleanup();
    } )

    return {
        onClickEvent,
        onMouseMoveEvent,
        cleanup
    }
}