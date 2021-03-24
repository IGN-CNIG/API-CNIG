import IGNSearchLocator from 'facade/ignsearchlocator';

// M.language.setLang('en');


const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
});

const mp = new IGNSearchLocator({
  servicesToSearch: 'gn',
  searchPosition: 'geocoder,nomenclator',
  maxResults: 10,
  isCollapsed: false,
  position: 'TL',
  reverse: true,
  nomenclatorSearchType: [
    'Estado',
    'Isla administrativa',
    'Comarca administrativa',
    'Jurisdicción',
    'Distrito municipal',
    //'Entidad singular',
    'Construcción/instalación abierta',
    'Edificación',
    'Vértice Geodésico',
    'Alineación montañosa',
    'Montaña',
    'Paso de montaña',
    'Llanura',
    'Depresión',
    'Vertientes',
    'Comarca geográfica',
    'Paraje',
    'Elemento puntual del paisaje',
    'Saliente costero',
    'Playa',
    'Isla',
    'Otro relieve costero',
    'Espacio protegido restante',
    'Instalación portuaria',
    'Camino y vía pecuaria',
    'Curso natural de agua',
    'Masa de agua',
    'Curso artificial de agua',
    'Embalse',
    'Hidrónimo puntual',
    'Glaciares',
    'Mar',
    'Entrante costero y estrecho marítimo',
    'Relieve submarino',
  ],
});

// map.removeControls('panzoom');

map.addPlugin(mp);

window.map = map;
