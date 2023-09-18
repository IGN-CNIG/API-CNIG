import PrintViewManagement from 'facade/printviewmanagement';

M.language.setLang('es');

const suelo = new M.layer.WMTS({
  url: 'https://servicios.idee.es/wmts/ocupacion-suelo?',
  name: 'LU.ExistingLandUse',
  legend: 'Ocupación del suelo WMTS',
  matrixSet: 'GoogleMapsCompatible',
  maxZoom: 20,
  minZoom: 4,
  visibility: true,
}, { crossOrigin: 'anonymous' });

const map = M.map({
  container: 'mapjs',
  zoom: 9,
  maxZoom: 20,
  minZoom: 4,
  layers: [suelo],
  center: [-467062.8225, 4683459.6216],
});

// añadir wmts API-CNIG {url: 'http://www.ign.es/wms-inspire/mapa-raster?', name: 'mtn_rasterizado',format: 'image/jpeg',legend: 'Mapa ETRS89 UTM',EPSG: 'EPSG:4258',},
// WMTS -> OK

const mp = new PrintViewManagement({
  isDraggable: true,
  position: 'TL',
  collapsible: true,
  collapsed: true,
  tooltip: 'Imprimir',
  serverUrl: 'https://componentes.cnig.es/geoprint',
  printStatusUrl: 'https://componentes.cnig.es/geoprint/print/status',
  defaultOpenControl: 3,
  georefImageEpsg: {
    tooltip: 'Georeferenciar imagen',
    layers: [
      {
        url: 'http://www.ign.es/wms-inspire/mapa-raster?',
        name: 'mtn_rasterizado',
        format: 'image/jpeg',
        legend: 'Mapa ETRS89 UTM',
        EPSG: 'EPSG:4326',
      },
      {
        url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        format: 'image/jpeg',
        legend: 'Imagen (PNOA) ETRS89 UTM',
        // EPSG: 'EPSG:4258',
      },
    ],
  },
  georefImage: {
    tooltip: 'Georeferenciar imagen',
    printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/mapexport',
    printSelector: true,
    // printType: 'client', // 'client' or 'server'
  },
  printermap: {
    printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/CNIG',
    // fixedDescription: true,
    headerLegend: 'https://www.idee.es/csw-codsi-idee/images/cabecera-CODSI.png',
    filterTemplates: ['A3 Horizontal'],
    logo: 'https://www.idee.es/csw-codsi-idee/images/cabecera-CODSI.png',
  },
});


map.addPlugin(mp);

window.map = map;
window.mp = mp;
