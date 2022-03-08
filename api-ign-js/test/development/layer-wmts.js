import { map } from 'M/mapea';
import WMTS from 'M/layer/WMTS';

const mapajs = map({
  container: 'map',
  layers: ['WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA'],
  center: [363063, 4150610],
  zoom: '4',
  controls: ['layerswitcher'],
});

// OPCION 2: Con el metodo addLayers
const layer = new WMTS({
  url: 'http://www.ideandalucia.es/geowebcache/service/wmts',
  name: 'toporaster',
  matrixSet: 'EPSG:25830',
  legend: 'Toporaster',
});

mapajs.addWMTS(layer);
