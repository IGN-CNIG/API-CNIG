import { map as Mmap } from 'M/mapea';

const mapjs = M.map({
  container: 'mapjs', //id del contenedor del mapa
  controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location', 'backgroundlayers'],
  zoom: 14,
  maxZoom: 20,
  minZoom: 13,
  center: ol.proj.fromLonLat([-4.024697, 39.8651]),
});

 mapjs.addLayers([transporte]);

window.mapjs = mapjs;
