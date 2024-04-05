import WMTS from 'M/layer/WMTS';

export const wmts_001 = new WMTS({
  url: 'https://wmts-mapa-lidar.idee.es/lidar',
  name: 'EL.GridCoverageDSM',
  legend: 'Modelo Digital de Superficies LiDAR',
  matrixSet: 'GoogleMapsCompatible',
  // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
  // minZoom: 5,
  // maxZoom: 10,
  // useCapabilities: false,
  // useCapabilities: true,
  // isBase: false,
  // isBase: true,
  // transparent: false,
  // transparent: true,
  // attribution: {
  //     name: 'Name Prueba WMTS',
  //     description: 'Description Prueba',
  //     url: 'https://www.ign.es',
  //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //     contentType: 'kml',
  //   },
},
{
  // matrixSet: 'GoogleMapsCompatible',
  // format: 'image/png',
  // useCapabilities: false,
  // useCapabilities: true,
  // crossOrigin: true,
  // crossOrigin: 'anonymous',
  // minScale: 2000000,
  // maxScale: 7000000,
  // minResolution: 705.5551745557614,
  // maxResolution: 2469.443110945165,
  // queryable: false,
  // queryable: true,
  // visibility: false,
  // visibility: true,
  // displayInLayerSwitcher: false,
  // displayInLayerSwitcher: true,
  // opacity: 0,
  // opacity: 0.5,
  // opacity: 1,
},
{
  // capabilitiesMetadata: {
  //  Abstract: '',
  //  Attribution: '',
  //  MetadataURL: '',
  //  Style: '',
  // },
  // source: {},
},
);

// ERROR: No funciona opacity al 0

export const wmts_002 = 'WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*imagen*true*image/jpeg*true*true*true';


export const wmts_003 = new WMTS({
  url: 'https://servicios.idee.es/wmts/ocupacion-suelo',
  name: 'LC.LandCoverSurfaces',
  legend: 'LC.LandCoverSurfaces l',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/png',
});


export const wmts_004 = new WMTS({
  url: 'https://www.ign.es/wmts/planos?',
  name: 'MancelliMadrid',
  legend: 'MancelliMadrid',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/png',
});
