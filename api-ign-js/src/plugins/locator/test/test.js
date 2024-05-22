import Locator from 'facade/locator';

M.language.setLang('es');
// M.language.setLang('en');

M.proxy(false);

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4783459.6216],
});
window.map = map;

const mp = new Locator({
  collapsible: true, // Ignorado con position 'TC', porque es false en ese caso.
  collapsed: true, // Ignorado con position 'TC', porque "collapsible" se pone a false.
  isDraggable: true, // Ignorado con position 'TC', porque elimina ese título
  position: 'TC', // TL | TR | BL | BR | TC
  useProxy: true,
  tooltip: 'Plugin Localizador',
  pointStyle: 'pinAzul', // 'pinAzul' | 'pinRojo' | 'pinMorado' | 'in_case_of_wrong_string'
  zoom: 5,
  byPlaceAddressPostal: true,
  /* /
  byPlaceAddressPostal: {
    maxResults: 5,
    noProcess: 'poblacion', // 'municipio' | 'poblacion' | 'toponimo' | 'callejero' | 'municipio,poblacion' | 'municipio,provincia,comunidad%20autonoma,poblacion,toponimo,expendeduria,ngbe,callejero,carretera,portal' | etc
    countryCode: 'es',
    reverse: false, // Añadir o no la opción de escoger punto del mapa en el buscado
    resultVisibility: true,
    urlCandidates: 'http://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp',
    urlFind: 'http://www.cartociudad.es/geocoder/api/geocoder/findJsonp',
    urlReverse: 'http://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode',
    geocoderCoords: [-5.741757, 41.512058], // Muestra popup con información de este punto, desaparece instantáneamente si esta "requestStreet" puesto.
    requestStreet: 'https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Sevilla&type=provincia&tip_via=null&id=41&portal=null&extension=null',
  }, // */
  byParcelCadastre: true,
  /* / 
  byParcelCadastre: {
    cadastreWMS: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR',
    CMC_url: 'http://ovc.catastro.meh.es/ovcservweb/ConsultaMunicipioCodigos',
    DNPPP_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/Consulta_DNPPP_Codigos',
    CPMRC_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_CPMRC',
  }, // */
  byCoordinates: true,
  /* /
  byCoordinates: {
    projections: [
      { title: 'ETRS89 geographic (4258) d', code: 'EPSG:4258', units: 'd' },
      { title: 'ETRS89 geographic (4258) dms', code: 'EPSG:4258', units: 'dms' },
    ],
    help: 'https://www.google.com/',
  }, // */
  order: 1,
});

map.addPlugin(mp);
window.mp = mp;

map.addPlugin(new M.plugin.Vectors({ position: 'TL' }));
map.addPlugin(new M.plugin.Layerswitcher({ position: 'TR' }));

// Lista de errores encontrados

// 1 - ERROR, con "byPlaceAddressPostal: true," o "byPlaceAddressPostal: {...reverse: true, ...}," de "m-ignsearchlocator-locate-button", la configuración de "featureTabOpts.content += `<div><b>${fullAddress !== undefined ? fullAddress : '-'}</b></div><br/>" deja elementos vacíos sin datos, se podría prever mejor, teniendo en cuenta que los casos de "" también son añadidos al no ser undefined.
// Se podría solucionar con "featureTabOpts.content += `${!(fullAddress === '' || fullAddress === undefined || fullAddress === null) ? `<div><b>${fullAddress}</b></div><br/>` : ''}"
// Además hay un espacio sobrante al final de este mismo string y similares en otros plugins de "toFixed(6)} </div>". En "ignsearch" hasta hay un espacio antes de "Lon:" que podría ser no necesario.

// 2 - ERROR, el buscado ha dejado de funcionar por como se configura ahora las llamadas de xhr, normalmente se enviaba al M.remote.get() la URL y parámetros, pero ahora los gets no añaden esos parámetros por lo que hay que usar "M.utils.addParameters(url, param);" que une los parámetros a la URL. Ocurre en las funciones "onProvinciaSelect" y "buildUrl_", dentro de "locator/src/facade/js/infocatastrocontrol.js"
// Se ha encontrado el REGEX por el que se puede encontrar todos estos errores "M.remote.get\((\w+(.\w+)?), (\{(\n|\s|.)+?\})\)" mientras que la cadena de reemplazo sería "M.remote.get(M.utils.addParameters($1, $3))", hay algunos otros plugins que pueden ser solucionados por este cambio. También se puede optar por añadir la constante de search igual que en otros elementos similares "const searchUrl = M.utils.addParameters($1, $3);M.remote.get(searchUrl)", aquí haría falta añadir salto de linea y espacios para que se ajuste al código.

// 3 - ERROR 'pinAzul' | 'pinRojo' | 'pinMorado' no tienen anchor ajustado para cada tipo de imagen.
// El 'pinAzul' de [M.config.THEME_URL, '/img/marker.svg'], debería de tener "anchor:[0.49, 0.95]".
// El 'pinRojo' de [M.config.THEME_URL, '/img/pinign.svg'], debería de tener "anchor: [0.5, 1]".
// El 'pinMorado' de [M.config.THEME_URL, '/img/m-pin-24.svg'], debería de tener "anchor: [0.5, 0.99]".

// 4 - ERROR Si se pone "byPlaceAddressPostal: false", la posición inicial del panel esta mal, puesto en el lateral en vez de mitad cuando esta el "position: 'TC'". Como si el default "TL" se ha puesto y no se ha actualizado al "TC".
// Se ha observado que no ocurre con "byPlaceAddressPostal: true" y a la vez es el único que se abre automáticamente en el inicio, porque tiene el siguiente código "if (this.position === 'TC') { if (this.byPlaceAddressPostal_ !== false) { document.querySelector('.m-plugin-locator').classList.add('m-plugin-locator-tc'); html.querySelector('#m-locator-ignsearch').click();}}" dentro de "locator/src/facade/js/locatorcontrol.js" en función "createView(map) {..."
// Se puede solucionar error de la posición inicial con, este "if" tras los tres "if" de añadido de estas opciones de control, quitando el código de "...classList.add('m-plugin-locator-tc');" del if de "this.byPlaceAddressPostal_ !== false":
//if (this.position === 'TC' && (this.byParcelCadastre_ !== false || this.byCoordinates_ !== false
//  || this.byPlaceAddressPostal_ !== false)) {
//  document.querySelector('.m-plugin-locator').classList.add('m-plugin-locator-tc');
//  // Si se quiere aquí ira el "once" descrito más adelante.
//}
// 4.1 - ERROR Dentro de este mismo "if" se puede añadir un código para abrir todos los elementos y no solo el de "byPlaceAddressPostal_", pero este cambio cambiará como funciona ahora este apartado a cualquier cliente que lo uso anteriormente por lo que podría no ser necesario para tener igual comportamiento. La única razón para tener este abrir sin "position: 'TC'" es solo cuando dentro de "byPlaceAddressPostal" se utiliza "geocoderCoords" o "requestStreet", por que estos activan su opción automáticamente. 
//this.once(M.evt.ADDED_TO_MAP, () => {
//  if (this.byPlaceAddressPostal_ !== false) {
//    html.querySelector('#m-locator-ignsearch').click();
//  } else if (this.byParcelCadastre_ !== false) {
//    html.querySelector('#m-locator-infocatastro').click();
//  } else if (this.byCoordinates_ !== false) {
//    html.querySelector('#m-locator-xylocator').click();
//  }
//});
// Si no se quiere abrir los demás se puede asegurarse que la funcionalidad actual solo se active cuando estén como mínimo uno de estos "geocoderCoords" o "requestStreet" en "byPlaceAddressPostal". Realmente esos 2 ifs podrían ser unidos con un "&&" ya que solo se activan si son ambos true.
// 4.2 - ERROR Luego cuando se da click para tener desactivadas todas las opciones, los icono se mueve del centro, es decir cada vez que lo activas o desactivas, hay que mover el ratón para volver a alcanzar el mismo icono.

// 5 - ERROR, dentro de parámetro "byPlaceAddressPostal" se puede poner "geocoderCoords"(muestra información de un punto) y "requestStreet"(carga el resultado del search indicado), pero el valor de geocoderCoords es añadido y inmediatamente borrado por el requestStreet en la función "initializateAddress(html) {...". Se puede añadir de forma que el punto se añada también tras finalizar el request impediendo la llamada primera de este con un "else" en "requestStreet" que asegure que ese if de "geocoderCoords" no se lance o solamente dejar el "else" para que solo genere el "requestStreet" y no haga el otro.

// 6 - ERROR, la función "getAPIRest()" no puede tratar los objetos de "byParcelCadastre", "byCoordinates" y "byPlaceAddressPostal", los muestra como "[object Object]", con poner "!!" antes de estos (Ej. ${!!this.byCoordinates}) se asegura que siempre sean booleanos, el único problema es que los objetos nunca serán descritos si no los default de este.
// También tiene un salto de linea que se envía por error en esta cadena por lo que hay que ponerlo en una sola linea. Este mismo error ocurre en plugins "selectionzoom", "locatorscn" y "viewmanagement"
// En plugin "storymap" hay un "*" al final sobrante en su generado o se olvido de un parámetro. A la vez que en README se indica que es un parámetro "delay" que no se añadió al API, pero también no incluye el "isDraggable" o "indexInContent"(No se sabe porque no se incluye).
// En plugin "transparency" no parece que tiene los "*" incluidos.
