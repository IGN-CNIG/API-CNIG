import OverviewMap from 'facade/overviewmap';

const map = M.map({
  center: [-467062.8225, 4783459.6216],
  container: 'mapjs',
  zoom: 5,
});


const mp = new OverviewMap({
  position: 'BR',
}, {
  collapsed: false,
  collapsible: true,
});

map.addPlugin(mp);

window.map = map;
