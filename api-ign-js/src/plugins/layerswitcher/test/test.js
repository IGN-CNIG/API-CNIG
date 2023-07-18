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
  layers: ['TMS*TMSBaseIGN*https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*true'],
});


const mp = new Layerswitcher({
  collapsed: true,
  position: 'TR',
  order: 1,
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
