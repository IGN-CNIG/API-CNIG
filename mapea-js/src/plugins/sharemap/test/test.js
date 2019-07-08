import ShareMap from 'facade/sharemap';

let layerRasterMTN = new M.layer.WMTS("WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*EPSG:4326*Leyenda*true");


const map = M.map({
  container: 'mapjs',
  controls: ['layerswitcher', 'overviewmap', 'scale*true', 'location', 'mouse'],
  zoom: 3,
  layers: [layerRasterMTN],
  projection: 'EPSG:4326*d',
  center: [-3.8972, 38.4492],
});


map.removeControls(["panzoombar"]);

const mp = new ShareMap({
  baseUrl: 'https://cnigvisores_pub.desarrollo.guadaltel.es/mapea/',
  position: 'BR',
});

map.addPlugin(mp);
// map.addKML(new M.layer.KML("KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/*arbda_sing_se.kml*true"))
window.map = map;
