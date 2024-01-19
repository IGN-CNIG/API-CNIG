import OGCAPIFeatures from 'M/layer/OGCAPIFeatures';

export const ogcAPIFeatures_001 = new OGCAPIFeatures({
    url: 'https://api-features.idee.es/collections/',
    name: 'hidrografia/Falls',
    legend: 'Capa OGCAPIFeatures',
    extract: true,
    infoEventType: 'hover',
    maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
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
