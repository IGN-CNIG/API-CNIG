import Transparency from 'facade/transparency';
import ShareMap from '../../sharemap/src/facade/js/sharemap';

const map = M.map({
  container: 'mapjs',
  controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location', 'getfeatureinfo'],
});


// 1 WMS por url
// const pluginTransparency = new Transparency({
//   position: 'TL',
//   layers: ['WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo'],
//   collapsible: false
// });

// 2 WMTS por url
// const pluginTransparency = new Transparency({
//   position: 'TL',
//   layers: ['WMTS*IGN*http://www.ideandalucia.es/geowebcache/service/wmts*toporaster'],
//   collapsible: false
// });

// 3 WMS y WMTS como objetos
let wmts = new M.layer.WMTS({
  url: "http://www.ideandalucia.es/geowebcache/service/wmts",
  name: "toporaster",
  matrixSet: "EPSG:25830",
  legend: "Toporaster"
}, {
  format: 'image/png'
});
map.addWMTS(wmts);

const wms = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

map.addWMS(wms);

// const pluginTransparency = new Transparency({
//   position: 'TL',
//   layers: [wmts, wms],
//   collapsible: false
// });

// 4 WMS y WMTS por nombres
const pluginTransparency = new Transparency({
  position: 'TL',
  layers: ['toporaster', 'AU.AdministrativeBoundary'],
  collapsible: false
});

// Prueba integración con Share Map
const shareMap = new ShareMap({
  baseUrl: 'http://mapea-lite.desarrollo.guadaltel.es/api-core/',
  position: 'BR',
})


const mp6 = new M.plugin.ZoomExtent();

const mp7 = new M.plugin.XYLocator({
  position: 'TL',
});

map.addPlugin(shareMap);
map.addPlugin(mp6);


map.addPlugin(pluginTransparency);
map.addPlugin(mp7);
window.map = map;
