import Curtain from 'facade/curtain';

// const wms = new M.layer.WMS({
//   url: 'http://www.ign.es/wms-inspire/ign-base',
//   name: 'IGNBaseTodo',
//   // legend: 'Limite administrativo',
//   tiled: false,
// }, {});

const map = M.map({
  container: 'mapjs',
  // layers: ['OSM'],
  collapsible: false,
  zoom: 3
});

let wmts = new M.layer.WMTS({
  url: "http://www.ideandalucia.es/geowebcache/service/wmts",
  name: "toporaster",
  matrixSet: "EPSG:25830",
  legend: "Toporaster"
}, {
  format: 'image/png'
});
map.addWMTS(wmts);


// map.addWMS(wms);

// cortina(event) {
//   var ctx = event.context;
//   var width = ctx.canvas.width;

//   ctx.save();
//   ctx.beginPath();
//   ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
//   ctx.clip();
// }

// wms.on('postcompose', function(event) {
//   var ctx = event.context;
//   ctx.restore();
// });


const mp = new Curtain();

map.addPlugin(mp);
