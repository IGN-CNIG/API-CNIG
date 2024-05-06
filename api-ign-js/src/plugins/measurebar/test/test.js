import MeasureBar from 'facade/measurebar';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});
window.map = map;

const mp = new MeasureBar({
  position: 'TL', // 'TL' | 'TR' | 'BR' | 'BL'
  collapsed: true,
  collapsible: true,
  tooltip: 'MeasureBar plugin',
  order: 1,
});
map.addPlugin(mp); window.mp = mp;

const mp2 = new M.plugin.Infocoordinates({ position: 'TR', decimalGEOcoord: 4, decimalUTMcoord: 4 }); map.addPlugin(mp2);

const mp3 = new M.plugin.Information({ position: 'TR', buffer: 100 }); map.addPlugin(mp3);

const mp4 = new M.plugin.Vectors({ collapsed: true, collapsible: true, position: 'TR', wfszoom: 12 }); map.addPlugin(mp4);

// Lista de errores encontrados

// 1 - ERROR, parece que hay un overlay invisible "m-measure-tooltip pointer" que muestra mensajes de ayuda, que realmente se podría quitar completamente del código si no se quiere usar este. Parece que comentando el código de "this.createHelpTooltip_();" se puede quitar, así mover el ratón a la derecha tiene menos lag o error visual por causa del ratón sobre este overlay invisible. Se podría hacer que haya un parámetro que por defecto este puesto a false de este para que solo lo muestre si se quiere añadir este, luego hay código de cambio de mensaje de tooltip que se podría meter solo dentro de si existe o no este tooltip anteriormente. Parece que "this.pointerMoveHandler_.bind(this));" también solo se usa si hay este help por lo que su añadido se puede ignorar en este caso.

// 2 - ERROR, hay ciertos cambios que mejorarán la velocidad del código.
// Parece que hay 2 funciones iguales "formatNumber(number) {..." que se podrían simplificar con "return `${number}`.replace('.', ',').replace(/\d(?=(\d{3})+,)/g, '$&.');", para no tener que hacer tantas veces split y join de arrays.
// Los cálculos de "Math.round((area / 10000) * 10000)" se podrían simplificar haciendo el calculo de dentro "Math.round(area)", importante que solo se haga con el paréntesis del "round" y no los cálculos externos a este.
// En "measurebar/src/impl/ol/js/measurearea.js", En "formatGeometry(geometry) {..." se puede no generar constante de "getProjection()", si no que usarla directamente al no ser usada más veces y también se puede simplificar los ifs a "area < 10000", "area < 1000000" y "else" restante por si solo.
// En "measurebar/src/impl/ol/js/measurebase.js" la función "onGeometryChange_" podría tener las constantes dentro del if, dejando solo "const newGeometry = evt.target;" y los demás aplicarlos directamente sin constante intermedia.
// En "measurebar/src/impl/ol/js/measurelength.js" y "measurebar/src/impl/ol/js/measurearea.js" se puede en "activate()" quitar el 'getControls().filter' por 'getControls().find' sin "[0]" al final.

// 3 - ERROR en JSP, si se añaden líneas y polígonos antes de cambiar alguno de los parámetros, el borrado de estos no funciona porque estará pensando que los layers antiguos no son los mismos. Se podría ver si "createLayer_() {..." podría nombrar este layer(según herramienta o Plugin, dependiendo de cual no causa problemas) y volver a cogerlo si ya esta añadido en vez de crearlo desde cero.
