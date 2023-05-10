import ViewManagement from 'facade/viewmanagement';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new ViewManagement({
  isDraggable: true,
  position: 'TL',
  collapsible: true,
  collapsed: true,
  order: 1,
  predefinedZoom: [{
    name: 'zoom 1',
    center: [-428106.86611520057, 4334472.25393817],
    zoom: 4,
  },
  {
    name: 'zoom 2',
    bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
  }],
  zoomExtent: true,
  viewhistory: true,
  zoompanel: true,
});

map.addPlugin(mp);

window.map = map;
window.mp = mp;
