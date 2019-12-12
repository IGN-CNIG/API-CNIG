import IGNSearchLocator from 'facade/ignsearchlocator';

const map = M.map({
  container: 'mapjs',
});

const mp = new IGNSearchLocator({ position: 'TL' });

// map.removeControls('panzoom');

map.addPlugin(mp);

window.map = map;
