import { map } from 'M/mapea';
import WMS from 'M/layer/WMS';

window.mapjs = map({
  container: 'map',
  controls: ['scale*true', 'scaleline', 'rotate', 'panzoombar', 'panzoom', 'location'],
  getfeatureinfo: true,
});


const layerUA = new WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false
}, {});

mapjs.addLayers(layerUA)
