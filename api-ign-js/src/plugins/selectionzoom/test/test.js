import SelectionZoom from 'facade/selectionzoom';

const map = M.map({
  container: 'mapjs',
});

const mp = new SelectionZoom({
  position: 'TL',
  collapsible: true,
  collapsed: true,
  layerId: 0,
  layerVisibility: true,
  layerOpts: [{
      id: 'peninsula',
      preview: '../src/facade/assets/images/espana.png',
      title: 'Peninsula',
      layers: [new M.layer.WMTS({
          url: 'http://www.ign.es/wmts/pnoa-ma?',
          name: 'OI.OrthoimageCoverage',
          legend: 'Imagen (PNOA)',
          matrixSet: 'GoogleMapsCompatible',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
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
    {
      id: 'canarias',
      title: 'Canarias',
      preview: '../src/facade/assets/images/canarias.png',
      layers: [new M.layer.WMTS({
          url: 'http://www.ign.es/wmts/pnoa-ma?',
          name: 'OI.OrthoimageCoverage',
          legend: 'Imagen (PNOA)',
          matrixSet: 'GoogleMapsCompatible',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
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
    {
      id: 'baleares',
      title: 'Baleares',
      preview: '../src/facade/assets/images/baleares.png',
      layers: [new M.layer.WMTS({
          url: 'http://www.ign.es/wmts/pnoa-ma?',
          name: 'OI.OrthoimageCoverage',
          legend: 'Imagen (PNOA)',
          matrixSet: 'GoogleMapsCompatible',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
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
    {
      id: 'ceuta',
      preview: '../src/facade/assets/images/ceuta.png',
      title: 'Ceuta',
      layers: [new M.layer.WMTS({
          url: 'http://www.ign.es/wmts/pnoa-ma?',
          name: 'OI.OrthoimageCoverage',
          legend: 'Imagen (PNOA)',
          matrixSet: 'GoogleMapsCompatible',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
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
    {
      id: 'melilla',
      preview: '../src/facade/assets/images/melilla.png',
      title: 'Melilla',
      layers: [new M.layer.WMTS({
          url: 'http://www.ign.es/wmts/pnoa-ma?',
          name: 'OI.OrthoimageCoverage',
          legend: 'Imagen (PNOA)',
          matrixSet: 'GoogleMapsCompatible',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
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
});
// Formato parámetros REST:
// ids: 'mapa,hibrido',
// titles: 'Mapa,Hibrido',
// previews: '', // '../src/facade/assets/images/svqmapa.png,
// ../src/facade/assets/images/svqhibrid.png',
// layers: 'WMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseTodoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscofalseasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue,WMTSasteriscohttps://www.ign.es/wmts/pnoa-ma?asteriscoOI.OrthoimageCoverageasteriscoGoogleMapsCompatibleasteriscoImagen (PNOA)asteriscofalseasteriscoimage/pngasteriscofalseasteriscofalseasteriscotruesumarWMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseOrtoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscotrueasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue',


map.addPlugin(mp);

window.map = map;
