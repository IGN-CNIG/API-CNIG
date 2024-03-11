import Comparators from 'facade/comparators';

M.language.setLang('es');
// M.proxy(false);

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  bbox: [323020, 4126873, 374759, 4152013],
});


const viewmanagement = {
  name: 'ViewManagement',
  param: {},
};

const mp = new Comparators({
  position: 'TR',
  collapsed: false,
  collapsible: true,
  isDraggable: true,
  transparencyParams: false,
  lyrcompareParams: false,
  mirrorpanelParams: false,
  windowsyncParams: {
    controls: ['scale'],
    plugins: [
      viewmanagement,
    ],
  },
});

map.addPlugin(mp);
window.map = map;
