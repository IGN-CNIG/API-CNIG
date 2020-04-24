import Information from 'facade/information';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  controls: ['location'],
});

const featureInfo = new M.control.GetFeatureInfo(true, { buffer: 1000 });
map.addControls(featureInfo);

const mp = new Information({
  position: 'TR',
  buffer: 100,
});

const layerinicial = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

const layerUA = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});

const hidrografia = new M.layer.WMS({
  url: 'http://servicios.idee.es/wms-inspire/hidrografia?',
  name: 'HY.PhysicalWaters.HydroPointOfInterest',
  legend: 'Hidrografía',
});

<<<<<<< HEAD
const capaPuntosLimpios = new M.layer.WMS({
  url: 'http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_puntos_limpios?',
  name: 'puntos_limpios',
  legend: 'Puntos Limpios',
});


map.addLayers([layerinicial, capaPuntosLimpios]);
=======
map.addLayers([layerinicial, layerUA, hidrografia]);
>>>>>>> redmine_155141
map.addPlugin(mp);
// window.mp = mp;
window.map = map;
