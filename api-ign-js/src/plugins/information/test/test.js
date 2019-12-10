import Information from 'facade/information';

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
});

const mp = new Information({
  position: 'BR',
});

const layerinicial = new M.layer.WMS({
  url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
  name: 'Catastro',
  legend: 'Catastro',
  tiled: false,
  version: '1.1.1',
}, { visibility: true, displayInLayerSwitcher: true, queryable: true });

const campamentos = new M.layer.GeoJSON({
  name: 'Campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
  extract: true,
});

map.addLayers([layerinicial, campamentos]);
map.addPlugin(mp);
window.mp = mp;
window.map = map;
