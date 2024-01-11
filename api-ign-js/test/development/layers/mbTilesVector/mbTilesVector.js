import MBTilesVector from 'M/layer/MBTilesVector';

export const mbtileVector_001 = new MBTilesVector({
    name: 'mbtilesvector',
    legend: 'Capa personalizada MBTilesVector',
    // isBase: true,
    // transparent: false,
    // extract: true,
    // infoEventType: 'hover',
    tileLoadFunction: (z, x, y) => {
      return new Promise((resolve) => {
        fetch(`https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/${z}/${x}/${y}.pbf`).then((response) => {
          resolve(response.arrayBuffer());
        });
      });
    },
  },
  // {
  //   minZoom: 5,
  //   maxZoom: 10
  // }
);
