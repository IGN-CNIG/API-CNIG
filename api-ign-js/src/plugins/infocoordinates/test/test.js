import Infocoordinates from 'facade/infocoordinates';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  zoom: 7,
  center: [-467062.8225, 4783459.6216],
});
window.map = map;

const mp = new Infocoordinates({
  position: 'TR', // TR | TL | BL | BR
  collapsed: true,
  collapsible: true,
  tooltip: 'Información de coordenadas',
  decimalGEOcoord: 4,
  decimalUTMcoord: 4,
  helpUrl: 'https://www.ign.es/',
  outputDownloadFormat: 'txt', // csv | txt
});
window.mp = mp;
map.addPlugin(mp);

/*/ PRUEBA con otros plugins
const mp2 = new M.plugin.Information({ position: 'TR', buffer: 100 });
const mp3 = new M.plugin.Vectors({ position: 'TR', collapsed: true, collapsible: true, wfszoom: 12 });
const mp4 = new M.plugin.MeasureBar({ position: 'TR' });
map.addPlugin(mp2); window.mp2 = mp2;
map.addPlugin(mp3); window.mp3 = mp3;
map.addPlugin(mp4); window.mp4 = mp4; // */

// Lista de errores

// 1 - ERROR, si se crean 3 puntos y luego se borra el primero de estos, causa que no se pueda volver a navegar por la lista de puntos, darle a "1" lleva a "2" y si se da a "2" causa de error "TypeError: this.layerFeatures.impl_.features_[(numPoint - 1)] is undefined" en "displayPoint infocoordinatescontrol.js:361", esto se puede solucionar cambiando el evento de click del botón así "buttonTab.addEventListener('click', () => this.openTabFromTab(featurePoint.getId()));", para que use el ID del feature en vez del valor original aportado que ya no es valido.

// 2 - ERROR, si se añaden más de 6 puntos, se expande la lista en 2 filas, causando que los botones inferiores se corten por la mitad. Esto se puede solucionar con solo cambiar este estilo del 305px a 321px para que se expanda hasta ese rango ".m-infocoordinates-content {max-height: 321px;}".

// 3 - ERROR, el "contenedorPuntoSelect" no se quita del número del feature si se escoge el último, es decir si el "2" esta seleccionado y se escoge el último valor "5", el número "2" sigue siendo marcado como escogido. Para solucionar esto se ha tenido que cambiar en "selectFeature" este if a "if (numPoint > countPoints) {this.displayPoint(numPoint);} else {if (document.getElementsByClassName('contenedorPuntoSelect')[0]) {document.getElementsByClassName('contenedorPuntoSelect')[0].classList.replace('contenedorPuntoSelect', 'contenedorPunto');}if (numPoint === countPoints) {document.querySelectorAll('.contenedorPunto').forEach((elem) => {if (parseInt(elem.textContent, 10) === numPoint) {elem.classList.replace('contenedorPunto', 'contenedorPuntoSelect');}});} else {try {document.getElementsByClassName('contenedorPunto')[document.getElementsByClassName('contenedorPunto').length - numPoint].classList.replace('contenedorPunto', 'contenedorPuntoSelect');/* eslint-disable no-empty */} catch (err) {}}/* Eliminamos las etiquetas de los puntos */if (document.getElementsByClassName('icon-displayON').length === 0 && this.map_.getMapImpl().getOverlays().array_.length > 0) {this.removeAllDisplaysPoints();}}" esto quitará ese elemento y además se reduce código copiado que se podría unir aquí.

// 4 - ERROR, el overlay de los números parece tener elementos HTML adicionales de cerrado presentes que se ignoran, ademas hay "table, tr, td" que se podrían eliminar y dejar igual con ciertos cambios:
// En "infocoordinates/src/facade/assets/css/infocoordinates.css",  cambiar los ".contenedorPuntoSelect" y ".contenedorPunto" para unirlos con estilos comunes nuevos y separar solo la diferencia, resultando en esto ".contenedorPuntoSelect, .contenedorPunto {position: absolute;top: -20px;left: -5px;font-size: 19px;color: white;font-family: sans;font-weight: bold;font-family: arial;z-index: 999;}.contenedorPunto {-webkit-text-stroke: 0.8px #2690e7;}.contenedorPuntoSelect {-webkit-text-stroke: 0.8px black;}", esto aplica el estilado para que sea igual aspecto de antes.
// En la función "displayPoint" cambiar el "textHTML" al "const textHTML = `<div class="contenedorPuntoSelect">${numPoint}</div>`;" y en la función "removePoint" cambiar el código de "contenedorPunto" reduciendo contado de tabs a "document.getElementsByClassName('contenedorPuntoSelect')[0].parentNode.remove();for (let elem of document.getElementsByClassName('contenedorPunto')) {if (parseInt(elem.innerHTML, 10) > numPoint) {elem.innerHTML = (parseInt(elem.innerHTML, 10) - 1);}}"
// 4.5 - ERROR, Parece que los demás "textHTML" de este plugin también tienen "</div> </div>" sobrantes al final de su creado que se ignoran.

// 5 - ERROR Si se pone el parámetro "collapsible" a false, no se puede añadir estos puntos, algo similar ocurre con parámetro "collapsed: false,", ya que en este caso hay que cerrar y abrir este para que se pueda añadir los puntos. Parece que se usa "this.panel_.on(M.evt.SHOW, this.activate, this); this.panel_.on(M.evt.HIDE, this.deactivate, this);" que solo detectan el abrir y cerrar del panel. Es posible que haga falta añadir un botón adicional solo para activar o desactivarlo en estado no colapsable.

// 6 - ERROR si los valores de configurado de decimales son altos por ejemplo " decimalGEOcoord: 10, decimalUTMcoord: 10," o si la cadena de coordenadas GMS/DMS es demasiado larga, termina expandiéndose la tabla, en height con lineas que cubren los botones de abajo, o width afectando los botones de copiar coordenadas causando que salgan del panel y no se pueda darles click.
// Se puede aumentar el tamaño máximo del panel ".div-m-infocoordinates-panel" pero esto no solucionaría todos los casos.
// Se Podría aplicar a la tabla un estilo de "table-layout: fixed;width: 100%;" para que no se salga del width y tras esto para arreglar los errores de height por lineas adicionales hay que cambiar los colspan (por ejemplo máximo de "9") con los td a "3" en los primeros cuatro textos y "4" en los demás, añadir overflow hidden a las coordenadas, poner a los iconos pequeños el colspan "1", dejando el resto del colspan a los demás apartados. Sería necesario en "m-infocoordinates-help" quitar "display: flex;align-items: center;" y poner solo a el span de ese el "float: left; margin-top: 7px;" con esto podría estar decentemente bien visualizado ahora y con menos problemas de tamaños.

// 7 - ERROR en JSP, si se refresca el plugin, este parece que solo hace desaparecer las coordenadas y los valores numéricos de overlays se quedan visibles permanentemente. Dentro de la función "removeAllPoints" hay un limpiado de todos los overlays con "this.map_.getMapImpl().removeOverlay", se podría crear una función común que se puede usar aquí y en el destroy del plugin a través de control_, el problema es que este borrado posiblemente quita otros overlay que no fueron añadidos por este plugin, por lo que podría ser una buena idea añadir un Array que tenga en cuenta todos los overlays que este plugin añade o quita. Por otro lado hay código repetido para hacer el "this.map_.getMapImpl().addOverlay(this.helpTooltip_);", que se podría convertir en una función de generado de overlays con "(textHTML, pos)".
