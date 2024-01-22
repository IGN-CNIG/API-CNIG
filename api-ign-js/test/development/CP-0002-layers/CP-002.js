import { map as Mmap } from 'M/mapea';
// import { tms_001 } from '../layers/tms/tms';
// import { tms_002 } from '../layers/tms/tms';
// import { wms_001 } from '../layers/wms/wms';
// import { wms_002 } from '../layers/wms/wms';
// import { wmts_001 } from '../layers/wmts/wmts';
// import { wmts_002 } from '../layers/wmts/wmts';
import { xyz_001 } from '../layers/xyz/xyz';
// import { xyz_002 } from '../layers/xyz/xyz';
// import { osm } from '../layers/osm/osm';
// import { osm_002 } from '../layers/osm/osm';
// import { osm_003 } from '../layers/osm/osm';
// import { mbtile_01 } from '../layers/mbtiles/mbtiles';


const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
  // layers: [osm]
});

mapa.addLayers([
  // tms_001,
  // tms_002,
  // wms_001,
  // wms_002,
  // wmts_001,
  // wmts_002,
  xyz_001,
  // xyz_002,
  // osm
  // osm_003,
  // mbtile_01,
]);

window.mapa = mapa;
// window.tms = tms_001;
// window.wms = wms_001;
// window.wmts = wmts_001;
window.xyz = xyz_001;
// window.osm = osm;
// window.mbtile = mbtile_01;
