import { map as Mmap } from 'M/mapea';
import WMS from 'M/layer/WMS';

const map = Mmap({
  container: 'map',
  zoom: 4,
  minZoom: 2,
  maxZoom: 10,
  getfeatureinfo: true,
  controls: ["scale", "scaleline", "panzoombar", "panzoom", "location", "getfeatureinfo", "rotate", "backgroundlayers"]
});

const layerUA = new WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false
}, {});

map.addLayers(layerUA);
window.map = map;
