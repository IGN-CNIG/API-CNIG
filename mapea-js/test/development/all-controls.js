import { map } from 'M/mapea';
import WMS from 'M/layer/WMS';

window.mapjs = map({
  container: 'map',
  controls: ['scale*true', 'scaleline', 'rotate', 'panzoombar', 'panzoom', 'location'],
  getfeatureinfo: true,
  projection: 'EPSG:25830*m',
});


const layerUA = new WMS({
  url: 'http://wms.dipucadiz.es/ideCadizWMS?',
  name: 'sig_ma_playas',
  legend: 'Unidad administrativa',
}, {});

mapjs.addLayers(layerUA)
