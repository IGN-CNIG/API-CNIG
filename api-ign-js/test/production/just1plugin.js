const map = M.map({
  container: 'map',
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

// OVERVIEW
// const mp = new M.plugin.OverviewMap({
//   position: 'BR',
// });
// map.addLayers(['WMS*Limites*http://www.ideandalucia.es/wms/mta10v_2007?*Limites*false', 'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?']);

const printer = new M.plugin.Printer({
  collapsed: true,
  collapsible: true,
  position: 'TR',
});

const mp3 = new M.plugin.ShareMap({
  baseUrl: 'https://api-ign-lite.desarrollo.guadaltel.es/api-core/',
  position: 'BR',
});

const mp2 = new M.plugin.Attributions({
  mode: 1,
  scale: 10000,
});

// const selectiondraw = new M.plugin.SelectionDraw({
//   projection: 'EPSG:3857',
// });
// selectiondraw.on('finished:draw', (feature) => {
//   console.log(feature);
// });
// map.addPlugin(selectiondraw);

map.addLayers([layerinicial, campamentos]);
map.addPlugin(printer);
map.addPlugin(mp3);
map.addPlugin(mp2);

window.map = map;
