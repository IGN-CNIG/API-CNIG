import MBTiles from 'M/layer/MBTiles';


export const mbtile_01 = new MBTiles({
    // url:'',
    // source:{},
    name: 'mbtilesLoadFunction',
    legend: 'Capa personalizada MBTiles',
    // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
    tileLoadFunction: (z, x, y) => {
      return new Promise((resolve) => {
        if (z > 4) {
          resolve('https://cdn-icons-png.flaticon.com/512/4616/4616040.png');
        } else {
          resolve('https://cdn.icon-icons.com/icons2/2444/PNG/512/location_map_pin_direction_icon_148665.png');
        }
      });
    },
    // opacity: 0,
    // opacity: 0.5,
    // opacity: 1,
    // maxZoomLevel: 4,
    // maxZoomLevel: 12,
    // visibility: false,
    visibility: true,
    // isBase: false,
    // isBase: true,
    // transparent: true,
    // transparent: false,
    // infoEventType: 'hover',
    // infoEventType: 'click',
    // attribution: {
    //     name: 'Name Prueba KML',
    //     description: 'Description Prueba',
    //     url: 'https://www.ign.es',
    //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //     contentType: 'kml',
    //   },

  },
  {
    // crossOrigin: true,
    // minZoom: 5,
    // maxZoom: 10,
    // displayInLayerSwitcher: true,
    // displayInLayerSwitcher: false,
  },
  {

  }
);
