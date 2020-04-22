import Information from 'facade/information';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
});

const mp = new Information({
  position: 'TR',
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

const capaPuntosLimpios = new M.layer.WMS({
  url: 'http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_puntos_limpios?',
  name: 'puntos_limpios',
  legend: 'Puntos Limpios',
});


map.addLayers([layerinicial, capaPuntosLimpios]);
map.addPlugin(mp);
// window.mp = mp;
window.map = map;
