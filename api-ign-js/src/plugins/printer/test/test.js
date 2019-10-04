import Printer from 'facade/printer';

const map = M.map({
  container: 'mapjs',
  // wmcfiles: ['cdau'],
});

const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

const campamentos = new M.layer.GeoJSON({
  name: 'Campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
  extract: true,
});

const mp = new Printer({
  collapsed: true,
  collapsible: true,
  position: 'TR',
});

map.addPlugin(mp);
map.addLayers([campamentos, layerinicial]);

window.map = map;
