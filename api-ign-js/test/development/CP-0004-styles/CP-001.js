import { map as Mmap } from 'M/mapea';
import { vector_001 } from '../layers/vector/vector';
import Point from 'M/style/Point';
import Line from 'M/style/Line';
import Polygon from 'M/style/Polygon';
import { TOP, BOTTOM, MIDDLE, ALPHABETIC, HANGING, IDEOGRAPHIC } from 'M/style/Baseline';
import { RIGHT, LEFT, CENTER } from 'M/style/Align';
import { BAN, BLAZON, BUBBLE, CIRCLE, LOZENGE, MARKER, NONE, SHIELD, SIGN, SQUARE, TRIANGLE } from 'M/style/Form';

const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  bbox: [-662541.2130577073, 4348884.724285094, -589161.665903938, 4383472.479584137], // punto
  // bbox: [-310002.719495043, 4005086.440611637, -212316.19734658775, 4047432.554281625], // linea
  // bbox: [167553.43719930138, 3994732.042590404, 350849.43102715403, 4100215.141623947], // poligono
});

// label prioriza sobre icon

// const estilo = new Point({
//     // Radio del punto. Numérico
//     radius: 50,
//     // Relleno
//     fill: {
//       color: 'blue',
//       //opacity: 1,
//     },
//     // Borde exterior
//     stroke: {
//       color: 'red',
//       // Grosor en pixeles
//       width: 6,
//       // Patrón de distancias
//       linedash: [5, 5, 20],
//       // Offset de fase
//       //linedashoffset: 30,
//       // Estilo de final de línea. round (borde redondeado)|square(borde cuadrado ligeramente alargado)|butt(borde cuadrado afilado)
//       linecap: 'butt', // solo aplica cuando hay linedash
//       // Estilo de conexión de segmentos. miter(inglete)|round(redondo)|bevel(bisel)
//       //linejoin: 'miter', //no se aprecia cambio por no haber conexion en un punto
//       // Tamaño máximo segmento de conexión
//       // miterlimit: 15, //no se aprecia cambio
//       // Opacidad
//       // opacity: 0.3,
//     },
//     // Etiquetado
//     /*label: {
//       // Texto a escribir
//       text: 'Etiqueta',
//       // Fuente y características
//       font: 'bold 30px Comic Sans MS',
//       // Color de la fuente. Hexadecimal, nominal
//       color: '#FF0000' || 'red',
//       // Debe o no rotar con la pantalla
//       rotate: false,
//       // Factor de escala de la fuente
//       //scale: 0.5,
//       // Desplazamiento en pixeles
//       //offset: [10, 20],
//       // Halo de la fuente
//       stroke: {
//         // Color de relleno del halo. Hexadecimal, nominal
//         color: 'black' || '#FFF000',
//         // Grosor en píxeles del halo
//         width: 5,
//         // Patrón de distancias de la línea
//         linedash: [5, 5, 20],
//         // Offset de fase
//         //linedashoffset: 5,
//         // Estilo de final de línea. round (borde redondeado)|square(borde cuadrado ligeramente alargado)|butt(borde cuadrado afilado)
//         //linecap: 'butt',
//         // Estilo de conexión de segmentos. miter(inglete)|round(redondo)|bevel(bisel)
//         //linejoin: 'round',
//         // Tamaño máximo segmento de conexión
//         //miterlimit: 15,
//       },
//       // Rotación de la etiqueta
//       //rotation: 0.5,
//       // Alineación. RIGHT|LEFT|CENTER
//       align: CENTER,
//       // Altura de la etiqueta. TOP|BOTTOM|MIDDLE|
//       // ALPHABETIC|HANGING|IDEOGRAPHIC
//       baseline: BOTTOM, // ALPHABETIC ~= BOTTOM ~= IDEOGRAPHIC | HANGING == TOP
//     },*/
//     // Icono tipo imagen
//     /*icon: {
//       // Url de la imagen
//       src: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/mozilla.svg',
//       // Rotación de la imagen
//       //rotation: 0.5,
//       // Factor de escala
//       //scale: 0.2,
//       // Transparencia del icono. 0(transparente)|1(opaco)
//       //opacity: 0.8,
//       // Desplazamiento respecto al punto
//       //anchor: [2, 2],
//       // Ubicación inicial de la coordenada respecto al icono
//       //anchororigin: 'bottom-right',
//       // Unidades de desplazamiento de anchor. fraction | pixel
//       //anchorxunits: 'pixel',
//       //anchoryunits: 'pixel',
//       // Rotación con dispositivo
//       //rotate: true,
//       // Offset permite recortar la imagen
//       // Punto de referencia para el corte. bottom-left/right|top-left/right
//       //offsetorigin: 'top-left',
//       // Píxeles a mover el punto de referencia en cada eje
//       //offset: [20, 0],
//       // Píxeles a recortar desde el offset en cada eje
//       //size: [300, 300],
//       // null||'Anonymous'(permite la descarga no autenticada de la imagen de origen cruzado)
//       crossorigin: 'Anonymus',
//       // Renderizado. true(nítido)|false(desenfoque)
//       //snaptopixel: false, //no se aprecia diferencia
//       // Relleno del SVG
//       fill: {
//         // Color de relleno. Hexadecimal, nominal
//         color: 'grey',
//         // Transparencia. 0(transparente)|1(opaco)
//         //opacity: 0.5,
//       },
//       // Halo del SVG
//       stroke: {
//         // Hexadecimal, nominal
//         color: 'white',
//         // Tamaño
//         width: 2,
//       },
//     },*/
//     // Icono tipo FontSymbol
//     /*icon: {
//       // Forma del fontsymbol.
//       // BAN(cículo)|BLAZON(diálogo cuadrado)|BUBBLE(diálogo redondo)|CIRCLE(círculo)|LOZENGE(diamante)|MARKER(diálogo redondeado)
//       // NONE(ninguno)|SHIELD(escudo)|SIGN(triángulo)|SQUARE(cuadrado)|TRIANGLE(triángulo invertido)
//       form: TRIANGLE,
//       // Clase fuente
//       //class: 'g-cartografia-alerta',
//       // Tamaño de la fuente
//       //fontsize: 0.5,
//       // Tamaño
//       radius: 20,
//       // Giro del icono en radianes
//       rotation: 3.14,
//       // Activar rotación con dispositivo
//       //rotate: false,
//       // Desplazamiento en píxeles en los ejes x,y
//       //offset: [0, 0],
//       // Hexadecimal, nominal
//       color: '006CFF' || 'blue',
//       // Color de relleno. Hexadecimal, nominal
//       fill: '#8A0829' || 'red',
//       // Color del borde. Hexadecimal, nominal
//       //gradientcolor: '#088A85' || 'blue',
//       // Degradado entre color de borde e interior
//       //gradient: true,
//       // Transparencia. 0(transparente)|1(opaco)
//       //opacity: 0.5,
//     },*/
// });

// const estilo = new Line({
//   // Relleno de la línea
//   fill: {
//     // Color de relleno. Hexadecimal, nominal
//     color: 'green',
//     // Grosor de la linea 
//     //width: 30,
//     // Transparencia. 0(transparente)|1(opaca)
//     //opacity: 0.5,
//     // Patrones para la línea
//     /*pattern: {
//       // Nombre del patrón. hatch(sombreado)|cross(cruz)|dot(punto)|circle(círculo)|square(cuadrado)|tile(mosaico)		 
//       // woven(tejido)|crosses(cruces)|caps(tapas)|nylon(nylon)|hexagon(hexágono)|cemetry(cementerio)|sand(arena)|conglomerate(conglomerado)|gravel(grava)
//       // brick(ladrillo)|dolomite(donomita)|coal(carbón)|breccia(brecha)|clay(arcilla)|flooded(inundado)|chaos(caos)|grass(hierba)|swamp(pantano)|wave(ola)
//       // vine(vid)|forest(bosque)|scrub(matorral)|tree(árbol)|pine(pino)|pines(pinos)|rock(rock)|rocks(rocks)|Image(Imagen)
//       name: 'brick',
//       // Tamaño del patrón
//       size: 5,
//       // Escalado del patrón
//       //scale: 3,
//       // SOLO ICONO:
//       // Si name tiene valor 'ICON'
//       // Color del patrón.Hexadecimal, nominal
//       color: '#FF0000' || 'red',
//       // Ángulo de rotación
//       //rotation: 90, // ! no hace nada con patron que no es imagen
//       // Desplazamiento del patrón
//       //offset: 5,
//       // Espacio
//       //spacing: 2,
//       // Clase fuente
//       //class: 'g-cartografia-save',
//       // Si name tiene valor Image
//       // Url de la imagen para el patrón.
//       //src: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/mozilla.svg', // ! problema de cors
//     }*/
//   },
//   // borde exterior de la línea
//   stroke: {
//     // Color del borde exterior. Hexadecimal, nominal
//     color: 'red',
//     // Grosor del borde, superior al de fill para su correcta visualización ya que si no quedaría por debajo del relleno
//     width: 20,
//     // Patrón de distancias
//     linedash: [10, 15],
//     // Offset de fase
//     //linedashoffset: 45,
//     // Estilo de final de línea. round (borde redondeado)|square(borde cuadrado ligeramente alargado)|butt(borde cuadrado afilado)
//     linecap: 'butt',
//     // Estilo de conexión de segmentos. miter(inglete)|round(redondo)|bisel(bisel)
//     linejoin: 'bevel', //no compatible con linedash
//     // Tamaño máximo segmento de conexión
//     //miterlimit: 5, //no se aprecia diferencia
//     // Opacidad
//     opacity: 1,
//   },
//   // etiquetado de la línea
//   label: {
//     // Texto o función de etiquetado
//     text: 'Tres Tristes Tigres',
//     // Fuente de etiquetado
//     font: 'bold 50px Comic Sans MS',
//     // Escalado a aplicar
//     //scale: 0.5,
//     // Desplazamiento de etiquetado en píxeles
//     offset: [20, 30],
//     // Color de la etiqueta. Hexadecimal, nominal
//     color: 'black',
//     // Halo de la etiqueta
//     stroke: {
//       // Color del halo. Hexadecimal, nominal
//       color: '#C8FE2E',
//       // Grosor del halo
//       width: 3,
//       // Patrón de distancias
//       //linedash: [5, 5],
//       // Offset de fase
//       //linedashoffset: 10,
//       // Estilo de final de línea. round (borde redondeado)|square(borde cuadrado ligeramente alargado)|butt(borde cuadrado afilado)
//       linecap: 'butt',
//       // Estilo de conexión de segmentos. miter(inglete)|round(redondo)|bevel(bisel)
//       linejoin: 'round',
//       // Tamaño máximo segmento de conexión   
//       //miterlimit: 15, //no se aprecia diferencia
//     },
//     // Rotación con dispositivo
//     //rotate: false,
//     // Ángulo de rotación
//     //rotation: 0.5,
//     // Alineación. RIGHT|LEFT|CENTER
//     //align: LEFT,
//     // Altura de la etiqueta. TOP|BOTTOM|MIDDLE| 					         
//     // ALPHABETIC | HANGING | IDEOGRAPHIC
//     //baseline: TOP,
//     // Efecto listo
//     //smooth: true,
//     // Desbordamiento de texto ellipsis|hidden|visible
//     //textoverflow: 'hidden',
//     // Propiedad que define el ancho minimo de un elemento
//     //minwidth: 60,
//     // Seguimiento de la geometría. IMPORTANTE: puede afectar seriamente al rendimiento si está activado
//     //path: true,
//   }
// });

const estilo = new Polygon({
  //Relleno del polígono
  fill: {
    // Color del borde. Hexadecimal, nominal
    color: '#6A0888',
    // Opacidad del relleno
    opacity: 1,
    // Patrón de relleno
    pattern: {
      // Nombre del patrón. // hatch(sombreado)|cross(cruz)|dot(punto)|circle(círculo)|square(cuadrado)|tile(mosaico)|		 
      // woven(tejido)|crosses(cruces)|caps(tapas)|nylon(nylon)|hexagon(hexágono)|cemetry(cementerio)|sand(arena)|
      // conglomerate(conglomerado)|gravel(grava)|brick(ladrillo)|dolomite(donomita)|coal(carbón)|breccia(brecha)|
      // clay(arcilla)|flooded(inundado)|chaos(caos)|grass(hierba)|swamp(pantano)|wave(ola)| vine(vid)|forest(bosque)|
      // scrub(matorral)|tree(árbol)|pine(pino)|pines(pinos)|rock(rock)|rocks(rocks)|IMAGE(Imagen)
      name: 'brick',
      // Escala del patrón
      scale: 2,
      // SOLO ICONO:
      // Si name tiene valor ICON
      // Tamaño del patrón
      //size: 5,
      // Separación del patrón     
      spacing: 20,
      // Rotación del patrón
      rotation: 20,
      // Desplazamiento en pixeles
      offset: 21,
      // Color del patrón. Hexadecimal, nominal
      color: 'orange',
      // Clase fuente
      //class: 'g-cartografia-save', //no se aprecia diferencia
      // si name tiene valor IMAGE
      //src: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/mozilla.svg', // ! problema de cors
    }
  },
  // borde del polígono
  stroke: {
    // Color del borde. Hexadecimal, nominal
    color: '#00F',
    // Ancho de la línea
    width: 30,
    // Patrón de distancias
    //linedash: [5, 10, 15],
    // Offset de fase
    //linedashoffset: 1,
    // Estilo de final de línea. round (borde redondeado)|square(borde cuadrado ligeramente alargado)|butt(borde cuadrado afilado)
    //linecap: 'butt',
    // Estilo de conexión de segmentos. miter(inglete)|round(redondo)|bevel(bisel)
    linejoin: 'miter', // no compatible con linedash
    // Tamaño máximo segmento de conexión
    miterlimit: 5, //no se aprecia diferencia
    // Opacidad
    opacity: 1,
    // Patrón de línea
    pattern: {
      // Nombre del patrón. hatch|cross|dot|circle
      // square|tile|woven|crosses|caps|nylon|hexagon|cemetry
      // sand|conglomerate|gravel|brick|dolomite|coal|breccia
      // clay|flooded|chaos|grass|swamp|wave|vine|forest|scrub
      // tree|pine|pines|rock|rocks|IMAGE
      name: 'wave',
      // Tamaño del patrón
      size: 1,
      // Escalado del patrón
      scale: 2,
      // SOLO ICONO:
      // Si name tiene valor 'ICON'
      // Color del patrón
      color: '#FF0000',
      // Ángulo de rotación
      rotation: 0,
      // Desplazamiento del patrón
      //offset: 5,
      // Espacio
      spacing: 2,
      // Clase de la fuente
      //class: 'g-cartografia-save',
      // Si name tiene valor 'Image'
      // Url de la imagen para el patrón.
      //src: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/mozilla.svg',
    }
  },
  //etiqueta del polígono
  label: {
    // Texto etiqueta. fijo (texto fijo)|función(función JS que devuelve el valor)|atributo(atributo de la capa)
    text: 'Tres Tristes Tigres',
    // Fuente de la etiqueta
    font: 'bold 16px Courier New',
    // Escala de la etiqueta
    scale: 1,
    // Desplazamiento en píxeles
    //offset: [10, 0],
    // Color del texto
    color: '#000',
    // Halo del texto
    /*stroke: {
      // Color de la fuente. Hexadecimal, nominal
      color: '#FF0000' || 'red',
      // Grosor del halo
      width: 5,
      // Patrón de distancias
      linedash: [5, 5, 20],
      // Offset de fase
      linedashoffset: 1,
      // Estilo de final de línea. round|square|butt
      linecap: 'square',
      // Estilo de conexión de segmentos. miter|round|bevel
      linejoin: 'miter',
      // Tamaño máximo segmento de conexión
      miterlimit: 15,
    },*/
    // Rotación con dispositivo
    rotate: true,
    // Rotación de la etiqueta
    //rotation: 0.3,
    // Alineación horizontal. CENTER|LEFT|RIGHT
    //align: LEFT,
    // Altura de la etiqueta. TOP|BOTTOM|MIDDLE| 					         
    // ALPHABETIC|HANGING|IDEOGRAPHIC 
    //baseline: BOTTOM,
  }
});

vector_001.setStyle(estilo);
mapa.addLayers(vector_001);
window.mapa = mapa;
window.vectorLayer = vector_001;