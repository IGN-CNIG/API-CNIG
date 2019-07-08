import BaseLayerSelector from 'facade/baselayerselector';

const map = M.map({
  container: 'mapjs',
});

const mp = new BaseLayerSelector({
  position: 'TR',
  layerOpts: [{
      id: 'mapa',
      title: 'Mapa',
      layer: new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'base_layer',
      }, {
        format: 'image/jpeg',
      }),
    },
    {
      id: 'imagen',
      title: 'Imagen',
      layer: new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'orto_layer',
      }, {
        format: 'image/png',
      }),
    },
    /*{
      id: 'hibrido',
      title: 'Híbrido',
      layer: [ new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'orto_layer',
      }, {
        format: 'image/png',
      }),  
      new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        legend: 'orto_layer',
      }, {
        format: 'image/png',
      }), 
    ]
    }*/
  ],
});
window.map = map;
map.addPlugin(mp);
