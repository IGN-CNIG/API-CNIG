import Information from 'facade/information';

// M.language.setLang('en');
M.config('MOVE_MAP_EXTRACT', true);

const map = M.map({
  container: 'mapjs',
  controls: ['location'],
  // zoom: 7,
  zoom: 17,
  layers: ['OSM'],
  // center: [-447979.2542807377, 4849659.371752165],
  center: [-698506.5558722795, 4371375.632927578],
});

const mp = new Information({
  position: 'TR',
  buffer: 100,
  opened: 'all',
});

const mp2 = new M.plugin.Infocoordinates({
  position: 'TR',
  decimalGEOcoord: 4,
  decimalUTMcoord: 4,
});

const mp3 = new M.plugin.Vectors({
  collapsed: true,
  collapsible: true,
  position: 'TR',
  wfszoom: 12,
});

const mp4 = new M.plugin.MeasureBar({ position: 'TR' });

const layer1 = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
  name: 'RED_NAP',
  legend: 'Red de Nivelación de Alta Presión',
  tiled: true,
  version: '1.1.0',
}, {});

const layer2 = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
  name: 'RED_ROI',
  legend: 'Red de Orden Inferior',
  tiled: true,
  version: '1.1.0',
}, {});

const layer3 = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
  name: 'RED_REGENTE',
  legend: 'Red REGENTE',
  tiled: true,
  version: '1.1.0',
}, {});

const layer4 = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
  name: 'RED_ERGNSS',
  legend: 'Red de Estaciones permanentes GNSS',
  tiled: true,
  version: '1.3.0',
}, {});

const layer5 = new M.layer.WMS({
  url: 'https://servicios.ine.es/WMS/WMS_INE_SECCIONES_G01/MapServer/WMSServer?',
  name: 'Secciones2021',
  legend: 'Secciones censales',
  version: '1.3.0',
  tiled: false,
  visibility: true,
}, {});

const hidrografia = new M.layer.WMS({
  url: 'https://servicios.idee.es/wms-inspire/hidrografia',
  name: 'HY.Network',
  legend: 'Red hidrográfica',
  tiled: true,
});

const testLayer = new M.layer.WMTS({
  url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
  name: 'catastrones',
  legend: 'catastrones',
  matrixSet: 'GoogleMapsCompatible',
  transparent: true,
  displayInLayerSwitcher: false,
  queryable: true,
  visible: true,
  format: 'image/jpeg',

});

// map.addLayers([layer1/*, layer2, layer3, layer4*/]);
map.addLayers([hidrografia]);
map.addPlugin(mp);

map.addPlugin(new M.plugin.FullTOC({
  collapsed: true,
  collapsible: true,
  position: 'TL',
  https: true,
  http: true,
  codsi: true,
}));

// map.addPlugin(mp2);
// map.addPlugin(mp3);
// map.addPlugin(mp4);
// window.mp = mp;
window.map = map;
