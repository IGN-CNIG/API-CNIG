import SRSselector from 'facade/srsselector';

const map = M.map({
  container: 'mapjs',
  layers: ['OSM']
});

const mp = new SRSselector({
  position: 'TR',
  projections: [
    // Param: [projection1, projection2, etc.]
    // Projection1 =  {title, code, units(m/d)}
    // { title: 'WGS84 (4326)', code: 'EPSG:4326', units: 'd' },
    // { title: 'ETRS89/UTM zone 31N (25831)', code: 'EPSG:25831', units: 'm' },
  ],
});

map.addPlugin(mp);

window.map = map;
