import BackImgLayer from 'facade/backimglayer';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
  center: [-458756.9690741142, 4682774.665868655],
  layers: ['OSM'],
  zoom: 6,
});

// const i = new M.plugin.Information({});
// map.addPlugin(i);

const mp = new BackImgLayer({
  position: 'TR',
  collapsed: true,
  collapsible: true,
  tooltip: 'Capas de fondo',
  layerVisibility: false,
  columnsNumber: 0,
  empty: true,
  // Cuando no se pasa layerOpts, se usan los parámetros ids, titles, previews y layers
  // ids: 'mapa,hibrido',
  // titles: 'Mapa,Hibrido',
  // previews: '../src/facade/assets/images/svqimagen.png,../src/facade/assets/images/svqmapa.png',
  // layers: 'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true,WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*true',
  layerOpts: [
    {
      id: 'wms',
      title: 'WMS',
      preview: '../src/facade/assets/images/svqimagen.png',
      layers: [
        new M.layer.WMS({
          url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
          name: 'AU.AdministrativeUnit',
          legend: 'Unidad administrativa',
          tiled: false,
          transparent: false,
          displayInLayerSwitcher: false,
          visible: true,
          useCapabilities: false,
        }),
      ],
    },
    {
      id: 'tms',
      preview: 'https://www.ign.es/iberpix/static/media/raster.c7a904f3.png',
      title: 'TMS',
      layers: [
        new M.layer.TMS({
          url: 'https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png',
          name: 'IGNBaseOrto',
          legend: 'Topónimos',
          projection: 'EPSG:3857',
          transparent: false,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          tileGridMaxZoom: 19,
        }),
      ],
    },
  ],
});

// const mp = new BackImgLayer({
//   collapsed: true,
//   collapsible: true,
//   position: 'BR',
//   columnsNumber: 3,
//   ids: ['mapa', 'hibrido'],
//   titles: ['Mapa', 'Hibrido'],
//   previews: ['../src/facade/assets/images/svqmapa.png', '../src/facade/assets/images/svqhibrid.png'],
//   layers: ['WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true', 'WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*true+WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseOrto*GoogleMapsCompatible*Mapa IGN*true*image/jpeg*false*false*true'],
// });


// Formato parámetros REST:
// ids: 'mapa,hibrido',
// titles: 'Mapa,Hibrido',
// previews: '', // '../src/facade/assets/images/svqmapa.png,
// ../src/facade/assets/images/svqhibrid.png',
// layers: 'WMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseTodoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscofalseasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue,WMTSasteriscohttps://www.ign.es/wmts/pnoa-ma?asteriscoOI.OrthoimageCoverageasteriscoGoogleMapsCompatibleasteriscoImagen (PNOA)asteriscofalseasteriscoimage/pngasteriscofalseasteriscofalseasteriscotruesumarWMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseOrtoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscotrueasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue',


map.addPlugin(mp);
// map.addPlugin(mp2);
/* map.addLayers(new M.layer.WMTS({
  url: 'https://www.ign.es/wmts/pnoa-ma?',
  name: 'OI.OrthoimageCoverage',
  matrixSet: 'GoogleMapsCompatible',
  legend: 'Imagen',
  transparent: true,
  displayInLayerSwitcher: false,
  queryable: false,
  visible: true,
  format: 'image/jpeg',
  minZoom: 10,
})); */

window.map = map;
