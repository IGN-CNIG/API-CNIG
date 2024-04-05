import { map as Mmap } from 'M/mapea';


// Habilitar para pruebas Layers
import KML from 'M/layer/KML';
import WMS from 'M/layer/WMS';
import WMTS from 'M/layer/WMTS';
import GeoJSON from 'M/layer/GeoJSON';
import MBTiles from 'M/layer/MBTiles';
import MBTilesVector from 'M/layer/MBTilesVector';
import OGCAPIFeatures from 'M/layer/OGCAPIFeatures';
import XYZ from 'M/layer/XYZ';
// import COG from 'M/layer/COG';


// Para otras pruebas
import Label from '../../../src/facade/js/Label';
import Polygon from 'M/style/Polygon';
import Feature from 'M/feature/Feature';
import Panel from 'M/ui/Panel';
import Popup from 'M/Popup';


//TERMINOLOGÍA
// OK (No parece tener nada mal)
// NO OK (Algún comportamiento raro)
// BUG (Este sufre un error)
// OK ERROR (Posiblemente un comportamiento de error apropiado)
// **** (Algo que requiere atención para finalizar, el "TO DO")
// DUDA (Requiere algunas confirmaciones)
// [APUNTADO A REDMINE] (Que ya fue enviado a Redmine)
// POR PROBAR (Requiere pruebas tras arreglo)
// IGNORAR (Creo que no son importantes)
// OL_ERROR (Apuntes de pruebas de "OL")
//TERMINOLOGÍA

//EJEMPLOS de pruebas: null, undefined, [], [null], [undefined], {}, {EJEMPLO:null}, {EJEMPLO:undefined}, {EJEMPLO:NaN}, "", "a4", 0, -1, NaN

// PRIMER PARÁMETRO [CHECK DONE]
// params.viewExtent, params.container, params.controls, params.minZoom, params.maxZoom, params.center, params.zoomConstrains, params.zoom, params.resolutions, params.bbox, params.label, params.maxExtent, params.ticket, params.projection, params.kml, params.wms, params.wmts, params.layers
// PRIMER PARÁMETRO

// SEGUNDO PARÁMETRO [CHECK DONE] NO EXISTEN MÁS PARÁMETROS QUE SE PUEDEN USAR AQUÍ.
// options.viewExtent (parece que sobrescribe el valor de viewExtent del primer parámetro por ello no hay ciertas pruebas o transformaciones como el de "string")
// SEGUNDO PARÁMETRO

// ¿¿¿ELEMENTOS SOBRANTES EN TRABAJO CON PRIMER PARÁMETRO??? IGNORAR BUG?
// Dentro de "api-ign-js/src/facade/js/parameter/Parameters.js", hay estas operaciones "this.wmc = parseWMC(userParameters);" y "this.getfeatureinfo = parseGetFeatureInfo(userParameters);", el resultado de esta operación se usan en "api-ign-js/src/facade/js/Map.js", pero estos de aquí nunca se usan, es decir se generan para nada.
// El único lugar que he encontrado que use este "New Parameters" es en "api-ign-rest/src/main/java/es/cnig/mapea/parameter/parser/ParametersParser.java" pero no creo que sea lo mismo.
// Por otro lado en "getWMS" hay referencia a WMC en descripción de esa función. También he encontrado bastantes comentarios o descripciones de funciones que usan este nombre WMC pero no parece que se refieren a él ya que terminan usando otros tipos de layers.
// Se ha indicado por Carmen que WMC efectivamente se ha dejado de usar, pero el "getfeatureinfo" debería de seguir siendo usado.
// ¿¿¿ELEMENTOS SOBRANTES EN TRABAJO CON PRIMER PARÁMETRO???


//BUG [APUNTADO A REDMINE] El compañero de al lado trabajo anteriormente con los CONTROLES y uso de parámetros con "*", el problema es que "backgroundlayers" pasa siempre por el case sin parámetros. Se ha informado al compañero.

// IGNORAR BUG? ZOOM INSPECTOR BROWSER.
//Se ha detectado que si se aplica el center del mapa cuando se esta habilitado el Inspector del Browser el center [-143777, 4853122] se pone como [-143777, 3994242.771391405]
//Esto parece ocurrir con objeto { x: -143777, y: 4853122 } más fácilmente. NO SE SI ES POR EL "fromUserCoordinate" que se usa en olView.setCenter(...)

// IGNORAR BUG? minZoom y maxZoom con valores negativos de máximos y mínimos de zooms.

//BUG(1)? [APUNTADO A REDMINE] Había indicación de que se puede enviar STRING al primer parámetro del mapa. Pero el "parseContainer" usa este string directamente como ID de HTML, por lo que solo valdría por ejemplo "map"
// En api-ign-js/src/impl/ol/js/Map.js se usa este código, pero no prevé el caso de NULL o hasta mejor sería sí esta en el ELSE el generado default:
//"""
//let newView = new View({ ...this.objectView, projection });
//if (this.viewExtent !== undefined && this.viewExtent.length === 4) {
//  newView = new View({ ...this.objectView, projection, extent: this.viewExtent });
//}
//"""
//Parece que en parseViewExtent, se usa "getParameterValue('viewExtent', parameter);", que devuelve null en este caso; HAY 3 apartados que usan "this.viewExtent !== undefined", podría ser mejor solución si se cambia null a undefined al final de "parseViewExtent"

//BUG [APUNTADO A REDMINE] podría ser que el segundo parámetro de mapa no se usa nunca, por lo que se podría quitar de Mmap(...)


const mapa = Mmap(
//PRIMER PARÁMETRO
  //PRUEBA DE PRIMER PARÁMETRO COMO CADENAS
  // 'map', // BUG(1) "this.viewExtent = options.viewExtent" termina como null, pero la única prueba es de undefined. [APUNTADO A REDMINE]/*
  //'https://componentes.cnig.es/api-core/?container=map&controls=scale,scaleline,panzoombar,panzoom,location,getfeatureinfo,rotate,backgroundlayers&center=-118114.81174504594,4397718.761898104&zoom=6&projection=EPSG:3857*m',/* // OK ERROR, creo que no debería de funcionar en este caso
  //PRUEBA DE PRIMER PARÁMETRO COMO CADENAS
  {
  // ? 00. Caso de uso: Pruebas de container
  container: 'map', // OK
  // container: {id:'map'}, // OK
  // container: {container:'map'}, // OK
  // container: function() {}, // OK ERROR El tipo del parámetro container no es válido: function
  // container: 0, // OK ERROR El tipo del parámetro container no es válido: number
  // container: NaN, // OK ERROR El tipo del parámetro container no es válido: number
  // container: {}, // OK ERROR No ha especificado ningún parámetro contenedor
  // container: ['map'], // OK ERROR No ha especificado ningún parámetro contenedor
  // container: [], // OK ERROR No ha especificado ningún parámetro contenedor
  // container: null, // OK ERROR No ha especificado ningún parámetro contenedor
  // container: undefined, // OK ERROR No ha especificado ningún parámetro contenedor
  // container: '', // OK ERROR No ha especificado ningún parámetro contenedor
  // SIN APUNTAR PARÁMETRO // OK ERROR No ha especificado ningún parámetro contenedor
  // ? 00. Caso de uso: Pruebas de container


  // ? 01. Caso de uso: Pruebas de controls // equivalente a this.addControls(...)
  // controls: ['scale'], // OK
  // controls: 'scale', // OK prueba de string
  // controls: ['sCaLeliNe'], // OK
  // controls: 'scaleline*scale', // OK, el "scaleline" aparece pero el "scale" no esta, porque el único uso de * es con Attributions.NAME
  // controls: ['scaleline*scale'] // OK, el "scaleline" aparece pero el "scale" no esta, porque el único uso de * es con Attributions.NAME
  // controls: ['scaleline','scale'], // OK se ven los dos controles
  // controls: ['scaleline', 'scale', 'panzoombar', 'panzoom', 'location', 'getfeatureinfo', 'rotate'], // OK
  // controls: ['attributions'], // OK
  // controls: ['attributions*EJEMPLO_DE_TEXTO_ATTRIBUTIONS'], // NO OK, deja mensaje "undefined, Gobierno de España", no parece que hay forma de usar esa string
  // controls: ['attributions*<p>EJEMPLO_DE_TEXTO_ATTRIBUTIONS</p>'], // OK, parece que solo funciona así
  // controls: ['backgroundlayers'], // OK
  // controls: ['backgroundlayers*1*true'], // NO OK, Se supone que tiene que escoger de M.config.backgroundlayers el numero "1" del array, que es mapa imagen, pero al hacerse split con "*" termina como "backgroundlayers" default
  // controls: [undefined], // OK vacío
  // controls: [null], // OK vacío
  // controls: undefined, // OK vacío
  // controls: null, // OK vacío
  // controls: [], // OK vacío
  // controls: '', // OK vacío.
  // controls: '*', // OK ERROR control is undefined
  // controls: {}, // OK ERROR El control "[object Object]" no es un control válido. (Espera clase "Control")
  // controls: [{}], // OK ERROR El control "[object Object]" no es un control válido. (Espera clase "Control")
  // controls: 0, // OK ERROR El control "0"("-1" ...) no es un control válido. (Espera clase "Control")
  // controls: [0], // OK ERROR El control "0" no es un control válido. (Espera clase "Control")
  // controls: NaN, // OK ERROR El control "NaN" no es un control válido. (Espera clase "Control")
  // controls: [NaN], // OK ERROR El control "NaN" no es un control válido. (Espera clase "Control")
  // controls: "Scaline,scale", // OK ERROR control is undefined, te indica la URL para ver la lista de controles
  // controls: ['PRUEBA_NO_EXISTENTE'], // OK ERROR control is undefined, te indica la URL para ver la lista de controles
  // SIN APUNTAR PARÁMETRO // OK vacío.
  // ? 01. Caso de uso: Pruebas de controls


  // ? 02. Caso de uso: Pruebas de viewExtent
  // viewExtent: [-2658785.5918715713, 4280473.583969865, 2037505.425969658, 5474114.217671178], // OK
  // viewExtent: [-2660000, 4280000, 2040000, 5470000], // OK
  // viewExtent: "-2660000,4280000,2040000,5470000", // OK
  // viewExtent: [-160000, 4800000,-120000, 4860000], // OK
  // viewExtent: [-2660000, 4500000, 2040000, 4500000], // OK vacío mapa al incluir un rango de 0
  // viewExtent: [2040000, 4500000, -2660000 , 4000000], // OK vacío con valores invertidos del rango
  // viewExtent: [-2660000, 4280000, 2040000, 5470000, 1, 2, 3, 4, 5, 6], // OK no ha hecho el zoom
  // viewExtent: [-2660000, 4280000, 2040000, 5470000,-2660000, 4280000, 2040000, 5470000], // OK no ha hecho el zoom
  // viewExtent: [-2660000, 4280000], // OK no se hizo ningún zoom
  // viewExtent: "-2660000,4280000,2040000,5470000,1", // OK no ha hecho el zoom
  // viewExtent: {x:{xmin:-2660000, xmax:2040000},y:{ymin:4280000,ymax:5470000}}, // OK ERROR viewExtent.split is not a function (al no ser Array)
  // viewExtent: {}, // OK ERROR viewExtent.split is not a function (al no ser Array en parseViewExtent, podría ser necesario asegurarse que es string)
  // viewExtent: 0, // OK ERROR viewExtent.split is not a function (al no ser Array en parseViewExtent, podría ser necesario asegurarse que es string)
  // viewExtent: NaN, // OK ERROR viewExtent.split is not a function (al no ser Array en parseViewExtent, podría ser necesario asegurarse que es string)
  // viewExtent: null, // BUG _this.viewExtent is null Map Map.js:202
  // viewExtent: undefined, // OK no se hizo ningún zoom
  // viewExtent: [], // OK no se hizo ningún zoom
  // viewExtent: '', // OK no se hizo ningún zoom
  // viewExtent: ',', // OK no se hizo ningún zoom window.mapa.impl_.viewExtent es [0,0]
  // viewExtent: [NaN], // OK no se hizo ningún zoom
  // viewExtent: "1234", // BUG window.mapa.impl_.viewExtent devuelve [1234], los otros viewExtent erroneos con arrays incorrectos también lo añaden
  // SIN APUNTAR PARÁMETRO // OK no se hizo ningún zoom
  // ? 02. Caso de uso: Pruebas de viewExtent


  // ? 03. Caso de uso: Pruebas de minZoom (Requiere center sobre España para acceder a tiles existentes)
  // minZoom: 4, // OK limita sin problemas el zoom
  // minZoom: 0, // OK Los tiles empiezan en zoom 3 por lo que no tiene efecto
  // minZoom: 2, // OK Los tiles empiezan en zoom 3 por lo que no tiene efecto
  // minZoom: 9, // OK
  // minZoom: 99, // OK fuerza el zoom a ese nivel y no se ve nada al no haber tiles en este
  // minZoom: "4", // OK se convierte a número
  // minZoom: "a4", // OK ERROR El formato del parámetro zoom no es correcto (por causa de NaN de ParseInt)
  // minZoom: null, // OK se convierte a número cero
  // minZoom: undefined, // OK se convierte a número cero
  // minZoom: [], // OK Es ignorado por "!isNullOrEmpty(params.minZoom)" en facade/js/Map.js
  // minZoom: "", // OK Es ignorado por "!isNullOrEmpty(params.minZoom)" en facade/js/Map.js
  // minZoom: [5], // OK ERROR El parámetro no es de un tipo soportado: object
  // minZoom: {}, // OK ERROR El parámetro no es de un tipo soportado: object
  // minZoom: {minZoom:5}, // OK ERROR El parámetro no es de un tipo soportado: object
  // minZoom: NaN, // OK ERROR El formato del parámetro zoom no es correcto
  // minZoom: -1, // BUG IGNORAR(openlayer también lo aplica) no parece que importa este valor negativo, funciona igual de bien visualmente termina como 3(tile mínimo). ¿Podría causar problemas si no se prevé, ya que se puede obtenerlo con getMinZoom()?
  // SIN APUNTAR PARÁMETRO // OK
  // ? 03. Caso de uso: Pruebas de minZoom


  // ? 04. Caso de uso: Pruebas de maxZoom (Requiere center sobre España para acceder a tiles existentes)
  // maxZoom: 5, // OK limita sin problemas el zoom
  // maxZoom: "5", // OK se convierte a número
  // maxZoom: "a5", // OK ERROR El formato del parámetro zoom no es correcto
  // maxZoom: "", // OK Es ignorado por "!isNullOrEmpty(params.minZoom)" en facade/js/Map.js
  // maxZoom: 0, // OK, Se pone a ZOOM 2 como mínimo y no se mueve, aunque en MinZoom no se ponía nunca en este, el mapa parece borroso
  // maxZoom: 2, // OK, No se mueve, el mapa parece borroso
  // maxZoom: 99, // NO OK, alrededor de zoom 36 y adelante, se va aumentando el error de saltos de mapas que a partir de 44 ya no es visible, los recortes tiene distintos aspectos, cuadrados o triángulos
  // maxZoom: -1, // BUG IGNORAR(openlayer tambien lo aplica window.mapa.getMapImpl().getView().getMaxZoom()), Se pone a ZOOM 2 como mínimo y no se mueve, aunque en MinZoom no se ponía nunca en este, el mapa parece borroso
  // maxZoom: [], // OK Es ignorado por "!isNullOrEmpty(params.minZoom)" en facade/js/Map.js
  // maxZoom: {}, // OK ERROR El parámetro no es de un tipo soportado: object
  // maxZoom: null, // OK, se transformo en número 28.
  // maxZoom: undefined, // OK, se transformo en número 28.
  // maxZoom: NaN, // OK ERROR El formato del parámetro zoom no es correcto
  // SIN APUNTAR PARÁMETRO // OK
  // ? 04. Caso de uso: Pruebas de maxZoom


  // ? 05. Caso de uso: Pruebas de minZoom y maxZoom (Requiere center sobre España para acceder a tiles existentes)
  // minZoom: 7, maxZoom: 7, // OK, no se mueve
  // minZoom: 6, maxZoom: 7, // OK, Se mueve solo en el rango indicado,
  // minZoom: 7, maxZoom: 6, // OK, se tiene prioridad con minZoom, se termina sin moverse en ese
  // ? 05. Caso de uso: Pruebas de minZoom y maxZoom


  // ? 06. Caso de uso: Pruebas de center (Parece que tener abierto el inspector de Browser causa un desplazado no deseado de "y" a 3994242.771391405)
  // center: [-143777, 4853122], // OK centrado en España que es necesario para minZoom y maxZoom (SALE EXACTAMENTE ESTE VALOR, tras más pruebas a dejado de salir este exactamente por inspector browser)
  // center: "-143777,4853122", // OK
  // center: { x: -143777, y: 4853122 }, // OK
  // center: { x: -143777, y: 4853122, draw:true}, // OK Ademas de aplicarse el dibujado de feature
  // center: { x: -143777, y: 4853122, draw:false}, // OK
  // center: [], // OK no se aplica nada
  // center: ["-143777", "4853122"], // OK
  // center: ["-143777"], // OK ERROR El formato del parámetro center no es correcto
  // center: ["a143777", "a4853122"], // OK ERROR El formato del parámetro center no es correcto
  // center: { x: "-143777", y: "4853122" }, // OK
  // center: { x: "-143777" }, // OK ERROR El formato del parámetro center no es correcto
  // center: { x: "A-143777", y: "a4853122" }, // OK ERROR El formato del parámetro center no es correcto
  // center: { x: null, y: 4853122 }, // OK ERROR El formato del parámetro center no es correcto
  // center: { x: -143777, y: undefined }, // OK ERROR El formato del parámetro center no es correcto
  // center: [-143777],// OK ERROR El formato del parámetro center no es correcto
  // center: [-143777, undefined], // BUG, no indica que ocurrió un error, pero si marca que es NaN en center "y", EL MAPA NO SE VE.
  // center: [undefined, 4853122 ], // BUG, no indica que ocurrió un error, pero si marca que es NaN en center "x", EL MAPA NO SE VE.
  // center: [undefined, undefined], // OK no se aplica nada
  // center: [null, null], // OK no se aplica nada
  // center: [-143777, null], // OK se aplica el null como 0
  // center: null, // OK no se aplica nada
  // center: undefined, // OK no se aplica nada
  // center: "", // OK no se aplica nada, ni hay ningún mensaje
  // center: "-143777,a4853122", // OK ERROR El formato del parámetro center no es correcto
  // center: 0, // BUG (igual que "", null o undefined) El parámetro no es de un tipo soportado: undefined y el mapa no se ve
  // center: [-143777, NaN], // OK ERROR El formato del parámetro center no es correcto
  // center: NaN, // BUG El parámetro no es de un tipo soportado: undefined y el mapa no se ve
  // SIN APUNTAR PARÁMETRO // OK
  // ? 06. Caso de uso: Pruebas de center


  // ? 07. Caso de uso: Pruebas de center y maxZoom con viewExtent
  // center: [-143777, 4853122], viewExtent: [-2658785, 4280473, 2037505, 5474114], // OK el center esta dentro del extent
  // center: [10000000, 6550000], viewExtent: [-2658785, 4280473, 2037505, 5474114], // OK El center no se puede aplicar al estar fuera, por lo que se queda con lo más cercano dentro del extent
  // maxZoom: 3, viewExtent: [-2658785, 4280473, 2037505, 5474114], // BUG, hay algún formato de re-localización severo que causa parpadeo no deseado
  // ? 07. Caso de uso: Pruebas de center y maxZoom con viewExtent


  // ? 08. Caso de uso: Pruebas de zoomConstrains (Pare hacer pruebas usar mapa.getZoom(true) ya que devuelve entonces valores reales)
  // zoomConstrains: true, // OK, creo que esta es la configuración default
    // minZoom: 6.5, // OK MinZoom:6.5 MaxZoom:27.5 y los zooms van desde 6 a 27
  // zoomConstrains: false, // OK, creo que debería haber permitido poner con setZoom(6.5), pero por alguna razón se puso 7.
    // minZoom: 6.5, // OK MinZoom:6.5 MaxZoom:27.5 y los zooms mostrados son desde 6 a 27 sin decimales, pero ahora los zooms no se mueven en unidades pero si decimales
    // minZoom: 6.5, maxZoom: 8.6, zoom: 6.6 // OK parece que en todo caso domina el minZoom, y el máximo se define en unidades superiores a este, 7.5, 8.5, 9.5 ..., pero el maxZoom impide que se escojan valores superiores a el mismo según el minZoom
  // SIN APUNTAR PARÁMETRO // OK se aplica default true
  // ? 08. Caso de uso: Pruebas de zoomConstrains


  // ? 09. Caso de uso: Pruebas de zoom
  // zoom: 7, // OK
  // zoom: "7", // OK
  // zoom: "a7", // OK ERROR El formato del parámetro zoom no es correcto
  // zoom: "", // OK
  // zoom: 0, // OK se limita al zoom 3 al ser el mínimo del tiles.
  // zoom: -1, // OK se limita al zoom 3 al ser el mínimo del tiles. El getZoom obtiene 3
  // zoom: null, // OK
  // zoom: undefined, // OK
  // zoom: NaN, // OK ERROR El formato del parámetro zoom no es correcto
  // zoom: [], // OK no se aplica nada
  // zoom: [7], // OK ERROR El parámetro no es de un tipo soportado: object
  // zoom: {}, // OK ERROR El parámetro no es de un tipo soportado: object
  // SIN APUNTAR PARÁMETRO // OK
  // ? 09. Caso de uso: Pruebas de zoom


  // ? 10. Caso de uso: Pruebas de resolutions
  // resolutions: [156543.03392804097,78271.51696402048,39135.75848201024,19567.87924100512,9783.93962050256,4891.96981025128,2445.98490512564,1222.99245256282,611.49622628141,305.748113140705,152.8740565703525,76.43702828517625,38.21851414258813,19.109257071294063,9.554628535647032,4.777314267823516,2.388657133911758,1.194328566955879,0.5971642834779395,0.29858214173896974,0.14929107086948487,0.07464553543474244,0.03732276771737122,0.01866138385868561,0.009330691929342804,0.004665345964671402,0.002332672982335701,0.0011663364911678506,0.0005831682455839253,0.00029158412279196264,0.00014579206139598132,0.00007289603069799066,0.00003644801534899533,0.000018224007674497665,0.000009112003837248832,0.000004556001918624416,0.000002278000959312208,0.000001139000479656104,5.69500239828052e-7,2.84750119914026e-7,1.42375059957013e-7,7.11875299785065e-8,3.559376498925325e-8], // OK
  // resolutions: [], // OK ignorado
  // resolutions: [1222.99245256282], // OK FUERZA A usar solo este zoom "0" definido como tal
  // resolutions: ["1222.99245256282"], // OK
  // resolutions: "1222.99245256282,611.49622628141", // OK
  // resolutions: "1222.99245256282;611.49622628141", // OK
  // resolutions: [null], // OK ignorado
  // resolutions: [undefined], // OK ignorado
  // resolutions: [NaN], // OK ERROR El formato del parámetro resolutions no es correcto
  // resolutions: [0], // OK MAPA VACÍO
  // resolutions: [-1], // OK MAPA VACÍO
  // resolutions: null, // OK ignorado
  // resolutions: undefined, // OK ignorado
  // resolutions: NaN, // OK ERROR El parámetro no es de un tipo soportado: number
  // resolutions: 0, // OK ERROR El parámetro no es de un tipo soportado: number
  // resolutions: -1, // OK ERROR El parámetro no es de un tipo soportado: number
  // resolutions: "", // OK ignorado
  // SIN APUNTAR PARÁMETRO // OK
  // ? 10. Caso de uso: Pruebas de resolutions


  // ? 11. Caso de uso: Pruebas de label [APUNTADO A REDMINE]
  // label: {panMapIfOutOfView: false, text:"Texto_de_Prueba_1", coord:[-143777, 4853122]}, // OK
  // label: {panMapIfOutOfView: false, text:"Texto_de_Prueba_2", coord:[0, 0]}, // OK
  // label: {panMapIfOutOfView: true, text:"Texto_de_Prueba_3", coord:[1, 1]}, // BUG [APUNTADO A REDMINE] Parece que la animación "panIntoView", en concreto "const popPx = this.getMap().getPixelFromCoordinate(coord);" tiene condición más adelante de "var frameState = this.frameState_; if (!frameState) {..." que se para ahí al ser null.
  // SIN APUNTAR PARÁMETRO // OK
  // ? 11. Caso de uso: Pruebas de label


  // ? 12. Caso de uso: Pruebas de maxExtent (El parámetro "center" configurado o no no parece que afecta este parámetro) [APUNTADO A REDMINE] Que no funciona con layer default del mapa, pero sí con OSM.
  // maxExtent: [[-160000, 4800000],[-120000, 4860000]], // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: [-160000, 4800000,-120000, 4860000, 1234], // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: [NaN], // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: "a7", // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: {x:{min:null,max:-120000},y:{min:4800000,max:4860000}}, // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: {x:{min:undefined,max:-120000},y:{min:4800000,max:4860000}}, // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: {x:{min:NaN,max:-120000},y:{min:4800000,max:4860000}}, // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: {left:NaN,right:-120000,bottom:4800000,top:4860000}, // OK ERROR El formato del parámetro maxExtent no es correcto
  // maxExtent: {maxExtent:[-160000, 4800000,-120000, 4860000]} // OK ERROR maxExtentParameter.x is undefined (Parece que este doble objeto no es valido)
  // maxExtent: {}, // OK ERROR maxExtentParameter.x is undefined
  // maxExtent: {left:null,right:-120000,bottom:4800000,top:4860000}, // OK ERROR maxExtentParameter.x is undefined
  // maxExtent: {left:undefined,right:-120000,bottom:4800000,top:4860000}, //  OK ERROR maxExtentParameter.x is undefined
  // maxExtent: 0, // OK ERROR El parámetro no es de un tipo soportado: number
  // maxExtent: NaN, // OK ERROR El parámetro no es de un tipo soportado: number
  
  // layers: ['OSM'], // Para pruebas de "maxExtent"
  // maxExtent: [], // OK no hace nada
  // maxExtent: [null], // OK no hace nada
  // maxExtent: [undefined], // OK no hace nada
  // maxExtent: "", // OK no hace nada
  // maxExtent: null, // OK no hace nada
  // maxExtent: undefined, // OK no hace nada
  // maxExtent: [-1830709, 3572699, 1040877, 5328916],// OK detectado que si funciona con layer OSM, pero no el default
  // maxExtent: [-160000, 4800000,-120000, 4860000], // OK
  // maxExtent: "-160000,4800000,-120000,4860000", // OK
  // maxExtent: "-160000;4800000;-120000;4860000", // OK
  // maxExtent: {x:{min:-160000,max:-120000},y:{min:4800000,max:4860000}}, // OK
  // maxExtent: {left:-160000,right:-120000,bottom:4800000,top:4860000}, // OK
  // SIN APUNTAR PARÁMETRO // OK
  // ? 12. Caso de uso: Pruebas de maxExtent


  // ? 13. Caso de uso: Pruebas de ticket [APUNTADO A REDMINE] Se tiene que generar un ticket temporal para las pruebas que caduca en el mismo día. El resultado fue que no se puede usar este parámetro, pero poner el ticket dentro de la URL hace que funcione bien.
  // ticket: "PWUMZ5MQTPUGAEWTHCXVXSFZLIEFBKR3SVA3XTDCYBY2ZRLKPI4TE24APP73YV2R3PJAYKS43723OMLGMG4G7NTD3HIALJ42K73PC7UFIXGDXYB5UB2AF3DQDNRV4J7Y4K2SAIEI2GAOURMWOMKWEDURE5K2H357Y35B5GI", layers: ['WFS*CAPA*https://hcsigc-geoserver-sigc.desarrollo.guadaltel.es/geoserver/Global/wfs?*Global:superadmin_jsonpruebas_20231117_102719*MPOLYGON'], // BUG no ha funcionado con el layer de ejemplo
  // layers: ['WFS*CAPA*https://hcsigc-geoserver-sigc.desarrollo.guadaltel.es/geoserver/Global/wfs?ticket=PWUMZ5MQTPUGAEWTHCXVXSFZLIEFBKR3SVA3XTDCYBY2ZRLKPI4TE24APP73YV2R3PJAYKS43723OMLGMG4G7NTD3HIALJ42K73PC7UFIXGDXYB5UB2AF3DQDNRV4J7Y4K2SAIEI2GAOURMWOMKWEDURE5K2H357Y35B5GI*Global:superadmin_jsonpruebas_20231117_102719*MPOLYGON'], // Solo funciona con este layer, ya que el ticket esta incluido en la URL //https://hcsigc-geoserver-sigc.desarrollo.guadaltel.es/geoserver/Global/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=superadmin_jsonpruebas_20231117_102719&outputFormat=application%2Fjson&srsname=EPSG%3A25830&&ticket=PWUMZ5MQTPUGAEWTHCXVXSFZLIEFBKR3SVA3XTDCYBY2ZRLKPI4TE24APP73YV2R3PJAYKS43723OMLGMG4G7NTD3HIALJ42K73PC7UFIXGDXYB5UB2AF3DQDNRV4J7Y4K2SAIEI2GAOURMWOMKWEDURE5K2H357Y35B5GI

  //ticket: "TEST_TICKET", // POR PROBAR
  //ticket: "", // POR PROBAR
  //ticket: null, // POR PROBAR
  //ticket: undefined, // POR PROBAR
  //ticket: 0, // POR PROBAR
  //ticket: NaN, // POR PROBAR
  //ticket: [], // POR PROBAR
  //ticket: {},  // POR PROBAR
  // SIN APUNTAR PARÁMETRO // OK
  // ? 13. Caso de uso: Pruebas de ticket


  // ? 14. Caso de uso: Pruebas de bbox
  // bbox: [-160000, 4800000,-120000, 4860000], // OK HACE zoom en la zona seleccionada
  // bbox: {x:{min:-160000,max:-120000},y:{min:4800000,max:4860000}}, // OK HACE zoom en la zona seleccionada
  // bbox: {left:-160000,right:-120000,bottom:4800000,top:4860000}, // OK HACE zoom en la zona seleccionada
  // bbox: "-160000,4800000,-120000,4860000", // OK HACE zoom en la zona seleccionada
  // bbox: "-160000;4800000;-120000;4860000", // OK HACE zoom en la zona seleccionada
  // bbox: [NaN], // OK ERROR El formato del parámetro maxExtent no es correcto
  // bbox: "a7", // OK ERROR El formato del parámetro maxExtent no es correcto
  // bbox: [-160000, 4800000,-120000, 4860000, 1234], // OK ERROR El formato del parámetro maxExtent no es correcto
  // bbox: {bbox:[-160000, 4800000,-120000, 4860000]}, // OK ERROR TypeError: maxExtentParameter.x is undefined (Parece que este doble objeto no es valido)
  // bbox: {}, // OK ERROR TypeError: maxExtentParameter.x is undefined
  // bbox: 0, // OK ERROR El parámetro no es de un tipo soportado: number
  // bbox: NaN, // OK ERROR El parámetro no es de un tipo soportado: number
  // bbox: [], // OK no hace nada
  // bbox: [null], // OK no hace nada
  // bbox: [undefined], // OK no hace nada
  // bbox: "", // OK no hace nada
  // bbox: null, // OK no hace nada
  // bbox: undefined, // OK no hace nada
  // SIN APUNTAR PARÁMETRO // OK
  // ? 14. Caso de uso: Pruebas de bbox


  // ? 15. Caso de uso: Pruebas de projection
  // projection: "EPSG:3857*m", // OK
  // projection: "EPSG:4258*d", // OK no se veía nada en el mapa por el center diseñado con la antigua proyección
  // projection: "EPSG:25830*m", // OK
  // projection: "EPSG:3857*d", // OK no aplica la unidad indicada y termina con "m"
  // projection: "EPSG:25830*d", // OK no aplica la unidad indicada y termina con "m"
  // projection: "EPSG:4258*m", // OK no aplica la unidad indicada y termina con "d"
  // projection: "EPSG:4258", // BUG? muestra alerta "El formato del parámetro projection no es correcto.Se usará la proyección por defecto: EPSG:3857*m"
  // projection: "EPSG:3857", // BUG? muestra alerta "El formato del parámetro projection no es correcto.Se usará la proyección por defecto: EPSG:3857*m"
  // projection: "EPSG:25830", // BUG? muestra alerta "El formato del parámetro projection no es correcto.Se usará la proyección por defecto: EPSG:3857*m"
  // projection: "", // OK no hace nada
  // projection: null, // OK no hace nada
  // projection: undefined, // OK no hace nada
  // projection: NaN, // OK ERROR El parámetro no es de un tipo soportado: number
  // projection: 0, // OK ERROR El parámetro no es de un tipo soportado: number
  // projection: [], // OK no hace nada
  // projection: {}, // OK ERROR muestra alerta "El formato del parámetro projection no es correcto.Se usará la proyección por defecto: EPSG:3857*m"
  // projection: "a7", // OK ERROR muestra alerta "El formato del parámetro projection no es correcto.Se usará la proyección por defecto: EPSG:3857*m"
  // projection: "*", // OK ERROR muestra alerta "El formato del parámetro projection no es correcto.Se usará la proyección por defecto: EPSG:3857*m"
  // SIN APUNTAR PARÁMETRO // OK
  // ? 15. Caso de uso: Pruebas de projection


  // ? 16. Caso de uso: Pruebas de kml
  // kml: 'KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*true', // OK se ven los puntos de ejemplo este
  // kml: 'KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*false', // OK, NO VEO NADA DE ESTE LAYER por "extract:false"
  // kml: new KML({url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',name: "capaKML",extract: true}), // OK, se ven los puntos de ejemplo este
  // kml: null, // OK no hace nada
  // kml: undefined, // OK no hace nada
  // kml: [], // OK no hace nada
  // kml: [null], // OK no hace nada
  // kml: [undefined], // OK no hace nada
  // kml: "", // OK no hace nada
  // kml: {}, // OK ERROR "500 Error Interno del Servidor"
  // kml: [{}], // OK ERROR "500 Error Interno del Servidor"
  // kml: "*", // OK ERROR "500 Error Interno del Servidor"
  // kml: 0, // OK ERROR El parámetro no es de un tipo soportado: number
  // kml: NaN, // OK ERROR El parámetro no es de un tipo soportado: number
  // kml: [NaN], // OK ERROR El parámetro no es de un tipo soportado: number
  // kml: "a7", // BUG params[(params.length - 2)] is undefined
  // kml: new KML(), // BUG "500 Error Interno del Servidor"
  // kml: [new KML()], // BUG "500 Error Interno del Servidor"
  // SIN APUNTAR PARÁMETRO // OK
  // ? 16. Caso de uso: Pruebas de kml


  // ? 17. Caso de uso: Pruebas de wms
  // wms: new WMS({url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',name: 'AU.AdministrativeBoundary',legend: 'Limite administrativo',tiled: false,}, {}), // OK se ven bordes de provincias
  // wms: 'WMS*Unidad administrativa*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeUnit*false*true*true*1.3.0*true*true*true', // OK se ve sin transparencia.
  // wms: 'WMS*Unidad administrativa*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeUnit*true*true*true*1.3.0*true*true*true', // OK se ve bordes de provincias y textos de estos
  // wms: null, // OK no hace nada
  // wms: undefined, // OK no hace nada
  // wms: [], // OK no hace nada
  // wms: [null], // OK no hace nada
  // wms: [undefined], // OK no hace nada
  // wms: "", // OK no hace nada
  // wms: "a7", // OK ERROR No se reconoce el tipo de capa undefined
  // wms: "*", // OK ERROR  No se reconoce el tipo de capa undefined
  // wms: 0, // OK ERROR El parámetro no es de un tipo soportado: number
  // wms: NaN, // OK ERROR El parámetro no es de un tipo soportado: number
  // wms: [NaN], // OK ERROR El parámetro no es de un tipo soportado: number
  // wms: new WMS(), // OK ERROR No se ha especificado ningún parámetro
  // wms: [new WMS()], // OK ERROR No se ha especificado ningún parámetro
  // wms: {}, // BUG requestUrl is undefined
  // wms: [{}], // BUG requestUrl is undefined
  // SIN APUNTAR PARÁMETRO // OK
  // ? 17. Caso de uso: Pruebas de wms


  // ? 18. Caso de uso: Pruebas de wmts
  // wmts: new WMTS({url: "http://www.ign.es/wmts/pnoa-ma",name: "OI.OrthoimageCoverage",matrixSet: "EPSG:25830",legend: "PNOA"}, {format: 'image/png'}), // OK se ve mapa satélite
  // wmts: 'WMTS*http://wmts-mapa-lidar.idee.es/lidar*EL.GridCoverageDSM*GoogleMapsCompatible*Modelo Digital de Superficies LiDAR*true*image/png*true*true*true', // OK se ve mapa satélite LiDAR
  // wmts: null, // OK no hace nada
  // wmts: undefined, // OK no hace nada
  // wmts: [], // OK no hace nada
  // wmts: [null], // OK no hace nada
  // wmts: [undefined], // OK no hace nada
  // wmts: "", // OK no hace nada
  // wmts: "a7", // OK ERROR No se reconoce el tipo de capa undefined
  // wmts: "*", // OK ERROR  No se reconoce el tipo de capa undefined
  // wmts: 0, // OK ERROR El parámetro no es de un tipo soportado: number
  // wmts: NaN, // OK ERROR El parámetro no es de un tipo soportado: number
  // wmts: [NaN], // OK ERROR El parámetro no es de un tipo soportado: number
  // wmts: new WMTS(), // OK ERROR No se ha especificado ningún parámetro
  // wmts: [new WMTS()], // OK ERROR No se ha especificado ningún parámetro
  // wmts: {}, // BUG capabilitiesInfo is undefined
  // wmts: [{}], // BUG capabilitiesInfo is undefined
  // SIN APUNTAR PARÁMETRO // OK
  // ? 18. Caso de uso: Pruebas de wmts


  // ? 19. Caso de uso: Pruebas de layers
  // layers: [new WMS({url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',name: 'AU.AdministrativeBoundary',legend: 'Limite administrativo',tiled: false,}, {}),'WMTS*http://wmts-mapa-lidar.idee.es/lidar*EL.GridCoverageDSM*GoogleMapsCompatible*Modelo Digital de Superficies LiDAR*true*image/png*true*true*true'], // OK se ven los dos layers sin problemas.
  // layers: 'KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*true;WMTS*http://wmts-mapa-lidar.idee.es/lidar*EL.GridCoverageDSM*GoogleMapsCompatible*Modelo Digital de Superficies LiDAR*true*image/png*true*true*true', // OK ERROR No hubo respuesta del KML (Parece que en este caso no existe separado de layers, tienen que ir por separados con anterioridad)
  // STRINGS utilizables 'WFS','WMS','GeoJSON','KML','Vector','WMTS','MVT','MBTiles','MBTilesVector','XYZ','TMS','OSM','OGCAPIFeatures','GenericRaster','GenericVector'
  // SIN APUNTAR PARÁMETRO // OK
  // ? 19. Caso de uso: Pruebas de layers

  // ? 20. Caso de uso: Pruebas de getfeatureinfo
  // center: { x: -462014, y: 4427238 }, zoom: 5, controls: ['getfeatureinfo'], layers: [new WMS({url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',name: 'RED_ERGNSS',legend: 'Red de Estaciones permanentes GNSS',tiled: true,version: '1.3.0',}, {})], // Necesario para pruebas de "getfeatureinfo"
  // getfeatureinfo: 'plain', // OK
  // getfeatureinfo: 'gml', // NO OK, no veo diferencia comparado con el plain
  // ? 20. Caso de uso: Pruebas de getfeatureinfo

} //*///BLOQUEO DE COMENTADO PARA PRUEBAS DE ESTE PARÁMETRO CON STRING
//PRIMER PARÁMETRO
//SEGUNDO PARÁMETRO
//, {
  // ? 21. Caso de uso: Pruebas de viewExtent en segundo Parámetro, SIMILAR A (02)
  // viewExtent: [-2658785.5918715713, 4280473.583969865, 2037505.425969658, 5474114.217671178], // OK IGUAL FUNCIONA IGUAL QUE EL OTRO viewExtent
  // viewExtent: [-2660000, 4280000, 2040000, 5470000], // OK IGUAL
  // viewExtent: "-2660000,4280000,2040000,5470000", // BUG, no ha funcionado, falta transformación en este caso al ser indirecto comparado con el primer parámetro.
  // viewExtent: [-2660000, 4500000, 2040000, 4500000], // OK IGUAL vacío mapa al incluir un rango de 0
  // viewExtent: [2040000, 4500000, -2660000 , 4000000], // OK IGUAL vacío con valores invertidos del rango
  // viewExtent: [-2660000, 4280000, 2040000, 5470000, 1, 2, 3, 4, 5, 6], // OK IGUAL no ha hecho el zoom
  // viewExtent: [-2660000, 4280000, 2040000, 5470000,-2660000, 4280000, 2040000, 5470000], // OK IGUAL no ha hecho el zoom
  // viewExtent: [-2660000, 4280000], // OK IGUAL no se hizo ningún zoom
  // viewExtent: "-2660000,4280000,2040000,5470000,1", // OK IGUAL, NO OK pero es por error de lectura marcado de antes, no ha hecho el zoom
  // viewExtent: {x:{xmin:-2660000, xmax:2040000},y:{ymin:4280000,ymax:5470000}}, // NO OK no hace zoom y no indica ningún error por valor no apropiado.
  // viewExtent: {}, // NO OK no hace zoom y no indica ningún error por valor no apropiado.
  // viewExtent: 0, // NO OK no hace zoom y no indica ningún error por valor no apropiado.
  // viewExtent: NaN, // NO OK no hace zoom y no indica ningún error por valor no apropiado.
  // viewExtent: null, // BUG IGUAL _this.viewExtent is null Map Map.js:202
  // viewExtent: undefined, // OK IGUAL no se hizo ningún zoom
  // viewExtent: [], // OK IGUAL no se hizo ningún zoom
  // viewExtent: '', // OK IGUAL no se hizo ningún zoom
  // viewExtent: ',', // OK IGUAL no se hizo ningún zoom
  // viewExtent: [NaN], // OK IGUAL no se hizo ningún zoom
  // ? 21. Caso de uso: Pruebas de viewExtent en segundo Parámetro

  // ? 22. Caso de uso: Pruebas de center y maxZoom con viewExtent y doble viewExtent, SIMILAR A (07)
  // Los parámetros de "center" y "maxZoom" no son usados aquí, pero si se generan en el primer parámetro, si funcionan igual que en la prueba 07.
  // Prueba de doble viewExtent, activar en el primer parámetro uno de estos y este de aquí. 
  // viewExtent: [-2658785, 4280473, 2037505, 5474114], // OK, se aplica este de aquí con prioridad si se introducen los dos, posiblemente el anterior es reemplazado
  // ? 22. Caso de uso: Pruebas de center y maxZoom con viewExtent

//}
//SEGUNDO PARÁMETRO
//TERCER PARÁMETRO api-ign-js/test/development/CP-0001-map/CP-004.js
);

window.mapa = mapa;

// ? 02 y 20. Caso de uso: Pruebas de viewExtent
// console.log("viewExtent:",mapa.getMapImpl().getView().options_.extent);
// ? 02 y 20. Caso de uso: Pruebas de viewExtent

// ? 03 y 04. Caso de uso: Pruebas de minZoom y maxZoom
// console.log("Zoom:"+mapa.getZoom()+" MinZoom:"+mapa.getMinZoom()+" MaxZoom:"+mapa.getMaxZoom());
// ? 03 y 04. Caso de uso: Pruebas de minZoom y maxZoom

// ? 06. Caso de uso: Pruebas de center
// let auxCenter = mapa.getCenter();if (auxCenter) {console.log("Center: X="+auxCenter.x+" Y="+auxCenter.y);}
// ? 06. Caso de uso: Pruebas de center

// ? 11. Caso de uso: Pruebas de label
// escapeJSCode error when launching label test.
// window.testLabel1 =new Label("Texto de prueba1", [0,0], false);//window.testLabel2 =new Label("Texto de prueba2", [0,0], true);//setTimeout(()=>{mapa.addLabel(window.testLabel1)},5000);//setTimeout(()=>{mapa.addLabel(window.testLabel2)},10000);
// ? 11. Caso de uso: Pruebas de label

// ? 12. Caso de uso: Pruebas de maxExtent
// console.log("MaxExtent:"+mapa.getMaxExtent());
// ? 12. Caso de uso: Pruebas de maxExtent

// ? 15. Caso de uso: Pruebas de projection
// let auxProj = mapa.getProjection();console.log("Projection:"+auxProj.code+" Unit:"+auxProj.units+" Extent:"+auxProj.getExtent());
// ? 15. Caso de uso: Pruebas de projection


////////////////////////////////
//////PRUEBAS DE FUNCIONES//////
////////////////////////////////

// HTMLs de CP-005.html
const popupDePruebas = window.document.getElementById('popup_de_test');
const abrirPopup = window.document.getElementById('abrir_test');
const cerrarPopup = window.document.getElementById('cerrar_test');
abrirPopup.addEventListener('click', () => {popupDePruebas.className = "active"});
cerrarPopup.addEventListener('click', () => {popupDePruebas.className = "notactive"});

const noParam = window.document.getElementsByClassName('noParameters')[0];
const getWithParam = window.document.getElementsByClassName('getWithParameters')[0];
const addParam = window.document.getElementsByClassName('addFunctions')[0];
const removeParam = window.document.getElementsByClassName('removeFunctions')[0];
const setParam = window.document.getElementsByClassName('setFunctions')[0];
const otherParam = window.document.getElementsByClassName('otherFunctions')[0];

// Botón para generar valores de de pruebas necesarias para algunas de estas funciones.
window.document.getElementsByClassName('generarDefaults')[0].addEventListener('click', ()=>{
  // For RemoveFeatures
  mapa.drawLayer_.addFeatures( new Feature("feature1", {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [
        -598044,
        5220448
      ]
    }
  }));

  // For getGeoJSON and removeLayers
  mapa.addLayers(new GeoJSON({name: "Provincias",url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json", legend:"TEST_LEGEND"}, {maxZoom: 10,style: new Polygon({fill: {color: 'red'}})}, {opacity: 0.5}))

  // For evtSetAttributions_ y getAttributions
  const auxContAttr =  mapa.getControls('attributions')[0];
  if (!auxContAttr) {
    mapa.addControls('attributions');
  }
});

// Ciertas variables necesarias para estas funciones.
const mbtile = new MBTiles({
  name: 'mbtilesLoadFunction',
  legend: 'Capa personalizada MBTiles',
  tileLoadFunction: (z, x, y) => {
    return new Promise((resolve) => {
      if (z > 4) {
        resolve('https://cdn-icons-png.flaticon.com/512/4616/4616040.png');
      } else {
        resolve('https://cdn.icon-icons.com/icons2/2444/PNG/512/location_map_pin_direction_icon_148665.png');
      }
    });
  },
});
const mbtileVector = new MBTilesVector({
  name: 'mbtilesvector',
  legend: 'Capa personalizada MBTilesVector',
  tileLoadFunction: (z, x, y) => {
    return new Promise((resolve) => {
      window.fetch(`https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/${z}/${x}/${y}.pbf`).then((response) => {
        resolve(response.arrayBuffer());
      });
    });
  },
});
const xyz = new XYZ({
  url: 'https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg',
  name: 'AtlasDeCresques',
  projection: 'EPSG:3857',
  visibility: true,
}); // CORS ERROR


// Guardar todos los __proto__ del Objeto "mapa", usando ... para traerse elementos de estos objetos a un objeto común con el que se trabajará
const mergeObjects = (first, second) => {return {...first,...Object.getOwnPropertyDescriptors(second)}}
let objectWithAllFunctions = {};
for(let acumuladorObjetos = mapa ;acumuladorObjetos.__proto__ !== null;acumuladorObjetos = acumuladorObjetos.__proto__){
  objectWithAllFunctions = mergeObjects(objectWithAllFunctions, acumuladorObjetos);
}


// Creado Array para manejar más adelante el objectWithAllFunctions y ordenado de este sin funciones de "constructor" y "destroy"
const listAllFunctions = Object.keys(objectWithAllFunctions).sort();
listAllFunctions.remove("constructor"); listAllFunctions.remove("destroy");
const listOnlyShown = [];


if (listAllFunctions && listAllFunctions.length > 0) { // Confirmar que existen funciones que se quieren probar
  const eventsFuncArray = [];
  const eventsKeyArray = [];

  // Función de escritura al Console del Browser
  const showResult = (button, format, result) => {
    let complete = button.innerText + (format? '_' + format : '');
    if (result instanceof Promise) {
      const resultArray = [];
      result.then((success) => {console.log("PROMISE_SUCCESS:" + complete, success);resultArray.push(success);button.className = 'okButton';}, (error)=> {console.log("PROMISE_ERROR_THEN:" + complete, error);resultArray.push(error);button.className = 'errorButton';}).catch((error)=> {console.log("PROMISE_ERROR_CATCH:" + complete, error);resultArray.push(error);button.className = 'errorButton';})
      return resultArray;
    } else {
      button.className = 'okButton';
      console.log(complete, result);
      return result;
    }
  };

  const checkFunctionArguments = function (func){
    let hasArguments = false;
    let functString = func.toString().split('\n').splice(0,2);
    if (functString[0]) {
      hasArguments = functString[0].substring(functString[0].indexOf('(')+1,functString[0].indexOf(')')).trim().length != 0 || functString[0].includes('arguments.length');
    }
    if (!hasArguments && functString[1]) {
      hasArguments = functString[1].includes('arguments.length') || functString[1].includes('[native code]');
    }
    return hasArguments;
  }

  for (let i = 0; i < listAllFunctions.length; i++) { // Comenzar a generar botones del HTML

    const auxName = listAllFunctions[i]; // Nombre de Función

    if (objectWithAllFunctions[auxName].value && objectWithAllFunctions[auxName].value instanceof Function) { // Comprobar que es una función y no un objeto

      // El botón de esta función
      const auxButton = document.createElement('button');
      auxButton.innerText = auxName;
      let appendTo;
      let parameterTest;
      listOnlyShown.push(auxName);

      if (objectWithAllFunctions[auxName].value && !checkFunctionArguments(objectWithAllFunctions[auxName].value)) {
        // ---------------------------------FUNCIONES SIN PARÁMETROS---------------------------------
        parameterTest = () => { // singeParameterTest
          showResult(auxButton, undefined , mapa[auxName]());
        };
        appendTo = noParam;
      } else {
        if (auxName.startsWith('get')) {
          // ---------------------------------FUNCIONES GET---------------------------------
          parameterTest = () => { // getParameterTest
            if (auxName == 'getAttributions') {
              showResult(auxButton, "GET_MAP_ATTRIBUTIONS", mapa[auxName]());
              if (mapa.getControls('attributions').length > 0) {
                showResult(auxButton, "GET_CONTROL_ATTRIBUTIONS", mapa[auxName](true));
              } else {
                auxButton.className = "warningButton";
                console.error('NO_CONTROL_PRESENT_FOR_SECOND_TEST');
              }
            } else if (auxName == 'getControls') {
              showResult(auxButton, "GET_ALL_CONTORLS", mapa[auxName]());
              showResult(auxButton, "GET_SCALELINE", mapa[auxName]('scaleline'));
            } else if (auxName == 'getGeoJSON') {
              showResult(auxButton, "GET_GeoJSON_ALL", mapa[auxName]());
              showResult(auxButton, "GET_GeoJSON_filter", mapa[auxName]({name:'Provincias'})); // {type:, url:, name:, legend:}
            } else if (auxName == 'getKML') {
              showResult(auxButton, "GET_KML", mapa[auxName]());
              showResult(auxButton, "GET_KML_LABEL", mapa[auxName]({label:true})) // parameter.split(/\*/)[params.length - 2].trim() For LABEL
            } else if (auxName == 'getLayers') {
              showResult(auxButton, "GET_Layers", mapa[auxName]());
              showResult(auxButton, "GET_Layers_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getMBTiles') {
              showResult(auxButton, "GET_MBTiles", mapa[auxName]());
              showResult(auxButton, "GET_MBTiles_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getMBTilesVector') {
              showResult(auxButton, "GET_MBTilesVector", mapa[auxName]());
              showResult(auxButton, "GET_MBTilesVector_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getMVT') {
              showResult(auxButton, "GET_MVT", mapa[auxName]());
              showResult(auxButton, "GET_MVT_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getOGCAPIFeatures') {
              showResult(auxButton, "GET_OGCAPIFeatures", mapa[auxName]());
              showResult(auxButton, "GET_OGCAPIFeatures", mapa[auxName]({name:'airports'}));
            } else if (auxName == 'getPanels') {
              showResult(auxButton, "GET_Panels", mapa[auxName]());
              showResult(auxButton, "GET_Panels_FILTER", mapa[auxName]('toolsExtra'));
            } else if (auxName == 'getPlugins') {
              showResult(auxButton, "GET_Plugins", mapa[auxName]());
              auxButton.className = "warningButton";
              console.error("IMPOSIBLE_TO_DO_TEST_IN_DEVELOPMENT"); // POR PROBAR SIN TERMINAR LA PRUEBA, requiere "M." que esta en Pruebas de Producción
            } else if (auxName == 'getRootLayers') {
              showResult(auxButton, "GET_RootLayers", mapa[auxName]());
              showResult(auxButton, "GET_RootLayers_FILTER", mapa[auxName]({name: "IGNBaseTodo"}));
            } else if (auxName == 'getTMS') {
              showResult(auxButton, "GET_TMS", mapa[auxName]());
              showResult(auxButton, "GET_TMS_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getWFS') {
              showResult(auxButton, "GET_WFS", mapa[auxName]());
              showResult(auxButton, "GET_WFS_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getWMS') {
              showResult(auxButton, "GET_WMS", mapa[auxName]());
              showResult(auxButton, "GET_WMS_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getWMTS') {
              showResult(auxButton, "GET_WMTS", mapa[auxName]());
              showResult(auxButton, "GET_WMTS_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getXYZs') {
              showResult(auxButton, "GET_XYZs", mapa[auxName]());
              showResult(auxButton, "GET_XYZs_filter", mapa[auxName]({name:'Test_layers'}));
            } else if (auxName == 'getZoom') {
              showResult(auxButton, "GET_ZOOM", mapa[auxName]());
              showResult(auxButton, "GET_ZOOM_NO_CONSTRAINS", mapa[auxName](true));
            } else {
              console.error('NOT_PREPARED_FUNCTION_TEST_FOR_GET:', auxName);
            }
          };
          appendTo = getWithParam;
        } else if (auxName.startsWith('add')) {
          // ---------------------------------FUNCIONES ADD---------------------------------
          parameterTest = () => { // addParameterTest
            if (auxName == 'addAttribution') {
              showResult(auxButton, "ADD_ATTRIBUTION_FALSE", mapa[auxName]({text:"EJEMPLO1"}, false));
              showResult(auxButton, "ADD_ATTRIBUTION_TRUE", mapa[auxName]({text:"EJEMPLO2"}, true));
            } else if (auxName == 'addControls') {
              showResult(auxButton, "ADD_NULL_CONTROL", mapa[auxName]());
              showResult(auxButton, "ADD_SCALELINE", mapa[auxName]('scaleline'));
            } else if (auxName == 'addKML') {
              showResult(auxButton, "ADD_NULL_KML", mapa[auxName]());
              showResult(auxButton, "ADD_KML", mapa[auxName]('KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*true')); // new KML()
            } else if (auxName == 'addLabel') {
              showResult(auxButton, "ADD_label_OBJECT", mapa[auxName]({panMapIfOutOfView: false, text:"Texto_de_Prueba_1", coord:[0, 0]})); // OK, only one at a time
              // showResult(auxButton, "ADD_label_STRING", mapa[auxName]("Texto_de_Prueba_2", [-143777, 4853122])); // OK, only one at a time
            } else if (auxName == 'addLayers') {
              showResult(auxButton, "ADD_Layers", mapa[auxName](['WMS*Unidad administrativa*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeUnit*true*true*true*1.3.0*true*true*true','MVT*https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf*vectortile']));
            } else if (auxName == 'addMBTiles') {
              showResult(auxButton, "ADD_MBTiles", mapa[auxName](mbtile));
            } else if (auxName == 'addMBTilesVector') {
              showResult(auxButton, "ADD_MBTilesVector", mapa[auxName](mbtileVector));
            } else if (auxName == 'addMVT') {
              showResult(auxButton, "ADD_MVT", mapa[auxName]('MVT*https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf*vectortile'));
            } else if (auxName == 'addOGCAPIFeatures') {
              // 404 ERROR showResult(auxButton, "ADD_OGCAPIFeatures", mapa[auxName](new OGCAPIFeatures({url: 'https://api-features.idee.es/collections/',name: 'hidrografia/Falls',legend: 'Capa OGCAPIFeatures',limit: 20 })));
              showResult(auxButton, "ADD_OGCAPIFeatures", mapa[auxName](new OGCAPIFeatures({url: 'https://demo.ldproxy.net/zoomstack/collections/',name: 'airports',legend: 'Capa OGCAPIFeatures',limit: 20 })));
            } else if (auxName == 'addPanels') {
              showResult(auxButton, "ADD_panels", mapa[auxName](new Panel('toolsExtra', {"collapsible": true,"className": 'm-tools',"collapsedButtonClass": 'g-cartografia-herramienta',"position": ".m-top.m-left"}))); // M.ui.position.TL
            } else if (auxName == 'addPlugin') {
              // POR PROBAR Hay que hacer la prueba de Plugin en api-ign-js/test/production
              // import GeometryDraw from 'M/plugin/GeometryDraw'; // Hay que crear el test de plugin en Poduction, ya que solo se tiene acceso a este desde ahí.
              // showResult(auxButton, "ADD_PLUGIN_DRAW", mapa[auxName](new M.plugin.GeometryDraw()));
              // showResult(auxButton, "ADD_PLUGIN_DRAW", mapa[auxName](new GeometryDraw()));
              auxButton.className = "warningButton";
              console.error("IMPOSIBLE_TO_DO_TEST_IN_DEVELOPMENT");
            } else if (auxName == 'addPopup') {
              const popup = new Popup();
              popup.addTab({'icon': 'g-cartografia-pin','title': 'Título','content': 'Información'});
              showResult(auxButton, "ADD_POPUP", mapa[auxName](popup, [240829,4143088]));// popup.on(M.evt.DESTROY, () => {M.dialog.info('Popup eliminado');  });popup.destroy();
            } else if (auxName == 'addQuickLayers') {
              showResult(auxButton, "ADD_QuickLayers", mapa[auxName]('QUICK*BASE_PNOA_MA_TMS')); // 403 'QUICK*BASE_IGNBaseOrto_TMS'
            } else if (auxName == 'addTMS') {
              showResult(auxButton, "ADD_TMS", mapa[auxName]("TMS*TMSBaseIGN*https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false"));
            } else if (auxName == 'addUnknowLayers_') {
              showResult(auxButton, "ADD_UnknowLayers_GeoJson", mapa[auxName](new GeoJSON({name: "Provincias",url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json", legend:"TEST_LEGEND"}, {maxZoom: 10,style: new Polygon({fill: {color: 'red'}})}, {opacity: 0.5})));
            } else if (auxName == 'addWFS') {
              showResult(auxButton, "ADD_WFS", mapa[auxName]('WFST*Campamentos*http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?*sepim:campamentos*MPOINT'));
            } else if (auxName == 'addWMS') {
              showResult(auxButton, "ADD_WMS", mapa[auxName]('WMS*Unidad administrativa*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeUnit*true*true*true*1.3.0*true*true*true'));
            } else if (auxName == 'addWMTS') {
              showResult(auxButton, "ADD_WMTS", mapa[auxName]('WMTS*http://wmts-mapa-lidar.idee.es/lidar*EL.GridCoverageDSM*GoogleMapsCompatible*Modelo Digital de Superficies LiDAR*true*image/png*true*true*true'));
            } else if (auxName == 'addXYZ') {
              showResult(auxButton, "ADD_XYZ", mapa[auxName](xyz)); // CORS ERROR WITH "XYZ*AtlasDeCresques*https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg*true*true"
            } else {
              console.error('NOT_PREPARED_FUNCTION_TEST_FOR_ADD:',auxName);
            }
          };
          appendTo = addParam;
        } else if (auxName.startsWith('remove')) {
          // ---------------------------------FUNCIONES REMOVE---------------------------------
          parameterTest = () => { // removeParameterTest
            if (auxName == 'removeAttribution') {
              if (mapa.getControls('attributions').length > 0) {
                const auxAttr = mapa.getAttributions(true)[0] || mapa.getAttributions()[0];
                if (auxAttr) {
                  showResult(auxButton, "REMOVE_ATTRIBUTION", mapa[auxName](auxAttr.id)); // Ejemplo remove con ID "bff4a6ba-e8c6-4741-94b3-04eb543aed75"
                } else {
                  console.error('NO_ATRIBUTIONS_ADDED_TO_SAID_CONTROL');
                }
              } else {
                auxButton.className = "warningButton";
                console.error('NO_ATRIBUTIONS_PRESENT');
              }
            } else if (auxName == 'removeControls') {
              showResult(auxButton, "REMOVE_SCALELINE", mapa[auxName]('scaleline'));
            } else if (auxName == 'removeFeatures') { // Removes from DrawLayer of Map
              showResult(auxButton, "REMOVE_Features", mapa[auxName](mapa.drawLayer_.getFeatures()));
            } else if (auxName == 'removeKML') {
              showResult(auxButton, "REMOVE_KML", mapa[auxName](mapa.getKML()));
            } else if (auxName == 'removeLayers') {
              if (mapa.getGeoJSON().length > 0) {
                showResult(auxButton, "REMOVE_Layers_GeoJSON", mapa[auxName](mapa.getGeoJSON()));
              } else {
                showResult(auxButton, "REMOVE_Layers", mapa[auxName](mapa.getLayers()));
              }
            } else if (auxName == 'removeMBTiles') {
              showResult(auxButton, "REMOVE_MBTiles", mapa[auxName](mapa.getMBTiles()));
            } else if (auxName == 'removeMBTilesVector') {
              showResult(auxButton, "REMOVE_MBTilesVector", mapa[auxName](mapa.getMBTilesVector()));
            } else if (auxName == 'removeMVT') {
              showResult(auxButton, "REMOVE_MVT", mapa[auxName](mapa.getMVT()));
            } else if (auxName == 'removeOGCAPIFeatures') {
              showResult(auxButton, "REMOVE_OGCAPIFeatures", mapa[auxName](mapa.getOGCAPIFeatures()));
            } else if (auxName == 'removePanel') {
              if (mapa.getPanels()[0]) {
                showResult(auxButton, "REMOVE_PANELS", mapa[auxName](mapa.getPanels()[0]));
              } else {
                auxButton.className = "warningButton";
                console.error("NO_PANELS_PRESENT_TO_REMOVE");
              }
            } else if (auxName == 'removePlugins') {
              if (mapa.getPlugins()[0]) {
                showResult(auxButton, "REMOVE_PLUGINS", mapa[auxName](mapa.getPlugins()));
                auxButton.className = "warningButton";
                console.error("IMPOSIBLE_TO_DO_TEST_IN_DEVELOPMENT");
              } else {
                auxButton.className = "warningButton";
                console.error("NO_PLUGINS_PRESENT_TO_REMOVE");
              }
            } else if (auxName == 'removeTMS') {
              showResult(auxButton, "REMOVE_TMS", mapa[auxName](mapa.getTMS()));
            } else if (auxName == 'removeWFS') {
              showResult(auxButton, "REMOVE_WFS", mapa[auxName](mapa.getWFS()));
            } else if (auxName == 'removeWMS') {
              showResult(auxButton, "REMOVE_WMS", mapa[auxName](mapa.getWMS()));
            } else if (auxName == 'removeWMTS') {
              showResult(auxButton, "REMOVE_WMTS", mapa[auxName](mapa.getWMTS()));
            } else if (auxName == 'removeXYZ') {
              showResult(auxButton, "REMOVE_XYZ", mapa[auxName](mapa.getXYZs()));
            } else {
              console.error('NOT_PREPARED_FUNCTION_TEST_FOR_REMOVE:',auxName);
            }
          };
          appendTo = removeParam;
        } else if (auxName.startsWith('set')) {
          // ---------------------------------FUNCIONES SET---------------------------------
          parameterTest = () => { // setParameterTest
            if (auxName == 'setBbox') {
              showResult(auxButton, "SET_BBOX", mapa[auxName]({"x": {"min": -1054179,"max": 1191234},"y": {"min": 4246770,"max": 6514198}}));
            } else if (auxName == 'setCenter') {
              showResult(auxButton, "SET_CENTER", mapa[auxName]({"x": -690278.9143510933,"y": 4477348.883930369}));
            } else if (auxName == 'setImpl') {
              showResult(auxButton, "SET_IMPL", mapa[auxName](mapa.getImpl()));
            } else if (auxName == 'setMaxExtent') {
              showResult(auxButton, "SET_MAX_EXTENT", mapa[auxName]([-160000, 4800000,-120000, 4860000])); // Requiere layers: ['OSM'], mínimo para pruebas de "maxExtent"
            } else if (auxName == 'setMaxZoom') {
              showResult(auxButton, "SET_MAX_ZOOM", mapa[auxName]((Math.round(Math.random() * 10) % 3) + 7));
            } else if (auxName == 'setMinZoom') {
              showResult(auxButton, "SET_MIN_ZOOM", mapa[auxName]((Math.round(Math.random() * 10) % 3) + 3));
            } else if (auxName == 'setProjection') {
              showResult(auxButton, "SET_PROJECTION", mapa[auxName]('EPSG:4258*d'));
            } else if (auxName == 'setResolutions') {
              showResult(auxButton, "SET_RESOLUTIONS", mapa[auxName]("40000,20000,10000,5000,2500,1250,625,312.5,156.25,78.125,39.0625,19.53125,9.765625,4.8828125,2.44140625"));
            } else if (auxName == 'setTicket') {
              // showResult(auxButton, "SET_Ticket", mapa[auxName](...)); // POR PROBAR KEY necesario para prueba
              auxButton.className = "warningButton";
              console.error("Prueba no diseñada para esta función");
            } else if (auxName == 'setZoom') {
              showResult(auxButton, "SET_ZOOM", mapa[auxName](Math.round(Math.random()*10)));
            } else if (auxName == 'setZoomConstrains') {
              showResult(auxButton, "SET_ZOOM_CONSTRAINS", mapa[auxName](!mapa.getZoomConstrains()));
            } else {
              console.error('NOT_PREPARED_FUNCTION_TEST_FOR_SET:',auxName);
            }
          };
          appendTo = setParam;
        } else {
          // ---------------------------------OTRAS FUNCIONES---------------------------------
          parameterTest = () => { // otherParameterTest
            if (auxName == 'collectorCapabilities_') {
              // showResult(auxButton, "collectorCapabilities_DOES_NOTHING", mapa[auxName](mapa.drawLayer_)); // Se para a medias al ser "__draw__"
              const auxTestWMS = mapa.getLayers().find(l=>l._type=='WMS');
              if (auxTestWMS) {
                // mapa.collectionCapabilities = []; // Limpiar para ver que lo vuelva a añadir de vuelta.
                showResult(auxButton, "collectorCapabilities_TESTED_WITH_WMS", mapa[auxName](auxTestWMS));
              } else {
                auxButton.className = "warningButton";
                console.error('NO_WMS_PREPARED_TO_TEST_THIS_FUCNTION:',auxName);
              }
            } else if (auxName == 'createAttribution') {
              showResult(auxButton, "createAttribution_NULL", mapa[auxName]());
              // showResult(auxButton, "createAttribution_EXAMPLE", mapa[auxName]("EJEMPLO"));
            } else if (auxName == 'drawFeatures') {
              showResult(auxButton, "drawFeatures", mapa[auxName](new Feature("feature1", {"type": "Feature","properties": {},"geometry": {"type": "Point","coordinates": [-500000,5220000]}})));
            } else if (auxName == 'drawPoints') {
              showResult(auxButton, "drawPoints", mapa[auxName]({x: -310000, y: 3940000, click: ()=>{console.log('CLICK_drawPoints_EVENT')}}));
            } else if (auxName == 'fire') {
              showResult(auxButton, "FIRE_CLICK_EVENT", mapa[auxName]('click', {pixel:[0, 0]}));
            } else if (auxName == 'on') {
              const onDate = new Date();
              const funcEvent = () => {console.log("ON_FUNCTION:",onDate.getTime())}
              eventsFuncArray.push(funcEvent);
              showResult(auxButton, "ON_CLICK_"+onDate.getTime(), mapa[auxName]('click',funcEvent));
            } else if (auxName == 'once') {
              const onDate = new Date();
              eventsKeyArray.push(showResult(auxButton, "ONCE_CLICK_"+onDate.getTime(), mapa[auxName]('click', () => {console.log("ONCE_FUNCTION:",onDate.getTime())})));
            } else if (auxName == 'un') {
              if (eventsFuncArray.length > 0) {
                eventsFuncArray.forEach(f => {showResult(auxButton, "UN", mapa[auxName]('click', f));});
                eventsFuncArray.splice(0);
              } else {
                auxButton.className = "warningButton";
                console.error('NO_ON_EVENTS_PRESENT_TO_CLEAR:',auxName);
              }
            } else if (auxName == 'unByKey') {
              if (eventsKeyArray.length > 0) {
                eventsKeyArray.forEach(k => {showResult(auxButton, "UNBYKEY", mapa[auxName]('click', k));});
                eventsKeyArray.splice(0);
              } else {
                auxButton.className = "warningButton";
                console.error('NO_ONCE_EVENTS_PRESENT_TO_CLEAR:',auxName);
              }
            } else if (auxName == 'zoomToMaxExtent') {
              showResult(auxButton, "ZOOM_TO_MAX_EXTENT_NOT_KEEP_USER_ZOOM", mapa[auxName](false));
              // showResult(auxButton, "ZOOM_TO_MAX_EXTENT_KEEP_USER_ZOOM", mapa[auxName](true));
            } else {
              console.error('NOT_PREPARED_FUNCTION_TEST_FOR_OTHER:',auxName);
            }
          };
          appendTo = otherParam;
        }
      }

      // Asignado del botón con el evento apropiado
      auxButton.addEventListener('click', () => {
        auxButton.className = '';
        try {
          parameterTest();
        } catch (error) {
          auxButton.className = 'errorButton';
          throw error;
        }
      });
      appendTo.append(auxButton)
    }
  }
}

window.listAllFunctions = listAllFunctions; // Para tener acceso a toda la lista de funciones.
window.listOnlyShown = listOnlyShown; // Solo las funciones mostradas en las pruebas.

// POR PROBAR**** No se han probado los "Test_layers" de implementado y borrado de layers con filtros. "setTicket" y todo relacionado a plugins.
// NO OK**** Los elementos que lanzan showResult múltiples veces solo muestran el resultado final del último que se resolvió en su color de botón.
// NO OK**** Se podría añadir una espera de respuestas validas de estas funciones, con posible configurado default que obtenga los resultados esperados de forma más rápida y con menos clicks manuales.
// He detectado que no se puede saber 100% si una función tiene o no parámetros, ya que los elementos de opciones (test = true), rompe este contar devolviendo 0, por lo que "createAttribution" si tiene parámetros, pero en estos ejemplos se ha puesto como sin parámetros.
// POR PROBAR**** Podría ser necesario, añadir los layers de cada capa como único layer al mapa con parámetros y usar las funciones otra vez del mapa para probar que funcionan con cada layer. Esto podría ser pruebas de layers y no del mapa.

// RESULTADO DE LAS PRUEBAS DE FUNCIONES, Hay que añadir esto a la bitácora para informar de su estado:

// [APUNTADO A REDMINE] mapa.removeAttribution(ID) No parece ser capaz de borrar todos los attributions, porque solo borra el primero enviado, de una de los dos arrays que se usan de este según el estado del control con similar nombre.
// [APUNTADO A REDMINE] mapa.createAttribution() terminar añadiendo atributo del layer default, pero no aparece este en el "getAttribution", mientras si se añade con "controls" si que esta.

// [APUNTADO A REDMINE] mapa.getEnvolvedExtent() // Si hay layers que no sean "__draw__", no devuelve nada.
// Porque crea un PROMISE que es enviado al "getMaxExtent" como "getMaxExtent(resolve)", // getEnvolvedExtent() { ... return new Promise((resolve) => { ... if (!isNullOrEmpty(visibleBaseLayer)) { visibleBaseLayer.getMaxExtent(resolve);
// Pero "getMaxExtent" no usa ningún parámetro que pueda devolver valores a un callback de un PROMISE.

// [APUNTADO A REDMINE] Ambos "mapa.setResolutions"(coordinate.js:244) y "mapa.setProjection"(POPUP) Sufren error "Uncaught TypeError: coordinate2 is undefined"

// IGNORAR mapa.zoomToMaxExtent(true) de "ZOOM_TO_MAX_EXTENT_KEEP_USER_ZOOM" no parece hacer nada, es posible que la configuración default de mapa causa que no se cambie nada

// [APUNTADO A REDMINE] mapa.getRootLayers Sufre un error al enviar filtrado {type:"TMS"}, porque espera que sea un Número en vez de String.

// [APUNTADO A REDMINE]src/impl/ol/js/loader/WFS.js tiene "loadInternal_(url, projection) {..." que en un momento usa "response.text.indexOf", pero al ser "response.text" null falla. En concreto es por causa del error 404.

// IGNORAR o NO OK getKML(*STRING*) Esta función puede recibir un string de estilo 'KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*true'
// Pero más adelante hay "parameter.split(/\*/)[params.length - 2].trim()" que configura el label, pero se ordena desde el final en vez de principio, por lo que el booleano final determina con su presencia cual valor se usa la URL o Título
// Creo que depende de que se introduzca bien esta cadena, y que el penúltimo elemento entre "*" sea "false" o "true"(en este caso cualquier cosa que no es false funciona como true), si hay algún raro error de escritura de este, pues entonces siempre se escogerá elementos no correctos

// IGNORAR mapa.getResolutions no devuelve ningún valor, lo he probado en un proyecto que usaba el antiguo configurado y devolvía un array, pero este no lo hace ahora. "https://componentes.cnig.es/api-core" y "https://mapea-lite.desarrollo.guadaltel.es/api-core" muestran undefined, "https://mapea4-sigc.juntadeandalucia.es/mapea" muestra array, pero es posible que anteriormente se configuro el setResolution y por eso se muestra.

// [APUNTADO A REDMINE] OL_ERROR se ha comprobado que añadir atribución con controls con "controls: ['attributions*EJEMPLO_DE_TEXTO_ATTRIBUTIONS']" o "controls: ['attributions*<p>EJEMPLO_DE_TEXTO_ATTRIBUTIONS</p>']"
// Introduce valor directamente del texto introducido al "_attributionsMap" sin el diseño de objeto atributo con ID

// [APUNTADO A REDMINE] OL_ERROR El parámetro "viewExtent" del primer parámetro de mapa o el segundo también, no funciona bien, no se centra en la zona indicada. parece caer con el zoom indicado en la coordenada [0,0]

// BUG IGNORAR minZoom y maxZoom no se comportan igual en ciertos casos comparado con la rama "develop", pero creo que es mejor en esta nueva versión de Openlayer o igual de confuso que en la otra pero no creo que sea efectivamente mal.

// IGNORAR Se ha detectado unas etiquetas de html en KML que se ha cargado, 'KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*true' los títulos de puntos terminan con <br/>

// [APUNTADO A REDMINE] OL_ERROR IGNORAR Se observa que el mapa, no tiene previsto el funcionamiento de todas sus funciones con el layer COG. Posiblemente en las pruebas de Layers, en concreto con los COGs, se incluyeran todos estos errores. Tras update de OL ha dejado de ocurrir algunos de estos por lo que asumo que se tendría que probar con test de Layer bien.

// [APUNTADO A REDMINE] OL_ERROR MUY GRAVE, parece que mapa.setResolutions y mapa.setProjection se comportan de diferente manera en esta versión de API_CNIG. Me ha causado un error muy grave que requería reiniciar mi portátil. Ocurrió tras usar el aplicado de Resoluciones seguido de setProjection, voy a repasar, apuntar y reproducir este error para estar muy seguro de como se reproduce antes de seguir adelante.

// [APUNTADO A REDMINE] BUG situacional, al usar "addAttribution" que muestra error "TypeError: layer is undefined" en "createVectorLayer Attributions.js:185", debido a que se añade Control de atribuciones, pero se han eliminado los layers anteriormente.