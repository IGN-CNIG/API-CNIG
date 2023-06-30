import { map, proxy } from 'M/mapea';
import KML from 'M/layer/KML';
import { ADD_KML, LOAD } from 'M/event/eventtype';
import Point from 'M/style/Point';


proxy(false); // Desactiva el proxy para poder usar KML local



const mapjs = map({
  container: 'map',
  controls: ['scaleline', 'panzoombar', 'location', 'getfeatureinfo', 'rotate', 'backgroundlayers'],
  bbox: [-741439.1743662109, 4456431.623082354, -599801.3609537793, 4517428.371653925]
});

const LayerKml = new KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'Delegaciones IGN',
  // layerSegregation: true,
  // showPointNames: true,
}, {
  scaleLabel: 3
});

mapjs.addKML(LayerKml);


// const LayerKml = new KML({
//   url: 'http://localhost:8080/test/development/layers/kmlFeatures.kml',
//   name: 'features',
//   extract: true
// }, {
//   //scaleLabel: 3
// });

// LayerKml.on(LOAD, () => {
//   // e = LayerKml.getFeatures()[0].getImpl().getOLFeature().getStyle()(LayerKml.getFeatures()[0].getImpl().getOLFeature());
//   // console.log(e)
//   const f = LayerKml.getFeatures()[0].getImpl().getOLFeature();
//   console.log(f.getStyle()(f).getText().getOffsetX());
// });

mapjs.addKML(LayerKml);

window.mapjs = mapjs;
window.Layer = LayerKml;
