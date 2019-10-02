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
  position: 'TR',
  url: 'https://geoprint.desarrollo.guadaltel.es/print/CNIG',
  params: {
    layout: {
      outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
    },
    pages: {
      clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
      creditos: 'Impresión generada a través de Mapea',
    },
    parameters: {
      imageSpain: 'file://E01_logo_IGN_CNIG.png',
      imageCoordinates: 'file://E01_logo_IGN_CNIG.png',
    },
  },
}, {
  options: {
    legend: 'true',
  },
});

// const selectiondraw = new M.plugin.SelectionDraw({
//   projection: 'EPSG:4326',
// });
// selectiondraw.on('finished:draw', (feature) => {
//   console.log(feature);
// });
// map.addPlugin(selectiondraw);

map.addLayers([layerinicial, campamentos]);
map.addPlugin(printer);

map.addPlugin(mp);

window.map = map;
