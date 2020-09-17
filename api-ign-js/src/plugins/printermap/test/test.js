import PrinterMap from 'facade/printermap';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  zoom: 7,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4683459.6216],
  //projection: 'EPSG:4326*d',
  /*layers: [
    new M.layer.WMTS({
      url: 'http://www.ign.es/wmts/mapa-raster?',
      name: 'MTN',
      legend: 'Mapa',
      matrixSet: 'EPSG:4326',
      transparent: false,
      displayInLayerSwitcher: false,
      queryable: false,
      visible: true,
      format: 'image/png',
    }),
  ],*/
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

const printermap = new PrinterMap({
  collapsed: true,
  collapsible: true,
  position: 'TR',
  credits: 'Impresión generada desde Fototeca',
  georefActive: false,
  logo: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/iberpix/static/media/iberpix_es.f8428667.png',
});


map.addPlugin(printermap);

map.addPlugin(new M.plugin.Vectors({
  position: 'TR',
}));

map.addLayers([layerinicial, campamentos]);

window.map = map;
