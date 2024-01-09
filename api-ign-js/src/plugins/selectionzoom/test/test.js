import SelectionZoom from 'facade/selectionzoom';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
  zoom: 4,
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
  ],
});

const mp = new SelectionZoom({
  position: 'TR',
  collapsible: true,
  collapsed: true,
  options: [{
      id: 'peninsula',
      preview: '../src/facade/assets/images/espana.png',
      title: 'Peninsula',
      bbox: '-1200091.444315327, 4348955.797933925, 365338.89496508264, 5441088.058207252',
    },
    {
      id: 'canarias',
      title: 'Canarias',
      preview: '../src/facade/assets/images/canarias.png',
      center: '-1844272.618465, 3228700.074766',
      zoom: 8,
    },
    {
      id: 'baleares',
      title: 'Baleares',
      preview: '../src/facade/assets/images/baleares.png',
      bbox: '115720.89020469127,4658411.436032817,507078.4750247937,4931444.501067467',
    },
    {
      id: 'ceuta',
      preview: '../src/facade/assets/images/ceuta.png',
      title: 'Ceuta',
      bbox: '-599755.2558583047, 4281734.817081453, -587525.3313326766, 4290267.100363785',
      zoom: 8
    },
    {
      id: 'melilla',
      preview: '../src/facade/assets/images/melilla.png',
      title: 'Melilla'
    },
  ],
});

map.addPlugin(mp);

window.map = map;
