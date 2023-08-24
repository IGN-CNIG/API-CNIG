/* eslint-disable no-param-reassign */
/**
 * @module M/control/LayerswitcherControl
 */

import Sortable from 'sortablejs';

import LayerswitcherImplControl from 'impl/layerswitchercontrol';
import template from '../../templates/layerswitcher';
import { getValue } from './i18n/language';
import infoTemplate from '../../templates/information';
import configTemplate from '../../templates/config';

export default class LayerswitcherControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(options = {}) {
    if (M.utils.isUndefined(LayerswitcherImplControl)) {
      M.exception(getValue('exception.impl'));
    }

    const impl = new LayerswitcherImplControl();
    super(impl, 'Layerswitcher');

    // Fachada del control
    impl.facadeControl = this;

    /**
     * Mapa
     * @private
     * @type {M.Map}
     */
    this.map_ = undefined;

    /**
     * Plantilla del control
     * @private
     * @type {String}
     */
    this.template_ = undefined;

    /**
     * Determina si el plugin es draggable o no
     * @private
     * @type {Boolean}
     */
    this.isDraggable_ = options.isDraggable;

    /**
     * Determina el orden de visualización de las capas
     * @private
     * @type {Boolean}
     */
    this.reverse = options.reverse;

    /**
     * Determina el modo de selección de las capas
     * @private
     * @type {Boolean}
     */
    this.modeSelectLayers = options.modeSelectLayers;

    /**
     * Determina si se ha seleccionado una capa mediante radio
     * @private
     * @type {Boolean}
     */
    this.isCheckedLayerRadio = false;

    /**
     * Listado de capas overlays
     * @private
     * @type {Boolean}
     */
    this.overlayLayers = [];

    /**
     * Determina si se van a mostrar o si se van a ocultar todas las capas
     * @private
     * @type {Boolean}
     */
    this.statusShowHideAllLayers = true;

    /**
     * Herramientas para mostrar en las capas
     * @public
     * @type {Array}
     */
    this.tools = options.tools;

    /**
     * Añadir control transparencia
     * @public
     * @type {Boolean}
     */
    this.isTransparency = false;

    /**
     * Añadir control leyenda
     * @public
     * @type {Boolean}
     */
    this.isLegend = false;

    /**
     * Añadir control zoom
     * @public
     * @type {Boolean}
     */
    this.isZoom = false;

    /**
     * Añadir control informacion
     * @public
     * @type {Boolean}
     */
    this.isInformation = false;

    /**
     * Añadir control eliminar
     * @public
     * @type {Boolean}
     */
    this.isStyle = false;

    /**
     * Añadir control eliminar
     * @public
     * @type {Boolean}
     */
    this.isDelete = false;

    /**
     * Permite saber si se permite movimiento de capas
     * @public
     * @type {boolean}
     */
    this.isMoveLayers = options.isMoveLayers;

    /**
     * Permite saber si el plugin está colapsado o no
     * @private
     * @type {boolean}
     */
    this.collapsed = options.collapsed;
  }

  /**
   * Esta función busca la capa
   *
   * @public
   * @function
   * @param {Event} evtParameter evento que se produce cuando se cambia el valor de la opacidad
   * @api
   */
  findLayer(evt) {
    const layerName = evt.target.getAttribute('data-layer-name');
    const layerURL = evt.target.getAttribute('data-layer-url');
    const layerType = evt.target.getAttribute('data-layer-type');
    let result = [];
    if (!M.utils.isNullOrEmpty(layerName) && !M.utils.isNullOrEmpty(layerURL) &&
      !M.utils.isNullOrEmpty(layerType)) {
      result = this.overlayLayers.filter((l) => {
        return l.name === layerName && l.url === layerURL && l.type === layerType;
      });
    }

    if (layerName === 'osm' && layerType === 'OSM') {
      result = this.overlayLayers.filter((l) => {
        return l.name === layerName && l.type === layerType;
      });
    }

    return result;
  }

  /**
   * Esta función crea la vista
   *
   * @public
   * @function
   * @param {M.Map} map mapa donde se añade el plugin
   * @api
   */
  createView(map) {
    this.map_ = map;
    this.tools.forEach((tool) => {
      if (tool === 'transparency') {
        this.isTransparency = true;
      }
      if (tool === 'legend') {
        this.isLegend = true;
      }
      if (tool === 'zoom') {
        this.isZoom = true;
      }
      if (tool === 'information') {
        this.isInformation = true;
      }
      if (tool === 'style') {
        this.isStyle = true;
      }
      if (tool === 'delete') {
        this.isDelete = true;
      }
    });

    return new Promise((success, fail) => {
      this.getTemplateVariables(map).then((templateVars) => {
        const html = M.template.compileSync(template, {
          vars: templateVars,
        });

        if (this.isDraggable_) {
          M.utils.draggabillyPlugin(this.getPanel(), '#m-layerswitcher-title');
        }

        this.template_ = html;

        this.template_.addEventListener('click', this.clickLayer.bind(this), false);
        this.template_.addEventListener('input', this.inputLayer.bind(this), false);

        this.getPanel().getButtonPanel().addEventListener('click', (e) => {
          if (!e.target.parentElement.classList.contains('collapsed')) {
            this.render();

            if (this.isDraggable_) {
              M.utils.draggabillyPlugin(this.getPanel(), '#m-layerswitcher-title');
            }

            this.getImpl().registerEvent(map);
          } else {
            this.getImpl().removeRenderComplete();
          }
        }, false);

        if (this.collapsed === false) {
          this.getImpl().registerEvent(map);
        }

        // Se llama en el evento de registerEvent
        // this.render();
        success(this.template_);
      });
    });
  }

  /**
   * Esta función renderiza la plantilla
   *
   * @public
   * @function
   * @api
   */
  render() {
    this.getTemplateVariables(this.map_).then((templateVars) => {
      const html = M.template.compileSync(template, {
        vars: templateVars,
      });
      this.template_.innerHTML = html.innerHTML;
      // si el modo de selección es radio y no se ha seleccionado ninguna capa se marca la primera
      if (this.modeSelectLayers === 'radio' && this.isCheckedLayerRadio === false) {
        const radioButtons = this.template_.querySelectorAll('input[type=radio]');
        if (radioButtons.length > 0) {
          this.isCheckedLayerRadio = true;
          radioButtons[0].click();
        }
      }

      const layerList = this.template_.querySelector('.m-layerswitcher-ullayers');
      if (layerList !== null && this.isMoveLayers) {
        Sortable.create(layerList, {
          animation: 150,
          ghostClass: 'm-fulltoc-gray-shadow',
        });
      }
    });
  }

  /**
   * Esta función devuelve las variables para la plantilla
   *
   * @public
   * @function
   * @api
   */
  getTemplateVariables(map) {
    return new Promise((success, fail) => {
      // gets base layers and overlay layers
      if (!M.utils.isNullOrEmpty(map)) {
        this.overlayLayers = map.getRootLayers().filter((layer) => {
          const isTransparent = (layer.transparent === true);
          const displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
          return isTransparent && displayInLayerSwitcher;
        });

        this.overlayLayers = this.reorderLayers(this.overlayLayers);

        const overlayLayersPromise =
          Promise.all(this.overlayLayers.map(this.parseLayerForTemplate_.bind(this)));
        overlayLayersPromise.then((parsedOverlayLayers) => {
          success({
            overlayLayers: parsedOverlayLayers,
            translations: {
              layers: getValue('layers'),
              show_hide: getValue('show_hide'),
              zoom: getValue('zoom'),
              info_metadata: getValue('info_metadata'),
              remove_layer: getValue('remove_layer'),
              change_style: getValue('change_style'),
            },
            allVisible: !this.statusShowHideAllLayers,
            isRadio: this.modeSelectLayers === 'radio',
            isEyes: this.modeSelectLayers === 'eyes',
            isTransparency: this.isTransparency,
            isLegend: this.isLegend,
            isZoom: this.isZoom,
            isInformation: this.isInformation,
            isStyle: this.isStyle,
            isDelete: this.isDelete,
          });
        });
      }
    });
  }

  /**
   * Esta función detecta cuando se hace click en la plantilla
   *
   * @public
   * @function
   * @api
   */
  clickLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    const layerName = evt.target.getAttribute('data-layer-name');
    const layerURL = evt.target.getAttribute('data-layer-url');
    const layerType = evt.target.getAttribute('data-layer-type');
    const selectLayer = evt.target.getAttribute('data-select-type');

    if (evt.target.id === 'm-layerswitcher-hsalllayers') {
      this.showHideAllLayers();
    } else if (!M.utils.isNullOrEmpty(layerName) && !M.utils.isNullOrEmpty(layerURL) &&
      !M.utils.isNullOrEmpty(layerType)) {
      let layer = this.findLayer(evt);
      if (layer.length > 0) {
        layer = layer[0];
        if (evt.target.className.indexOf('m-layerswitcher-check') > -1 && selectLayer === 'eye') {
          // show hide layer
          if (evt.target.classList.contains('m-layerswitcher-check')) {
            if (layer.transparent === true || !layer.isVisible()) {
              layer.setVisible(!layer.isVisible());
            }
          }
        } else if (evt.target.className.indexOf('m-layerswitcher-check') > -1 && selectLayer === 'radio') {
          this.overlayLayers.forEach((l) => {
            if (l.name === layerName && l.url === layerURL && l.type === layerType) {
              l.checkedLayer = 'true';
              l.setVisible(true);
            } else {
              l.checkedLayer = 'false';
              l.setVisible(false);
            }
          });
        } else if (evt.target.className.indexOf('m-layerswitcher-icons-image') > -1) {
          const legend = evt.target.parentElement.parentElement.parentElement.querySelector('.m-layerswitcher-legend');
          const legendUrl = layer.getLegendURL();
          if (legendUrl instanceof Promise) {
            legendUrl.then((url) => {
              legend.querySelector('img').src = url;
            });
          } else {
            legend.querySelector('img').src = legendUrl;
          }
          if (legend.style.display === 'block') {
            legend.style.display = 'none';
          } else {
            legend.style.display = 'block';
          }
        } else if (evt.target.className.indexOf('m-layerswitcher-icons-target') > -1) {
          if (layerType === 'WMS' || layerType === 'WMTS' || layerType === 'WFS') {
            const extent = layer.getMaxExtent();
            this.map_.setBbox(extent);
          } else if (layerType === 'KML') {
            const extent = layer.getImpl().getExtent();
            this.map_.setBbox(extent);
          } else if (layerType === 'GeoJSON') {
            const extent = this.getImpl().getGeoJSONExtent(layer);
            this.map_.setBbox(extent);
          } else if (layerType === 'OGCAPIFeatures') {
            const extent = layer.getFeaturesExtent();
            this.map_.setBbox(extent);
          } else {
            M.dialog.info(getValue('exception.extent'), getValue('info'), this.order);
          }
        } else if (evt.target.className.indexOf('m-layerswitcher-icons-info') > -1) {
          const vars = {
            name: layer.name, // nombre
            title: layer.legend, // titulo
            abstract: layer.capabilitiesMetadata.abstract, // resumen
            translations: {
              title: getValue('title'),
              name: getValue('name'),
              abstract: getValue('abstract'),
              provider: getValue('provider'),
              service_info: getValue('service_info'),
              download_center: getValue('download_center'),
              see_more: getValue('see_more'),
              metadata_abstract: getValue('metadata_abstract'),
              responsible: getValue('responsible'),
              access_constraints: getValue('access_constraints'),
              use_constraints: getValue('use_constraints'),
              online_resources: getValue('online_resources'),
              see_more_layer: getValue('see_more_layer'),
              see_more_service: getValue('see_more_service'),
              metadata: getValue('metadata'),
            },
          };

          vars.capabilities = this.addCapabilitiesInformation(layer);
          if (layer.capabilitiesMetadata.metadataURL) {
            vars.metadata = layer.capabilitiesMetadata.metadataURL[0].OnlineResource;
          }
          vars.provider = this.informationProvider(layer);

          M.remote.get(vars.capabilities).then((response) => {
            const source = response.text;
            const urlService = source.split('<inspire_common:URL>')[1].split('<')[0].split('&amp;').join('&');
            if (!M.utils.isNullOrEmpty(urlService) && M.utils.isUrl(urlService)) {
              vars.metadata_service = urlService;
              vars.hasMetadata = true;
            }

            if (M.utils.isNullOrEmpty(vars.metadata) || !M.utils.isUrl(vars.metadata)) {
              if (vars.metadata_service !== undefined) {
                this.infoDownloadCenter(vars.metadata_service, vars);
              } else {
                this.renderInfo(vars);
              }
            } else {
              vars.hasMetadata = true;
              this.infoDownloadCenter(vars.metadata, vars);
            }
          }).catch((err) => {
            this.renderInfo(vars);
          });
        } else if (evt.target.className.indexOf('m-layerswitcher-icons-style') > -1) {
          let otherStyles = [];
          if (!M.utils.isUndefined(layer.capabilitiesMetadata) &&
            !M.utils.isUndefined(layer.capabilitiesMetadata.style)) {
            otherStyles = layer.capabilitiesMetadata.style;
          }
          const config = M.template.compileSync(configTemplate, {
            jsonp: true,
            parseToHtml: false,
            vars: {
              styles: otherStyles,
              translations: {
                select_style: getValue('select_style'),
                change: getValue('change'),
                style: getValue('style'),
                default_style: getValue('default_style'),
                selected: getValue('selected'),
              },
            },
          });

          M.dialog.info(config, getValue('configure_layer'));
          setTimeout(() => {
            const selector = '#m-layerswitcher-style button';
            document.querySelector(selector).addEventListener('click', this.changeLayerConfig.bind(this, layer, otherStyles));
            document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
            const button = document.querySelector('div.m-dialog.info div.m-button > button');
            button.innerHTML = getValue('close');
            button.style.width = '75px';
            button.style.backgroundColor = '#71a7d3';
          }, 10);
        } else if (evt.target.className.indexOf('m-layerswitcher-icons-delete') > -1) {
          this.map_.removeLayers(layer);
        }
      }
    }
    evt.stopPropagation();
  }

  changeLayerConfig(layer) {
    const styleSelected = document.querySelector('#m-layerswitcher-style-select').value;
    if (styleSelected !== '') {
      layer.getImpl().getOL3Layer().getSource().updateParams({ STYLES: styleSelected });
      document.querySelector('div.m-mapea-container div.m-dialog').remove();
      const cm = layer.capabilitiesMetadata;
      if (!M.utils.isNullOrEmpty(cm) && !M.utils.isNullOrEmpty(cm.style)) {
        const filtered = layer.capabilitiesMetadata.style.filter((style) => {
          return style.Name === styleSelected;
        });

        if (filtered.length > 0 && filtered[0].LegendURL.length > 0) {
          const newURL = filtered[0].LegendURL[0].OnlineResource;
          layer.setLegendURL(newURL);
        }
      }
    }
  }

  informationProvider(layer) {
    if (M.utils.isNullOrEmpty(layer.capabilitiesMetadata.attribution)) {
      return false;
    }
    let provider = '';

    if (layer.type === 'WMS') {
      provider = `${layer.capabilitiesMetadata.attribution.Title}`;
      if (layer.capabilitiesMetadata.attribution.OnlineResource !== undefined) {
        provider += `<p><a class="m-layerswitcher-provider-link" href="${layer.capabilitiesMetadata.attribution.OnlineResource}" target="_blank">${layer.capabilitiesMetadata.attribution.OnlineResource}</a></p>`;
      }
    }
    if (layer.type === 'WMTS') {
      provider = `${layer.capabilitiesMetadata.attribution.ProviderName}` +
        `<p><a class="m-layerswitcher-provider-link" href="${layer.capabilitiesMetadata.attribution.ProviderSite}" target="_blank">${layer.capabilitiesMetadata.attribution.ProviderSite}</a></p>`;
      const sc = layer.capabilitiesMetadata.attribution.ServiceContact;
      if (!M.utils.isNullOrEmpty(sc) && !M.utils.isNullOrEmpty(sc.ContactInfo)) {
        const mail = sc.ContactInfo.Address.ElectronicMailAddress;
        provider += `<p><a class="m-layerswitcher-provider-link" href="mailto:${mail}">${mail}</a></p>`;
      }
    }

    return provider;
  }

  addCapabilitiesInformation(layer) {
    if (layer.type === 'WMS') {
      return M.utils.getWMSGetCapabilitiesUrl(layer.url, layer.version);
    }

    if (layer.type === 'WMTS') {
      return M.utils.getWMTSGetCapabilitiesUrl(layer.url);
    }
    return false;
  }

  infoDownloadCenter(url, vars) {
    M.remote.get(url).then((response) => {
      const metadataText = response.text;
      const unfiltered = metadataText.split('<gmd:MD_DigitalTransferOptions>')[1].split('<gmd:URL>').filter((elem) => {
        return elem.indexOf('centrodedescargas') > -1 && elem.indexOf('atom') === -1;
      });

      if (unfiltered.length > 0) {
        const downloadCenter = unfiltered[0].split('</gmd:URL>')[0].trim();
        vars.downloadCenter = downloadCenter;
      }

      this.renderInfo(vars);
    }).catch((err) => {
      this.renderInfo(vars);
    });
  }

  /**
   * Esta función ordena todas las capas
   *
   * @public
   * @param {Array<M.Layer>} layers listado de capas para ordenar
   * @function
   * @api
   */
  reorderLayers(layers) {
    const result = layers.sort((layer1, layer2) => layer1.getZIndex() - layer2.getZIndex());
    if (this.reverse) {
      result.reverse();
    }
    return result;
  }

  /**
   * Esta función monta objeto con propiedades de la capa para la plantilla
   *
   * @public
   * @param {M.Layer} layer capa para parsear
   * @function
   * @api
   */
  parseLayerForTemplate_(layer) {
    const layerTitle = layer.legend || layer.name;
    const hasMetadata = !M.utils.isNullOrEmpty(layer.capabilitiesMetadata) &&
      !M.utils.isNullOrEmpty(layer.capabilitiesMetadata.abstract);
    return new Promise((success) => {
      const layerVarTemplate = {
        title: layerTitle,
        type: layer.type,
        visible: (layer.isVisible() === true),
        id: layer.name,
        url: layer.url,
        outOfRange: !layer.inRange(),
        checkedLayer: layer.checkedLayer || 'false',
        opacity: layer.getOpacity(),
        metadata: hasMetadata,
        hasStyles: hasMetadata && layer.capabilitiesMetadata.style.length > 1,
      };
      success(layerVarTemplate);
    });
  }

  /**
   * Esta función gestiona el control de la opacidad de las capas
   *
   * @public
   * @function
   * @param {Event} evtParameter evento que se produce cuando se cambia el valor de la opacidad
   * @api
   */
  inputLayer(evtParameter) {
    clearTimeout(this.inputLayerTimeID);
    this.getImpl().removeRenderComplete();

    const evt = (evtParameter || window.event);
    if (!M.utils.isNullOrEmpty(evt.target)) {
      const layer = this.findLayer(evt);
      if (layer.length > 0) {
        evt.stopPropagation();
        layer[0].setOpacity(evt.target.value);
      }
    }

    this.inputLayerTimeID = setTimeout(() => {
      this.getImpl().registerEvent(this.map_);
    }, 500);
  }

  /**
   * Esta función muestra/oculta todas las capas
   *
   * @public
   * @function
   * @param {Event} evtParameter evento que se produce cuando se cambia el valor de la opacidad
   * @api
   */
  showHideAllLayers() {
    this.statusShowHideAllLayers = !this.statusShowHideAllLayers;
    this.overlayLayers.forEach((layer) => {
      layer.setVisible(this.statusShowHideAllLayers);
    });
  }

  /**
   * Esta función compila la plantilla de información
   * @public
   * @function
   * @param {Object} vars variables para la plantilla
   * @api
   */
  renderInfo(vars) {
    const info = M.template.compileSync(infoTemplate, {
      jsonp: false,
      parseToHtml: false,
      vars,
    });

    M.dialog.info(info, getValue('layer_info'), this.order);
    setTimeout(() => {
      document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
      const button = document.querySelector('div.m-dialog.info div.m-button > button');
      button.innerHTML = getValue('close');
      button.style.width = '75px';
      button.style.backgroundColor = '#71a7d3';
    }, 10);
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
    return control instanceof LayerswitcherControl;
  }
}
