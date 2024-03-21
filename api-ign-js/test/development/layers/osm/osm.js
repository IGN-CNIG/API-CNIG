import OSM from 'M/layer/OSM';

export const osm = new OSM({
    name: 'OSM',
    legend: 'OSM',
    url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    matrixSet: 'EPSG:3857',
    // isBase: false,
    // isBase: true,
    // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
    // transparent: false,
    transparent: true,
    // attribution: {
    //     name: 'Name Prueba OSM',
    //     description: 'Description Prueba',
    //     url: 'https://www.ign.es',
    //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //     contentType: 'kml',
    //   },
    // minZoom: 5,
    // maxZoom: 10,
    // visibility: false,
    visibility: true,
    // opacity: 0,
    // opacity: 0.5,
    // opacity: 1,
  },
  {
    // animated: false,
    // animated: true,
    // displayInLayerSwitcher: false,
    // displayInLayerSwitcher: true,
  },
  {
    // source: {},
  },
);

// ERROR: No funciona opacity al 0

export const osm_002 = 'OSM';

export const osm_003 = 'OSM*Capa*OSM';
