import { map as Mmap } from 'M/mapea';
import { vector_001 } from '../layers/vector/vector';
import { wfs_001 } from '../layers/wfs/wfs';
import { geojson_001 } from '../layers/geojson/geojson';
import { kml_001 } from '../layers/kml/kml';
import { mvt_001 } from '../layers/mvt/mvt';
import { ogcAPIFeatures_001 } from '../layers/ogcApiFeatures/ogcApiFeatures';
import { mbtileVector_001 } from '../layers/mbTilesVector/mbTilesVector';
import { generic_002 } from '../layers/generic/generic';


const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
  controls: ['getfeatureinfo'],
  layers:[
    vector_001,
    // geojson_001,
    // wfs_001,
    // kml_001,
    // mvt_001,
    // ogcAPIFeatures_001,
    // mbtileVector_001,
    // generic_002,
  ],
});

mapa.addLayers([
  // vector_001,
  // geojson_001,
  // wfs_001,
  // kml_001,
  // mvt_001,
  // ogcAPIFeatures_001,
  // mbtileVector_001,
  // generic_002,
]);

window.mapa = mapa;
// window.vector = vector_001;
// window.wfs = wfs_001;
// window.geojson = geojson_001;
// window.kml = kml_001;
// window.mvt = mvt_001;
// window.ogcAPIFeatures = ogcAPIFeatures_001;
// window.mbtileVector = mbtileVector_001;
