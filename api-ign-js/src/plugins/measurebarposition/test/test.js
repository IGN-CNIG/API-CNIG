import MeasureBar from 'facade/measurebar';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});

const plugin = new MeasureBar();

const mp = new M.plugin.Infocoordinates({
  position: 'TR',
  decimalGEOcoord: 4,
  decimalUTMcoord: 4,
});

const mp2 = new M.plugin.Information({
  position: 'TR',
  buffer: 100,
});

const mp3 = new M.plugin.Vectors({
  collapsed: true,
  collapsible: true,
  position: 'TR',
  wfszoom: 12,
});

map.addPlugin(plugin);
map.addPlugin(mp);
map.addPlugin(mp2);
map.addPlugin(mp3);

window.plugin = plugin;
window.map = map;

document.addEventListener("testTemporalDeMeasurePosition",function (e){
  plugin.measurePosition_.impl_.setCoordLocationStart(e.coordinates);
});