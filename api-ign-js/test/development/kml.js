import { map } from 'M/mapea';
import KML from 'M/layer/KML';
import MouseSRS from 'plugins/mousesrs/facade/js/mousesrs';

const mapjs = map({
  container: 'map',
  controls: ['scaleline', 'panzoombar', 'location', 'getfeatureinfo', 'rotate', 'backgroundlayers']
});


const mp7 = new MouseSRS({
  projection: 'EPSG:4326',
});

mapjs.addPlugin(mp7);


const LayerKml = new KML({
  url: 'http://mapea-sigc.juntadeandalucia.es/sepim_server/api/datos/kml/1193/item/341',
  name: 'capaKML',
  extract: true,
});

mapjs.addKML(LayerKml);

window.Layer = LayerKml;
