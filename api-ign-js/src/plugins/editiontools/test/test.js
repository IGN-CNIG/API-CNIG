import EditionTools from 'facade/editiontools';

const map = M.map({container: 'mapjs', projection: 'EPSG:4326*d'});

const mp = new EditionTools(9);
// const provincias = new M.layer.GeoJSON({ name: 'Provincias', url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json', extract: false });
M.proxy(false);
// map.addLayers(provincias);
// const style1 = new ol.style.Style({
//   stroke: new ol.style.Stroke({ color: '#0000FF', width: 8 }),
//   fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
// });
// setTimeout(() => {
//   provincias.getImpl().getOL3Layer().getSource().getFeatures()
//     .forEach((feature) => {
//       feature.setStyle(style1);
//     });
// }, 3000);
map.addLayers([new M.layer.OSM()]);
map.setCenter([-5.956278073296221, 37.387066050519486]);
map.setZoom(10);
// provincias.getImpl().getOL3Layer().set('vendor.mapaalacarta.selectable', true);
map.addControls(['layerswitcher']);
map.addPlugin(mp);

window.map = map;
