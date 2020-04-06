import Georefimage from 'facade/georefimage';

M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4683459.6216],
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
const georefimage = new Georefimage({
  collapsed: true,
  collapsible: true,
  position: 'TR',
});
map.addLayers([layerinicial, campamentos]);
map.addPlugin(georefimage);
window.map = map;
