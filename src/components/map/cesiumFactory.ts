import * as Cesium from "cesium";

export interface CesiumInstance {
    viewer: Cesium.Viewer;
    initialized: boolean;
}

class CesiumFactory { 
    private static instance: CesiumFactory | null = null;
    private cesiumInstance: CesiumInstance | null = null;

    private constructor() {}
    // 单例模式
    public static getInstance(): CesiumFactory {
        if (!CesiumFactory.instance) {
            CesiumFactory.instance = new CesiumFactory();
        }
        return CesiumFactory.instance;

    }

    public initialized(container: HTMLElement, options?: Cesium.Viewer.ConstructorOptions): CesiumInstance {

        if (!this.cesiumInstance) {
            const viewer = new Cesium.Viewer(container, {
                ...options,
                // 默认配置
                timeline: false,
                animation: false,
                fullscreenButton: false,
                vrButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                navigationHelpButton: false,
                navigationInstructionsInitiallyVisible: false,
                baseLayerPicker: false,
            })

            if (viewer.cesiumWidget.creditContainer instanceof HTMLElement) {
                viewer.cesiumWidget.creditContainer.style.display = 'none';
            }

            this.cesiumInstance = {
                viewer,
                initialized: true
            }
        }
            return this.cesiumInstance
    }

    public getInstanceIfExists(): CesiumInstance | null {
        return this.cesiumInstance
    }

    public destroy(): void {
        if (this.cesiumInstance) {
            this.cesiumInstance.viewer.destroy()
            this.cesiumInstance = null
        }
    }
}

export default CesiumFactory