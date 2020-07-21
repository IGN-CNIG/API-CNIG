import Infocoordinates from 'facade/infocoordinates';

const map = M.map({
  container: 'mapjs',
  zoom: 7,
  center: [-467062.8225, 4783459.6216],

});


M.language.setLang('es');

const mp = new Infocoordinates({
  position: 'TR',
  decimalGEOcoord: 'er',
  decimalUTMcoord: 4,
});

map.addPlugin(mp);

window.map = map;
