import IGNSearchLocator from 'facade/ignsearchlocator';

// M.language.setLang('en');


const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
});

const mp = new IGNSearchLocator({
  servicesToSearch: 'gn',
  searchPosition: 'geocoder,nomenclator',
  maxResults: 10,
  isCollapsed: false,
  position: 'TL',
  reverse: true,
  helpUrl: 'https://visores-cnig-gestion-publico.desarrollo.guadaltel.es/iberpix/help?node=node107',
});

// map.removeControls('panzoom');

map.addPlugin(mp);

window.map = map;
