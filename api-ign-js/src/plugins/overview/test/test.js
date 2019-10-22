import Overview from 'facade/overview';

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  maxZoom: 17,
  minZoom: 5,
  center: [-467062.8225, 4683459.6216],
});

const mp = new Overview({
  collapsed: true,
  collapsible: true,
  position: 'BR',
  baseLayer: 'WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*PNOA*false*image/jpeg*false*false*true',
});

map.addPlugin(mp);

window.map = map;

// WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*PNOA*false*image/jpeg*false*false*true
// WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true
// WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*true+WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseOrto*GoogleMapsCompatible*Mapa IGN*true*image/jpeg*false*false*true',

//  layers: [new M.layer.WMTS({
//    url: 'http://www.ign.es/wmts/pnoa-ma?',
//    name: 'OI.OrthoimageCoverage',
//    legend: 'Imagen (PNOA)',
//    matrixSet: 'GoogleMapsCompatible',
//    transparent: false,
//    displayInLayerSwitcher: false,
//    queryable: false,
//    visible: true,
//    format: 'image/jpeg',
//  })],
