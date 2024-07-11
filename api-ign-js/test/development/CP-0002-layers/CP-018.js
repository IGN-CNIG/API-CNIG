/* eslint-disable no-underscore-dangle,camelcase */
import { map as Mmap } from 'M/mapea';
// import MapLibre from 'M/layer/MapLibre';
import { maplibre_001 } from '../layers/maplibre/maplibre';

const mapa = Mmap({
  container: 'map',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
});
window.mapa = mapa;

mapa.addLayers([
  maplibre_001,
  // maplibre_004,
]);

// Prueba de setLayoutProperty(maplibre_001)
// maplibre_001.setLayoutProperty('fondo', 'visibility', 'visible');

// Prueba de mapa diferente
// maplibre_001.setStyle('https://demotiles.maplibre.org/style.json');

/* / Prueba con estilo generados con array(demotiles.maplibre)
maplibre_001.setStyle('https://demotiles.maplibre.org/style.json');
const styles = [{
  id: 'coastline',
  paint: [{
    property: 'line-color', value: '#000',
  }, {
    property: 'line-width', value: 7,
  }],
}, {
  id: 'countries-label',
  paint: [{
    property: 'text-color', value: 'red',
  }],
}];
maplibre_001.setStyle(styles); // */

/*
! TODO
maplibre_001.url = 'https://demotiles.maplibre.org/style.json';
maplibre_001.maplibrestyle = {json}
maplibre_001.setPaintProperty('coastline', 'line-color', '#000');
maplibre_001.setPaintProperty('coastline', 'line-width', 7);
maplibre_001.setPaintProperty('countries-label', 'text-color', 'red');
*/

window.mapLibre = maplibre_001; // console.log(maplibre_001);
