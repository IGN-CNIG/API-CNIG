/* eslint-disable max-len */
import StoryMap from 'facade/storymap';

import StoryMapJSON2 from './StoryMapJSON2'; // https://openlayers.org/en/latest/examples/animation.html
import StoryMapJSON1 from './StoryMapJSON1';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});
window.map = map;

const mp = new StoryMap({
  position: 'TR', // 'TL' | 'TR' | 'BR' | 'BL'
  collapsible: true,
  collapsed: false,
  isDraggable: false,
  // tooltip: 'TEST TOOLTIP',
  content: { // Contenidos
    es: StoryMapJSON2,
    en: StoryMapJSON1,
  },
  // indexInContent: false,
  //
  indexInContent: { // Título de todo este apartado, automáticamente incluye lista y redirección a siguientes apartados
    title: 'Indice StoryMap',
    subtitle: 'Visualizador de Cervantes y el Madrid del siglo XVII',
    js: "console.log('HolaMundo')",
  }, // */
  delay: 2000, // Tiempo entre animaciones de scroll al usar play
});

map.addPlugin(mp); window.mp = mp;

// Lista de errores encontrados

// 1 - ERROR, La flecha de abajo que representa el uso de scroll sigue flotando transparente en este elemento, sería recomendable limpiarla cuando se llega a opacidad 0 con "display: none;" y hay casos de que el scroll vuelve a aplicar opacidad causando que se ponga a opacidad negativa.
// Se puede arreglar cambiando como se confirma el lanzado inicial de la opacidad con
// if (this.svgArrowScroll) {
//   this.svgArrowScroll = false;
//   this.arrowScrollEffect();
// }
// Y luego el propio efecto debería tener ese configurado de display:none
// arrowScrollEffect() {
//   setTimeout(() => {
//     this.arrowScrollEffect_contador -= 0.1;
//     document.querySelector('.arrowScroll').style = this.arrowScrollEffect_contador > 0 ? `opacity: ${this.arrowScrollEffect_contador};` : 'opacity: 0;display: none;';
//     if (this.arrowScrollEffect_contador > 0) this.arrowScrollEffect();
//   }, 150);
// }
// Podría ser una buena idea incluir en css ".arrowScroll svg" el "box-shadow: 0 0 3px -1px gray;" para que se distinga mejor este elemento.

// 2 - ERROR, en addTo(map), parece que hay sobrantes "window.map = map;" y "window.mapjs = map;" que podrían haberse introducido para pruebas y se olvidaron quitar.

// 3 - ERROR el README y getAPI, no muestran valores iguales, porque hay terminación con variable y carácter incorrectos.

// 4 - ERROR el "{ text: '0.5x', value: 0 }," termina con el valor como "0.6...x" porque se aplica "1.5" en los cálculos, pero si se pone "{ text: '0.5x', value: 2 }," y se quita ese "+ 1.5", será mucho más cercano a "0.5x" y más claro a la vez como funciona.
// Se puede optar por hacerlo de esta otra forma:
// const speed = [
//   { text: '0.5x', value: this.delay / 500 },
//   { text: '1x', value: this.delay / 1000 },
//   { text: '2x', value: this.delay / 2000 },
//   { text: '3x', value: this.delay / 3000 },
//   { text: '5x', value: this.delay / 5000 },
// ];
// con solo un "target.setAttribute('speed', speed[position].value);" antes del if de "position !== 0"

// 5 - ERROR, Hay varias veces que se salta la primera opción de los grupos de datos, ocurre en el inicio o si se ejecuta más de una vez este play de scroll. Parece ser por la memoria del último scroll y el aplicado del "display:block", se ha podido solucionar con:
// target.scroll({ top: 10, behavior: 'auto' });
// Antes de los dos asignados de "target.style = 'display: none';" de función "scrollEvent(html)" para que se ponga en un valor default que se podrá usar más tarde si se desea volver a él.

// 6 - ERROR, Al llegar al final de la lista el play se pone de vuelta la pausa, esto no ocurre en todas las situaciones, si se activa el play con el botón de "1x","2x" ... se aplica la pausa al final, pero con el play normal nunca se limpia.
// Se ha podido solucionar con:
// timeCap() {
//   const lenghtCap = this.content_.cap.length - 1;
//   const lengthStep = this.content_.cap[lenghtCap].steps.length - 1;
//   const id = setInterval(() => {
//     const idChapter = this.capIndex('#contentStoryMap', '.chapters');
//     const idStep = this.capIndex(`#cap${idChapter}`, '.step');
//     if (idChapter !== lenghtCap || idStep !== lengthStep) {
//       const step = document.querySelector(`#cap${idChapter} #step${idStep}`);
//       step.scroll({ top: step.scrollHeight + 10, behavior: 'smooth' });
//     } else {
//       clearInterval(id);
//       document.querySelector('#m-storymap-panel #play').style.display = 'block';
//       document.querySelector('#m-storymap-panel #pause').style.display = 'none';
//     }
//   }, (document.querySelector('#buttonDelay').getAttribute('speed') * 1000));
//   return id;
// }

//----------------
// ERROR-MEJORA Al hacer click en el selector de velocidad se activa el play. No deberia estar ligado el selecctor de velocidad al avance de los elementos.
// si se quiere pasar a la velocidad 0.5x, tienes que pasar por todas las velocidades para dar la vuelta y puedes perderte información