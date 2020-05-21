import Infocoordinates from 'facade/infocoordinates';

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  center: [-467062.8225, 4783459.6216],

});




const mp = new Infocoordinates();

map.addPlugin(mp);

window.map = map;
