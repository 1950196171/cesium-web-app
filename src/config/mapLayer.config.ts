import * as Cesium from 'cesium'

const mapLayers = [
    {
        name: 'NaturalEarthII',
        type: 'imagery',
        layer: 'node_modules/cesium/Build/cesium/Assets/Textures/NaturalEarthII'
    },
    {
        name: 'Bing Maps',
        type: 'imagery',
        layer: ''
    },
]
// 加载ArcGIs影像
export const addArcGisMapImageryLayers = async () => {
    const esri = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    )
    return esri
}

// 加载Cesium ion地图服务

export const addCesiumIonMapImageryLayers = async () => {
    const ion = Cesium.ImageryLayer.fromProviderAsync(Cesium.IonImageryProvider.fromAssetId(3812, {}), {});
    return ion
}