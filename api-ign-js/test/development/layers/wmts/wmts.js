import WMTS from 'M/layer/WMTS';

export const wmts_001 = new WMTS({
    url: 'https://wmts-mapa-lidar.idee.es/lidar',
    name: 'EL.GridCoverageDSM',
    legend: 'Modelo Digital de Superficies LiDAR',
    matrixSet: 'GoogleMapsCompatible',
    // visibility: true,
    // isBase: true,
    // transparent: false,
}, {});