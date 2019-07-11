import { map as Mmap } from 'M/mapea';
import KML from 'M/layer/KML';

const map = Mmap({
  container: 'map',
  zoom: 4,
  minZoom: 2,
  maxZoom: 10,
});

window.map = map;

const kml2 = new KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'Delegaciones',
  extract: false,
  label: false,
});
// map.addLayers(kml2);

window.kml = kml2;
