/**
 * @module M/control/FullTOCControl
 */

/*
eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }]
*/

import Sortable from 'sortablejs';
import FullTOCImplControl from 'impl/fulltoccontrol';
import template from '../../templates/fulltoc';
import configTemplate from '../../templates/config';
import infoTemplate from '../../templates/information';
import addServicesTemplate from '../../templates/addservices';
import resultstemplate from '../../templates/addservicesresults';
import { getValue } from './i18n/language';

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum eu nisl eget porttitor.' +
' Praesent cursus diam at aliquam mattis. Donec luctus ut mauris nec viverra. Nullam sollicitudin ullamcorper blandit.' +
' Vestibulum iaculis cursus erat vel porttitor. Pellentesque fermentum, risus vel accumsan dictum, ' +
'nisi neque interdum felis, a finibus nisi mauris blandit mauris.';

export default class FullTOCControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(http, https, precharged) {
    if (M.utils.isUndefined(FullTOCImplControl)) {
      M.exception(getValue('exception.impl'));
    }

    const impl = new FullTOCImplControl();
    super(impl, 'FullTOC');

    // facade control goes to impl as reference param
    impl.facadeControl = this;

    /**
     * Map
     * @private
     * @type {Object}
     */
    this.map_ = undefined;

    /**
     * Template
     * @private
     * @type {String}
     */
    this.template_ = undefined;

    this.http = http;

    this.https = https;

    this.precharged = precharged;

    this.stateSelectAll = false;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api
   */
  createView(map) {
    this.map_ = map;
    return new Promise((success, fail) => {
      this.getTemplateVariables(map).then((templateVars) => {
        const html = M.template.compileSync(template, {
          vars: templateVars,
        });

        this.template_ = html;
        success(html);
        this.template_.addEventListener('click', this.clickLayer.bind(this), false);
        this.template_.addEventListener('input', this.inputLayer.bind(this), false);
        this.getImpl().registerEvents();
        this.render();
      });
    });
  }

  /**
   * Sets the visibility of the clicked layer
   *
   * @public
   * @function
   * @api stable
   */
  inputLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    if (!M.utils.isNullOrEmpty(evt.target)) {
      const layerName = evt.target.getAttribute('data-layer-name');
      if (!M.utils.isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        const layer = this.map_.getLayers().filter(l => l.name === layerName)[0];
        if (evt.target.classList.contains('m-check')) {
          if (layer.transparent === true || !layer.isVisible()) {
            const opacity = evt.target.parentElement.parentElement.parentElement.parentElement.querySelector('div.tools > input');
            if (!M.utils.isNullOrEmpty(opacity)) {
              layer.setOpacity(opacity.value);
            }
            layer.setVisible(!layer.isVisible());
          }
        } else if (evt.target.classList.contains('m-fulltoc-transparency')) {
          layer.setOpacity(evt.target.value);
        }
      }
    }
  }

  /**
   * Sets the visibility of the clicked layer
   *
   * @public
   * @function
   * @api stable
   */
  clickLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    let notRender = false;
    if (!M.utils.isNullOrEmpty(evt.target)) {
      const layerName = evt.target.getAttribute('data-layer-name');
      if (!M.utils.isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        const layer = this.map_.getLayers().filter(l => l.name === layerName)[0];
        // checkbox
        if (evt.target.classList.contains('m-check')) {
          if (layer.transparent === true || !layer.isVisible()) {
            const opacity = evt.target.parentElement.parentElement.parentElement.querySelector('div.tools > input');
            if (!M.utils.isNullOrEmpty(opacity)) {
              layer.setOpacity(opacity.value);
            }
            layer.setVisible(!layer.isVisible());
          }
        } else if (evt.target.classList.contains('m-fulltoc-transparency')) {
          layer.setOpacity(evt.target.value);
        } else if (evt.target.classList.contains('m-fulltoc-remove')) {
          this.map_.removeLayers(layer);
        } else if (evt.target.classList.contains('m-fulltoc-zoom')) {
          if (layer.type === 'WMS' || layer.type === 'WMTS' || layer.type === 'WFS') {
            const extent = layer.getMaxExtent();
            this.map_.setBbox(extent);
          } else if (layer.type === 'KML') {
            const extent = layer.getImpl().getExtent();
            this.map_.setBbox(extent);
          } else if (layer.type === 'GeoJSON') {
            const extent = this.getImpl().getGeoJSONExtent(layer);
            this.map_.setBbox(extent);
          } else {
            M.dialog.info(getValue('exception.extent'), getValue('info'));
          }
        } else if (evt.target.classList.contains('m-fulltoc-legend')) {
          const legend = evt.target.parentElement.parentElement.parentElement.querySelector('.m-legend');
          if (legend.style.display === 'block') {
            legend.style.display = 'none';
          } else {
            legend.style.display = 'block';
          }
          notRender = true;
        } else if (evt.target.classList.contains('m-fulltoc-config')) {
          const config = M.template.compileSync(configTemplate, {
            jsonp: true,
            parseToHtml: false,
            vars: {
              styles: ['Estilo1', 'Estilo2'],
              translations: {
                select_style: getValue('select_style'),
                change: getValue('change'),
              },
            },
          });

          M.dialog.info(config, getValue('configure_layer'));
          setTimeout(() => {
            const selector = 'div.m-mapea-container div.m-dialog #m-fulltoc-change-config button';
            document.querySelector(selector).addEventListener('click', this.changeLayerConfig.bind(this, layer));
            document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
            const button = document.querySelector('div.m-dialog.info div.m-button > button');
            button.innerHTML = getValue('close');
            button.style.width = '75px';
            button.style.backgroundColor = '#71a7d3';
          }, 10);
        } else if (evt.target.classList.contains('m-fulltoc-info')) {
          const metadata = 'http://www.ign.es/csw-inspire/srv/spa/csw?SERVICE=CSW&VERSION=2.0.2&REQUEST=GetRecordById&outputSchema=http://www.isotc211.org/2005/gmd&ElementSetName=full&ID=spaignHIDROGRAFIA_IGR';
          const vars = {
            name: layer.name,
            title: layer.legend,
            abstract: LOREM,
            provider: LOREM,
            translations: {
              title: getValue('title'),
              name: getValue('name'),
              abstract: getValue('abstract'),
              provider: getValue('provider'),
              query_metadata: getValue('query_metadata'),
              download_center: getValue('download_center'),
            },
          };

          if (!M.utils.isNullOrEmpty(metadata) && M.utils.isUrl(metadata)) {
            vars.metadata = metadata;
            M.remote.get(metadata).then((response) => {
              const unfiltered = response.text.split('<gmd:URL>').filter((elem) => {
                return elem.indexOf('centrodedescargas') > -1;
              });

              if (unfiltered.length > 0) {
                const downloadCenter = unfiltered[0].split('</gmd:URL>')[0].trim();
                vars.downloadCenter = downloadCenter;
              }

              this.renderInfo(vars);
            }).catch(() => {
              this.renderInfo(vars);
            });
          } else {
            this.renderInfo(vars);
          }
        }
      } else if (evt.target.classList.contains('m-fulltoc-addservice')) {
        const addServices = M.template.compileSync(addServicesTemplate, {
          jsonp: true,
          parseToHtml: false,
          vars: {
            precharged: this.precharged,
            translations: {
              url_service: getValue('url_service'),
              query: getValue('query'),
              loaded_services: getValue('loaded_services'),
              clean: getValue('clean'),
              availables: getValue('availables'),
            },
          },
        });

        M.dialog.info(addServices, getValue('load_ext_services'));
        setTimeout(() => {
          document.querySelector('#m-fulltoc-addservices-search-btn').addEventListener('click', e => this.readCapabilities(e));
          document.querySelector('#m-fulltoc-addservices-clear-btn').addEventListener('click', e => this.removeContains(e));
          document.querySelector('#m-fulltoc-addservices-list-btn').addEventListener('click', e => this.showSuggestions(e));
          document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
          const button = document.querySelector('div.m-dialog.info div.m-button > button');
          button.innerHTML = getValue('close');
          button.style.width = '75px';
          button.style.backgroundColor = '#71a7d3';
          document.querySelectorAll('.m-fulltoc-suggestion-caret').forEach((elem) => {
            elem.addEventListener('click', () => {
              elem.parentElement.querySelector('.m-fulltoc-suggestion-group').classList.toggle('active');
              elem.classList.toggle('m-fulltoc-suggestion-caret-close');
            });
          });
          document.querySelectorAll('#m-fulltoc-addservices-suggestions .m-fulltoc-suggestion').forEach((elem) => {
            elem.addEventListener('click', e => this.loadSuggestion(e));
          });
        }, 10);
      }
    }

    if (!notRender) {
      this.render();
    }
  }

  renderInfo(vars) {
    const info = M.template.compileSync(infoTemplate, {
      jsonp: true,
      parseToHtml: false,
      vars,
    });

    M.dialog.info(info, getValue('info'));
    setTimeout(() => {
      document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
      const button = document.querySelector('div.m-dialog.info div.m-button > button');
      button.innerHTML = getValue('close');
      button.style.width = '75px';
      button.style.backgroundColor = '#71a7d3';
    }, 10);
  }

  showSuggestions() {
    document.querySelector('#m-fulltoc-addservices-results').innerHTML = '';
    document.querySelector('#m-fulltoc-addservices-suggestions').style.display = 'block';
  }

  loadSuggestion(evt) {
    const url = evt.target.getAttribute('data-link');
    const serviceType = evt.target.getAttribute('data-service-type');
    document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').value = url;
    if (serviceType === 'WMTS') {
      document.getElementById('m-fulltoc-addservices-wmts').checked = true;
      document.getElementById('m-fulltoc-addservices-wms').checked = false;
    } else {
      document.getElementById('m-fulltoc-addservices-wms').checked = true;
      document.getElementById('m-fulltoc-addservices-wmts').checked = false;
    }

    this.readCapabilities(evt);
  }

  changeLayerConfig(layer) {
    document.querySelector('div.m-mapea-container div.m-dialog').remove();
  }

  /**
   * @function
   * @public
   * @api
   */
  getTemplateVariables(map) {
    return new Promise((success, fail) => {
      // gets base layers and overlay layers
      if (!M.utils.isNullOrEmpty(map)) {
        const overlayLayers = map.getRootLayers().filter((layer) => {
          const isTransparent = (layer.transparent === true);
          const displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
          const isNotWMC = (layer.type !== M.layer.type.WMC);
          const isNotWMSFull = !((layer.type === M.layer.type.WMS) &&
          M.utils.isNullOrEmpty(layer.name));
          const isDraw = layer.type === 'Vector' && layer.name === 'selectLayer';
          return (isTransparent && isNotWMC && isNotWMSFull && displayInLayerSwitcher && !isDraw);
        }).reverse();

        const overlayLayersPromise = Promise.all(overlayLayers.map(this.parseLayerForTemplate_));
        overlayLayersPromise.then(parsedOverlayLayers => success({
          layers: overlayLayers,
          overlayLayers: parsedOverlayLayers,
          translations: {
            layers: getValue('layers'),
            add_service: getValue('add_service'),
            show_hide: getValue('show_hide'),
            zoom: getValue('zoom'),
            info_metadata: getValue('info_metadata'),
            change_style: getValue('change_style'),
            remove_layer: getValue('remove_layer'),
          },
        }));
      }
    });
  }

  /**
   * @function
   * @public
   * @api
   */
  render() {
    this.getTemplateVariables(this.map_).then((templateVars) => {
      const html = M.template.compileSync(template, {
        vars: templateVars,
      });

      this.registerImgErrorEvents_(html);
      this.template_.innerHTML = html.innerHTML;
      // document.querySelector('.m-fulltoc-container .m-title .span-title').click();
      const layerList = document.querySelector('.m-fulltoc-container .m-layers');
      const layers = templateVars.layers;
      Sortable.create(layerList, {
        animation: 150,
        ghostClass: 'm-fulltoc-gray-shadow',
        onEnd: (evt) => {
          const from = evt.from;
          let maxZIndex = Math.max(...(layers.map((l) => {
            return l.getZIndex();
          })));
          from.querySelectorAll('li.m-layer div.m-visible-control span').forEach((elem) => {
            const name = elem.getAttribute('data-layer-name');
            const filtered = layers.filter((layer) => {
              return layer.name === name;
            });

            if (filtered.length > 0) {
              filtered[0].setZIndex(maxZIndex);
              maxZIndex -= 1;
            }
          });
        },
      });
    });
  }

  registerImgErrorEvents_(html) {
    const imgElements = html.querySelectorAll('img');
    Array.prototype.forEach.call(imgElements, (imgElem) => {
      imgElem.addEventListener('error', (evt) => {
        const layerName = evt.target.getAttribute('data-layer-name');
        const legendErrorUrl = M.utils.concatUrlPaths([M.config.THEME_URL,
          M.layer.WMS.LEGEND_ERROR]);
        const layer = this.map_.getLayers().filter(l => l.name === layerName)[0];
        if (!M.utils.isNullOrEmpty(layer)) {
          layer.setLegendURL(legendErrorUrl);
        }
      });
    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api
   */
  activate() {
    super.activate();
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api
   */
  deactivate() {
    super.deactivate();
  }
  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api
   */
  getActivationButton(html) {
    return html.querySelector('.m-fulltoc button');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api
   */
  equals(control) {
    return control instanceof FullTOCControl;
  }

  /**
   *
   *
   * @private
   * @function
   */
  parseLayerForTemplate_(layer) {
    const layerTitle = layer.legend || layer.name;
    let isIcon = false;
    if (layer instanceof M.layer.Vector) {
      const style = layer.getStyle();
      if (style instanceof M.style.Point && !M.utils.isNullOrEmpty(style.get('icon.src'))) {
        isIcon = true;
      }
    }

    return new Promise((success, fail) => {
      const layerVarTemplate = {
        visible: (layer.isVisible() === true),
        id: layer.name,
        title: layerTitle,
        outOfRange: !layer.inRange(),
        opacity: layer.getOpacity(),
        // metadata: !M.utils.isNullOrEmpty(layer.getImpl().options.metadataUrl),
        type: layer.type,
        isIcon,
      };
      const legendUrl = layer.getLegendURL();
      if (legendUrl instanceof Promise) {
        legendUrl.then((url) => {
          layerVarTemplate.legend = url;
          success(layerVarTemplate);
        });
      } else {
        layerVarTemplate.legend = layer.type !== 'KML' ? legendUrl : null;
        success(layerVarTemplate);
      }
    });
  }

  getCapabilitiesWFS_(url) {
    const layerUrl = url.replace('wfs?', 'wms?');
    const projection = this.map_.getProjection();
    const getCapabilitiesPromise = new Promise((success, fail) => {
      const wmsGetCapabilitiesUrl = M.utils.getWMSGetCapabilitiesUrl(layerUrl, '1.1.0');
      M.remote.get(wmsGetCapabilitiesUrl).then((response) => {
        const gcDoc = response.xml;
        const gcParser = new M.impl.format.WMSCapabilities();
        const gc = gcParser.read(gcDoc);
        const gcUtils = new M.impl.GetCapabilities(gc, layerUrl, projection);
        success(gcUtils);
      });
    });

    return getCapabilitiesPromise;
  }

  /**
   * This function reads service capabilities
   *
   * @function
   * @private
   * @param {Event} evt - Click event
   */
  readCapabilities(evt) {
    evt.preventDefault();
    let HTTPeval = false;
    let HTTPSeval = false;
    document.querySelector('#m-fulltoc-addservices-suggestions').style.display = 'none';
    const url = document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').value.trim();
    const type = document.getElementById('m-fulltoc-addservices-wmts').checked ? 'WMTS' : 'WMS';
    if (!M.utils.isNullOrEmpty(url)) {
      if (M.utils.isUrl(url)) {
        if (this.http && !this.https) {
          const expReg = /^(http:)/;
          HTTPeval = expReg.test(url);
        } else if (this.https && !this.http) {
          const expReg = /^(https:)/;
          HTTPSeval = expReg.test(url);
        } else if (this.http && this.https) {
          HTTPeval = true;
          HTTPSeval = true;
        }

        if (HTTPeval === true || HTTPSeval === true) {
          if (type === 'WMTS') {
            M.remote.get(M.utils.getWMTSGetCapabilitiesUrl(url)).then((response) => {
              try {
                const getCapabilitiesParser = new M.impl.format.WMTSCapabilities();
                const getCapabilities = getCapabilitiesParser.read(response.xml);
                const layers = M.impl.util.wmtscapabilities.getLayers(
                  getCapabilities.capabilities,
                  url,
                  this.map_.getProjection().code,
                );

                this.capabilities = this.filterResults(layers);
                this.showResults();
              } catch (err) {
                M.dialog.error(getValue('exception.capabilities'));
              }
            });
          } else {
            M.remote.get(M.utils.getWMSGetCapabilitiesUrl(url)).then((response) => {
              try {
                const getCapabilitiesParser = new M.impl.format.WMSCapabilities();
                const getCapabilities = getCapabilitiesParser.read(response.xml);
                const getCapabilitiesUtils = new M.impl.GetCapabilities(
                  getCapabilities,
                  url,
                  this.map_.getProjection().code,
                );
                this.capabilities = this.filterResults(getCapabilitiesUtils.getLayers());
                this.showResults();
              } catch (err) {
                M.dialog.error(getValue('exception.capabilities'));
              }
            });
          }
        } else {
          let errorMsg;
          if (this.http) {
            errorMsg = getValue('exception.only_http');
          } else if (this.https) {
            errorMsg = getValue('exception.only_https');
          } else if (!this.http && !this.https) {
            errorMsg = getValue('exception.no_http_https');
          }
          M.dialog.error(errorMsg);
        }
      } else {
        M.dialog.error(getValue('exception.valid_url'));
      }
    } else {
      M.dialog.error(getValue('exception.empty'));
    }
  }

  filterResults(allLayers) {
    const layers = [];
    const layerNames = [];
    let allServices = [];
    if (this.precharged.services !== undefined && this.precharged.services.length > 0) {
      allServices = allServices.concat(this.precharged.services);
    }

    if (this.precharged.groups !== undefined && this.precharged.groups.length > 0) {
      this.precharged.groups.forEach((group) => {
        if (group.services !== undefined && group.services.length > 0) {
          allServices = allServices.concat(group.services);
        }
      });
    }

    allLayers.forEach((layer) => {
      let insideService = false;
      allServices.forEach((service) => {
        if (service.type === layer.type && service.url === layer.url) {
          if (service.white_list !== undefined && service.white_list.length > 0 &&
            service.white_list.indexOf(layer.name) > -1 && layerNames.indexOf(layer.name) === -1) {
            layers.push(layer);
            layerNames.push(layer.name);
          } else if (service.white_list === undefined && layerNames.indexOf(layer.name) === -1) {
            layers.push(layer);
            layerNames.push(layer.name);
          }

          insideService = true;
        }
      });

      if (!insideService) {
        layers.push(layer);
        layerNames.push(layer.name);
      }
    });

    return layers;
  }

  /**
   * This function shows results
   *
   * @function
   * @private
   */
  showResults() {
    const result = [];
    this.capabilities.forEach((capability) => {
      result.push(capability.getImpl());
    });

    const container = document.querySelector('#m-fulltoc-addservices-results');
    if (result.length > 0) {
      const html = M.template.compileSync(resultstemplate, {
        vars: {
          result,
          translations: {
            layers: getValue('layers'),
            add: getValue('add'),
          },
        },
      });


      container.innerHTML = html.innerHTML;
      M.utils.enableTouchScroll(container);
      const results = container.querySelectorAll('span.m-check-fulltoc-addservices');
      for (let i = 0; i < results.length; i += 1) {
        results[i].addEventListener('click', evt => this.registerCheck(evt));
      }

      container.querySelector('#m-fulltoc-addservices-selectall').addEventListener('click', evt => this.registerCheck(evt));
      container.querySelector('.m-fulltoc-addservices-add').addEventListener('click', evt => this.addLayers(evt));
    } else {
      container.innerHTML = `<p class="m-fulltoc-noresults">${getValue('exception.no_results')}</p>`;
    }
  }

  /**
   * This function registers the marks or unmarks check and click allselect
   *
   * @function
   * @private
   * @param {Event} evt - Event
   */
  registerCheck(evt) {
    const e = (evt || window.event);
    if (!M.utils.isNullOrEmpty(e.target) && e.target.classList.contains('m-check-fulltoc-addservices')) {
      const container = document.querySelector('#m-fulltoc-addservices-results');
      let numNotChecked = container.querySelectorAll('.m-check-fulltoc-addservices.icon-check').length;
      numNotChecked += (e.target.classList.contains('icon-check') ? -1 : 1);
      e.stopPropagation();
      e.target.classList.toggle('icon-check');
      e.target.classList.toggle('icon-check-seleccionado');
      if (numNotChecked > 0) {
        this.stateSelectAll = false;
        document.querySelector('#m-fulltoc-addservices-selectall').classList.remove('icon-check-seleccionado');
        document.querySelector('#m-fulltoc-addservices-selectall').classList.add('icon-check');
      } else if (numNotChecked === 0) {
        this.stateSelectAll = true;
        document.querySelector('#m-fulltoc-addservices-selectall').classList.remove('icon-check');
        document.querySelector('#m-fulltoc-addservices-selectall').classList.add('icon-check-seleccionado');
      }
    } else if (!M.utils.isNullOrEmpty(e.target) && e.target.id === 'm-fulltoc-addservices-selectall') {
      if (this.stateSelectAll) {
        e.target.classList.remove('icon-check-seleccionado');
        e.target.classList.add('icon-check');
        this.unSelect();
        this.stateSelectAll = false;
      } else {
        e.target.classList.remove('icon-check');
        e.target.classList.add('icon-check-seleccionado');
        this.select();
        this.stateSelectAll = true;
      }
    }
  }

  /**
   * This function unselects checkboxs
   *
   * @function
   * @private
   */
  unSelect() {
    const unSelect = document.querySelectorAll('#m-fulltoc-addservices-results .icon-check-seleccionado');
    for (let i = 0; i < unSelect.length; i += 1) {
      unSelect[i].classList.remove('icon-check-seleccionado');
      unSelect[i].classList.add('icon-check');
    }
  }

  /**
   * This function selects checkboxs
   *
   * @function
   * @private
   */
  select() {
    const select = document.querySelectorAll('#m-fulltoc-addservices-results .icon-check');
    for (let i = 0; i < select.length; i += 1) {
      select[i].classList.remove('icon-check');
      select[i].classList.add('icon-check-seleccionado');
    }
  }

  /**
   * This function adds layers
   *
   * @function
   * @param {Event} evt - Event
   * @private
   */
  addLayers(evt) {
    evt.preventDefault();
    const layers = [];
    const elmSel = document.querySelectorAll('#m-fulltoc-addservices-results .icon-check-seleccionado');
    if (elmSel.length === 0) {
      M.dialog.error(getValue('exception.select_layer'));
    } else {
      for (let i = 0; i < elmSel.length; i += 1) {
        for (let j = 0; j < this.capabilities.length; j += 1) {
          if (elmSel[i].id === this.capabilities[j].name) {
            this.capabilities[j].options.origen = this.capabilities[j].type;
            layers.push(this.capabilities[j]);
          }
        }
      }
      this.map_.addLayers(layers);
    }
  }

  /**
   * This function remove results show
   *
   * @function
   * @param {goog.events.BrowserEvent} evt - Event
   * @private
   */
  removeContains(evt) {
    evt.preventDefault();
    document.querySelector('#m-fulltoc-addservices-results').innerHTML = '';
    document.querySelector('#m-fulltoc-addservices-suggestions').style.display = 'none';
  }
}
