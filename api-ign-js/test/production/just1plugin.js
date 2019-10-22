const map = M.map({
  container: 'map',
<<<<<<< HEAD
});

const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
=======
  zoom: 5,
  maxZoom: 17,
  minZoom: 5,
  center: [-467062.8225, 4683459.6216],
});

const layerinicial = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
>>>>>>> Se resuelve conflicto
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

<<<<<<< HEAD
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
=======
const mp = new M.plugin.Overview();
const mp2 = new M.plugin.TOC();

const mp3 = new M.plugin.BackImgLayer({
  position: 'TR',
  layerId: 0,
  layerVisibility: true,
  layerOpts: [{
      id: 'mapa',
      preview: 'plugins/backimglayer/images/svqmapa.png',
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
        visibility: true,
        format: 'image/jpeg',
      })],
    },
    {
      id: 'imagen',
      title: 'Imagen',
      preview: 'plugins/backimglayer/images/svqimagen.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visibility: true,
        format: 'image/jpeg',
      })],
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      preview: 'plugins/backimglayer/images/svqhibrid.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visibility: true,
        format: 'image/jpeg',
      }, {
        format: 'image/png',
      }), new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'GoogleMapsCompatible',
        legend: 'Mapa IGN',
        transparent: true,
        displayInLayerSwitcher: false,
        queryable: false,
        visibility: true,
        format: 'image/png',
      })],
    },
    {
      id: 'lidar',
      preview: 'plugins/backimglayer/images/svqlidar.png',
      title: 'LIDAR',
      layers: [new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        name: 'EL.GridCoverageDSM',
        legend: 'Modelo Digital de Superficies LiDAR',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visibility: true,
        format: 'image/png',
      })],
    },
  ],
});


map.addPlugin(mp);
map.addPlugin(mp2);
map.addPlugin(mp3);
map.addLayers(layerinicial);
>>>>>>> Se resuelve conflicto

window.map = map;
