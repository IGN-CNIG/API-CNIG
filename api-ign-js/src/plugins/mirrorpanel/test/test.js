import Mirrorpanel from 'facade/mirrorpanel'; //Importación del plugin que desarrollamos para trabajar

M.language.setLang('es'); //Español
//M.language.setLang('en');//Inglés

/**
 * Definimos las capas con notación MAPEA
 */
const capasPNOA = ['WMS*PNOA 2004*https://www.ign.es/wms/pnoa-historico*PNOA2004',
  'WMS*PNOA 2005*https://www.ign.es/wms/pnoa-historico*PNOA2005',
  'WMS*PNOA 2006*https://www.ign.es/wms/pnoa-historico*PNOA2006',
  'WMS*PNOA 2007*https://www.ign.es/wms/pnoa-historico*PNOA2007',
  'WMS*PNOA 2008*https://www.ign.es/wms/pnoa-historico*PNOA2008',
  'WMS*PNOA 2009*https://www.ign.es/wms/pnoa-historico*PNOA2009',
  'WMS*PNOA 2010*https://www.ign.es/wms/pnoa-historico*PNOA2010',
  'WMS*PNOA 2011*https://www.ign.es/wms/pnoa-historico*PNOA2011',
  'WMS*PNOA 2012*https://www.ign.es/wms/pnoa-historico*PNOA2012',
  'WMS*PNOA 2013*https://www.ign.es/wms/pnoa-historico*PNOA2013',
  'WMS*PNOA 2014*https://www.ign.es/wms/pnoa-historico*PNOA2014',
  'WMS*PNOA 2015*https://www.ign.es/wms/pnoa-historico*PNOA2015',
  'WMS*PNOA 2016*https://www.ign.es/wms/pnoa-historico*PNOA2016',
  'WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico*PNOA2017',
  'WMS*PNOA 2018*https://www.ign.es/wms/pnoa-historico*PNOA2018',
];

const map = M.map({
  container: 'mapjs',
  center: {
    x: -667143.31,
    y: 4493011.77,
  },
  controls: ['scale', 'location'],
  projection: "EPSG:3857*m",
  zoom: 15,
});

/**
 * Añadimos un FullTOC para gestionar las capas Overlay
 */

const mpFullTOC = new M.plugin.FullTOC({
  position: 'TR',
  collapsed: true,
  http: true,
  https: true,
  precharged: {
    groups: [{
      name: 'Cartografía histórica',
      services: [{
        name: 'Planimetrías',
        type: 'WMS',
        url: 'https://www.ign.es/wms/minutas-cartograficas',
      },
      {
        name: 'Primeras ediciones de cartografía',
        type: 'WMTS',
        url: 'http://www.ign.es/wmts/primera-edicion-mtn',
      },
      ],
    },
    {
      name: 'Transporte',
      services: [{
        name: 'IDEE - Red de transporte',
        type: 'WMS',
        url: 'http://servicios.idee.es/wms-inspire/transportes?',
      },
      {
        name: 'ADIF - Red de transporte ferroviario',
        type: 'WMS',
        url: 'http://ideadif.adif.es/services/wms?',
      },
      ],
    },
    ],
    services: [{
      name: 'Ortofotografías del PNOA y  Vuelos',
      type: 'WMS',
      url: 'https://www.ign.es/wms/pnoa-historico',
    }],
  },
});

//map.addPlugin(mpFullTOC);

let backImgLayerParams = {
  position: 'TR',
  collapsible: true,
  collapsed: true,
  layerId: 0,
  layerVisibility: true,
  layerOpts: [
    {
      id: 'mapa',
      preview: 'http://componentes.ign.es/api-core/plugins/backimglayer/images/svqmapa.png',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
      })],
    },
    {
      id: 'imagen',
      title: 'Imagen',
      preview: 'http://componentes.ign.es/api-core/plugins/backimglayer/images/svqimagen.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
      })],
    },
    {
      id: 'raster',
      preview: '../src/templates/img/svqmtn.png',
      title: 'Ráster',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/mapa-raster?',
        name: 'MTN',
        legend: 'Mapa IGN',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
      })],
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      preview: 'http://componentes.ign.es/api-core/plugins/backimglayer/images/svqhibrid.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: true,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      }),
      new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'GoogleMapsCompatible',
        legend: 'Mapa IGN',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      })
      ],
    },
  ],
}
const mpBIL = new M.plugin.BackImgLayer(backImgLayerParams);
map.addPlugin(mpBIL);


const mpMirrorPanel = new Mirrorpanel({
  position: 'TR',
  collapsible: true, // El botón para desplegar/replegar el plugin no aparece (false) o sí aparece(true)
  collapsed: false, // El panel del plugin se muestra desplegado (false) o replegado (true)
  modeViz: 0,
  enabledPlugins: true, // Si el mapa principal tiene los controles M.plugin.BackImgLayer y M.plugin.FullTOC, se importan en mapas espejo
  mirrorLayers: capasPNOA, // Array de capas para los mapas espejo en formato StringAPICNIG
  enabledKeyFunctions: true, // Están habilitadas los comandos por teclado
  showCursors: true, // Se muestran los cursores
  backImgLayersParams: backImgLayerParams
});

map.addPlugin(mpMirrorPanel);