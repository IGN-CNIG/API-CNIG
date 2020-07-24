/* eslint-disable no-console */
/**
 * @module M/control/InfocoordinatesControl
 */
import InfocoordinatesImplControl from 'impl/infocoordinatescontrol';
import template from 'templates/infocoordinates';
import { getValue } from './i18n/language';



export default class InfocoordinatesControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(decimalGEOcoord, decimalUTMcoord) {

    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(InfocoordinatesImplControl)) {
      M.exception(getValue('expection.impl'));
    }
    // 2. implementation of this control
    const impl = new InfocoordinatesImplControl();
    super(impl, 'Infocoordinates');
    this.map_ = null;
    this.numTabs = 0;
    this.layerFeatures = new M.layer.Vector();
    this.layerFeatures.name = 'infocoordinatesLayerFeatures';
    this.decimalGEOcoord = decimalGEOcoord;
    this.decimalUTMcoord = decimalUTMcoord;
  }



  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.map_ = map;
    if (!M.template.compileSync) { // JGL: retrocompatibilidad Mapea4
      M.template.compileSync = (string, options) => {
        let templateCompiled;
        let templateVars = {};
        let parseToHtml;
        if (!M.utils.isUndefined(options)) {
          templateVars = M.utils.extends(templateVars, options.vars);
          parseToHtml = options.parseToHtml;
        }
        const templateFn = Handlebars.compile(string);
        const htmlText = templateFn(templateVars);
        if (parseToHtml !== false) {
          templateCompiled = M.utils.stringToHtml(htmlText);
        } else {
          templateCompiled = htmlText;
        }
        return templateCompiled;
      };
    }

    return new Promise((success, fail) => {
      let options = {
        jsonp: true,
        vars: {
          translations: {
            title: getValue('title'),
            point: getValue('point'),
            datum: getValue('datum'),
            latitude: getValue('latitude'),
            longitude: getValue('longitude'),
            formatCoordinates: getValue('formatCoordinates'),
            zone: getValue('zone'),
            coordX: getValue('coordX'),
            coordY: getValue('coordY'),
            altitude: getValue('altitude'),
            removePoint: getValue('removePoint'),
            removeAllPoints: getValue('removeAllPoints'),
            importAllPoints: getValue('importAllPoints'),
            displayONAllPoints: getValue('displayONAllPoints'),
            displayOFFAllPoints: getValue('displayOFFAllPoints')
          }
        }
      };
      const html = M.template.compileSync(template, options);
      // Añadir código dependiente del DOM

      this.map_.addLayers(this.layerFeatures);
      this.panel_.on(M.evt.SHOW, this.activate, this);
      this.panel_.on(M.evt.HIDE, this.deactivate, this);

      success(html);
      html.querySelector('#m-infocoordinates-buttonRemoveAllPoints').addEventListener('click', this.removeAllPoints.bind(this));
      html.querySelector('#m-infocoordinates-buttonImportAllPoints').addEventListener('click', this.importAllPoints.bind(this));
      html.querySelector('#m-infocoordinates-buttonDisplayAllPoints').addEventListener('click', this.displayAllPoints.bind(this));
      html.querySelector('#m-infocoordinates-comboDatum').addEventListener('change', this.changeSelectSRSorChangeFormat.bind(this));
      html.querySelector('#m-infocoordinates-buttonConversorFormat').addEventListener('change', this.changeSelectSRSorChangeFormat.bind(this));
      html.querySelector('#m-infocoordinates-buttonRemovePoint').addEventListener('click', this.removePoint.bind(this));
    });

  }


  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.map_.on(M.evt.CLICK, this.addPoint, this);
    document.body.style.cursor = 'crosshair';
    this.map_.getFeatureHandler().deactivate();
  }


  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.map_.un(M.evt.CLICK, this.addPoint, this);
    document.body.style.cursor = 'default';
    this.map_.getFeatureHandler().activate();
  }



  addPoint(evt) {
    let numPoint = this.numTabs + 1;
    document.getElementById('m-infocoordinates-comboDatum').removeAttribute('disabled');
    document.getElementById('m-infocoordinates-buttonConversorFormat').removeAttribute('disabled');
    document.getElementById('m-infocoordinates-buttonRemovePoint').classList.remove('noDisplay');
    document.getElementsByClassName('m-infocoordinates-div-buttonRemoveAllPoints')[0].classList.remove('noDisplay');
    document.getElementsByClassName('m-infocoordinates-div-buttonImportAllPoints')[0].classList.remove('noDisplay');
    document.getElementsByClassName('m-infocoordinates-div-buttonDisplayAllPoints')[0].classList.remove('noDisplay');

    // Eliminamos las etiquetas de los puntos
    if (document.getElementsByClassName('icon-infocoordinates-displayON').length === 0 && this.map_.getMapImpl().getOverlays().array_.length > 0) {
      this.removeAllDisplaysPoints();
    }


    // Agrego la tab que es un botón con el número de punto
    let tabsDiv = document.getElementsByClassName('m-infocoordinates-tabs')[0];
    let buttonTab = document.createElement('button');
    let buttonTabText = document.createTextNode(numPoint);
    buttonTab.appendChild(buttonTabText);
    buttonTab.classList.add('tablinks');
    buttonTab.setAttribute('id', `tablink${numPoint}`);
    tabsDiv.appendChild(buttonTab);

    // cojo las coordenadas del punto pinchado
    let coordinates = evt.coord;

    //Agrego la feature
    let featurePoint = new M.Feature(numPoint, {
      "type": "Feature",
      "id": numPoint,
      "geometry": {
        "type": "Point",
        "coordinates": [coordinates[0], coordinates[1]]
      },
      "properties": {
        "EPSGcode": this.map_.getProjection().code,
        "coordinates": [coordinates[0], coordinates[1]]
      }

    });

    // Ubico el scroller centrado en el ultimo botón añadido
    tabsDiv.scrollTop = tabsDiv.scrollHeight;

    //Altura
    let altitudeFromWCSservice;
    let altitudeBox = document.getElementById('m-infocoordinates-altitude');
    let promesa = new Promise((success, fail) => {
      altitudeBox.innerHTML = getValue('readingAltitude');
      altitudeFromWCSservice = this.getImpl().readAltitudeFromWCSservice(coordinates, this.map_.getProjection().code)
      success(altitudeFromWCSservice);
    });

    promesa.then(response => {
      altitudeFromWCSservice = response.text.split(/\n/)[5].split(' ')[1];
      if (altitudeFromWCSservice == undefined) {
        altitudeFromWCSservice = getValue('noDatafromWCS');
      }
      featurePoint.setAttribute('Altitude', altitudeFromWCSservice);
      altitudeBox.innerHTML = parseFloat(altitudeFromWCSservice).toFixed(2);
      buttonTab.addEventListener('click', () => this.openTabFromTab(numPoint));
    })


    this.layerFeatures.addFeatures([featurePoint]);
    this.layerFeatures.setZIndex(999);
    this.openTab(numPoint)
    this.numTabs = numPoint;
  }

  activateSelection() {
    const olMap = this.facadeMap_.getMapImpl();
    const facadeControl = this.facadeControl;
    const drawingLayer = facadeControl.drawLayer.getImpl().getOL3Layer();

    this.facadeControl.hideTextPoint();

    if (document.querySelector('.m-geometrydraw>#downloadFormat') !== null) {
      document.querySelector('.m-geometrydraw').removeChild(facadeControl.downloadingTemplate);
    }

    if (drawingLayer) {
      this.select = new ol.interaction.Select({
        wrapX: false,
        layers: [drawingLayer],
      });

      this.select.on('select', (e) => {
        if (e.target.getFeatures().getArray().length > 0) {
          this.facadeControl.onSelect(e);
        }
      });

      olMap.addInteraction(this.select);

      this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
      this.edit.on('modifyend', (evt) => {
        this.facadeControl.onModify();
      });
      olMap.addInteraction(this.edit);
    }
  }



  selectFeature(numPoint) {
    this.point = new M.style.Point({
      icon: {
        form: M.style.form.NONE,
        class: '+',
        fontsize: 1.5,
        radius: 10,
        color: 'black',
        fill: 'white',
      },
    });

    this.pointDisable = new M.style.Point({
      radius: 5,
      icon: {
        form: 'none',
        class: '+',
        radius: 15,
        rotation: 0,
        rotate: false,
        offset: [0, 0],
        color: '#2690e7',
        opacity: 1,
        stroke: {
          width: 20
        }
      },
    });

    // Calculamos el número de elementos de numPoints que hay
    const countPoints = document.getElementsByClassName('contenedorPunto').length + document.getElementsByClassName('contenedorPuntoSelect').length;
    // Si el numPoint que se pasa es mayor que la cantidad de numPoints que existe, quiere decir que es nuevo, se añade.
    // En el caso de que no sea nuevo, se modifica el estilo del punto.
    if (numPoint > countPoints) {
      this.displayPoint(numPoint);
    } else {
      document.getElementsByClassName('contenedorPuntoSelect')[0].classList.replace('contenedorPuntoSelect', 'contenedorPunto');
      document.getElementsByClassName('contenedorPunto')[document.getElementsByClassName('contenedorPunto').length - numPoint].classList.replace('contenedorPunto', 'contenedorPuntoSelect');

      // Eliminamos las etiquetas de los puntos
      if (document.getElementsByClassName('icon-infocoordinates-displayON').length === 0 && this.map_.getMapImpl().getOverlays().array_.length > 0) {
        this.removeAllDisplaysPoints();
      }
    }

    this.layerFeatures.getFeatures().map((elemento) => (elemento.setStyle(this.pointDisable)));
    let featureSelected = this.layerFeatures.getFeatureById(numPoint);
    featureSelected.setStyle(this.point);
  }

  displayPoint(numPoint) {
    var pos = this.layerFeatures.impl_.features_[numPoint - 1].impl_.olFeature_.values_.coordinates;

    // Modificamos el color del estilo de los puntos anteriores.
    if (numPoint > 1) {
      document.getElementsByClassName('contenedorPuntoSelect')[0].classList.replace('contenedorPuntoSelect', 'contenedorPunto');
    }

    const textHTML = `<div class="contenedorPuntoSelect">
                <table>
                    <tbody>
                      <tr>
                        <td style="font-weight: bold; font-family: arial;">${numPoint}</td></b>
                      </tr>
                    </tbody>
                </table>
            </div>
          </div>
      </div>`

    const helpTooltipElement = M.template.compileSync(textHTML, {
      jsonp: true,
      vars: {
        translations: getValue('text'),
      },
    });

    this.helpTooltip_ = new ol.Overlay({
      element: helpTooltipElement,
      offset: [10, -5],
    });

    this.helpTooltip_.setPosition(pos);
    this.map_.getMapImpl().addOverlay(this.helpTooltip_);
  }


  activateTab(numPoint) {
    let allTabsLinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < allTabsLinks.length; i++) {
      allTabsLinks[i].classList.remove('active')
    }
    let idBotonTab = document.getElementById(`tablink${numPoint}`);
    idBotonTab.classList.add('active');
  }

  changeSelectSRSorChangeFormat() {
    // Cojo la tab activa
    let numPoint = parseInt(document.querySelector('.tablinks.active').textContent);
    this.displayXYcoordinates(numPoint);

  }

  displayXYcoordinates(numPoint) {
    let featureSelected = this.layerFeatures.getFeatureById(numPoint);

    //Capturo los elementos
    let pointBox = document.getElementById('m-infocoordinates-point');
    let latitudeBox = document.getElementById('m-infocoordinates-latitude');
    let longitudeBox = document.getElementById('m-infocoordinates-longitude');
    let zoneBox = document.getElementById('m-infocoordinates-zone');
    let coordX = document.getElementById('m-infocoordinates-coordX');
    let coordY = document.getElementById('m-infocoordinates-coordY');


    //Cojo el srs seleccionado en el select
    let selectSRS = document.getElementById('m-infocoordinates-comboDatum').value;

    //Cojo el formato de las coordenadas geográficas
    let formatGMS = document.getElementById('m-infocoordinates-buttonConversorFormat').checked;

    //Cambio coordenadas y calculo las UTM
    let pointDataOutput = this.getImpl().getCoordinates(featureSelected, selectSRS, formatGMS, this.decimalGEOcoord, this.decimalUTMcoord);

    // pinto
    pointBox.innerHTML = pointDataOutput.NumPoint;
    latitudeBox.innerHTML = pointDataOutput.projectionGEO.coordinatesGEO.latitude;
    longitudeBox.innerHTML = pointDataOutput.projectionGEO.coordinatesGEO.longitude;
    zoneBox.innerHTML = pointDataOutput.projectionUTM.zone;
    coordX.innerHTML = this.formatUTMCoordinate(pointDataOutput.projectionUTM.coordinatesUTM.coordX);
    coordY.innerHTML = this.formatUTMCoordinate(pointDataOutput.projectionUTM.coordinatesUTM.coordY);
  }

  displayZcoordinate(numPoint) {
    let featureSelected = this.layerFeatures.getFeatureById(numPoint);
    let altitudeBox = document.getElementById('m-infocoordinates-altitude');
    altitudeBox.innerHTML = featureSelected.getAttribute('Altitude');
  }


  openTab(numPoint) {
    this.selectFeature(numPoint);
    this.activateTab(numPoint);
    this.displayXYcoordinates(numPoint);
  }

  openTabFromTab(numPoint) {
    this.selectFeature(numPoint);
    this.activateTab(numPoint);
    this.displayXYcoordinates(numPoint);
    this.displayZcoordinate(numPoint);

  }

  removePoint() {
    if (document.getElementsByClassName('tablinks').length > 1) {
      let tablinkActive = document.querySelector('.tablinks.active');
      let numPoint = tablinkActive.textContent;
      //Elimina tab
      tablinkActive.parentNode.removeChild(tablinkActive);
      // elimina la feature
      let featureSelect = this.layerFeatures.getFeatureById(parseInt(numPoint));
      this.layerFeatures.removeFeatures(featureSelect);

      //mostrar otro punto, muestro el último punto y lo activo
      let lastTablink = document.getElementsByClassName('m-infocoordinates-tabs')[0].lastChild;
      lastTablink.classList.add('active');
      this.openTabFromTab(parseInt(lastTablink.textContent))
    } else {
      this.removeAllPoints();
    }
  }


  importAllPoints() {
    // const projectionSelect = document.getElementById('m-infocoordinates-projectionPrint').value;
    // const projectionPoints = this.layerFeatures.impl_.features_[0].formatGeoJSON_.impl_.dataProjection.code_;
    let printDocument = [];

    for (let i = 0; i < this.layerFeatures.impl_.features_.length; i += 1) {

      let featureSelected = this.layerFeatures.impl_.features_[i];

      //Cojo el srs seleccionado en el select
      let selectSRS = document.getElementById('m-infocoordinates-comboDatum').value;

      //Cojo el formato de las coordenadas geográficas
      let formatGMS = document.getElementById('m-infocoordinates-buttonConversorFormat').checked;

      //Cambio coordenadas y calculo las UTM
      let pointDataOutput = this.getImpl().getCoordinates(featureSelected, selectSRS, formatGMS, this.decimalGEOcoord, this.decimalUTMcoord);



      let coordinatesGEO = [
        pointDataOutput.projectionGEO.coordinatesGEO.longitude,
        pointDataOutput.projectionGEO.coordinatesGEO.latitude
      ];

      let coordinatesUTM = [
        pointDataOutput.projectionUTM.coordinatesUTM.coordX,
        pointDataOutput.projectionUTM.coordinatesUTM.coordY
      ];

      // tranformCoordinates = this.getImpl().transform(
      //   tranformCoordinates,
      //   projectionPoints,
      //   projectionSelect);

      printDocument.push(getValue('point') + i + ': ' + '\n');
      printDocument.push(pointDataOutput.projectionGEO.code + ': ');
      printDocument.push('[' + coordinatesGEO + ']' + '\n');
      printDocument.push(pointDataOutput.projectionUTM.code + ': ');
      printDocument.push('[' + coordinatesUTM + ']' + '\n');
    }

    const toBlobType = new Blob(printDocument, {
      type: 'text/plain'
    })

    const f = new Date();
    const titulo = 'mapa_'.concat(f.getFullYear(), '-', f.getMonth() + 1, '-', f.getDay() + 1, '_', f.getHours(), f.getMinutes(), f.getSeconds());

    this.descargarArchivo(toBlobType, titulo.concat('.txt'));
  }

  displayAllPoints() {
    if (document.getElementsByClassName('icon-infocoordinates-displayON').length === 0 && this.map_.getMapImpl().getOverlays().array_.length > 0) {
      this.removeAllDisplaysPoints();
    } else {
      // Modificamos el icono
      document.getElementsByClassName('icon-infocoordinates-displayON')[0].classList.replace("icon-infocoordinates-displayON", "icon-infocoordinates-displayOFF")
      document.getElementsByClassName('icon-infocoordinates-displayOFF')[0].title = getValue("displayOFFAllPoints")

      // Eliminamos el num sobre el punto
      for (let i = 0; i < document.getElementsByClassName('contenedorPunto').length; i += 1) {
        document.getElementsByClassName('contenedorPunto')[i].style = 'display: none';
      }
      document.getElementsByClassName('contenedorPuntoSelect')[0].style = 'display: none'

      // Creamos las etiquetas de los puntos
      for (let i = 0; i < this.layerFeatures.impl_.features_.length; i += 1) {
        const pos = this.layerFeatures.impl_.features_[i].impl_.olFeature_.values_.coordinates;
        const varUTM = this.calculateUTMcoordinates(i + 1);
        const textHTML = `<div class="m-popup m-collapsed" style="padding: 5px 5px 5px 5px !important;background-color: rgba(255, 255, 255, 0.7) !important;">
              <div class="contenedorCoordPunto">
                <table>
                    <tbody>
                      <tr>
                        <td style="font-weight: bold">${getValue('point')} ${i+1}</td></b>
                      </tr>
                      <tr>
                        <td>X: ${this.formatUTMCoordinate(varUTM[0])}</td>
                      </tr>
                      <tr>
                        <td>Y: ${this.formatUTMCoordinate(varUTM[1])}</td>
                      </tr>
                      <tr>
                        <td>${getValue('altitude')} ${parseFloat(this.layerFeatures.impl_.features_[i].impl_.olFeature_.values_.Altitude).toFixed(2)}</td>
                      </tr>
                    </tbody>
                </table>
            </div>
          </div>
          </div>
      </div>`

        const helpTooltipElement = M.template.compileSync(textHTML, {
          jsonp: true,
          vars: {
            translations: getValue('text'),
          },
        });

        this.helpTooltip_ = new ol.Overlay({
          element: helpTooltipElement,
          offset: [10, -5],
        });

        this.helpTooltip_.setPosition(pos);
        this.map_.getMapImpl().addOverlay(this.helpTooltip_);
      }
    }
  }

  calculateUTMcoordinates(numPoint) {
    let featureSelected = this.layerFeatures.getFeatureById(numPoint);
    //Cojo el srs seleccionado en el select
    let selectSRS = document.getElementById('m-infocoordinates-comboDatum').value;

    //Cojo el formato de las coordenadas geográficas
    let formatGMS = document.getElementById('m-infocoordinates-buttonConversorFormat').checked;

    //Cambio coordenadas y calculo las UTM
    let pointDataOutput = this.getImpl().getCoordinates(featureSelected, selectSRS, formatGMS, this.decimalGEOcoord, this.decimalUTMcoord);

    return [pointDataOutput.projectionUTM.coordinatesUTM.coordX, pointDataOutput.projectionUTM.coordinatesUTM.coordY];
  }

  removeAllDisplaysPoints() {
    // Modificamos el icono
    document.getElementsByClassName('icon-infocoordinates-displayOFF')[0].classList.replace("icon-infocoordinates-displayOFF", "icon-infocoordinates-displayON");
    document.getElementsByClassName('icon-infocoordinates-displayON')[0].title = getValue("displayONAllPoints");

    // Mostramos el num sobre el punto
    for (let i = 0; i < document.getElementsByClassName('contenedorPunto').length; i += 1) {
      document.getElementsByClassName('contenedorPunto')[i].style = 'display: block';
    }
    document.getElementsByClassName('contenedorPuntoSelect')[0].style = 'display: block'


    // Eliminamos todas las etiquetas de los puntos
    const numOverlays = this.map_.getMapImpl().getOverlays().getArray().length;
    for (let i = numOverlays - 1; i > -1; i -= 1) {
      if (this.map_.getMapImpl().getOverlays().array_[i].options.element.className === 'm-popup m-collapsed') {
        this.map_.getMapImpl().removeOverlay(this.map_.getMapImpl().getOverlays().getArray()[i]);
      }

    }
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var save = document.createElement('a');
      save.href = event.target.result;
      save.target = '_blank';
      save.download = nombreArchivo || 'archivo.dat';
      var clicEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      save.dispatchEvent(clicEvent);
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
  }

  removeAllPoints() {
    let divTabContainer = document.getElementsByClassName('m-infocoordinates-tabs')[0];
    divTabContainer.innerHTML = '';

    document.getElementById('m-infocoordinates-point').innerHTML = '--';
    document.getElementById('m-infocoordinates-latitude').innerHTML = '--';
    document.getElementById('m-infocoordinates-longitude').innerHTML = '--';
    document.getElementById('m-infocoordinates-zone').innerHTML = '--';
    document.getElementById('m-infocoordinates-coordX').innerHTML = '--';
    document.getElementById('m-infocoordinates-coordY').innerHTML = '--';
    document.getElementById('m-infocoordinates-altitude').innerHTML = '--';

    document.getElementById('m-infocoordinates-buttonRemovePoint').classList.add('noDisplay');
    document.getElementsByClassName('m-infocoordinates-div-buttonRemoveAllPoints')[0].classList.add('noDisplay');
    document.getElementsByClassName('m-infocoordinates-div-buttonImportAllPoints')[0].classList.add('noDisplay');
    document.getElementsByClassName('m-infocoordinates-div-buttonDisplayAllPoints')[0].classList.add('noDisplay');
    document.getElementById('m-infocoordinates-buttonConversorFormat').setAttribute('disabled', 'disabled');
    document.getElementById('m-infocoordinates-comboDatum').setAttribute('disabled', 'disabled');


    //Elimino todas las features
    this.layerFeatures.removeFeatures((this.layerFeatures.getFeatures()));

    // Elimino todos los popups del mapa
    const numOverlays = this.map_.getMapImpl().getOverlays().getArray().length;
    for (let i = numOverlays - 1; i > -1; i -= 1) {
      this.map_.getMapImpl().removeOverlay(this.map_.getMapImpl().getOverlays().getArray()[i]);
    }

    //Reseteo el contador de tabs
    this.numTabs = 0;
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof InfocoordinatesControl;
  }

  removeLayerFeatures() {
    this.map_.removeLayers(this.layerFeatures);
  }

  formatUTMCoordinate(coord) {
    return coord.replace(/\d(?=(\d{3})+\.)/g, '$&*').split('.').join(',').split('*').join('.');
  }

}
