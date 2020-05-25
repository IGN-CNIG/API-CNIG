import Infocoordinates from 'facade/infocoordinates';

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  center: [-467062.8225, 4783459.6216],

});


M.language.setLang('en');

const mp = new Infocoordinates({
  position: 'TL',
  decimalGEOcoord: "er",
  decimalUTMcoord: 15
});

map.addPlugin(mp);

window.map = map;
