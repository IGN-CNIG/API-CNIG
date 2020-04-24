import SelectionZoom from 'facade/selectionzoom';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
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
});

const mp = new SelectionZoom({
  position: 'TL',
  collapsible: true,
  collapsed: true,
  layerId: 0,
  layerVisibility: true,
  ids: 'peninsula,canarias,baleares,ceuta,melilla',
  titles: 'Peninsula,Canarias,Baleares,Ceuta,Melilla',
  previews: '../src/facade/assets/images/espana.png,../src/facade/assets/images/canarias.png,../src/facade/assets/images/baleares.png,../src/facade/assets/images/ceuta.png,../src/facade/assets/images/melilla.png',
  bboxs: '-1200091.444315327, 365338.89496508264, 4348955.797933925, 5441088.058207252, -2170190.6639824593, -1387475.4943422542, 3091778.038884449, 3637844.1689537475 , 115720.89020469127, 507078.4750247937, 4658411.436032817, 4931444.501067467,-599755.2558583047, -587525.3313326766, 4281734.817081453, 4290267.100363785, -334717.4178261766, -322487.4933005484, 4199504.016876071, 4208036.300158403',
  zooms: '7,8,9,14,14',
  // layerOpts: [{
  //     id: 'peninsula',
  //     preview: '../src/facade/assets/images/espana.png',
  //     title: 'Peninsula',
  //     bbox: [-1200091.444315327, 365338.89496508264, 4348955.797933925, 5441088.058207252],
  //     zoom: '7',
  //   },
  //   {
  //     id: 'canarias',
  //     title: 'Canarias',
  //     preview: '../src/facade/assets/images/canarias.png',
  //     bbox: [-2170190.6639824593, -1387475.4943422542, 3091778.038884449, 3637844.1689537475],
  //     zoom: '8',
  //   },
  //   {
  //     id: 'baleares',
  //     title: 'Baleares',
  //     preview: '../src/facade/assets/images/baleares.png',
  //     bbox: [115720.89020469127, 507078.4750247937, 4658411.436032817, 4931444.501067467],
  //     zoom: '9',
  //   },
  //   {
  //     id: 'ceuta',
  //     preview: '../src/facade/assets/images/ceuta.png',
  //     title: 'Ceuta',
  //     bbox: [-599755.2558583047, -587525.3313326766, 4281734.817081453, 4290267.100363785],
  //     zoom: '14',
  //   },
  //   {
  //     id: 'melilla',
  //     preview: '../src/facade/assets/images/melilla.png',
  //     title: 'Melilla',
  //     bbox: [-334717.4178261766, -322487.4933005484, 4199504.016876071, 4208036.300158403],
  //     zoom: '14',
  //   },
  // ],
});

map.addPlugin(mp);

window.map = map;
