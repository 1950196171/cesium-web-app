import * as Cesium from "cesium";
import CesiumFactory, { type CesiumInstance } from "../../cesiumFactory";

export const useCesiumSceneInteraction = (cesiumInstance: CesiumInstance | null) => { 
    // 获取有效的 Cesium 实例
    const getValidInstance = (): CesiumInstance | null => {
        if (cesiumInstance) return cesiumInstance;
        
        // 尝试从工厂获取全局实例
        const factory = CesiumFactory.getInstance();
        return factory.getInstanceIfExists();
    };

    // 屏幕坐标转世界坐标
    const screenToCartesian = ( screenPosition: Cesium.Cartesian2 ): Cesium.Cartesian3 | undefined => {

        const instance = getValidInstance()
        
        if (!instance) return;

        const ray = instance.viewer.camera.getPickRay(screenPosition);

        if (!ray) return undefined;

        return instance.viewer.scene.globe.pick(ray, instance.viewer.scene);
    }

    // 世界坐标转屏幕坐标
    const cartesianToScreen = ( cartesian: Cesium.Cartesian3 ): Cesium.Cartesian2 | undefined => {
        const instance = getValidInstance()
        
        if (!instance) return;
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            instance.viewer.scene,
            cartesian
        );
    }

    // 世界坐标转地理坐标
    const cartesianToGeographic = ( cartesian: Cesium.Cartesian3 ): Cesium.Cartographic | undefined => {
        const instance = getValidInstance()
        
        if (!instance) return;
        const Cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);

        const longitude = Cesium.Math.toDegrees(Cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(Cartographic.latitude);
        const height = Cartographic.height;

        return new Cesium.Cartographic(longitude, latitude, height);

    }
    // 
    const enablePointCreation = (callback: (cartesian: Cesium.Cartesian3) => void) => {
        const instance = getValidInstance()
        
        if (!instance) return;
        const handler = new Cesium.ScreenSpaceEventHandler(instance!.viewer!.canvas);

        handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = screenToCartesian(click.position);  
            if (cartesian) {
                callback(cartesian);
            } 
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        return () => handler.destroy();
    }

    return {
        screenToCartesian,
        cartesianToScreen,
        cartesianToGeographic,
        enablePointCreation
    }
}