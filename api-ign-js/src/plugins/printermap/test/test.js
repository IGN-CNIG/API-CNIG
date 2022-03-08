import PrinterMap from 'facade/printermap';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  zoom: 7,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4683459.6216],
  //projection: 'EPSG:4326*d',
  layers: [
    new M.layer.XYZ({
      url: 'https://tms-pnoa-ma.ign.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg',
      name: 'OI.OrthoimageCoverage',
      legend: 'Imagen',
      projection: 'EPSG:3857',
      transparent: false,
      displayInLayerSwitcher: false,
      queryable: false,
      visible: true,
    }),
  ],
});

const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

/* const campamentos = new M.layer.GeoJSON({
  name: 'Campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
  extract: true,
}); */

const printermap = new PrinterMap({
  collapsed: true,
  collapsible: true,
  position: 'TR',
  // credits: 'Impresión generada desde Fototeca Digital http://fototeca.cnig.es/',
  georefActive: true,
  // serverUrl: 'https://componentes.cnig.es/geoprint',
  // printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/CNIG',
  // printStatusUrl: 'https://componentes.cnig.es/geoprint/print/status',
  // fototeca: true,
});

map.addPlugin(printermap);

/*map.addPlugin(new M.plugin.Infocoordinates({
  position: 'TR',
  decimalGEOcoord: 6,
  decimalUTMcoord: 2,
}));*/

/*map.addPlugin(new M.plugin.IGNSearchLocator({
  servicesToSearch: 'gn',
  searchPosition: 'geocoder,nomenclator',
  maxResults: 10,
  isCollapsed: false,
  position: 'TL',
  reverse: true,
}));*/

map.addPlugin(new M.plugin.Vectors({
  position: 'TR',
}));

//map.addLayers([layerinicial, campamentos]);
//map.addLayers([campamentos]);

window.map = map;
