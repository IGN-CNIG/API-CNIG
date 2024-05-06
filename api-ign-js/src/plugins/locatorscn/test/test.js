import Locatorscn from 'facade/locatorscn';

M.language.setLang('es');
// M.language.setLang('en');

M.proxy(false);

const map = M.map({
  container: 'mapjs',
  minZoom: 4, maxZoom: 20, zoom: 5,
  center: [-467062.8225, 4783459.6216],
});
window.map = map;

const mp = new Locatorscn({
  collapsible: true,
  collapsed: true,
  isDraggable: true,
  position: 'TC', // TL | TR | BL | BR | TC
  tooltip: 'EJEMPLO DE TOOLTIP',
  zoom: 16,
  pointStyle: 'pinRojo', // 'pinAzul'|'pinRojo'|'pinMorado' Otros string causan que sea estilo deafult de API_IGN.
  //
  searchOptions: { // https://gzllpz.github.io/prueba2/api/informacion_general/
    reverse: true, // Activa la opcion de escoger punto
    resultVisibility: true, // Permite generado de features de la busqueda
    addendum: 'iderioja',
    size: 15,
    layers: 'address,street,venue',
    radius: 200,
    urlAutocomplete: 'https://geocoder.larioja.org/v1/autocomplete', // Search with text input // https://gzllpz.github.io/prueba2/api/autocompletar/#filtros
    urlReverse: 'https://geocoder.larioja.org/v1/reverse', // Search with Coordinate // https://gzllpz.github.io/prueba2/api/geocodificacion_inversa/
    sources: '', // 'cnig' | 'dgcat' | 'ieca' | 'ign' | 'cnig,ign' | etc (default is all) // cnig	Centro Nacional de Información Geográfica (CNIG) // dgcat	Dirección General del Catastro // ieca	Instituto de Estadística y Cartografía de Andalucía (IECA) // ign	Instituto Geográfico Nacional (IGN)
    peliasCoords: [-273618, 5224405], // 4 - ERROR
  }, // */
  useProxy: true,
  order: 1,
});
map.addPlugin(mp);
window.mp = mp;

// Lista de errores encontrados

// 1 - ERROR, Es igual al plugin "locator" el input de dirección, por ello aparece el popup de "m-ignsearchlocatorscn-results-list", este apartado tiene los valores de "locator" no validos en este mismo apartado por lo que sufre error.
// Se tendría que asignar un "window.localStorage.getItem('recents')" único a cada plugin si tienen conflictos o impedir que ocurran errores en caso de escoger uno de estos.
// El set parece estar hecho con "window.localStorage.setItem('recents', JSON.stringify(recents));"
// Esto posiblemente no debería de ocurrir ya que las URLs deberían de ser distintas. Pero en las pruebas es el mismo "test/dev.html".

// 2 - ERROR, Si se intenta ver la información de un punto del mapa, esta función "parsePeliasToGeocoder(candicate) { const properties = candicate.properties; ..." sufre error porque "candicate" es undefined, porque el resultado de ese punto no tiene features.
// Si se prevé que no hay feature, con "features.length > 0" aun así sufre error al enviar objeto vacío, se ha encontrado forma de prever este error de "showPopUp" con devolver este objeto:
//const temporalObject = {};temporalObject[this.addendumField] = {}; // Objetos para evitar error de NULL en el "native" más adelante.
//addressData = {
//  lng: etrs89pointCoordinates[0], lat: etrs89pointCoordinates[1], // Coordenadas para no dejar separadores de lineas vacíos
//  geom: `POINT(${etrs89pointCoordinates[1]} ${etrs89pointCoordinates[0]})`, // Hay un error de NULL si no esta. Realmente se podría quitar si se evita este error con if de su existencia.
//  native: { properties: { addendum: temporalObject } }, // Hay un error de NULL si no esta. Realmente se podría quitar si se evita este error con if de la existencia de "native".
//  address: '? ? ? ? ?', // Para no dejar solo las coordenadas se podría dejar esto o hacer una cadena traducible que indique que no se ha encontrado nada en esta coordenada, dejando claro su estado.
//};
// Así se deja un popup con coordenadas en caso de no encontrar nada en los pedidos, en vez de sufrir error no descriptivo o no visualizar nada.

// 3 - ERROR, similar error del plugin "locator" de anchors de 'pinAzul'|'pinRojo'|'pinMorado' necesarios.

// 4 - ERROR hay un configurado de "peliasCoords" de "searchOptions" que se podría eliminar completamente, ya que nunca se usa o solo dejar su asignado en la función "showReversePopUp".

// 5 - ERROR, En la función " getAPIRest() {...", están los parámetros sobrantes de "byParcelCadastre", "byCoordinates" y "byPlaceAddressPostal" del plugin original de "locator", luego hay error con nueva linea tras "pointStyle" y se usa "isDraggableE", que la "E" del final es una errata. Tampoco se usa "searchOptions" que se indica en el archivo README.

// 6 - ERROR, el comentario de "this.searchOptions = options.searchOptions || {};" esta mal indicado, siendo copia del tooltip y luego existe la función "getIGNSearchLocatorscn" que no se usa y posiblemente se tendría que reemplazar por las configuraciones default de "searchOptions", que es el parámetro "options" de "IGNSearchLocatorscnControl" y así se reutiliza todos esos configurados default en este ejemplo. Se podría diseñar que se pueda poner un "true" igual que en el plugin "locator" usando el default de similar manera, solo requiriendo enviar el true o false en ese caso del api.

// 7 - ERROR, la función "getHelp() {..." no existe en este plugin, debería posiblemente estar.

// 8 - ERROR, JSP directamente no puede acceder a este plugin y tiene el mismos error "2" que causa que sufran muchos errores al buscar con coordenadas.
