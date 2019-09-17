const map = M.map({
  container: 'map',
});

const mp = new M.plugin.OverviewMap({
  position: 'BR',
  // collapsedButtonClass: 'overviewmap-mundo',
  // openedButtonClass: 'g-cartografia-flecha-derecha2',
  // toggleDelay: 400,
});

map.addLayers(['WMS*Limites*http://www.ideandalucia.es/wms/mta10v_2007?*Limites*false', 'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?']);

map.addPlugin(mp);


window.map = map;
