import Transparency from 'facade/transparency';

const map = M.map({
  container: 'mapjs',
  controls: ['layerswitcher'],
});


// 1 WMS
// const pluginTransparency = new Transparency({
//   position: 'TL',
//   layers: ['WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo'],
//   collapsible: false
// });

// map.addPlugin(pluginTransparency);
// window.map = map;

//2 WMS
const pluginTransparency = new Transparency({
  position: 'TL',
  layers: ['WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas', 'WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo']
});

map.addPlugin(pluginTransparency);
window.map = map;

//RADIUS
// const pluginTransparency = new Transparency({
//   position: 'TL',
//   layers: ['WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas', 'WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo'],
//   radius: 200
// });

// map.addPlugin(pluginTransparency);
// window.map = map;

// WMTS
// let wmts = new M.layer.WMTS({
//   url: "http://www.ideandalucia.es/geowebcache/service/wmts",
//   name: "toporaster",
//   matrixSet: "EPSG:25830",
//   legend: "Toporaster"
// }, {
//   format: 'image/png'
// });
// map.addWMTS(wmts);

// const mp = new Transparency({
//   position: 'TL',
//   layers: ['toporaster'],
// });

// map.addPlugin(mp);
// window.map = map;


// 1 WFS
// let wfs = "WFST*CapaWFS*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MPOLYGON";
// map.addWFS(wfs);

// const mp = new Transparency({
//   position: 'TL',
//   layers: ['Provincias'],
// });
// map.addPlugin(mp);


// WMTS + WMS
// let wmts = new M.layer.WMTS({
//   url: "http://www.ideandalucia.es/geowebcache/service/wmts",
//   name: "toporaster",
//   matrixSet: "EPSG:25830",
//   legend: "Toporaster"
// }, {
//   format: 'image/png'
// });
// map.addWMTS(wmts);

// const mp = new Transparency({
//   position: 'TL',
//   layers: ['toporaster', 'WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo'],
// });

// map.addPlugin(mp);
