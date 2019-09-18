import OverviewMap from 'facade/overviewmap';

const map = M.map({
  container: 'mapjs',
});


const mp = new OverviewMap({
  position: 'BL',
});

map.addLayers(['WMS*Limites*http://www.ideandalucia.es/wms/mta10v_2007?*Limites*false', 'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?']);

map.addPlugin(mp);
