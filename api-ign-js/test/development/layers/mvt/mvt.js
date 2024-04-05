import MVT from 'M/layer/MVT';
window.MVT=MVT;
import Generic from 'M/style/Generic';

export const mvt_001 = new MVT({
    url: "https://vt-fedme.idee.es/vt.senderogr/{z}/{x}/{y}.pbf",
    name: 'sendero_gr',
    // projection: '',
    // mode: 'render',
    mode: 'feature',
    // opacity: 0,
    // opacity: 0.5,
    // opacity: 1,
    // layers: ['Layer__0', 'Layer__1'],
    // layers: 'Layer__0,Layer__1',
    // layers: [],
    // visibility: true,
    // visibility: false,
    extract: true,
    // extract: false,
    // infoEventType: 'click',
    infoEventType: 'hover',
    // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
    // isBase: true,
    // isBase: false,
    // transparent: true,
    // transparent: false,
    // attribution: {
    //   name: 'Name Prueba MVT',
    //   description: 'Description Prueba',
    //   url: 'https://www.ign.es',
    //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //   contentType: 'kml',
    // },
  },
  {
    // minZoom: 5,
    // maxZoom: 10,
    // predefinedStyles: [],
    // style: new Generic({
    //   point: {
    //     radius: 10,
    //     fill: {
    //       color: 'blue'
    //     }
    //   },
    //   polygon: {
    //     fill: {
    //       color: 'red'
    //     }
    //   },
    //   line: {
    //     stroke: {
    //       color: 'black'
    //     }
    //   }
    // }),
    // displayInLayerSwitcher: true,
    // displayInLayerSwitcher: false,
  },
  {
    // source: {},
  },
);

// ERROR: No funciona opacity al 0

export const mvt_002 = new MVT({
  url: 'https://vts.larioja.org/rioja/{z}/{x}/{y}.pbf',
  name: 'vectortile2',
  projection: 'EPSG:3857',
});
