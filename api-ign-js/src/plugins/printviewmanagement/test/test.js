import PrintViewManagement from 'facade/printviewmanagement';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
  zoom: 9,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4683459.6216],
});

const mp = new PrintViewManagement({
  isDraggable: true,
  position: 'TL',
  collapsible: true,
  collapsed: true,
  order: 1,
  serverUrl: 'https://geoprint.desarrollo.guadaltel.es',
  printTemplateUrl: 'https://geoprint.desarrollo.guadaltel.es/print/mapexport',
  printStatusUrl: 'https://geoprint.desarrollo.guadaltel.es/print/status',
  georefImageEpsg: {
    tooltip: 'Georeferenciar imagen',
    layers: [ // Posibilidad de hacer Getmap
      {
        url: 'http://www.ign.es/wms-inspire/mapa-raster?',
        name: 'mtn_rasterizado',
        format: 'image/jpeg',
        legend: 'Mapa ETRS89 UTM',
        EPSG: 'EPSG:4258',
      },
      {
        url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        format: 'image/jpeg',
        legend: 'Imagen (PNOA) ETRS89 UTM',
      },
    ],
  },
  georefImage: {
    tooltip: 'Georeferenciar imagen',
  },
  viewhistory: true,
  zoompanel: true,
});

map.addPlugin(mp);

window.map = map;
window.mp = mp;
