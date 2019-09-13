import ViewHistory from 'facade/viewhistory';

const map = M.map({
  container: 'mapjs',
});

const mp = new ViewHistory({
  position: 'TL',
});

map.addPlugin(mp);

window.map = map;
