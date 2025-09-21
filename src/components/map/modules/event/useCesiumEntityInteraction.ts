import * as Cesium from "cesium";
import { type CesiumInstance } from "../../cesiumFactory";

export const useCesiumEntityInteraction = (cesiumInstance: CesiumInstance | null) => {
    // 高亮实体
    const highlightEntity = (entity: Cesium.Entity, color: Cesium.Color = Cesium.Color.YELLOW) => {
        if (!cesiumInstance || !entity) return;
        
        // 保存原始颜色
        const originalColor = new Map<string, Cesium.Color>();
        
        entity.properties?.propertyNames.forEach((name: string) => {
            const property = (entity as any)[name];
            if (property instanceof Cesium.Color) {
                originalColor.set(name, property);
                (entity as any)[name] = color;
            }
        });
        
        return () => {
            // 恢复原始颜色
            originalColor.forEach((color, name) => {
                (entity as any)[name] = color;
            });
        };
    };

    // 选择实体
    const selectEntity = (entity: Cesium.Entity) => {
        if (!cesiumInstance || !entity) return;
        
        cesiumInstance.viewer.selectedEntity = entity;
    };

    // 取消选择
    const deselectEntity = () => {
        if (!cesiumInstance) return;
        
        cesiumInstance.viewer.selectedEntity = undefined;
    };

    return {
        highlightEntity,
        selectEntity,
        deselectEntity
    };
};