import Attributions from 'facade/attributions';

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
  zoom: 6,
  bbox: [-3132050.401125163, 3036505.360983581, 983484.0466877755, 5563700.732843714],
  layers: [
    new M.layer.WMTS({
      url: 'http://www.ign.es/wmts/pnoa-ma?',
      name: 'OI.OrthoimageCoverage',
      legend: 'Imagen (PNOA)',
      matrixSet: 'GoogleMapsCompatible',
      transparent: false,
      displayInLayerSwitcher: false,
      queryable: false,
      visible: true,
      format: 'image/jpeg',
    }),
    /*new M.layer.WMTS({
      url: 'https://www.ign.es/wmts/mapa-raster?',
      name: 'MTN',
      legend: 'Mapa',
      matrixSet: 'GoogleMapsCompatible',
      transparent: false,
      displayInLayerSwitcher: false,
      queryable: false,
      visible: true,
      format: 'image/jpeg',
    }),*/
  ],
});

window.map = map;

// M.config.attributions.defaultAttribution = 'Ministerio de Justicia';
// M.config.attributions.defaultURL = 'https://mapadefosas.mjusticia.es';


const mp = new Attributions({
  mode: 1,
  scale: 10000,
});

map.addPlugin(mp);

// {
//   mode,
//   layer,
//   url,
//   type,
//   zoom,
//   minWidth,
//   defaultAttribution
//   position 'TL', 'TR', 'BL' , 'BR'
//
// }
