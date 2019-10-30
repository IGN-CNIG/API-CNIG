const map = M.map({
  container: 'map',
  zoom: 5,
  maxZoom: 17,
  minZoom: 5,
  center: [-467062.8225, 4683459.6216],
});

// const layerinicial = new M.layer.WMS({
//   url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeBoundary',
//   legend: 'Limite administrativo',
//   tiled: false,
// }, {});

// const campamentos = new M.layer.GeoJSON({
//   name: 'Campamentos',
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
//   extract: true,
// });

// const selectiondraw = new M.plugin.SelectionDraw({
//   projection: 'EPSG:3857',
// });
// selectiondraw.on('finished:draw', (feature) => {
//   console.log(feature);
// });
// map.addPlugin(selectiondraw);

const mp = new M.plugin.EditionTools(9);

const provincias = new M.layer.GeoJSON({ name: 'Provincias', url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json', extract: false });
const lineas = new M.layer.GeoJSON({ name: 'Provincias', url: 'https://gischgdes.chguadalquivir.es/geoserver/chg/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chg:act2009&maxFeatures=50&outputFormat=application/json', extract: false });
const puntos = new M.layer.GeoJSON({ name: 'Provincias', url: 'https://gischgdes.chguadalquivir.es/geoserver/chg/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chg:vertidos_no_autorizados&maxFeatures=50&outputFormat=application/json', extract: false });

map.addLayers([provincias, lineas, puntos]);


map.addPlugin(mp);

window.map = map;
