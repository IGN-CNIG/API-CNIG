import ShareMap from 'facade/sharemap';

let layerRasterMTN = new M.layer.WMTS("WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*EPSG:4326*Leyenda*true");


const map = M.map({
  container: 'mapjs',
  controls: ['scale*true', 'location'],
  zoom: 3,
  layers: [layerRasterMTN],
});

const mp = new ShareMap({
  baseUrl: 'https://mapea-lite.desarrollo.guadaltel.es/api-core/',
  position: 'BR',
});

map.addPlugin(mp);
// map.addKML(new M.layer.KML("KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/*arbda_sing_se.kml*true"))
window.map = map;
const kml2 = new M.layer.KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'Delegaciones',
  extract: false,
  label: false,
});
map.addLayers(kml2);
