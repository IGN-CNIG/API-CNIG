import OGCAPIFeatures from 'M/layer/OGCAPIFeatures';

export const ogcAPIFeatures_001 = new OGCAPIFeatures({
    url: 'https://api-features.idee.es/collections/',
    name: 'hidrografia/Falls',
    legend: 'Capa OGCAPIFeatures',
    extract: true,
    infoEventType: 'hover',
    // bbox: [
    //   -157000.66673495102,
    //   -744037.0439651047, 
    //   5403089.153398914,
    //   5099481.277050193
    // ],
    // maxExtent: [-953031.9167337259, 5198473.475942763, -879652.3695799566, 5233405.1978690885],
    // limit: 20,
    // isBase: true,
    // transparent: false,
    // attribution: {
    //   name: 'Name Prueba OGCAPIFeatures',
    //   description: 'Description Prueba',
    //   url: 'https://www.ign.es',
    //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //   contentType: 'kml',
    // }
  },
  // {
  //   minZoom: 5,
  //   maxZoom: 10
  // }
);

// export const ogcAPIFeatures_002 = new OGCAPIFeatures({
//   url: 'https://api-features.idee.es/collections/',
//   name: 'hidrografia/Wetland',
//   legend: 'Capa OGCAPIFeatures',
// });
