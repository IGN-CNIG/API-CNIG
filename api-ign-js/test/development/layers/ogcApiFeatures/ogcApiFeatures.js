import OGCAPIFeatures from 'M/layer/OGCAPIFeatures';
import Generic from 'M/style/Generic';

export const ogcAPIFeatures_001 = new OGCAPIFeatures({
    url: 'https://api-features.idee.es/collections/',
    name: 'falls',
    legend: 'Capa OGCAPIFeatures',
    extract: true,
    // extract: false,
    // infoEventType: 'hover',
    // infoEventType: 'click',
    // format: 'json',
    // offset: 10,
    // offset: 2,
    // id: 11,
    // conditional: {
    //   slug: 'Puerto-del-Leon-por-Totalan'
    // },
    // limit: 20,
    // crs: '',
    // geometry: 'MPOLYGON',
    // geometry: 'MPOINT',
    // minZoom: 5,
    // maxZoom: 10,
    // bbox: [
    //   -157000.66673495102,
    //   -744037.0439651047, 
    //   5403089.153398914,
    //   5099481.277050193
    // ],
    // maxExtent: [-953031.9167337259, 5198473.475942763, -879652.3695799566, 5233405.1978690885],
    // isBase: true,
    // isBase: false,
    // transparent: true,
    // transparent: false,
    // attribution: {
    //   name: 'Name Prueba OGCAPIFeatures',
    //   description: 'Description Prueba',
    //   url: 'https://www.ign.es',
    //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //   contentType: 'kml',
    // }
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
    // visibility: true,
    // visibility: false,
    // displayInLayerSwitcher: true,
    // displayInLayerSwitcher: false,
    // opacity: 0,
    // opacity: 0.5,
    // opacity: 1,
    // bbox: [
    //   -157000.66673495102,
    //   -744037.0439651047, 
    //   5403089.153398914,
    //   5099481.277050193
    // ],
    // getFeatureOutputFormat: 'application/json',
    // getFeatureOutputFormat: 'geojson',
    // describeFeatureTypeOutputFormat: 'geojson',
  },
  {
    // cql: 'id IN (3,5)'
    // source: {},
  },
);

// ERROR: infoEventType en hover no cierra el popup al salir

// export const ogcAPIFeatures_002 = new OGCAPIFeatures({
//   url: 'https://api-features.idee.es/collections/',
//   name: 'hidrografia/Wetland',
//   legend: 'Capa OGCAPIFeatures',
// });
