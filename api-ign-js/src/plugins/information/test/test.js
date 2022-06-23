import Information from 'facade/information';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  controls: ['location'],
  zoom: 7,
  layers: [],
  center: [-447979.2542807377, 4849659.371752165],
});

const mp = new Information({
  position: 'TR',
  buffer: 100,
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

const layerinicial = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

const layerUA = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});

const hidrografia = new M.layer.WMS({
  url: 'http://servicios.idee.es/wms-inspire/hidrografia?',
  name: 'HY.PhysicalWaters.HydroPointOfInterest',
  legend: 'Hidrografía',
});

map.addLayers([layerinicial, layerUA/*, hidrografia*/]);
map.addPlugin(mp);
map.addPlugin(mp2);
map.addPlugin(mp3);
map.addPlugin(mp4);
// window.mp = mp;
window.map = map;
