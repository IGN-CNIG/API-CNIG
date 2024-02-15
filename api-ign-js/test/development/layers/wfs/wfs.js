import WFS from 'M/layer/WFS';

export const wfs_001 = new WFS({
    url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
    namespace: "tematicos",
    name: "Provincias",
    legend: "Provincias",
    geometry: 'MPOLYGON',
    // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
    // extract: true,
    // infoEventType: 'click',
    // ids:"3,4",
    // isBase: true,
    // transparent: false,
    // attribution: {
    //   name: 'Name Prueba WFS',
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

export const wfs_002 = new WFS({
  url: "https://www.ign.es/wfs/redes-geodesicas",
  name: "RED_REGENTE",
  legend: "RED_REGENTE",
  geometry: 'MPOINT',
});
