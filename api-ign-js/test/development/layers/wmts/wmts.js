import WMTS from 'M/layer/WMTS';

export const wmts_001 = new WMTS({
    url: 'https://wmts-mapa-lidar.idee.es/lidar',
    name: 'EL.GridCoverageDSM',
    legend: 'Modelo Digital de Superficies LiDAR',
    matrixSet: 'GoogleMapsCompatible',
    // visibility: true,
    // isBase: true,
    // transparent: false,
    // attribution: {
    //     name: 'Name Prueba WMTS',
    //     description: 'Description Prueba',
    //     url: 'https://www.ign.es',
    //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //     contentType: 'kml',
    //   },
}, {});