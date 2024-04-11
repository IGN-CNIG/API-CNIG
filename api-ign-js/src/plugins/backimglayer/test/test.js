import BackImgLayer from 'facade/backimglayer';

M.language.setLang('es');

// const wmstTestLayer0 = new M.layer.WMTS({url: 'https://www.ign.es/wmts/pnoa-ma?', name: 'OI.OrthoimageCoverage', matrixSet: 'GoogleMapsCompatible', legend: 'Imagen', transparent: true, displayInLayerSwitcher: false, queryable: false, visible: true, format: 'image/jpeg', minZoom: 5, maxZoom: 10}); // NO BASE
// const wmstTestLayer0 = new M.layer.WMTS({url: 'https://www.ign.es/wmts/pnoa-ma?', name: 'OI.OrthoimageCoverage', matrixSet: 'GoogleMapsCompatible', legend: 'Imagen', transparent: false, displayInLayerSwitcher: false, queryable: false, visible: true, format: 'image/jpeg', minZoom: 5, maxZoom: 10}); // BASE
const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
  center: [-458756.9690741142, 4682774.665868655],
  layers: ['OSM'], // [wmstTestLayer0], // Este layer OSM o wmstTestLayer se quitan al añadir el plugin, si son layer base, en este caso si fue configurado como transparente false. Parece ser por map.getBaseLayers().forEach((layer) => {layer.on(M.evt.LOAD, map.removeLayers(layer));});.
  zoom: 6,
});

// Variables necesarias para las pruebas.
const wmtsLayer1 = 'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true';
const wmtsLayer2 = 'WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*true';
const wmtsLayer3 = 'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseOrto*GoogleMapsCompatible*Mapa IGN*true*image/jpeg*false*false*true';
//const old_restLayer4= 'WMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseTodoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscofalseasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue,WMTSasteriscohttps://www.ign.es/wmts/pnoa-ma?asteriscoOI.OrthoimageCoverageasteriscoGoogleMapsCompatibleasteriscoImagen (PNOA)asteriscofalseasteriscoimage/pngasteriscofalseasteriscofalseasteriscotruesumarWMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseOrtoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscotrueasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue'; // Los 'asterisco' no se usan, se debería de ser hecho con '*'
const restLayer4= 'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true,WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*truesumarWMTS*https://www.ign.es/wmts/ign-base?*IGNBaseOrto*GoogleMapsCompatible*Mapa IGN*true*image/jpeg*false*false*true';
const pwImg1 = '../src/facade/assets/images/svqimagen.png';
const pwImg2 = 'https://www.ign.es/iberpix/static/media/raster.c7a904f3.png';
const pwImg3 = '../src/facade/assets/images/svqmapa.png';
const pwImg4 = '../src/facade/assets/images/svqhibrid.png';

// const i = new M.plugin.Information({}); map.addPlugin(i);

const mp = new BackImgLayer({
  collapsed: false, // true,
  collapsible: true,
  tooltip: 'Tooltip de texto "Capas de fondo" que aparece al hacer hover sobre él.',
  layerVisibility: false,
  columnsNumber: 0,
  empty: true,

  /* // PRUEBA 1 // Cuando no se pasa layerOpts, se usan los parámetros ids, titles, previews y layers
  position: 'TL', // 2 - ERROR
  ids: 'mapa,hibrido',
  titles: 'Mapa,Hibrido',
  previews: pwImg1 + ',' + pwImg3,
  layers: wmtsLayer1 + ',' + wmtsLayer2,
  // */

  /* // PRUEBA 2
  position: 'BR', // 2 - ERROR
  columnsNumber: 3, // 2 // El "2" termina como 2x2 si hay 3
  // ids: ['mapa', 'hibrido'],// BUG IGNORAR si "ids" ya es array no se puede usar split(',') de strings para convertirlo al Array
  ids: 'mapa,hibrido',
  // titles: ['Mapa', 'Hibrido'],// BUG IGNORAR si "titles" ya es array no se puede usar split(',') de strings para convertirlo al Array
  titles: 'Mapa,Hibrido',
  // previews: [pwImg3, pwImg4],// BUG IGNORAR si "previews" ya es array no se puede usar split(',') de strings para convertirlo al Array
  previews: pwImg3+','+pwImg4,
  // layers: [wmtsLayer1, wmtsLayer2 + '+' + wmtsLayer3],// BUG IGNORAR si "layers" ya es array no se puede usar split(',') de strings para convertirlo al Array
  // layers: wmtsLayer1+','+wmtsLayer2 + '+' + wmtsLayer3,// BUG IGNORAR usar '+' no parece que vale para este generado de layers, esta explicado
  layers: wmtsLayer1+','+wmtsLayer2 + 'sumar' + wmtsLayer3, // OK
  // ids: 'mapa,hibrido,orto', titles: 'Mapa,Hibrido,Orto', layers: wmtsLayer1+','+wmtsLayer2 + ',' + wmtsLayer3, // BUG IGNORAR, si "titles" o preview, no hay 3 elementos no funciona bien(No se ve imagen o nombre de la capa), en "ids" si no hay 3 falla gravemente
  // layers: wmtsLayer1 + ',' + wmtsLayer2, // OK
  // */

  // PRUEBA 3
  position: 'TR', // 2 - ERROR
  layerOpts: [
    {
      id: 'wms',
      title: 'WMS',
      preview: pwImg1,
      layers: [
        new M.layer.WMS({
          url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
          name: 'AU.AdministrativeUnit',
          legend: 'Unidad administrativa',
          tiled: false,
          transparent: false,
          displayInLayerSwitcher: false,
          visible: true,
          useCapabilities: false,
        }),
      ],
    },
    {
      id: 'tms',
      preview: pwImg2,
      title: 'TMS',
      layers: [
        new M.layer.TMS({
          url: 'https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png',
          name: 'IGNBaseOrto',
          legend: 'Topónimos',
          projection: 'EPSG:3857',
          transparent: false,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          tileGridMaxZoom: 19,
        }),
      ],
    },
  ],
  // */

  /* // PRUEBA 4 // Formato parámetros REST: Hubo error al usar antiguo formato con 'asterisco' en vez de '*'
  position: 'BL', // 2 - ERROR
  ids: 'mapa,hibrido',
  titles: 'Mapa,Hibrido',
  previews: pwImg3 + ',' + pwImg4,
  layers: restLayer4,
  // */

});

map.addPlugin(mp);window.mp = mp; window.BackImgLayer = BackImgLayer;

/* // Esto es una prueba de insertar layer, al aplicar el plugin 'BackImgLayer' un zIndex 0 en sus layers seleccionables, este se pone encima al ser zIndex aproximadamente 43 y no se ve la capa del plugin
const wmstTestLayer = new M.layer.WMTS({
  url: 'https://www.ign.es/wmts/pnoa-ma?',
  name: 'OI.OrthoimageCoverage',
  matrixSet: 'GoogleMapsCompatible',
  legend: 'Imagen',
  transparent: true, // 3 - ERROR
  displayInLayerSwitcher: false,
  queryable: false,
  visible: true,
  format: 'image/jpeg',
  minZoom: 5,
  maxZoom: 10
});
map.addLayers(wmstTestLayer); window.wmstTestLayer = wmstTestLayer; // */

window.map = map;

//Lista de errores

// 1 - ERROR en "api-ign-js/src/plugins/backimglayer/src/facade/js/backimglayer.js" la explicación de "this.layers = options.layers || 'QUICK*BASE_MapaBase_IGNBaseTodo_WMTS';", no es correcta:
// El separado de 'asterisco' en realidad se hace con carácter '*'
// Para clarificar mejor el texto se puede poner "separated by string" o "separated by character"
// Se podría poner "(before was character: '+')" o quitarlo completamente
// El "(NOT * )" se tiene que quitar ya que es descripción falsa.

// 2 - ERROR Al poner el parámetro "Position 'BL'"(Botom Left) en el Plugin, la caja se corta y no muestra tamaño completo con las opciones del Plugin. Ocurre algo menos notable con "position: 'TR'" y "position: 'TL'" porque el título de "Capas de fondo" es más grande que las demás cajas. En 'BL' solo se corta la caja.

// 3 - ERROR Encontrado error al añadir capa con "addLayer", que tiene puesto la transparencia a "false", da error "(in promise) TypeError: this.map is null" en "value WMTS.js:162" en código concreto parece ser "const defaultExtent = this.map.getMaxExtent();"

// 4 - ERROR Si se usa "mp.turnLayerOptsIntoUrl()" sin que se haya añadido "layerOpts" en el parámetro del Plugin, sufre error "TypeError: this.layerOpts is undefined", podría ser mejor idea comprobar y dar error único descriptivo o devolver nada o calcular de otra forma ese resultado sin layerOpts si no está.

// 5 - ERROR Creo que se usa "*!" para definir API-REST, en ambos funciones "getAPIRest()" y README, pero parece que se usa actualmente solo '*' en muchos de estos apartados. Es muy posible que hay inconsistencia similares en muchos apartados similares en todos los plugins, pero desconozco si se tiene o no que usar '*!'.

// 6 - ERROR MEJORA Si se da click sobre el elemento de layer vacío, no se cambia a este el focus de color, igual que se hace con las otras opciones.
// Se puede arreglar de la siguiente manera:
// Añadir " else {e.currentTarget.parentElement.querySelector('#m-backimglayer-lyr-empty').classList.add('activeBackimglayerDiv');}" al "if (!isActivated) {...}" de "showBaseLayer", paca que si se apaga un layer se marque el vacío.
// Cambiar el "const elem = html.querySelector('#m-backimglayer-previews div.activeBackimglayerDiv:not(#m-backimglayer-lyr-empty)');" de "showEmptyLayer" para que ignore a si mismo en el click.
// También se puede añadir al "showEmptyLayer" al final, el "html.querySelector('#m-backimglayer-lyr-empty').classList.add('activeBackimglayerDiv');", pero debería ser redundante ya que el quitar de "showBaseLayer" debería ya de haberlo aplicarlo.
