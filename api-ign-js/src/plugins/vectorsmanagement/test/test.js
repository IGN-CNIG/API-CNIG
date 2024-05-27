/* eslint-disable max-len */
import VectorsManagement from 'facade/vectorsmanagement';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  center: [-458756.9690741142, 4682774.665868655],
  layers: ['OSM'],
  zoom: 6,
});
window.map = map;

map.addPlugin(new M.plugin.Layerswitcher({ collapsed: true, position: 'TR' }));

/* / Capa Vector
map.addLayers(new M.layer.Vector({
  name: 'vector_a',
  legend: 'Capa Vector',
}, { displayInLayerSwitcher: true })); // */

/* / Capa WFS
map.addLayers(new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Capa WFS',
  geometry: 'MPOLYGON',
})); // */

/* / Capa GeoJSON
map.addLayers(new M.layer.GeoJSON({
  name: 'Municipios',
  legend: 'Capa GeoJSON',
  url: 'https://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=500000&outputFormat=application%2Fjson',
})); // */

/* / Capa KML
map.addLayers(new M.layer.KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'capaKML',
  legend: 'Capa KML',
  extract: true,
})); // */

/* / Capa MVT
map.addLayers(new M.layer.MVT({
  // url: 'https://vts.larioja.org/rioja/{z}/{x}/{y}.pbf', name: 'MVT', 404 error
  url: 'https://vt-fedme.idee.es/vt.senderogr/{z}/{x}/{y}.pbf',
  name: 'sendero_gr',
  mode: 'feature',
  projection: 'EPSG:3857',
})); // */

/* / Capa OGCAPIFeatures
map.addLayers(new M.layer.OGCAPIFeatures({
  url: 'https://api-features.idee.es/collections/',
  name: 'hidrografia/Falls',
  legend: 'Capa OGCAPIFeatures',
  limit: 20,
})); // */

/* / Capa MBTilesVector
window.fetch('./countries.mbtiles').then((response) => {
  const mbtilesvector = new M.layer.MBTilesVector({
    name: 'mbtiles_vector',
    legend: 'Capa MBTilesVector L',
    source: response,
  });
  map.addLayers(mbtilesvector);
}).catch((e) => { throw e; }); // */

const mp = new VectorsManagement({
  position: 'TL', // 'TL' | 'TR' | 'BR' | 'BL'
  collapsible: false,
  collapsed: false,
  isDraggable: true,
  // tooltip: 'TOOLTIP TEST Gestionar mis vectores',
  // useProxy => falta implementar

  // Herramientas
  // help: false,
  // addlayer: false,
  // selection: false, // Automaticamente desactiva "edition" y "analysis"
  // creation: false,
  // edition: false,
  // style: false,
  // analysis: false,
  // download: false,

  order: null,
});

map.addPlugin(mp); window.mp = mp;

// Lista de errores encontrados

// 1 - ERROR, En los códigos de ".filter(f => f.getImpl().getOLFeature() === olFeature)[0]" se obtiene resultado feature o undefined
// Pero más adelante hay códigos que solamente asumen que es feature valido y no el undefined, por lo que pueden terminar fallando instantáneamente tras acabar este filtrado.
// Se podría solucionar con ifs que lo tengan en cuenta, ademas se podría reemplazar el filtro por "find" ya que obtiene el primero que coincide o devuelve undefined, exactamente lo que se quiere sin más pruebas innecesarias.
// Parece haber 3 instancias de estos, uno de ellos hasta tiene previsto una función que lo usa más adelante, pero no la segunda directamente siguiente que también tenía que haberse incluido posiblemente.

// 2 - ERROR, Salta el error "Uncaught TypeError: this.managementControl_ is undefined" en "active helpcontrol.js:111", debido a que se ha usado el botón de help que esta en el panel de este plugin.
// Parece ser porque esta variable nunca se añadió en "plugins/vectorsmanagement/src/facade/js/helpcontrol.js".
// Se ha observado que en "addHelpControl" el creado del evento se hace sin el segundo parámetro "this" igual que los demás controles
// Dentro del propio "HelpControl", no se espera segundo parámetro de "managementControl" que se tendría que asignar igual que los demás controles a "this.managementControl_".

// 3 - ERROR, En la traducción de ingles no hay texto de "selectLayerDefault", porque se ha puesto en ingles esta misma cadena pero con un error de mayúscula "selectlayerdefault"(default en vez del correcto Default), tras más investigación se observa que ocurre en otros textos de traducciones "selectionlayer","selectionfeature"...

// 4 - ERROR Si se desactiva "addlayer" y "help", la zona para escoger la capa se reduce de height cambiando el aspecto del panel, podría no ser efecto deseado.
// Si se desactiva "selection" no aparecen las demás herramientas, es causado por error de undefined. En el "if (this.selectionControl.selectedFeatures_.length > 0) {..." se tendría que añadir "this.selectionControl && " ya que en esta caso al ser undefined no se tiene que lanzar nada.
// En otro caso si se quitan "creation", "edition", "style", "analysis", "download", la única funcionalidad es escoger y esta no esta centrada en mitad en este caso.
// Podría ser buena idea quitar las ayudas que se han deshabilitado para que no se vean las funcionalidades apagadas a las que no tiene acceso el usuario.
// Si se desactiva "selection" "creation", "edition", "style", "analysis" y "download", entonces la opción de escoger capa es completamente innecesaria y se podría limpiar.
// Si todas las herramientas (excepto "ayuda") están apagadas entonces no se puede usar el plugin por lo que posiblemente hay que indicar que es un error. La ayuda tampoco sería útil en este caso por lo que se puede quitar también.

// 5 - ERROR, Si se activa la funcionalidad de "analysis", se añade una capa llamada "bufferLayer", podría ser más claro llamarla "analysisBufferLayer" para menor confusión, pero si es necesario que tenga este mismo nombre por alguna otra razón, por ejemplo el plugin buffer también usa el mismo nombre, por lo que depende de si se ha hecho intencionadamente este nombre o no deberían de haber duplicados
// Va a requerir cambiar bastantes archivos. Si es necesario se añade a "LAYERS_PREVENT_PLUGINS" este nuevo nombre de "analysisBufferLayer" en "plugins/stylemanager/src/facade/js/stylemanagerControl.js". Y podría hasta requerir actualizar el plugin buffer si se quería que también trabaje con este nuevo layer.

// 6 - ERROR, En el "active(html) {..." de "plugins/vectorsmanagement/src/facade/js/helpcontrol.js", se trae excesivamente "getValue('help_template')", podría ser mejor idea guardarlo en una variable en el inicio de este
// Una opción aun más sencilla es remplazar todo el contenido de "translations: { ...***GRANDE_LISTA***... }" con esto "translations: { ...getValue('help_template') }" ya que el entero objeto tiene exactamente los mismos nombres de traducciones por lo que se pueden traer directamente.

// 7 - ERROR, Este plugin no tiene función "getHelp" igual que los demás plugins, aunque aquí hay ayuda, los demás plugins no sabrán que no se puede pedir esta función, podría ser buena idea añadirla al menos vacía, para que devuelva un HTML básico de reemplazo como mínimo.

// 8 - ERROR, Se ha encontrado el siguiente error, si se escoge uno o varios features(No todos) y se abre la lista de atributos, aquí aparecen solo las linea de estos, si renombras o borras un atributo, se refresca la lista pero incluyendo todos los demás features.
// Este comportamiento no parece ser apropiado, pero culmina en un error aun más grave, en este mismo panel ahora se puede añadir columna, ya que originalmente no eran todos, solo se añaden la cantidad de celdas que había en la primera lista de los features seleccionados.
// Es decir por ejemplo si había 10 features en total, hay 10 filas, pero si originalmente se escogió solo 3, en la nueva columna habrá solo 3 filas.
// Aquí podría ocurrir un error visual, ya que estas 3 filas están relacionadas en orden a los 3 features seleccionados, es decir un usuario no sabría que la primera fila de esos 10 en ese nuevo atributo realmente se refiere al primer feature seleccionado que por ejemplo es el cuarto en la lista de 10.
// Se ha podido encontrar forma de solucionar esto teniendo en cuenta la cantidad de features con los que se opera en "plugins/vectorsmanagement/src/facade/js/editioncontrol.js":
// En la función "createAttributeTable(keys, features) {..." hay que actualizar el generado de "th" para incluir el "features.length"
// const th = this.createAttributeHeader(k, features.length);
// Hay que actualizar esta función para permitir este valor y incluirlo en los eventos de borrado y renombrado, nombrado esta variable como "numOfFtrs" en el ejemplo.
//  createAttributeHeader(attributeName, numOfFtrs) {
//    btnDel.addEventListener('click', evt => this.deleteAttribute(evt, numOfFtrs));
//    btnRename.addEventListener('click', evt => this.renameAttribute(evt, numOfFtrs));
// Actualizar la función de borrado para incluir este cambio
// deleteAttribute(evt, numOfFtrs) {
//   const attributeName = evt.target.name;
//   const features = this.layer_.getFeatures();
//   features.forEach((f) => {
//     f.getImpl().getOLFeature().unset(attributeName);
//   });
//   const table = document.querySelector('#attribute-table');
//   table.parentNode.removeChild(table);
//   if (numOfFtrs !== features.length && this.isEditAttributeActive && this.managementControl_) {
//     this.createAttributeTable(
//       Object.keys(features[0].getAttributes()),
//       this.managementControl_.getSelectedFeatures(),
//     );
//   } else {
//     this.createAttributeTable(Object.keys(features[0].getAttributes()), features);
//   }
// }
// Tras esto hay que actualizar la funcionalidad de renombrado de atributos con estos cambios para incluir esa variable
// renameAttribute(evt, numOfFtrs) {
//   this.updateFeaturesAttributeName(evt.target.name, inputName.value, numOfFtrs);
// Y finalizar con el actualizado de esta función
// updateFeaturesAttributeName(attributeName, newAttributeName, numOfFtrs) {
//   const features = this.layer_.getFeatures();
//   features.forEach(f => this.updateAttributes(f, attributeName, newAttributeName));
//   if (numOfFtrs !== features.length && this.isEditAttributeActive && this.managementControl_) {
//     this.refreshAttributeTable(this.managementControl_.getSelectedFeatures());
//   } else {
//     this.refreshAttributeTable(features);
//   }
// }

// Errores OL
// 9 - ERROR, Error al calcular el perfil topográfico, al añadir el control profileControl al mapa (src/impl/ol/analysiscontrol:293):
  // TypeError: Cannot read properties of undefined (reading 'length')
    // at Profil.value (Control.js:120:44)
    // at t.<anonymous> (Map.js:509:23)
    // at t.value (Target.js:114:11)
    // at t.value (Collection.js:207:10)
    // at t.value (Collection.js:233:10)
    // at t.value (Map.js:594:24)
    // at Analysiscontrol.showProfile (analysiscontrol.js:293:34)
    // at eval (analysiscontrol.js:198:14)