import PredefinedZoom from 'facade/predefinedzoom';

const map = M.map({
  container: 'mapjs',
});

const mp = new PredefinedZoom({
  position: 'TL',
  savedZooms: [{
    name: 'Zoom a la extensión del mapa',
    bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
  }],
});

map.addPlugin(mp);
