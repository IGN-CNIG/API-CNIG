import OverviewMap from 'facade/overviewmap';

const map = M.map({
  container: 'mapjs',
});

const mp = new OverviewMap();

map.addPlugin(mp);
