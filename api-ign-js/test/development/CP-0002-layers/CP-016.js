import { map as Mmap } from 'M/mapea';
//import { cog_001, cog_002, cog_003, cog_004 } from '../layers/cog/cog';
import { mvt_001 } from '../layers/mvt/mvt';
// import { generic_002 } from '../layers/generic/generic';


const mapa = Mmap({
  container: 'map',
  // projection: 'EPSG:3857*m',
  // projection: 'EPSG:4326*d',
  // layers: ['OSM'],
  // center: [-443273.10081370454, 4757481.749296248],
  // zoom: 6,
  // center: [-443273.10081370454, 4757481.749296248],zoom: 6,layers: ['OSM'],controls: ['scale', 'getfeatureinfo'], // COG TEST
});

mapa.addLayers([
  // vector_001,
  // vector_002,
  // geojson_001,
  // wfs_001,
  // kml_001,
  mvt_001,
  // ogcAPIFeatures_001,
  // mbtileVector_001
  // generic_002
  // cog_001, cog_002, cog_003, cog_004 // COG TEST
]);

// ? proyección, si no pone nada 4326 si lo pone el que ponga
// ? Es necesario que este la capa incluida en el mapa

setTimeout(() => {
  // ++++++++++++++++ Capa vector. +++++++++++++++
  // console.log('toGeoJSON -- Capa Vector')
  // console.log(vector_001.toGeoJSON())
  // console.log('Capa Vector - Feature - getGeoJSON')
  // console.log(vector_001.getFeatures()[0].getGeoJSON())
  
  // Feature sin crs
  // console.log('toGeoJSON -- Capa Vector')
  // console.log(vector_002.toGeoJSON())
  // console.log('Capa Vector - Feature - getGeoJSON')
  // console.log(vector_002.getFeatures()[0].getGeoJSON())

  // ++++++++++++++++ Capa GeoJSON. +++++++++++++++
  // console.log('toGeoJSON -- Capa GeoJSON')
  // console.log(geojson_001.toGeoJSON())
  // console.log('Capa GeoJSON - Feature - getGeoJSON')
  // console.log(geojson_001.getFeatures()[0].getGeoJSON())

  // ++++++++++++++++ Capa WFS. +++++++++++++++
  // console.log('toGeoJSON -- Capa WFS')
  // console.log(wfs_001.toGeoJSON())
  // console.log('Capa WFS - Feature - getGeoJSON')
  // console.log(wfs_001.getFeatures()[0].getGeoJSON())

  // ++++++++++++++++ Capa KML. +++++++++++++++
  // console.log('toGeoJSON -- Capa KML')
  // console.log(kml_001.toGeoJSON())
  // console.log('Capa KML - Feature - getGeoJSON')
  // console.log(kml_001.getFeatures()[0].getGeoJSON())

  // ++++++++++++++++ Capa MVT. +++++++++++++++
  // console.log('toGeoJSON -- Capa MVT')
  // console.log(mvt_001.toGeoJSON()) // ! Método vacío 
  // console.log('Capa MVT - Feature - getGeoJSON')
  // console.log(mvt_001.getFeatures()[0].getGeoJSON())
  
  // ++++++++++++++++ Capa mbtileVector. +++++++++++++++
  // console.log('toGeoJSON -- Capa mbtileVector')
  // console.log(mbtileVector_001.toGeoJSON()) // ! Método vacío 
  // console.log('Capa mbtileVector - Feature - getGeoJSON')
  // console.log(mbtileVector_001.getFeatures()[0].getGeoJSON()) // ! RenderFeatures - es necesario feature (implementar)

  // ++++++++++++++++ Capa ogcAPIFeatures. +++++++++++++++
  // console.log('toGeoJSON -- Capa ogcAPIFeatures') // ! Error index
  // console.log(ogcAPIFeatures_001.toGeoJSON())
  // console.log('Capa ogcAPIFeatures - Feature - getGeoJSON')
  // console.log(ogcAPIFeatures_001.getFeatures()[0].getGeoJSON())

  // ++++++++++++++++ Capa Generic. +++++++++++++++
  // console.log('toGeoJSON -- Capa Generic')
  // console.log(generic_002.toGeoJSON())
  // console.log('Capa Generic - Feature - getGeoJSON')
  // console.log(generic_002.getFeatures()[0].getGeoJSON())

  // ++++++++++++++++ Capa COG. +++++++++++++++
  // **********************************************
}, 1000);

window.mapa = mapa;
