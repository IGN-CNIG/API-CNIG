import SelectionZoom from 'facade/selectionzoom';

M.language.setLang('es');

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
      bbox: {
        x: {
          min: -1200091.444315327,
          max: 365338.89496508264,
        },
        y: {
          min: 4348955.797933925,
          max: 5441088.058207252,
        },
      },
      zoom: 7,
    },
    {
      id: 'canarias',
      title: 'Canarias',
      preview: '../src/facade/assets/images/canarias.png',
      bbox: {
        x: {
          min: -2170190.6639824593,
          max: -1387475.4943422542,
        },
        y: {
          min: 3091778.038884449,
          max: 3637844.1689537475,
        },
      },
      zoom: 8,
    },
    {
      id: 'baleares',
      title: 'Baleares',
      preview: '../src/facade/assets/images/baleares.png',
      bbox: {
        x: {
          min: 115720.89020469127,
          max: 507078.4750247937,
        },
        y: {
          min: 4658411.436032817,
          max: 4931444.501067467,
        },
      },
      zoom: 9,
    },
    {
      id: 'ceuta',
      preview: '../src/facade/assets/images/ceuta.png',
      title: 'Ceuta',
      bbox: {
        x: {
          min: -599755.2558583047,
          max: -587525.3313326766,
        },
        y: {
          min: 4281734.817081453,
          max: 4290267.100363785,
        },
      },
      zoom: 14,
    },
    {
      id: 'melilla',
      preview: '../src/facade/assets/images/melilla.png',
      title: 'Melilla',
      bbox: {
        x: {
          min: -334717.4178261766,
          max: -322487.4933005484,
        },
        y: {
          min: 4199504.016876071,
          max: 4208036.300158403,
        },
      },
      zoom: 14,
    },
  ],
});

map.addPlugin(mp);

window.map = map;
