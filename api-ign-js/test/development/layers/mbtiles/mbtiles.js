import MBTiles from 'M/layer/MBTiles';


export const mbtile_01 = new MBTiles({
  name: 'mbtilesLoadFunction',
  legend: 'Capa personalizada MBTiles',
  // isBase: false,
  transparent: false,
  // attribution: {
  //   name: 'Name Prueba MBTiles',
  //   description: 'Description Prueba',
  //   url: 'https://www.ign.es',
  //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //   contentType: 'kml',
  // },
  tileLoadFunction: (z, x, y) => {
    return new Promise((resolve) => {
      if (z > 4) {
        resolve('https://cdn-icons-png.flaticon.com/512/4616/4616040.png');
      } else {
        resolve('https://cdn.icon-icons.com/icons2/2444/PNG/512/location_map_pin_direction_icon_148665.png');
      }
    });
  },
});
