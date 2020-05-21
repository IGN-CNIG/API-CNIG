/* eslint-disable no-console */
/**
 * @module M/control/InfocoordinatesControl
 */

import InfocoordinatesImplControl from 'impl/infocoordinatescontrol';
import template from 'templates/infocoordinates';

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
  constructor() {

    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(InfocoordinatesImplControl)) {
      M.exception('La implementación usada no puede crear controles InfocoordinatesControl');
    }
    // 2. implementation of this control
    const impl = new InfocoordinatesImplControl();
    super(impl, 'Infocoordinates');
    this.map_ = null;
    this.numTabs = 0;
    this.layerFeatures = new M.layer.Vector();
    this.SELECTED_FEATURE_STYLE = new M.style.Point({
      fill: {
        color: '#71a7d3',
      }
    });
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
      const html = M.template.compileSync(template);
      // Añadir código dependiente del DOM      

      this.map_.addLayers(this.layerFeatures);
      this.panel_.on(M.evt.SHOW, this.activate, this);
      this.panel_.on(M.evt.HIDE, this.deactivate, this);

      success(html);
      html.querySelector('#m-infocoordinates-buttonRemoveAllPoints').addEventListener('click', this.removeAllPoints.bind(this));
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
  }



  addPoint(evt) {
    let numPoint = this.numTabs + 1;
    document.getElementById('m-infocoordinates-comboDatum').removeAttribute('disabled');
    document.getElementById('m-infocoordinates-buttonConversorFormat').removeAttribute('disabled');
    document.getElementById('m-infocoordinates-buttonRemovePoint').classList.remove('noDisplay');
    document.getElementsByClassName('m-infocoordinates-div-buttonRemoveAllPoints')[0].classList.remove('noDisplay');


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



    //Altura 
    let altitudeFromWCSservice;
    let altitudeBox = document.getElementById('m-infocoordinates-altitude');
    let promesa = new Promise((success, fail) => {
      altitudeBox.innerHTML = 'Consultando...';
      altitudeFromWCSservice = this.getImpl().readAltitudeFromWCSservice(coordinates, this.map_.getProjection().code)
      success(altitudeFromWCSservice);
    });

    promesa.then(response => {
      altitudeFromWCSservice = response.text.split(/\n/)[5].split(' ')[1];
      if (altitudeFromWCSservice == undefined) {
        altitudeFromWCSservice = 'Sin datos';
      }
      featurePoint.setAttribute('Altitude', altitudeFromWCSservice);
      altitudeBox.innerHTML = altitudeFromWCSservice;
      buttonTab.addEventListener('click', () => this.openTabFromTab(numPoint));
    })


    this.layerFeatures.addFeatures([featurePoint]);
    this.openTab(numPoint)
    this.numTabs = numPoint;

  }


  selectFeature(numPoint) {
    this.layerFeatures.getFeatures().map((elemento) => (elemento.clearStyle()));
    let featureSelected = this.layerFeatures.getFeatureById(numPoint);
    featureSelected.setStyle(this.SELECTED_FEATURE_STYLE);
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
    let pointDataOutput = this.getImpl().getCoordinates(featureSelected, selectSRS, formatGMS);

    // pinto 
    pointBox.innerHTML = pointDataOutput.NumPoint;
    latitudeBox.innerHTML = pointDataOutput.projectionGEO.coordinatesGEO.latitude;
    longitudeBox.innerHTML = pointDataOutput.projectionGEO.coordinatesGEO.longitude;
    zoneBox.innerHTML = pointDataOutput.projectionUTM.zone;
    coordX.innerHTML = pointDataOutput.projectionUTM.coordinatesUTM.coordX;
    coordY.innerHTML = pointDataOutput.projectionUTM.coordinatesUTM.coordY;
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
    document.getElementById('m-infocoordinates-buttonConversorFormat').setAttribute('disabled', 'disabled');
    document.getElementById('m-infocoordinates-comboDatum').setAttribute('disabled', 'disabled');


    //Elimino todas las features
    this.layerFeatures.removeFeatures((this.layerFeatures.getFeatures()));

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

}
