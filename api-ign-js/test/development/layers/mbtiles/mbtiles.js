import MBTiles from 'M/layer/MBTiles';


export const mbtile_01 = new MBTiles({
    name: 'mbtilesLoadFunction',
    legend: 'Capa personalizada MBTiles',
    // isBase: true,
    // transparent: false,
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
