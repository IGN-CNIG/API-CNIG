import MBTilesVector from 'M/layer/MBTilesVector';
import Generic from 'M/style/Generic';

export const mbtileVector_001 = new MBTilesVector({
    name: 'mbtilesvector',
    legend: 'Capa personalizada MBTilesVector',
    // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
    // isBase: true,
    // isBase: false,
    // transparent: true,
    // transparent: false,
    // attribution: {
    //     name: 'Name Prueba KML',
    //     description: 'Description Prueba',
    //     url: 'https://www.ign.es',
    //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //     contentType: 'kml',
    //   },
    extract: true,
    // extract: false,
    // visibility: true,
    // visibility: false,
    infoEventType: 'hover',
    // infoEventType: 'click',
    tileLoadFunction: (z, x, y) => {
      return new Promise((resolve) => {
        fetch(`https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/${z}/${x}/${y}.pbf`).then((response) => {
          resolve(response.arrayBuffer());
        });
      });
    },
  },
  {
    // minZoom: 5,
    // maxZoom: 10,
    // opacity: 0,
    // opacity: 0.5,
    // opacity: 1,
    // displayInLayerSwitcher: true,
    // displayInLayerSwitcher: false,
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
  },
  {
    // source: {},
  },
);

// ERROR: infoEventType en hover no cierra el popup al salir
