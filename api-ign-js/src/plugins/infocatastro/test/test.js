import InfoCatastro from 'facade/infocatastro';
import ShareMap from '../../sharemap/src/facade/js/sharemap';


const map = M.map({
  container: 'mapjs',
});

const mp = new InfoCatastro({
  position: 'TR',
  tooltip: 'Consultar Catastro',
});

const mp2 = new ShareMap({
  baseUrl: 'https://mapea-lite.desarrollo.guadaltel.es/api-core/',
  position: 'BR',
});

map.addPlugin(mp);
map.addPlugin(mp2);
