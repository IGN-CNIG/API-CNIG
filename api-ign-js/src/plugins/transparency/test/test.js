import Transparency from 'facade/transparency';

const map = M.map({
  container: 'mapjs',
});


// 1 WMS
const pluginTransparency = new Transparency({
  position: 'TL',
  layers: ['WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico?*PNOA2017*true*true'],
  collapsible: false
});

map.addPlugin(pluginTransparency);
window.map = map;