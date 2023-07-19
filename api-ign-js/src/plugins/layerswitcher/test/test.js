import Layerswitcher from 'facade/layerswitcher';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
  center: {
    x: -528863.345515127,
    y: 4514194.232367303,
  },
  zoom: 9,
});


const mp = new Layerswitcher({
  collapsed: false,
  position: 'TL',
  collapsible: false,
  isDraggable: false,
  // tooltip: 'Pruebas',
});
map.addPlugin(mp);

const layerUA = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});

map.addLayers(layerUA);

window.map = map;
