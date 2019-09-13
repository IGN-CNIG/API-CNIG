const map = M.map({
  container: 'map',
});

const mp = new M.plugin.PredefinedZoom({
  position: 'TR',
  savedZooms: [{
    name: 'Zoom a la extensión del mapa',
    bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
  }],
});

map.addPlugin(mp);

window.map = map;
