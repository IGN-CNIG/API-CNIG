import QueryAttributes from 'facade/queryattributes';

M.language.setLang('es'); // Español
// M.language.setLang('en'); // Inglés

const map = M.map({
  container: 'mapjs',
  // controls: ['panzoom','panzoombar', 'scale*true', 'scaleline', 'rotate', 'location','backgroundlayers'], //getfeatureinfo: este control es un poco coñazo, siempre está buscando información al hacer clic en el mapa.
  // controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location', 'backgroundlayers', 'getfeatureinfo'],
  minZoom: 4, maxZoom: 20, zoom: 10,
  projection: 'EPSG:3857*m',
  center: {
    x: -409000, y: 4930000,
    // x: -712300, y: 4310700,
    draw: false, // Dibuja un punto en el lugar de la coordenada
  },
});
window.map = map;

// Capa vertex de GeoJSON
const COLORES_PROVINCIA = {
  2: 'olive', 5: 'green', 6: 'blue', 9: 'navy',
  10: 'springgreeen', 13: 'lightsalmon',
  16: 'steelblue', 19: 'orangered', 28: 'red',
  40: 'plum', 42: 'lime', 45: 'gold',
  47: 'emerald', 50: 'turquoise',
};
const estiloPoint = new M.style.Point({
  icon: {
    // e2m: En la propiedad form se decide que forma adopta el icon de las preconfiguradas
    // Valores: BAN|BLAZON|BUBBLE|CIRCLE|LOZENGE|MARKER|NONE|SHIELD|SIGN|SQUARE|TRIANGLE

    // Este es el punto. En vez de igualar el valor de la propiedad a unos de los valores, lo igualamos a una función anónima que pasa como parámetros el feature y el mapa
    // Con el elemento (feature) puedo acceder a los atributos que tiene el geoJSON. La forma la determina el propietario de la estación.
    // Como valor devuelto por el return es la clase de Mapea que representa a la forma: M.style.form.TRIANGLE para el triángulo y M.style.form.CIRCLE para el cí­rculo
    form: function(feature,map) {
      return M.style.form.CIRCLE;
    },
    // e2m: luego sigo definiendo el resto de propiedades comunes a todos los sí­mbolos
    radius: function(feature,map) {
      return 5;
    },
    rotation: 3.14159, // Giro el icono 180 en radianes
    rotate: false, // Activar rotación con dispositivo
    offset: function(feature,map) {
      return [0,0]
    }, // Desplazamiento en pixeles en los ejes X, Y con respecto a su posición según la coordenada
    color: '#3e77f7', // No es el color del sí­mbolo, sino de un pequeño borde que ayuda al contraste con el mapa62, 119, 247
    fill: function(feature,map) {
      let colorPunto;
      const colorProvincia = COLORES_PROVINCIA[feature.getAttribute('codprov')] || 'green';
      colorPunto = colorProvincia;
      return colorPunto;
    }, // Color de relleno
    gradientcolor: '#3e77f7', // Color del borde
    gradient: function(feature,map) {
      return false;
    }, // Degradado entre color de borde e interior
    opacity: 1, // Transparencia. 0(transparente). 1(opaco).
    snaptopixel: true,
  },
});
const vertex = new M.layer.GeoJSON({
  name: 'vertices',
  // url: 'https://projects.develmap.com/attributestable/roivertexcenter.geojson',
  url: 'https://projects.develmap.com/attributestable/roivertexcenterred.geojson',
  extract: true, // Con esta propiedad sale el popup standard con las propiedades
});
vertex.setStyle(estiloPoint);// Asociamos a la capa el estilo definido
map.addLayers(vertex); // */

// Capa WFS
const campamentos = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
  name: 'campamentos', legend: 'Campamentos',
  namespace: 'sepim',
  geometry: 'POINT',
}, {
  getFeatureOutputFormat: 'json',
  describeFeatureTypeOutputFormat: 'json',
});
map.addWFS(campamentos); // */

const mp = new QueryAttributes({
  collapsible: true,
  collapsed: true, // 1 - ERROR
  position: 'BL', // 'TL' | 'TR' | 'BR' | 'BL'
  tooltip: 'TEST TOOLTIP Consulta de atributos',
  refreshBBOXFilterOnPanning: true, // true | false
  //
  configuration: {
    layer: 'vertices', // 'vertices' | 'PRUEBA_VACIA' // Si no existe se queda vacío el popup del plugin
    pk: 'id', // Parece ser una columna oculta de ID
    initialSort: { name: 'nombre', dir: 'asc' },
    columns: [
      { name: 'id', alias: 'Identificador', visible: false, searchable: false, showpanelinfo: true, align: 'right', type: 'string'},
      { name: 'nombre', alias: 'Nombre Vértice', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      { name: 'urlficha', alias: 'URL PDF Ficha', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'linkURL', typeparam:'Ficha vértice'},
      { name: 'imagemtn50', alias: 'Imagen Hoja MTN50', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'image'},
      // { name: 'xutmetrs89', alias: 'Coordenada X (UTM ETRS89)', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string'},
      // { name: 'yutmetrs89', alias: 'Coordenada Y (UTM ETRS89)', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string'},
      // { name: 'lat', alias: 'Latitud', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string'},
      // { name: 'lng', alias: 'Longitud', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string'},
      // { name: 'horto', alias: 'Altitud Ortométrica', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string'},
      // { name: 'calidad', alias: 'Calidad señal', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'formatter', typeparam:'*'},
      // { name: 'nivel', alias: 'Vida útil', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'percentage' },
      // { name: 'urlcdd', alias: 'URL Centro Descargas', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'buttonURL', typeparam:'Acceso CdD' },
      // { name: 'hojamtn50', alias: 'Hoja MTN50', visible: false, searchable: false, showpanelinfo: true, align: 'right', type: 'string' },
      // { name: 'summary', alias: 'Localización', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string'},
      // { name: 'description', alias: 'Descripción completa', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      // { name: 'pertenencia', alias: 'Pertenencia', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string' },
      // { name: 'municipio', alias: 'Ayuntamiento', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      // { name: 'codigoine', alias: 'Municipio', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      // { name: 'codprov', alias: 'Provincia', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string'},
      // { name: 'codauto', alias: 'Autonomía', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string'},
    ],
  }, // */
  filters: true, // true | false // 1 - ERROR
});

setTimeout(() => {map.addPlugin(mp); window.mp = mp;}, 2000); // 1 - ERROR // Solo añadir el plugin 2 segundos más tarde para que de tiempo de traer todo el layer y evitar "1 - ERROR"

// Lista de errores encontrados

// 1 - ERROR Salta el error "TypeError: e is null" en "api-ign-js/src/impl/ol/js/layer/Vector.js.js:307" por causa de "const olFeatures = [...olSource.getFeatures()];" en el cual "olSource" es aun null. Tras este error se puede cerrar el plugin, pero este ahora no vuelve a poner el mapa en su sitio.
// Si se da click sobre este botón de plugin muy rápidamente tras el activado del mapa, por no ser cargado antes del refresh de "addAbrePanelEvent".
// Si se pone el parámetro "filter: false" se llama a "setBboxFilter" con evento "moveend" antes de que termine de cargar el mapa.
// si se pone "collapsed: false," también ocurre este error, pero no tiene error constante o permanente como consecuencia de estos.
// Se ha colocado el añadido de plugin tras hacer el añadido de layers para que haya más tiempo a que se cargue esto. Pero no era suficiente por lo que el añadido del plugin ahora se hace con espera de 2 segundos de "setTimeout".

// 2 - ERROR "position: 'BL'," el plugin se habré en el lado izquierdo de la página y el mapa en vez de ser visible a la derecha se pone también en izquierda debajo de este popup, completamente cubierto, ademas al ser reducido el lado derecho es completamente blanco.
// Esto es causado en "queryattributes/src/facade/js/queryattributescontrol.js" por "if (this_.position === 'TL') {", "if (this.position === 'TL') {" y "if (this.position_ === 'TL') {", ya que deberían de incluir la opción de 'BL'
// Se soluciona de la siguiente forma "if (this.position === 'TL' || this.position === 'BL') {" (Parece que no era necesario el this_ o position_ en estos)
// Se podría crear una función común que haga este añadido de 530px de estos tres apartados, para así tener menos código copiado y facilita modificaciones futuras.
// A la vez se puede quitar el comentado en "queryattributes/src/facade/js/queryattributes.js" de "// e2m: Lo meto en el control" que creo que no es necesario al ya ser implementado.

// 3 - ERROR se ha observado que el evento "this.map.getMapImpl().on('click', (evt) => {this.actualizaInfo(evt, this.layer);});" se lanza repetidas veces en un mismo click, se ha añadido un remove a este evento antes de añadir otra copia de este.
//this.map.getMapImpl().un('click', this.currentMapClickEvent_);
//this.currentMapClickEvent_ = (evt) => {
//  this.actualizaInfo(evt, this.layer);
//};
//this.map.getMapImpl().on('click', this.currentMapClickEvent_);
// También encontrado lo mismo con el siguiente evento al lado de "moveend", se reemplazaría "this.map.getMapImpl().on('moveend', (evt) => {..." por los siguiente que también prevé el caso de doble moveend que no tiene que tener el check por filters "false":
//this.map.getMapImpl().un('moveend', this.currentMapMoveendEvent_);
//this.currentMapMoveendEvent_ = (evt) => {
//  if (this.bboxfilter || !this.filters) {
//    this.setBboxFilter();
//  }
//};
//this.map.getMapImpl().on('moveend', this.currentMapMoveendEvent_);
// Parece que se puede añadir filtrado por vista pero este no se quita cuando se configura el de área, no se si es intencionado este diseño o no. Podría ser por causa de que hay múltiples "moveend" del mismo filtrado cuando el filtrado esta puesto a false o por que los eventos no se quitan.
// En "queryattributes/src/facade/js/queryattributescontrol.js" se ha cambiado como se generaba el primer "moveend" para que también se pueda limpiar:
//if (this.filters) {
//  this.showAttributeTable(this.configuration.layer);
//} else {
//  this.showAttributeTable(this.configuration.layer, this.setBboxFilter.bind(this));
//  this.map.getMapImpl().un('moveend', this.currentMapMoveendEvent_);
//  this.currentMapMoveendEvent_ = (evt) => {
//    this.setBboxFilter();
//  };
//  if (this.refreshBBOXFilterOnPanning) {
//    this.map.getMapImpl().once('moveend', this.currentMapMoveendEvent_);
//  } else {
//    this.map.getMapImpl().on('moveend', this.currentMapMoveendEvent_);
//  }
//}
// Por otro lado he añadido dentro del "setDrawFilter" el "this.bboxfilter = false;" para desactivarlo en ese caso.

// 4 - ERROR si se da click sobre el mapa se abre este plugin por si solo, el botón hasta no se cambia a su formato de cerrar popup. Podría ser que se tiene que mover los creados de eventos a otro elemento que se usa tras darle al botón de activar este plugin.

// 5 - ERROR "addAbrePanelEvent" y "addCierraPanelEvent" añaden un evento 'click', que termina exponencialmente siendo duplicado cada vez que se utiliza, se puede solucionar de la siguiente manera, se tiene que sustituir todo el código de add event listener "elem.addEventListener('click', () => {..." por "elem.removeEventListener('click', this.currentClickEvent_); this.currentClickEvent_ = ***FUNCIÓN_DEL_EVENTO_ANTERIOR***; elem.addEventListener('click', this.currentClickEvent_);"

// 6 - ERROR Este control no tiene funcionalidad destroy que permite limpiarlo, por lo que por ejemplo el evento click sobre el mapa termina ejecutando el abrir de este sin el panel, causando que el mapa se vea mal.
// Con añadir en "queryattributes/src/facade/js/queryattributescontrol.js" estos eliminados de eventos que se indicaron en las soluciones superiores se soluciona este problema:
//destroy() {
//  this.map.getMapImpl().un('click', this.currentMapClickEvent_);
//  this.map.getMapImpl().un('moveend', this.currentMapMoveendEvent_);
//}

// 7 - ERROR cuando se activa el filtro por zona de la pantalla de Browser(vista), si no hay nada en este sufre error porque el extent es con infinite en "setBboxFilter", se debería de hacer esto "const auxExtent = this.getImpl().getLayerExtent(this.layer);if(!(auxExtent[0] === Infinity || auxExtent[0] === -Infinity)){this.map.setBbox(auxExtent);}" en vez del actual cambio que puede causar grandes problemas por llamadas de errores repetidas cada vez.
// Ocurre los mismo con "setDrawFilter" haciendo lo mismo parece solucionarlo.
// Estos cambios también podrían incluir un popup de Mapea si se quiere comunicar al usuario que no hay nada encontrado con este filtro, pero se tendría que tener en cuenta que no aparezcan múltiples de estos.

// 8 - ERROR si se escoge filtro por vista y se da click sobre uno de los features, aparece el popup con información de este, el problema es que este filtrado siempre pone centrado en mitad de todos los features visibles, por lo que el botón de cerrado de ese popup de feature único no se puede usar, se podría impedir el zoom al fit cuando están estos popups o cambiar la estructura del popup para que empiece desde el lado del botón de cerrado o cambiar el botón de cerrado al otro lado.

// 9 - ERROR tras finalizar los filtrados se añaden todos los elementos visibles hasta cierto tamaño, permitiendo el scroll desde entonces, pero si se escoge un feature, aparece un elemento adicional de información de este, causando que el elemento de scroll apunte a este y se reduzca para permitirle espacio, el problema es que si se vuelve a hacer el buscado este elemento de feature de antes se queda visible y inaccesible hasta que no se le da a minimizar y expandir este para que se vuelvan a aplicar los estilos correctos, podría ser recomendable retener ese tamaño pequeño hasta que no se limpie el visualizado de feature único.
