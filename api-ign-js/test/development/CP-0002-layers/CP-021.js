/* eslint-disable camelcase */
import { map as Mmap } from 'M/mapea';
import LayerGroup from 'M/layer/LayerGroup';
// import { vector_001 } from '../layers/vector/vector'; window.vector = vector_001;
// import { geojson_001 } from '../layers/geojson/geojson'; window.geojson = geojson_001;
// import { wfs_001 } from '../layers/wfs/wfs'; window.wfs = wfs_001;
// import { kml_001 } from '../layers/kml/kml'; window.kml = kml_001;
// import { mvt_001 } from '../layers/mvt/mvt'; window.mvt = mvt_001; // Mode 'feature'
// import { mvt_003 } from '../layers/mvt/mvt'; window.mvt = mvt_003; // Mode 'render'
// import { ogcAPIFeatures_001 } from '../layers/ogcApiFeatures/ogcApiFeatures'; window.ogcAPIFeatures = ogcAPIFeatures_001;
// import { mbtileVector_001 } from '../layers/mbTilesVector/mbTilesVector'; window.mbtileVector = mbtileVector_001;
// import { generic_002 } from '../layers/generic/generic'; window.generic = generic_002;
// import { tms_001 } from '../layers/tms/tms'; window.tms = tms_001;
// STRING ==> import { tms_002 } from '../layers/tms/tms'; const capaPrueba = tms_002; window.tms = tms_002;
// import { wms_001 } from '../layers/wms/wms'; window.wms = wms_001;
// STRING ==> import { wms_002 } from '../layers/wms/wms'; const capaPrueba = wms_002; window.wms = wms_002;
// import { wmts_001 } from '../layers/wmts/wmts'; window.wmts = wmts_001;
// STRING ==> import { wmts_002 } from '../layers/wmts/wmts'; const capaPrueba = wmts_002; window.wmts = wmts_002;
// import { xyz_001 } from '../layers/xyz/xyz'; window.xyz = xyz_001;
// STRING ==> 
  
// import { xyz_002 } from '../layers/xyz/xyz'; const capaPrueba = xyz_002; window.xyz = xyz_002;
// import { osm } from '../layers/osm/osm'; window.osm = osm;
// STRING ==> import { osm_002 } from '../layers/osm/osm'; const capaPrueba = osm_002; window.osm = osm_002;
// STRING ==> import { osm_003 } from '../layers/osm/osm'; const capaPrueba = osm_003; window.osm = osm_003;
// import { mbtile_01 } from '../layers/mbtiles/mbtiles'; window.mbtile = mbtile_01;
// import { generic_001 } from '../layers/generic/generic'; window.generic = generic_001;
//import { geotiff_001 } from '../layers/geotiff/geotiff'; window.geotiff = geotiff_001;

const url = 'LayerGroup*PRUEBA NAME*PRUEBA LEGEND*true*true*["WMTS*https://servicios.idee.es/wmts/ocupacion-suelo*LC.LandCoverSurfaces*GoogleMapsCompatible*LC.LandCoverSurfaces l*true*image/png*true*true*true", "XYZ*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*true"]';
// const url = 'LayerGroup*Grupo de capas 1*Grupo de capas 1*true*true*["WMTS*https://servicios.idee.es/wmts/ocupacion-suelo*LC.LandCoverSurfaces*GoogleMapsCompatible*LC.LandCoverSurfaces l*true*image/png*true*true*true","LayerGroup*Grupo de capas 2*Grupo de capas 2*true*true*[`WMS*capaWMS3*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wms?*provincias_pob*true*false**1.3.0*true*true*true`]"]'

const mapa = Mmap({
  container: 'map',
  // projection: 'EPSG:4326*d',
  center: [-443273.10081370454, 4757481.749296248],
  // layers: [urlAPI],
  // layers: ['OSM'],
  zoom: 6,
  // controls: ['scale', 'attributions'],
});
window.mapa = mapa;

/*
const subLayerGroup = new LayerGroup({   name: 'Grupo de capas 2',
legend: 'Grupo de capas LEGEND 2', layers: [geojson_001,  mvt_003, wms_001] });

// const subLayerGroup3 = new LayerGroup({ layers: [subLayerGroup] });

const layerGroup = new LayerGroup({
  layers: [
    subLayerGroup,
    // xyz_002 
    // vector_001, 
    // ogcAPIFeatures_001,
    // ogcAPIFeatures_001,
    // mbtileVector_001,
    // generic_002,
    tms_001,
    // wmts_001,
    // xyz_001,
    osm,
    // mbtile_01,
    // generic_001,
    // geotiff_001,
    // wfs_001,
  ],
  // isBase: true,
  // transparent: false,
  name: 'Grupo de capas',
  legend: 'Grupo de capas LEGEND',
  // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
  // visibility: false,
}, {
  // minResolution: 705.5551745557614,
  // maxResolution: 2469.443110945165,
  // minZoom: 5,
  // maxZoom: 10,
}, {});

window.layerGroup = layerGroup;
window.subLayerGroup = subLayerGroup;


mapa.addLayers([wfs_001, layerGroup, wmts_001]);
*/

mapa.addLayers([url]);