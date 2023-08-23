M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});
const mp = new M.plugin.HistoryMap();
map.addPlugin(mp);
