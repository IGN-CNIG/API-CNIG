import { map as Mmap } from 'M/mapea';
// import  addQuickLayers from '../../../src/facade/js/mapea';



const mapa = Mmap({
  container: 'map',
});

window.mapa = mapa;
// mapa.addLayers('QUICK*BTN_Completa_MapLibre')
mapa.addQuickLayers('UnidadesAdministrativas_MVT')