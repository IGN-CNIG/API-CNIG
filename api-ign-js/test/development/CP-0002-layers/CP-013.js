import { map as Mmap } from 'M/mapea';
// import { vector_001 } from '../layers/vector/vector';
// import { wfs_001 } from '../layers/wfs/wfs';
// import { geojson_001 } from '../layers/geojson/geojson';
import { kml_001 } from '../layers/kml/kml';
// import { mvt_001 } from '../layers/mvt/mvt';
// import { ogcAPIFeatures_001 } from '../layers/ogcApiFeatures/ogcApiFeatures';
// import { mbtileVector_001 } from '../layers/mbTilesVector/mbTilesVector';
// import { generic_002 } from '../layers/generic/generic';


const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
});

mapa.addLayers([
  // vector_001,
  // geojson_001,
  // wfs_001,
  kml_001,
  // mvt_001,
  // ogcAPIFeatures_001,
  // mbtileVector_001,
  // generic_002
]);

// [-] KML
// mapa.addLayers(kml_001)
// console.log(kml_001.getMaxExtent())
// setTimeout(() => {
//   kml_001.setMaxExtent([-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652])
// }, 5000);

window.mapa = mapa;

