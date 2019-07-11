const map = M.map({
  container: 'map',
  controls: ['panzoom', 'panzoombar', 'scale*true', 'scaleline', 'rotate', 'location'],
  zoom: 5,
  center: [-467062.8225, 4683459.6216],
  getfeatureinfo: true,
});

const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

const layerUA = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false
}, {});


const kml = new M.layer.KML('KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*false*false');


map.addLayers([layerinicial, layerUA, kml]);

const mp2 = new M.plugin.Attributions({
  mode: 1,
  scale: 10000,
  defaultAttribution: 'Instituto Geográfico Nacional',
  defaultURL: 'https://www.ign.es/',
});
map.addPlugin(mp2);
