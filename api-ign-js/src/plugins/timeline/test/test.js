import Timeline from 'facade/timeline';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
  controls: ['panzoom', 'scale', 'scaleline', 'rotate', 'location', 'getfeatureinfo'],
});

const wfs = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON',
});

map.addWFS(wfs);


// 1 WMS y WMTS por url
const pluginTimeline = new Timeline({
  position: 'TR',
  layers: ['WMS*hil*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeBoundary', 'WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA', 'WMTS*http://servicios.idee.es/wmts/mdt?*EL.GridCoverage*EPSG:25830*mdt'],
  radius: ""
});


// 2 WMTS por url
// const pluginTimeline = new Timeline({
//   position: 'TL',
//   layers: ['WMTS*http://www.ideandalucia.es/geowebcache/service/wmts*toporaster'],
//   collapsible: false
// });

// WMS por url
// const pluginTimeline = new Timeline({
//   position: 'TL',
//   layers: ['WMS*hil*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeBoundary'],
//   collapsible: false
// });

// WMS*hil*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeBoundary
// WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas
// WMS*http://www.ideandalucia.es/wms/mdt_2016?*modelo_digital_terreno_2016_color

// WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*PNOA
// WMTS*http://www.ign.es/wmts/mapa-raster?*MTN*GoogleMapsCompatible*mtn
// WMTS*http://servicios.idee.es/wmts/ocupacion-suelo?*LC.LandCoverSurfaces*GoogleMapsCompatible*usoSuelo


// 3 WMS y WMTS como objetos
// let wmts = new M.layer.WMTS({
//   url: "http://www.ideandalucia.es/geowebcache/service/wmts",
//   name: "toporaster",
//   matrixSet: "EPSG:25830",
//   legend: "Toporaster"
// }, {
//   format: 'image/png'
// });
// map.addWMTS(wmts);

// const wms = new M.layer.WMS({
//   url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeBoundary',
//   legend: 'Limite administrativo',
//   tiled: false,
// }, {});

// map.addWMS(wms);

// const pluginTimeline = new Timeline({
//   position: 'TL',
//   layers: [wmts, wms],
//   collapsible: false
// });

// 4 WMS y WMTS por nombres
// const pluginTimeline = new Timeline({
//   position: 'TL',
//   layers: ['AU.AdministrativeBoundary'],
//   collapsible: false
// });

map.addPlugin(pluginTimeline);

window.map = map;
