const map = M.map({
  container: 'map',
  controls: ['panzoom', 'panzoombar', 'scale*true', 'scaleline', 'rotate', 'location', 'getfeatureinfo'],
  zoom: 5,
  center: [-467062.8225, 4683459.6216],
  getfeatureinfo: "html",
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
