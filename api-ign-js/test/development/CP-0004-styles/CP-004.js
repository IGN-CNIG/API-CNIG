import { map as Mmap } from 'M/mapea';
import Generic from 'M/style/Generic';
import Choropleth from 'M/style/Choropleth';
import Proportional from 'M/style/Proportional';
import Category from 'M/style/Category';
import Chart from 'M/style/Chart';
import Heatmap from 'M/style/Heatmap';
import Cluster from 'M/style/Cluster';
import FlowLine from 'M/style/FlowLine';
import { schemes } from 'M/chart/types';
import { JENKS, QUANTILE, EQUAL_INTERVAL, MEDIA_SIGMA, ARITHMETIC_PROGRESSION, GEOMETRIC_PROGRESSION } from 'M/style/Quantification';
import { wfs_001, wfs_002, wfs_003, wfs_004 } from '../layers/wfs/wfs';
import { geojson_003 } from '../layers/geojson/geojson';
import { info } from 'M/dialog';

const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  bbox: [-1558215.73316107, 4168698.8601280265, 789929.7757595448, 5275507.029697379],
});

// COROPLETAS
const getCoropletasStyle = () => {
  const estilo = new Choropleth(
    'u_cod_prov',
    ['#000000', '#008000', '#FFFFFF'],
    JENKS(4),
  );
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = wfs_001;
  mapa.addLayers(window.layer);
  return estilo;
};

// PROPORCIONAL
const getProportionalStyle = () => {
  const estilo = new Proportional('tot_ibi', 5, 20,
    new Generic({ // estilo del punto
      point: {
        fill: {
          color: '#000000',
        },
        stroke: {
          color: '#FFFFFF',
          width: 2,
        },
      },
    }),
  );
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = wfs_003;
  mapa.addLayers(window.layer);
  return estilo;
};

// CATEGORICO
const getCategoricStyle = () => {
  const verde = new Generic({polygon: {fill: {color: 'green'}}});
  const amarillo = new Generic({polygon: {fill: {color: 'pink'}}});
  const rojo = new Generic({polygon: {fill: {color: 'red'}}});
  const azul = new Generic({polygon: {fill: {color: 'grey'}}});
  const naranja = new Generic({polygon: {fill: {color: 'orange'}}});
  const marron = new Generic({polygon: {fill: {color: 'brown'}}});
  const magenta = new Generic({polygon: {fill: {color: '#e814d9'}}});
  const morado = new Generic({polygon: {fill: {color: '#b213dd'}}});

  const estilo = new Category("provincia", {
    "Almería": marron,
    "Cádiz": amarillo,
    "Córdoba": magenta,
    "Granada": verde,
    "Jaén": naranja,
    "Málaga": azul,
    "Sevilla": rojo,
    "Huelva": morado
  });
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = wfs_003;
  mapa.addLayers(window.layer);
  return estilo;
};

// / ESTADÍSTICOS
const getEstadisticStyle = (graphicType) => {
  const opcionesEstilo = {
    // Características generales de la gráfica
    type: graphicType || 'pie',
    radius: 25,
    stroke: { color: 'black', width: 1 },
    scheme: schemes.Custom, // usaremos nuestros propios colores

    // Variables que queremos representar
    variables: [{
      attribute: 'es_0_15', // población entre 0 y 15 años
      legend: '0-15 años',
      fill: '#F2F2F2',
      label: {
        stroke: { color: 'white', width: 2 },
        radiusIncrement: 10,
        fill: 'black',
        text: '{{es_0_15}}',
        font: 'Comic Sans MS',
      },
    }, {
      attribute: 'es_16_45', // población entre 16 y 45 años
      legend: '16-45 años',
      fill: 'blue',
      label: {
        text(value, values, feature) {
          return value.toString();
        },
        radiusIncrement: 10,
        stroke: { color: '#fff', width: 2 },
        fill: 'blue',
        font: 'Comic Sans MS',
      },
    }, {
      attribute: 'es_45_65', // población entre 45 y 65 años
      legend: '45-65 años',
      fill: 'pink',
      label: {
        text: '{{es_45_65}}',
        stroke: { color: '#fff', width: 2 },
        fill: 'red',
        font: 'Comic Sans MS',
      },
    }, {
      attribute: 'es_65', // población mayor de 65 años
      legend: '65 años o más',
      fill: 'orange',
      label: {
        text: '{{es_65}}',
        stroke: { color: '#fff', width: 2 },
        fill: '#886A08',
        font: 'Comic Sans MS',
      },
    }],
  };
  const estilo = new Chart(opcionesEstilo);
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = wfs_001;
  mapa.addLayers(window.layer);
  return estilo;
};

// MAPA DE CALOR
const getHeatmapStyle = () => {
  const estilo = new Heatmap('numero', {
    blur: 15,
    radius: 10,
    gradient: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red'],
  });
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = wfs_002;
  mapa.addLayers(window.layer);
  return estilo;
};

// CLUSTER
const getClusterStyle = () => {
  const clusterOptions = {
    ranges: [{
      min: 2,
      max: 4,
      style: new Generic({
        point: {
          stroke: {
            color: '#5789aa',
          },
          fill: {
            color: '#99ccff',
          },
          radius: 20,
        },
      }),
    }, {
      min: 5,
      max: 9,
      style: new Generic({
        point: {
          stroke: {
            color: '#5789aa',
          },
          fill: {
            color: '#3399ff',
          },
          radius: 30,
        },
      }),
    },
    // Se pueden definir más rangos
    ],
    animated: true,
    hoverInteraction: true,
    displayAmount: true,
    selectInteraction: true,
    distance: 80,
    label: {
      font: 'bold 19px Comic Sans MS',
      color: '#FFFFFF',
    },
  };
  const estilo = new Cluster(clusterOptions);
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = wfs_004;
  mapa.addLayers(window.layer);
  return estilo;
};

// LINEA DE FLUJO
const getFlowLineStyle = () => {
  const estilo = new FlowLine({
    color: 'blue',
    color2: 'pink',
    width: function (feature) {
              return feature.getAttribute('inicio') * 0.2;
          },
    width2: function (feature) {
              return feature.getAttribute('final') * 0.2;
          },
    arrow: -1,
    arrowColor: 'grey',
    lineCap: 'butt',
  });
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = geojson_003;
  mapa.addLayers(window.layer);
  return estilo;
};

// COMPOSICION
const getCompositeStyle = () => {
  // Estilo genérico: puntos amarillos con borde rojo
  const estilo_base = new Generic({
    point: {
      radius: 5,
      fill: {
        color: 'yellow',
        opacity: 0.5
      },
      stroke: {
        color: '#FF0000'
      }
    }
  });

  // Estilo cluster por defecto
  const estilo_cluster = new Cluster();

  // Cluster permite Composite, así que se le puede agregar el estilo base
  const estilo = estilo_cluster.add(estilo_base);
  if (window.layer) {
    mapa.removeLayers(window.layer);
  }
  window.layer = wfs_004;
  mapa.addLayers(window.layer);
  return estilo;
};

window.mapa = mapa;

const popupDePruebas = window.document.getElementById('popup_de_test');
const abrirPopup = window.document.getElementById('abrir_test');
abrirPopup.addEventListener('click', () => {popupDePruebas.className = "active"});

const cerrarPopup = window.document.getElementById('cerrar_test');
cerrarPopup.addEventListener('click', () => {popupDePruebas.className = "notactive"});

const styleTypeDiv = window.document.getElementsByClassName('styleType')[0];
styleTypeDiv.addEventListener('click', (evt) => styleTypeEvent(evt));

const styleOptionsDiv = window.document.getElementsByClassName('styleOptions')[0];
styleOptionsDiv.addEventListener('click', (evt) => refreshStyle(evt));

const showStyleBtn = window.document.getElementById('showStyleOptions');
showStyleBtn.addEventListener('click', () => showStyleDialog());

const resetDefaultBtn = window.document.getElementById('resetDefault');
resetDefaultBtn.addEventListener('click', () => resetDefaultStyle());

const setParam = window.document.getElementsByClassName('setFunctions')[0];
const getWithParam = window.document.getElementsByClassName('getWithParameters')[0];
const noParam = window.document.getElementsByClassName('noParameters')[0];
const otherParam = window.document.getElementsByClassName('otherFunctions')[0];

let estilo = null;
let styleType = null;

const styles = {
  coropletas: {
    funcion: getCoropletasStyle,
    opciones: {},
  },
  proportional: {
    funcion: getProportionalStyle,
    opciones: {},
  },
  categoric: {
    funcion: getCategoricStyle,
    opciones: {},
  },
  estadistic: {
    funcion: getEstadisticStyle,
    opciones: [
      {
        id: 'pie', value: 'pie', texto: 'Tarta', default: true,
      }, {
        id: 'pie3D', value: 'pie3D', texto: 'Tarta 3D', default: false,
      }, {
        id: 'donut', value: 'donut', texto: 'Donut', default: false,
      }, {
        id: 'bar', value: 'bar', texto: 'Barras', default: false,
      },
    ],
  },
  heatmap: {
    funcion: getHeatmapStyle,
    opciones: {},
  },
  cluster: {
    funcion: getClusterStyle,
    opciones: {},
  },
  flowline: {
    funcion: getFlowLineStyle,
    opciones: {},
  },
  composite: {
    funcion: getCompositeStyle,
    opciones: {},
  },
};

const styleTypeEvent = (evt) => {
  const idTarget = evt.target.id;
  if (idTarget) {
    styleType = idTarget;
    activateStyleTypeBtn(idTarget);
    refreshStyleOptions(idTarget);
    setStyle(idTarget);
    refreshFuntions();
    showTestSections();
  }
};

const resetDefaultStyle = () => {
  const activeBtn = document.querySelector('.activeButton');
  const okButtons = document.querySelectorAll('.okButton');
  removeClassFromListElements(okButtons, 'okButton');
  const warningButtons = document.querySelectorAll('.warningButton');
  removeClassFromListElements(warningButtons, 'warningButton');
  const errorButtons = document.querySelectorAll('.errorButton');
  removeClassFromListElements(errorButtons, 'errorButton');
  setStyle(activeBtn.id);
};

const removeClassFromElement = (element, className) => {
  element.classList.remove(className);
};

const removeClassFromListElements = (elements, className) => {
  elements.forEach(e => removeClassFromElement(e, className));
};

const deleteChilds = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const activateStyleTypeBtn = (idBtn) => {
  const buttons = window.document.querySelectorAll('.styleType>button');
  buttons.forEach((b) => {
    b.classList.remove('activeButton');
    if (b.id === idBtn) {
      b.classList.add('activeButton');
    }
  });
};

const showTestSections = () => {
  const testSections = window.document.getElementById('test_sections');
  testSections.classList.remove('hidden');
};

const setStyle = (type) => {
  estilo = styles[type].funcion();
  window.layer.setStyle(estilo);
};

const setStyleWithParam = (type, param) => {
  estilo = styles[type].funcion(param);
  window.layer.setStyle(estilo);
};

const refreshStyleOptions = (type) => {
  const options = styles[type].opciones;
  deleteChilds(styleOptionsDiv);
  for (let i = 0; i < options.length; i++) {
    const btn = document.createElement('button');
    btn.innerText = options[i].texto;
    btn.id = options[i].id;
    if (options[i].default) {
      btn.classList.add('activeButton');
    }
    styleOptionsDiv.appendChild(btn);
  }
};

const refreshFuntions = () => {
  deleteChilds(setParam);
  deleteChilds(getWithParam);
  deleteChilds(noParam);
  deleteChilds(otherParam);
  addTestFunctions();
};

const refreshStyle = (evt) => {
  const idBtn = evt.target.id;
  if (idBtn) {
    removeClassFromListElements(styleOptionsDiv.querySelectorAll('.activeButton'), 'activeButton');
    evt.target.classList.add('activeButton');
    const value = styles[styleType].opciones.filter(o => o.id === idBtn)[0].value;
    setStyleWithParam(styleType, value);
  }
};

const showStyleDialog = () => {
  const options = estilo.getOptions();
  const jsonFormateado = JSON.stringify(options, null, 2);
  console.log(options);
  info(jsonFormateado);
};

///////////////////////
////// FUNCIONES //////
///////////////////////

// Función de escritura al Console del Browser
const showResult = (button, format, result) => {
  const complete = button.innerText + (format ? `_${format}` : '');
  if (result instanceof Promise) {
    const resultArray = [];
    result.then((success) => {
      console.log(`PROMISE_SUCCESS: ${complete}`, success);
      resultArray.push(success);
      button.className = 'okButton';
    }, (error)=> {
      console.log(`PROMISE_ERROR_THEN: ${complete}`, error);
      resultArray.push(error);
      button.className = 'errorButton';
    }).catch((error)=> {
      console.log(`PROMISE_ERROR_CATCH: ${complete}`, error);
      resultArray.push(error);
      button.className = 'errorButton';
    });
    return resultArray;
  }
  button.className = 'okButton';
  console.log(complete, result);
  return result;
};

const checkFunctionArguments = (func) => {
  let hasArguments = false;
  const functString = func.toString().split('\n').splice(0, 2);
  if (functString[0]) {
    hasArguments = functString[0].substring(functString[0].indexOf('(') + 1, functString[0].indexOf(')')).trim().length !== 0 || functString[0].includes('arguments.length');
  }
  if (!hasArguments && functString[1]) {
    hasArguments = functString[1].includes('arguments.length') || functString[1].includes('[native code]');
  }
  return hasArguments;
};

const addTestFunctions = () => {
  // Guardar todos los __proto__ del Objeto "estilo", usando ... para traerse elementos de estos objetos a un objeto común con el que se trabajará
  const objectWithAllFunctions = {
    ...Object.getOwnPropertyDescriptors(estilo.__proto__),
    ...Object.getOwnPropertyDescriptors(estilo.__proto__.__proto__),
    ...Object.getOwnPropertyDescriptors(estilo.__proto__.__proto__.__proto__),
    ...Object.getOwnPropertyDescriptors(estilo.__proto__.__proto__.__proto__.__proto__)
  };


  // Creado Array para manejar más adelante el objectWithAllFunctions y ordenado de este sin funciones de "constructor" y "destroy"
  const listOfAllFunctions = Object.keys(objectWithAllFunctions).sort();
  listOfAllFunctions.remove('constructor');
  listOfAllFunctions.remove('destroy');
  listOfAllFunctions.remove('equals');
  listOfAllFunctions.remove('setImpl');
  listOfAllFunctions.remove('loadCanvasImages_'); // se llama internamente con updateCanvas
  listOfAllFunctions.remove('drawGeometryToCanvas'); // se llama internamente con updateCanvas
  if (styleType !== 'composite') {
    // listOfAllFunctions.remove('add');
    listOfAllFunctions.remove('unapplySoft');
    listOfAllFunctions.remove('updateInternal_');
  }
  // Confirmar que existen funciones que se quieren probar
  if (listOfAllFunctions && listOfAllFunctions.length > 0) {
    // Comenzar a generar botones del HTML
    for (let i = 0; i < listOfAllFunctions.length; i++) {
      const auxName = listOfAllFunctions[i]; // Nombre de Función
      // Comprobar que es una función y no un objeto
      if (objectWithAllFunctions[auxName].value && objectWithAllFunctions[auxName].value instanceof Function) {
        // El botón de esta función
        const auxButton = document.createElement('button');
        auxButton.innerText = auxName;
        let appendTo;
        let parameterTest;

        if (objectWithAllFunctions[auxName].value && !checkFunctionArguments(objectWithAllFunctions[auxName].value)) {
          // ---------------------------------FUNCIONES SIN PARÁMETROS-----------------------------
          parameterTest = () => { // singeParameterTest
            showResult(auxButton, undefined , estilo[auxName]());
          };
          appendTo = noParam;
        } else {
          if (auxName.startsWith('get')) {
            // ---------------------------------FUNCIONES GET---------------------------------
            parameterTest = () => { // getParameterTest
              if (auxName == 'get') {
                showResult(auxButton, 'fill.color', estilo[auxName]('fill.color'));
              } else if (auxName == 'getStyleForCategory') {
                showResult(auxButton, 'SEVILLA', estilo[auxName]('Sevilla'));
              } else if (auxName == 'getRange') {
                showResult(auxButton, '2-4', estilo[auxName](2, 4));
              } else {
                console.error('NOT_PREPARED_FUNCTION_TEST_FOR_OTHER:',auxName);
              }
            };
            appendTo = getWithParam;
          } else if (auxName.startsWith('set')) {
            // ---------------------------------FUNCIONES SET---------------------------------
            parameterTest = () => { // setParameterTest
              if (auxName === 'set') {
                showResult(auxButton, 'fill.color', estilo[auxName]('fill.color', 'pink'));
              } else if (auxName === 'setAttributeName') {
                showResult(auxButton, 'es_0_15', estilo[auxName]('es_0_15'));
              } else if (auxName === 'setQuantification') {
                // const rangos = [10, 20, 30, 40, 50];
                showResult(auxButton, 'JENKS', estilo[auxName](EQUAL_INTERVAL(4)));
              } else if (auxName === 'setStyles') {
                showResult(auxButton, 'EMPTY_STYLES', estilo[auxName]([]));
              } else if (auxName === 'setMaxRadius') {
                showResult(auxButton, '30', estilo[auxName](30));
              } else if (auxName === 'setMinRadius') {
                showResult(auxButton, '3', estilo[auxName](3));
              } else if (auxName === 'setProportionalFunction') {
                const miFuncionProporcional = (value, minValue, maxValue, minRadius, maxRadius) => {
                  let radio = value * (maxValue / maxRadius);                  
                  return radio;
                }
                showResult(auxButton, 'function', estilo[auxName](miFuncionProporcional));
              } else if (auxName === 'setCategories') {
                const categories = {};
                showResult(auxButton, 'empty_object', estilo[auxName](categories));
              } else if (auxName === 'setStyleForCategory') {
                const negro = new Generic({polygon: {fill: {color: 'black'}}});
                showResult(auxButton, 'black', estilo[auxName]('Sevilla', negro));
              } else if (auxName === 'setBlurSize') {
                showResult(auxButton, '10', estilo[auxName](10));
              } else if (auxName === 'setGradient') {
                const gradient = ['red', 'green', 'blue'];
                showResult(auxButton, '[red, green, blue]', estilo[auxName](gradient));
              } else if (auxName === 'setRadius') {
                showResult(auxButton, '20', estilo[auxName](20));
              } else if (auxName === 'setAnimated') {
                showResult(auxButton, 'false', estilo[auxName](false));
              } else if (auxName === 'setRanges') {
                const rangos = [{
                  min: 1,
                  max: 3,
                  style: new Generic({
                    point: {
                      stroke: {
                        color: '#5789aa',
                      },
                      fill: {
                        color: '#99ccff',
                      },
                      radius: 20,
                    },
                  }),
                }, {
                  min: 4,
                  max: 7,
                  style: new Generic({
                    point: {
                      stroke: {
                        color: '#5789aa',
                      },
                      fill: {
                        color: '#3399ff',
                      },
                      radius: 30,
                    },
                  }),
                },
                // Se pueden definir más rangos
                ];
                showResult(auxButton, null, estilo[auxName](rangos));
              } else {
                console.error('NOT_PREPARED_FUNCTION_TEST_FOR_OTHER:',auxName);
              }
            };
            appendTo = setParam;
          } else {
            // ---------------------------------OTRAS FUNCIONES---------------------------------
            parameterTest = () => { // otherParameterTest
              if (auxName === 'apply' || auxName === 'applyInternal') {
                showResult(auxButton, null, estilo[auxName](window.layer));
              } else if (auxName == 'applyToFeature') {
                const feature = window.layer.getFeatures()[0];
                showResult(auxButton, null, estilo[auxName](feature));
              } else if (auxName == 'refresh') {
                showResult(auxButton, null, estilo[auxName]());
              } else if (auxName === 'unapply' || auxName === 'unapplyInternal') {
                showResult(auxButton, null, estilo[auxName](window.layer));
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
        appendTo.append(auxButton);
      }
    }
  }
  
  window.listOfAllFunctions = listOfAllFunctions; // Para tener acceso a toda la lista de funciones.
};


////////////////////
// ERORES develop //
///////////////////
/*
Estilo Coropletas
  + setQuantification --> no funciona pasandole array de rangos, funcion que devuelve rangos ni con funciones de Quantification

Proporcional
  + set --> this.getImpl(...).updateFacadeOptions is not a function
  + update_ --> Cannot read properties of null (reading 'getStyle')
  + setAttributeName, setMaxRadius, setMinRadius, setProportionaFunction, apply, applyInternal, refresh  --> fallan por el error en el update_

Cluster
  + setRanges --> Cannot set properties of null (setting 'style')

Linea de flujo
  + applyToFeature --> Cannot read properties of null (reading 'getOptions')
  + set --> Cannot read properties of null (reading 'getOptions') //El estilo no tiene opciones
*/