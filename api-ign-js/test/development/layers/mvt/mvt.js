import MVT from 'M/layer/MVT';

export const mvt_001 = new MVT({
    url: "https://vt-fedme.idee.es/vt.senderogr/{z}/{x}/{y}.pbf",
    name: 'sendero_gr',
    // visibility: true,
    // extract: true,
    // infoEventType: 'click',
    // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
    // isBase: true,
    // opacity: 0.5,
    // transparent: false,
    // attribution: {
    //   name: 'Name Prueba MVT',
    //   description: 'Description Prueba',
    //   url: 'https://www.ign.es',
    //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //   contentType: 'kml',
    // },
  },
  // {
  //   minZoom: 5,
  //   maxZoom: 10,
  // }
);

export const mvt_002 = new MVT({
  url: 'https://vts.larioja.org/rioja/{z}/{x}/{y}.pbf',
  name: 'vectortile2',
  projection: 'EPSG:3857',
});
