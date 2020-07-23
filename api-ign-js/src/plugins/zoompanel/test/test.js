import ZoomPanel from 'facade/zoompanel';

M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});
const mp = new ZoomPanel({
  position: 'TL',
  collapsed: true,
  collapsible: true,
});

map.addPlugin(mp);
window.map = map;
