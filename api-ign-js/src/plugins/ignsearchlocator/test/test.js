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
});

// map.removeControls('panzoom');

map.addPlugin(mp);

window.map = map;
