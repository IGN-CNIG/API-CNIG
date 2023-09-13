/* eslint-disable no-param-reassign */
/**
 * @module M/control/LayerswitcherControl
 */

import Sortable from 'sortablejs';

import LayerswitcherImplControl from 'impl/layerswitchercontrol';
import template from '../../templates/layerswitcher';
import templateAux from '../../templates/layerswitchercontent';
import { getValue } from './i18n/language';
import infoTemplate from '../../templates/information';
import infoTemplateOGC from '../../templates/informationogc';
import infoTemplateOthers from '../../templates/informationothers';
import configTemplate from '../../templates/config';
import addServicesTemplate from '../../templates/addservices';
import resultstemplate from '../../templates/addservicesresults';
import ogcModalTemplate from '../../templates/ogcmodal';
import layerModalTemplate from '../../templates/layermodal';
import customQueryFiltersTemplate from '../../templates/customqueryfilters';

const CATASTRO = '//ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx';

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
     * @public
     * @type {boolean}
     */
    this.collapsed = options.collapsed;

    /**
     * Listado de capas precargadas
     * @public
     * @type {Array}
     */
    this.precharged = options.precharged;

    /**
     * Determina si permite o no servicios http
     * @public
     * @type {Boolean}
     */
    this.http = options.http;

    /**
     * Determina si permite o no servicios https
     * @public
     * @type {Boolean}
     */
    this.https = options.https;

    this.filterName = undefined;

    /**
     * Determina si se han seleccionado todas las capas o no
     * @public
     * @type {Boolean}
     */
    this.stateSelectAll = false;
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
        this.getPanel().getButtonPanel().addEventListener('click', this.collapsedPlugin.bind(this), false);

        this.getImpl().registerEvent(map);

        // this.render();
        success(this.template_);
      });
    });
  }

  collapsedPlugin(e) {
    if (!e.target.parentElement.classList.contains('collapsed')) {
      this.render();
      this.getImpl().registerEvent(this.map_);
    } else {
      this.getImpl().removeRenderComplete();
    }
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
      let scroll;
      if (document.querySelector('.m-plugin-layerswitcher.opened ul.m-layerswitcher-ullayers') !== null) {
        scroll = document.querySelector('.m-plugin-layerswitcher.opened ul.m-layerswitcher-ullayers').scrollTop;
      }

      const html = M.template.compileSync(templateAux, {
        vars: templateVars,
      });
      this.template_.querySelector('#m-layerswitcher-content').innerHTML = html.innerHTML;
      this.template_.querySelector('#m-layerswitcher-addlayers').addEventListener('click', this.openAddServices.bind(this), false);

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
        const layers = this.map_.getLayers().filter(l => l.name !== '__draw__');
        Sortable.create(layerList, {
          animation: 150,
          ghostClass: 'm-layerswitcher-gray-shadow',
          filter: '.m-layerswitcher-opacity',
          preventOnFilter: false,
          onEnd: (evt) => {
            const from = evt.from;
            let maxZIndex = Math.max(...(layers.map((l) => {
              return l.getZIndex();
            })));

            from.querySelectorAll('li.m-layerswitcher-layer .m-layerswitcher-title-layer .m-visible-control *').forEach((elem) => {
              const name = elem.getAttribute('data-layer-name');
              const url = elem.getAttribute('data-layer-url');
              const type = elem.getAttribute('data-layer-type');
              const filtered = layers.filter((layer) => {
                // Para las capas OSM, ... no tienen url // rev
                return layer.name === name && layer.url === url && layer.type === type;
              });
              if (filtered.length > 0) {
                filtered[0].setZIndex(maxZIndex);
                maxZIndex -= 1;
              }
            });
          },
        });
      }
      if (scroll !== undefined) {
        document.querySelector('.m-plugin-layerswitcher.opened ul.m-layerswitcher-ullayers').scrollTop = scroll;
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
            if (l.name === layerName && l.type === layerType && (l.url === layerURL || layerURL === 'noURL')) {
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
              if (url.indexOf('assets/img/legend-default.png') !== -1) {
                legend.querySelector('img').src = url;
              } else {
                this.errorLegendLayer(layer).then((newLegend) => {
                  if (newLegend !== '') {
                    legend.querySelector('img').src = newLegend;
                  } else {
                    legend.querySelector('img').src = legendUrl;
                  }
                });
              }
            });
          } else if (legendUrl.indexOf('assets/img/legend-default.png') !== -1) {
            this.errorLegendLayer(layer).then((newLegend) => {
              if (newLegend !== '') {
                legend.querySelector('img').src = newLegend;
              } else {
                legend.querySelector('img').src = legendUrl;
              }
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
          if (layerType === 'WMS' || layerType === 'WMTS' || layerType === 'WFS' || layerType === 'MBTilesVector' ||
            layerType === 'MBTiles' || layerType === 'OSM' || layerType === 'XYZ' || layerType === 'TMS' ||
            layerType === 'GeoJSON' || layerType === 'KML' || layerType === 'OGCAPIFeatures' || layerType === 'Vector') {
            const extent = layer.getMaxExtent();
            this.map_.setBbox(extent);
          } else if (layerType === 'MVT') {
            const extent = layer.getFeaturesExtent();
            this.map_.setBbox(extent);
          } else {
            M.dialog.info(getValue('exception.extent'), getValue('info'), this.order);
          }
        } else if (evt.target.className.indexOf('m-layerswitcher-icons-info') > -1) {
          if (layer.type === 'OGCAPIFeatures') {
            const metadataURL = `${layer.url}${layer.name}?f=json`;
            const htmlURL = `${layer.url}${layer.name}?f=html`;
            let jsonResponseOgc;
            M.remote.get(metadataURL).then((response) => {
              jsonResponseOgc = JSON.parse(response.text);
              const vars = {
                title: jsonResponseOgc.description,
                abstract: jsonResponseOgc.title,
                hasMetadata: true,
                metadata: htmlURL,
                isOgc: true,
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
              this.renderInfo(vars, 'OGCAPIFeatures');
            });
          } else if (layer.type === 'WMS' || layer.type === 'WMTS') {
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
          } else {
            const vars = {
              title: layer.name,
              translations: {
                title: getValue('title'),
              },
            };
            this.renderInfo(vars, 'Others');
          }
        } else if (evt.target.className.indexOf('m-layerswitcher-icons-style') > -1) {
          let otherStyles = [];
          let isOGCAPIFeatures;
          if (!M.utils.isUndefined(layer.capabilitiesMetadata) &&
            !M.utils.isUndefined(layer.capabilitiesMetadata.style)) {
            otherStyles = layer.capabilitiesMetadata.style;
          }

          if (layer.type === 'OGCAPIFeatures') {
            otherStyles = layer.predefinedStyles;
            isOGCAPIFeatures = true;
          }

          const config = M.template.compileSync(configTemplate, {
            jsonp: true,
            parseToHtml: false,
            vars: {
              styles: otherStyles,
              isOGCAPIFeatures,
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

  errorLegendLayer(layer) {
    return new Promise((success) => {
      let legend = '';
      if (layer.type === 'XYZ' || layer.type === 'TMS') {
        legend = layer.url.replace('{z}/{x}/{-y}', '0/0/0');
      } else if (layer.type === 'OSM') {
        let url = layer.getImpl().getOL3Layer().getSource().getUrls();
        if (url.length > 0) {
          url = url[0];
        }
        legend = url.replace('{z}/{x}/{y}', '0/0/0');
      }
      if (legend !== '') {
        M.remote.get(legend).then((response) => {
          if (response.code !== 200) {
            legend = '';
          }
          success(legend);
        });
      }
    });
  }

  changeLayerConfig(layer, otherStyles) {
    const styleSelected = document.querySelector('#m-layerswitcher-style-select').value;
    if (styleSelected !== '') {
      if (layer.type === 'OGCAPIFeatures') {
        if (!M.utils.isNullOrEmpty(otherStyles)) {
          const filtered = otherStyles[styleSelected];
          if (styleSelected === 0) {
            layer.setStyle();
          } else {
            layer.setStyle(filtered);
          }
        }
      } else {
        layer.getImpl().getOL3Layer().getSource().updateParams({ STYLES: styleSelected });
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
      document.querySelector('div.m-mapea-container div.m-dialog').remove();
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
    const result = layers.sort((layer1, layer2) => layer1.getZIndex() -
      layer2.getZIndex()).reverse();
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

    let ogcapiFeaturesStyles;
    if (layer.type === 'OGCAPIFeatures') {
      if (!M.utils.isNullOrEmpty(layer.predefinedStyles)) {
        ogcapiFeaturesStyles = layer.predefinedStyles.length > 1;
      }
    }

    return new Promise((success) => {
      const layerVarTemplate = {
        title: layerTitle,
        type: layer.type,
        visible: (layer.isVisible() === true),
        id: layer.name,
        url: layer.url || 'noURL',
        outOfRange: !layer.inRange(),
        checkedLayer: layer.checkedLayer || 'false',
        opacity: layer.getOpacity(),
        metadata: hasMetadata,
        hasStyles: (hasMetadata && layer.capabilitiesMetadata.style.length > 1) ||
          ogcapiFeaturesStyles,
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
    if (evtParameter.target.type === 'radio') {
      return;
    }

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
  renderInfo(vars, type) {
    let info;
    if (type === 'OGCAPIFeatures') {
      info = M.template.compileSync(infoTemplateOGC, {
        jsonp: false,
        parseToHtml: false,
        vars,
      });
    } else if (type === 'Others') {
      info = M.template.compileSync(infoTemplateOthers, {
        jsonp: false,
        parseToHtml: false,
        vars,
      });
    } else {
      info = M.template.compileSync(infoTemplate, {
        jsonp: false,
        parseToHtml: false,
        vars,
      });
    }

    M.dialog.info(info, getValue('layer_info'), this.order);
    setTimeout(() => {
      document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
      const button = document.querySelector('div.m-dialog.info div.m-button > button');
      button.innerHTML = getValue('close');
      button.style.width = '75px';
      button.style.backgroundColor = '#71a7d3';
    }, 10);
  }

  openAddServices() {
    const precharged = this.precharged;
    const hasPrecharged = (precharged.groups !== undefined && precharged.groups.length > 0) ||
      (precharged.services !== undefined && precharged.services.length > 0);
    const addServices = M.template.compileSync(addServicesTemplate, {
      jsonp: true,
      parseToHtml: false,
      vars: {
        precharged,
        hasPrecharged,
        translations: {
          url_service: getValue('url_service'),
          query: getValue('query'),
          loaded_services: getValue('loaded_services'),
          clean: getValue('clean'),
          availables: getValue('availables'),
          codsi_services: getValue('codsi_services'),
          filter_results: getValue('filter_results'),
          clean_filter: getValue('clean_filter'),
          filter_text: getValue('filter_text'),
        },
      },
    });
    M.dialog.info(addServices, getValue('load_ext_services'));

    setTimeout(() => {
      document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
      const button = document.querySelector('div.m-dialog.info div.m-button > button');
      button.innerHTML = getValue('close');
      button.style.width = '75px';
      button.style.backgroundColor = '#71a7d3';

      // eventos botones buscadores
      document.querySelector('#m-layerswitcher-addservices-search-btn').addEventListener('click', (e) => {
        this.filterName = undefined;
        this.readCapabilities(e);
      });

      // evento para desplegar capas predefinidas
      document.querySelectorAll('.m-layerswitcher-suggestion-caret').forEach((elem) => {
        elem.addEventListener('click', () => {
          elem.parentElement.querySelector('.m-layerswitcher-suggestion-group').classList.toggle('active');
          elem.classList.toggle('m-layerswitcher-suggestion-caret-close');
        });
      });

      // evento para mostrar listado de capas predefinidas
      document.querySelectorAll('#m-layerswitcher-addservices-suggestions .m-layerswitcher-suggestion').forEach((elem) => {
        elem.addEventListener('click', e => this.loadSuggestion(e));
      });
    }, 10);
  }

  /**
   * Esta función lee las capas de un servicio
   *
   * @function
   * @private
   * @param {Event} evt - Click event
   */
  readCapabilities(evt) {
    evt.preventDefault();
    let HTTPeval = false;
    let HTTPSeval = false;
    document.querySelector('#m-layerswitcher-addservices-suggestions').style.display = 'none';
    const url = document.querySelector('div.m-dialog #m-layerswitcher-addservices-search-input').value.trim().split('?')[0];
    this.removeContains(evt);
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
          // MVT
          if (url.indexOf('.pbf') >= 0) {
            const metadata = url.replace('{z}/{x}/{y}.pbf', 'metadata.json');
            M.remote.get(metadata).then((meta) => {
              let layers = JSON.parse(meta.text).vector_layers;
              layers = layers.map((layer) => {
                return { name: layer.id };
              });
              this.printLayerModal(url, 'mvt', layers);
            });
            // TMS
          } else if (url.indexOf('{z}/{x}/{-y}') >= 0) {
            this.printLayerModal(url, 'tms');
            // OSM
          } else if (url.indexOf('{z}/{x}/{y}') >= 0 && url.indexOf('openstreetmap') >= 0) {
            this.printLayerModal(url, 'osm');
            // XYZ
          } else if (url.indexOf('{z}/{x}/{y}') >= 0) {
            this.printLayerModal(url, 'xyz');
          } else {
            const promise = new Promise((success, reject) => {
              const id = setTimeout(() => reject(), 15000);
              M.remote.get(M.utils.getWMTSGetCapabilitiesUrl(url)).then((response) => {
                clearTimeout(id);
                success(response);
              });
            });

            promise.then((response) => {
              try {
                if (response.text.indexOf('<TileMatrixSetLink>') >= 0 && response.text.indexOf('Operation name="GetTile"') >= 0) {
                  const getCapabilitiesParser = new M.impl.format.WMTSCapabilities();
                  const getCapabilities = getCapabilitiesParser.read(response.xml);
                  this.serviceCapabilities = getCapabilities.capabilities || {};
                  const layers = M.impl.util.wmtscapabilities.getLayers(
                    getCapabilities.capabilities,
                    url,
                    this.map_.getProjection().code,
                  );
                  this.capabilities = this.filterResults(layers);
                  this.showResults();
                } else {
                  const promise2 = new Promise((success, reject) => {
                    const id = setTimeout(() => reject(), 15000);
                    M.remote.get(M.utils.getWMSGetCapabilitiesUrl(url, '1.3.0')).then((response2) => {
                      clearTimeout(id);
                      success(response2);
                    });
                  });
                  promise2.then((response2) => {
                    if (response2.text.indexOf('<TileMatrixSetLink>') === -1 && response2.text.indexOf('<GetMap>') >= 0) {
                      try {
                        const getCapabilitiesParser = new M.impl.format.WMSCapabilities();
                        const getCapabilities = getCapabilitiesParser.read(response2.xml);
                        this.serviceCapabilities = getCapabilities.Service || {};
                        const getCapabilitiesUtils = new M.impl.GetCapabilities(
                          getCapabilities,
                          url,
                          this.map_.getProjection().code,
                        );
                        this.capabilities = this.filterResults(getCapabilitiesUtils.getLayers());
                        this.capabilities.forEach((layer) => {
                          try {
                            this.getParents(getCapabilities, layer);
                            /* eslint-disable no-empty */
                          } catch (err) {}
                        });
                        this.showResults();
                      } catch (error) {
                        M.dialog.error(getValue('exception.capabilities'));
                      }
                    } else {
                      this.checkIfOGCAPIFeatures(url).then((reponseIsJson) => {
                        if (reponseIsJson === true) {
                          this.printOGCModal(url);
                        } else {
                          M.remote.get(url).then((response3) => {
                            // GEOJSON
                            if (response3.text.replaceAll('\r\n', '').replaceAll(' ', '').indexOf('"type":"FeatureCollection"') >= 0) {
                              this.printLayerModal(url, 'geojson');
                            } else if (response3.text.indexOf('<kml ') >= 0) {
                              const parser = new DOMParser();
                              const xmlDoc = parser.parseFromString(response3.text, 'text/xml');
                              const folders = xmlDoc.getElementsByTagName('Folder');
                              let cont = -1;
                              const names = Array.from(folders).map((folder) => {
                                cont += 1;
                                const name = folder.name || `Layer__${cont}`;
                                return { name };
                              });
                              this.printLayerModal(url, 'kml', names);
                            }
                          });
                        }
                      });
                    }
                  }).catch((eerror) => {
                    M.dialog.error(getValue('exception.capabilities'));
                  });
                }
              } catch (err) {
                M.dialog.error(getValue('exception.capabilities'));
              }
            }).catch((err) => {
              M.dialog.error(getValue('exception.capabilities'));
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

  /**
   * Esta función elimina los resultados
   */
  removeContains(evt) {
    evt.preventDefault();
    if (document.querySelector('#m-layerswitcher-addservices-suggestions') !== null) {
      document.querySelector('#m-layerswitcher-addservices-suggestions').style.display = 'none';
    }
    if (document.querySelector('#m-layerswitcher-ogcCContainer') !== null) {
      document.querySelector('#m-layerswitcher-ogcCContainer').style.display = 'none';
    }

    if (document.querySelector('#m-layerswitcher-layerContainer') !== null) {
      document.querySelector('#m-layerswitcher-layerContainer').style.display = 'none';
    }
    document.querySelector('#m-layerswitcher-addservices-results').innerHTML = '';
  }

  /**
   * Esta función filtra los resultados
   */
  filterResults(allLayers) {
    const layers = [];
    const layerNames = [];
    let allServices = [];
    if (this.filterName === undefined) {
      allLayers.forEach((layer) => {
        layers.push(layer);
        layerNames.push(layer.name);
      });
    } else if (this.filterName === 'none') {
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
          if (service.type === layer.type && this.checkUrls(service.url, layer.url)) {
            if (service.white_list !== undefined && service.white_list.length > 0 &&
              service.white_list.indexOf(layer.name) > -1 &&
              layerNames.indexOf(layer.name) === -1) {
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
    } else if (this.precharged.groups !== undefined && this.precharged.groups.length > 0) {
      this.precharged.groups.forEach((group) => {
        if (group.services !== undefined && group.services.length > 0 &&
          group.name === this.filterName) {
          allLayers.forEach((layer) => {
            let insideService = false;
            group.services.forEach((service) => {
              if (service.type === layer.type && this.checkUrls(service.url, layer.url)) {
                if (service.white_list !== undefined && service.white_list.length > 0 &&
                  service.white_list.indexOf(layer.name) > -1 &&
                  layerNames.indexOf(layer.name) === -1) {
                  layers.push(layer);
                  layerNames.push(layer.name);
                } else if (service.white_list === undefined &&
                  layerNames.indexOf(layer.name) === -1) {
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
        }
      });
    }

    return layers;
  }

  /**
   * Esta función muestra los resultados
   */
  showResults() {
    const result = [];
    let serviceType = 'WMS';
    this.capabilities.forEach((capability) => {
      const add = capability.getImpl();
      add.abstract = capability.capabilitiesMetadata.abstract.trim();
      serviceType = capability.type;
      result.push(add);
    });

    const container = document.querySelector('#m-layerswitcher-addservices-results');
    if (result.length > 0) {
      const serviceCapabilities = {};
      if (serviceType === 'WMTS') {
        const si = this.serviceCapabilities.ServiceIdentification;
        const sp = this.serviceCapabilities.ServiceProvider;
        if (si !== undefined && si.Title !== undefined) {
          serviceCapabilities.title = si.Title.trim();
        }

        if (si !== undefined && si.Abstract !== undefined) {
          serviceCapabilities.abstract = si.Abstract.trim();
        }

        if (si !== undefined && si.AccessConstraints !== undefined) {
          serviceCapabilities.accessConstraints = si.AccessConstraints.trim();
        }

        if (sp !== undefined) {
          let contact = `${sp.ProviderName}<p><a class="m-layerswitcher-provider-link" href="${sp.ProviderSite}" target="_blank">${sp.ProviderSite}</a></p>`;
          const ci = sp.ServiceContact.ContactInfo;
          if (!M.utils.isNullOrEmpty(sp.ServiceContact) && !M.utils.isNullOrEmpty(ci)) {
            const mail = ci.Address.ElectronicMailAddress;
            contact += `<p><a class="m-layerswitcher-provider-link" href="mailto:${mail}">${mail}</a></p>`;
          }

          serviceCapabilities.contact = contact;
        }
      } else {
        const ci = this.serviceCapabilities.ContactInformation;
        if (this.serviceCapabilities.Title !== undefined) {
          serviceCapabilities.title = this.serviceCapabilities.Title.trim();
        }

        if (this.serviceCapabilities.Abstract !== undefined) {
          serviceCapabilities.abstract = this.serviceCapabilities.Abstract.trim();
        }

        if (this.serviceCapabilities.AccessConstraints !== undefined) {
          serviceCapabilities.accessConstraints = this.serviceCapabilities.AccessConstraints.trim();
        }

        if (ci !== undefined && ci.ContactPersonPrimary !== undefined) {
          if (ci.ContactPersonPrimary.ContactOrganization !== undefined) {
            serviceCapabilities.contact = ci.ContactPersonPrimary.ContactOrganization.trim();
          }
        }
      }

      const html = M.template.compileSync(resultstemplate, {
        vars: {
          result,
          serviceCapabilities,
          translations: {
            layers: getValue('layers'),
            add: getValue('add'),
            title: getValue('title'),
            abstract: getValue('abstract'),
            responsible: getValue('responsible'),
            access_constraints: getValue('access_constraints'),
            show_service_info: getValue('show_service_info'),
          },
        },
      });

      container.innerHTML = html.innerHTML;
      const results = container.querySelectorAll('span.m-check-layerswitcher-addservices');
      for (let i = 0; i < results.length; i += 1) {
        results[i].addEventListener('click', evt => this.registerCheck(evt));
      }

      const resultsNames = container.querySelectorAll('.m-layerswitcher-table-results .m-layerswitcher-table-container table tbody tr td.m-layerswitcher-table-layer-name');
      for (let i = 0; i < resultsNames.length; i += 1) {
        resultsNames[i].addEventListener('click', evt => this.registerCheckFromName(evt));
      }

      const checkboxResults = container.querySelectorAll('.m-layerswitcher-table-results .m-layerswitcher-table-container table tbody tr td span');
      checkboxResults.forEach(l => l.addEventListener('keydown', e => (e.keyCode === 13) && this.registerCheckFromName(e)));

      container.querySelector('#m-layerswitcher-addservices-selectall').addEventListener('click', evt => this.registerCheck(evt));
      container.querySelector('.m-layerswitcher-addservices-add').addEventListener('click', evt => this.addLayers(evt));
      const elem = container.querySelector('.m-layerswitcher-show-capabilities');
      elem.addEventListener('click', () => {
        const block = container.querySelector('.m-layerswitcher-capabilities-container');
        if (block.style.display !== 'block') {
          block.style.display = 'block';
          elem.innerHTML = `<span class="m-layerswitcher-icons-colapsar"></span>&nbsp;${getValue('hide_service_info')}`;
        } else {
          block.style.display = 'none';
          elem.innerHTML = `<span class="m-layerswitcher-icons-desplegar"></span>&nbsp;${getValue('show_service_info')}`;
        }
      });
    } else {
      container.innerHTML = `<p class="m-layerswitcher-noresults">${getValue('exception.no_results')}</p>`;
    }
  }

  /**
   * Esta función determina si la capa es de tipo OGCAPI
   */
  checkIfOGCAPIFeatures(url) {
    return M.remote.get(`${url}?f=json`).then((response) => {
      let isJson = false;
      if (!M.utils.isNullOrEmpty(response) && !M.utils.isNullOrEmpty(response.text) && response.text.indexOf('collections') !== -1) {
        const responseString = response.text;
        JSON.parse(responseString);
        isJson = true;
      }
      return isJson;
    }).catch(() => {
      return false;
    });
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
    if (!M.utils.isNullOrEmpty(e.target) && e.target.classList.contains('m-check-layerswitcher-addservices')) {
      const container = document.querySelector('#m-layerswitcher-addservices-results');
      let numNotChecked = container.querySelectorAll('.m-check-layerswitcher-addservices.m-layerswitcher-icons-check').length;
      numNotChecked += (e.target.classList.contains('m-layerswitcher-icons-check') ? -1 : 1);
      e.stopPropagation();
      e.target.classList.toggle('m-layerswitcher-icons-check');
      e.target.classList.toggle('m-layerswitcher-icons-check-seleccionado');
      if (numNotChecked > 0) {
        this.stateSelectAll = false;
        document.querySelector('#m-layerswitcher-addservices-selectall').classList.remove('m-layerswitcher-icons-check-seleccionado');
        document.querySelector('#m-layerswitcher-addservices-selectall').classList.add('m-layerswitcher-icons-check');
      } else if (numNotChecked === 0) {
        this.stateSelectAll = true;
        document.querySelector('#m-layerswitcher-addservices-selectall').classList.remove('m-layerswitcher-icons-check');
        document.querySelector('#m-layerswitcher-addservices-selectall').classList.add('m-layerswitcher-icons-check-seleccionado');
      }
    } else if (!M.utils.isNullOrEmpty(e.target) && e.target.id === 'm-layerswitcher-addservices-selectall') {
      if (this.stateSelectAll) {
        e.target.classList.remove('m-layerswitcher-icons-check-seleccionado');
        e.target.classList.add('m-layerswitcher-icons-check');
        this.unSelect();
        this.stateSelectAll = false;
      } else {
        e.target.classList.remove('m-layerswitcher-icons-check');
        e.target.classList.add('m-layerswitcher-icons-check-seleccionado');
        this.select();
        this.stateSelectAll = true;
      }
    }
  }

  /**
   * This function registers the marks or unmarks check and click allselect from layer name
   *
   * @function
   * @private
   * @param {Event} evt - Event
   */
  registerCheckFromName(evt) {
    const e = (evt || window.event);
    e.target.parentElement.querySelector('span.m-check-layerswitcher-addservices').click();
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
    const elmSel = document.querySelectorAll('#m-layerswitcher-addservices-results .m-layerswitcher-icons-check-seleccionado');
    if (elmSel.length === 0) {
      M.dialog.error(getValue('exception.select_layer'));
    } else {
      for (let i = 0; i < elmSel.length; i += 1) {
        for (let j = 0; j < this.capabilities.length; j += 1) {
          const name = this.capabilities[j].name;
          if (elmSel[i].id === name || elmSel[i].name === name) {
            const limit = parseInt(this.serviceCapabilities.MaxWidth, 10);
            const hasLimit = !Number.isNaN(limit) && limit < 4096;
            const isIDECanarias = this.serviceCapabilities.Title !== undefined && this.serviceCapabilities.Title.toLowerCase().indexOf('idecanarias') > -1;
            if (this.capabilities[j].url.indexOf(CATASTRO) > -1 || isIDECanarias) {
              this.capabilities[j].version = '1.1.1';
            }

            this.capabilities[j].tiled = this.capabilities[j].type === 'WMTS' || hasLimit || isIDECanarias;
            this.capabilities[j].options.origen = this.capabilities[j].type;
            const legendUrl = this.capabilities[j].getLegendURL();
            const meta = this.capabilities[j].capabilitiesMetadata;
            if ((legendUrl.indexOf('GetLegendGraphic') > -1 || legendUrl.indexOf('assets/img/legend-default.png') > -1) && meta !== undefined && meta.style.length > 0) {
              if (meta.style[0].LegendURL !== undefined && meta.style[0].LegendURL.length > 0) {
                const style = meta.style[0].LegendURL[0].OnlineResource;
                if (style !== undefined && style !== null) {
                  this.capabilities[j].setLegendURL(style);
                }
              }

              if (this.capabilities[j].type === 'WMTS') {
                if (meta.style !== undefined && meta.style.length > 0) {
                  meta.style.forEach((s) => {
                    if (s.isDefault === true && s.LegendURL !== undefined &&
                      s.LegendURL.length > 0) {
                      const urlDefaultStyle = s.LegendURL[0].href;
                      this.capabilities[j].setLegendURL(urlDefaultStyle);
                    }
                  });
                }
              }
            }

            layers.push(this.capabilities[j]);
          }
        }
      }

      layers.reverse();
      this.map_.addLayers(layers);
    }
  }

  /**
   * This function unselects checkboxs
   *
   * @function
   * @private
   */
  unSelect() {
    const unSelect = document.querySelectorAll('#m-layerswitcher-addservices-results .m-layerswitcher-icons-check-seleccionado');
    for (let i = 0; i < unSelect.length; i += 1) {
      unSelect[i].classList.remove('m-layerswitcher-icons-check-seleccionado');
      unSelect[i].classList.add('m-layerswitcher-icons-check');
    }
  }

  /**
   * This function selects checkboxs
   *
   * @function
   * @private
   */
  select() {
    const select = document.querySelectorAll('#m-layerswitcher-addservices-results .m-layerswitcher-icons-check');
    for (let i = 0; i < select.length; i += 1) {
      select[i].classList.remove('m-layerswitcher-icons-check');
      select[i].classList.add('m-layerswitcher-icons-check-seleccionado');
    }
  }

  loadSuggestion(evt) {
    const url = evt.target.getAttribute('data-link');
    try {
      const group = evt.target.parentElement.parentElement.parentElement;
      const nameGroup = group.querySelector('span.m-layerswitcher-suggestion-caret').innerText;
      this.filterName = nameGroup;
      if (group.localName === 'tbody') {
        this.filterName = 'none';
      }
      /* eslint-disable no-empty */
    } catch (err) {}
    document.querySelector('div.m-dialog #m-layerswitcher-addservices-search-input').value = url;

    this.readCapabilities(evt);
  }

  checkUrls(url1, url2) {
    return url1 === url2 || (url1.indexOf(url2) > -1) || (url2.indexOf(url1) > -1);
  }

  printLayerModal(url, type, layers) {
    const modal = M.template.compileSync(layerModalTemplate, {
      jsonp: true,
      parseToHtml: false,
      vars: {
        type,
        layers,
        translations: {
          add_btn: getValue('add_btn'),
          legend: getValue('legend'),
          name: getValue('name'),
          data_layer: getValue('data_layer'),
          layers: getValue('layers'),
        },
      },
    });

    document.querySelector('#m-layerswitcher-layerContainer').outerHTML = modal;
    if (type === 'mvt' || type === 'kml') {
      document.querySelector('#m-layerswitcher-addservices-selectall').addEventListener('click', evt => this.registerCheck(evt));
      const results = document.querySelectorAll('span.m-check-layerswitcher-addservices');
      for (let i = 0; i < results.length; i += 1) {
        results[i].addEventListener('click', evt => this.registerCheck(evt));
      }
    }

    const btnAddLayer = document.querySelector('#m-layerswitcher-layer-button');
    btnAddLayer.addEventListener('click', () => {
      const randomNumber = Math.floor(Math.random() * 9000) + 1000;
      const name = document.querySelector('#m-layerswitcher-layer-name').value || `layer_${randomNumber}`;
      const legend = document.querySelector('#m-layerswitcher-layer-legend').value || `layer_${randomNumber}`;
      let matrixSet = document.querySelector('#m-layerswitcher-layer-matrixset');
      if (!M.utils.isNullOrEmpty(matrixSet)) {
        matrixSet = matrixSet.value || 'EPSG:3857';
      }

      if (type === 'osm') {
        this.map_.addLayers(new M.layer.OSM({
          name,
          legend,
          transparent: true,
          url,
          matrixSet,
        }));
      } else if (type === 'geojson') {
        this.map_.addLayers(new M.layer.GeoJSON({
          name,
          legend,
          url,
        }));
      } else if (type === 'tms') {
        this.map_.addLayers(new M.layer.TMS({
          name,
          legend,
          url,
          matrixSet,
        }));
      } else if (type === 'xyz') {
        this.map_.addLayers(new M.layer.XYZ({
          name,
          legend,
          url,
          matrixSet,
        }));
      } else if (type === 'mvt') {
        const elmSel = document.querySelectorAll('#m-layerswitcher-addservices-results .m-layerswitcher-icons-check-seleccionado');
        const layersSelected = [];
        elmSel.forEach((elm) => {
          layersSelected.push(elm.id);
        });
        const obj = {
          name,
          legend,
          url,
          matrixSet,
        };
        if (!M.utils.isNullOrEmpty(layersSelected)) {
          obj.layers = layersSelected;
        }
        this.map_.addLayers(new M.layer.MVT(obj));
      } else if (type === 'kml') {
        const elmSel = document.querySelectorAll('#m-layerswitcher-addservices-results .m-layerswitcher-icons-check-seleccionado');
        const layersSelected = [];
        elmSel.forEach((elm) => {
          layersSelected.push(elm.id);
        });
        const obj = {
          name,
          legend,
          url,
        };
        if (!M.utils.isNullOrEmpty(layersSelected)) {
          obj.layers = layersSelected;
        }
        this.map_.addLayers(new M.layer.KML(obj));
      }

      document.querySelector('div.m-dialog.info').parentNode.removeChild(document.querySelector('div.m-dialog.info'));
    });
  }

  printOGCModal(
    url, selectedLayer, limitVal, onlyBbox, summary,
    filterByID, filterByOtherFilters,
  ) {
    let prevID;
    let urlOGC = url.trim();
    if (M.utils.isUrl(urlOGC)) {
      document.querySelector('#m-layerswitcher-addservices-search-input').value = url;

      const collections = `${(urlOGC.endsWith('/') ? urlOGC : `${urlOGC}/`)}collections?f=json`;
      M.remote.get(collections).then((response) => {
        const resJSON = JSON.parse(response.text);
        const layers = resJSON.collections;
        if (M.utils.isNullOrEmpty(summary)) {
          summary = undefined;
          filterByID = undefined;
          filterByOtherFilters = undefined;
        }

        const ogcModal = M.template.compileSync(ogcModalTemplate, {
          jsonp: true,
          parseToHtml: false,
          vars: {
            layers,
            selectedLayer,
            limit: limitVal,
            bbox: onlyBbox,
            summary,
            filterByID,
            filterByOtherFilters,
            prevID,
            translations: {
              select_service: getValue('select_service'),
              amount_results: getValue('amount_results'),
              amount_results_2: getValue('amount_results_2'),
              bbox_select: getValue('bbox-select'),
              other_filters: getValue('other_filters'),
              id_filter: getValue('id_filter'),
              warning: getValue('warning'),
              add_btn: getValue('add_btn'),
              custom_query_btn: getValue('custom_query_btn'),
              filters: getValue('filters'),
              check_results: getValue('check_results'),
            },
          },
        });

        document.querySelector('#m-layerswitcher-ogcCContainer').outerHTML = ogcModal;

        const radioBtnFilterByID = document.querySelector('input[name="m-layerswitcher-ogc-filter"][value="id"]');
        const radioBtnFilterByOther = document.querySelector('input[name="m-layerswitcher-ogc-filter"][value="others"]');

        this.setOnClickRadioBtn(radioBtnFilterByID, radioBtnFilterByOther);
        this.setOnChanges(summary);
        this.setOnClickCloseBtn();
        this.setOnClickersFiltersButtons(
          summary, urlOGC, radioBtnFilterByID, radioBtnFilterByOther,
          layers, url, filterByID, filterByOtherFilters,
        );
      }).catch((err) => {
        urlOGC = '';
        M.dialog.error(getValue('exception.error_ogc'));
      });
    }
  }

  // Cambia la visualización de opciones de filtrado dependiendo del filtro seleccionado
  // (ID u otros)
  setOnClickRadioBtn(radioBtnFilterByID, radioBtnFilterByOther) {
    radioBtnFilterByID.addEventListener('click', () => {
      document.querySelector('#m-layerswitcher-ogc-other-filters').style.display = 'none';
      document.querySelector('#m-layerswitcher-ogc-filter-id').style.display = 'block';
      document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = '';
    });
    radioBtnFilterByOther.addEventListener('click', () => {
      document.querySelector('#m-layerswitcher-ogc-other-filters').style.display = 'block';
      document.querySelector('#m-layerswitcher-ogc-filter-id').style.display = 'none';
      document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = '';
    });
  }

  setOnChanges(summary) {
    document.querySelector('#m-layerswitcher-ogc-search-form-ID').addEventListener('change', () => {
      document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = '';
    });

    document.querySelector('#m-layerswitcher-ogc-limit-items').addEventListener('change', () => {
      document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = '';
    });
    document.querySelector('#m-layerswitcher-ogc-search-bbox').addEventListener('change', () => {
      document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = '';
    });

    document.querySelector('#m-layerswitcher-ogc-vectors-select').addEventListener('change', () => {
      const divSummary = document.querySelector('#m-layerswitcher-ogc-summary');
      if (divSummary !== null) {
        divSummary.remove();
        summary = undefined;
      }
      document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = '';
    });
  }

  setOnClickCloseBtn() {
    const buttonClose = document.querySelector('div.m-dialog.info div.m-button > button');
    buttonClose.innerHTML = getValue('close');
    buttonClose.style.width = '75px';
    buttonClose.style.backgroundColor = '#71a7d3';
    buttonClose.addEventListener('click', () => {
      try {
        document.querySelector('div.m-dialog.info').parentNode.removeChild(document.querySelector('div.m-dialog.info'));
      } catch (error) {}
    });
  }

  setOnClickersFiltersButtons(
    summary, urlOGC, radioBtnFilterByID,
    radioBtnFilterByOther, layers, url, filterByID, filterByOtherFilters,
  ) {
    let indexCurrentLayer;
    let formInputs;
    let properties;
    let selectValue = document.querySelector('#m-layerswitcher-ogc-vectors-select').value;
    const btnAddLayer = document.querySelector('#m-layerswitcher-ogcCContainer #m-layerswitcher-ogc-select-button');
    const btnCheck = document.querySelector('#m-layerswitcher-ogcCContainer #m-layerswitcher-ogc-check-button');
    const btnCustomQuery = document.querySelector('#m-layerswitcher-ogc-custom-query-button');

    btnAddLayer.addEventListener('click', () => {
      if (selectValue === getValue('select_service')) {
        M.dialog.error(getValue('no_results'));
      } else {
        properties = this.getProperties(selectValue, summary);

        this.getImpl().loadOGCAPIFeaturesLayer(properties);

        const buttonClose = document.querySelector('div.m-dialog.info div.m-button > button');
        buttonClose.click();
      }
    });

    btnCheck.addEventListener('click', () => {
      if (selectValue === getValue('select_service')) {
        M.dialog.error(getValue('no_results'));
      } else {
        properties = this.getProperties(selectValue, summary);
        this.getImpl().getNumberFeaturesOGCAPIFeaturesLayer(properties).then((numberFeatures) => {
          let results1;
          let results2;
          if (numberFeatures === 1) {
            results1 = getValue('results_1_singular');
            results2 = getValue('results_2_singular');
          } else {
            results1 = getValue('results_1_plural');
            results2 = getValue('results_2_plural');
          }
          document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = `${results1}${numberFeatures}${results2}`;
        });
      }
    });

    btnCustomQuery.addEventListener('click', () => {
      let filtersList;

      const previousModal = document.querySelector('.m-content').innerHTML;
      selectValue = document.querySelector('#m-layerswitcher-ogc-vectors-select').value;
      const limit = document.querySelector('#m-layerswitcher-ogc-limit-items').value;
      const checked = document.querySelector('#m-layerswitcher-ogc-search-bbox').checked;
      const urlQueryables = `${urlOGC}/collections/${selectValue}/queryables`;
      M.remote.get(urlQueryables).then((queryablesResponse) => {
        try {
          const res = JSON.parse(queryablesResponse.text);
          const props = res.properties;
          filtersList = Object.values(props);
          filtersList.forEach((v) => {
            if (v.title !== undefined) {
              const type = v.type.toLowerCase();
              if (type === 'bool' || type === 'boolean') {
                v.bool = true;
              } else if (type === 'timestamp' || type === 'date') {
                v.date = true;
              } else if (type === 'int4' || type === 'int' ||
                type === 'number' || type === 'numeric' || type.includes('numeric')) {
                v.number = true;
              } else {
                v.text = true;
              }
            }
            if (summary !== undefined) {
              if (v.title in summary) {
                v.value = summary[v.title];
              }
              document.querySelector('#m-layerswitcher-ogc-check-results').innerHTML = '';
            }
          });
        } catch (error) {}
        const urlInput = document.querySelector('#m-layerswitcher-addservices-search-input').value;

        const customQueryTemplate = M.template.compileSync(customQueryFiltersTemplate, {
          jsonp: true,
          parseToHtml: false,
          vars: {
            filtersList,
            summary,
            translations: {
              other_filters: getValue('other_filters'),
              id_filter: getValue('id_filter'),
              filters: getValue('filters'),
              custom_query_warning: getValue('custom_query_warning'),
            },
          },
        });
        const msg = `${getValue('custom_query_btn')}`;
        M.dialog.remove(ogcModalTemplate);
        M.dialog.info(customQueryTemplate, msg);
        const btnApplyFilters = document.createElement('button');
        const btnBack = document.createElement('button');
        setTimeout(() => {
          const temp = document.querySelector('div.m-mapea-container div.m-dialog div.m-title');
          temp.style.backgroundColor = '#71a7d3';
          const button = document.querySelector('div.m-dialog.info div.m-button > button');
          button.innerHTML = getValue('close');
          button.style.width = '75px';
          button.style.backgroundColor = '#71a7d3';
          button.style.display = 'none';
          const buttons = document.querySelector('div.m-dialog.info div.m-button');

          btnBack.textContent = getValue('close');
          btnBack.style.width = '75px';
          btnBack.style.backgroundColor = '#71a7d3';
          btnBack.style.marginLeft = '4px';
          btnBack.setAttribute('data-link', urlInput);
          btnBack.setAttribute('data-service-type', 'OGCAPIFeatures');
          buttons.insertBefore(btnBack, buttons.firstChild);

          btnApplyFilters.textContent = getValue('apply_btn');
          btnApplyFilters.style.width = '75px';
          btnApplyFilters.style.backgroundColor = '#71a7d3';
          btnApplyFilters.setAttribute('data-link', urlInput);
          btnApplyFilters.setAttribute('data-service-type', 'OGCAPIFeatures');
          buttons.insertBefore(btnApplyFilters, buttons.firstChild);
        }, 10);
        btnApplyFilters.addEventListener('click', () => {
          let filterByIDTemp = false;
          let filterByOtherFiltersTemp = false;

          // comprobar el valor del tipo de m-layerswitcher-ogc-filter seleccionado
          if (radioBtnFilterByID.checked) {
            filterByIDTemp = true;
            filterByOtherFiltersTemp = false;
            formInputs = document.querySelectorAll('#m-layerswitcher-ogc-search-form-id input');
          } else if (radioBtnFilterByOther.checked) {
            filterByIDTemp = false;
            filterByOtherFiltersTemp = true;
            formInputs = document.querySelectorAll('#m-layerswitcher-ogc-search-formothers input');
          }
          const cDict = this.getFiltersDict(formInputs);

          const modalActual = document.querySelector('.m-content');

          modalActual.innerHTML = previousModal;

          indexCurrentLayer = layers.findIndex((capa) => {
            return capa.id === selectValue;
          });

          if (M.utils.isNullOrEmpty(cDict)) {
            this.printOGCModal(url, indexCurrentLayer, limit, checked);
          } else if (Object.keys(cDict).length === 0) {
            this.printOGCModal(url, indexCurrentLayer, limit, checked);
          } else {
            this.printOGCModal(
              url, indexCurrentLayer, limit, checked, cDict,
              filterByIDTemp, filterByOtherFiltersTemp,
            );
          }
        });
        btnBack.addEventListener('click', () => {
          const modalActual = document.querySelector('.m-content');
          modalActual.innerHTML = previousModal;
          indexCurrentLayer = layers.findIndex((capa) => {
            return capa.id === selectValue;
          });
          this.printOGCModal(
            url, indexCurrentLayer, limit, checked,
            summary, filterByID, filterByOtherFilters,
          );
        });
      }).catch((err) => {
        M.dialog.error(getValue('no_results'));
      });
    });
  }

  getProperties(selectValue, summary) {
    const urlQuery = document.querySelector('#m-layerswitcher-addservices-search-input').value;
    const selectValueText = document.querySelector('#m-layerswitcher-ogc-vectors-select').selectedOptions[0].text;
    selectValue = document.querySelector('#m-layerswitcher-ogc-vectors-select').value;
    const limit = document.querySelector('#m-layerswitcher-ogc-limit-items').value;
    const checked = document.querySelector('#m-layerswitcher-ogc-search-bbox').checked;
    const limitValue = limit;
    let bboxString;
    if (checked) {
      const bbox = this.map_.getBbox();
      const min = this.getImpl().getTransformedCoordinates(
        this.map_.getProjection().code,
        [bbox.x.min, bbox.y.min],
      );
      const max = this.getImpl().getTransformedCoordinates(
        this.map_.getProjection().code,
        [bbox.x.max, bbox.y.max],
      );
      bboxString = `${min[0]};${min[1]};${max[0]};${max[1]}`;
    }
    const properties = {};
    properties.url = `${urlQuery}/collections/`;
    properties.name = selectValue;
    properties.legend = selectValueText;
    properties.limit = limitValue;
    if (checked) {
      properties.bbox = bboxString;
    }

    const isFiltroPorID = document.querySelector('#m-layerswitcher-ogc-filter-id-input').checked;

    if (isFiltroPorID === true) {
      properties.id = document.querySelector('#m-layerswitcher-ogc-search-form-ID').value;
    } else if (summary !== undefined) {
      properties.conditional = summary;
    }

    properties.format = 'json';

    return properties;
  }

  /**
   * This function get filters as a dict
   *
   * @function
   * @param formInputs - formInputs
   * @private
   */
  getFiltersDict(formInputs) {
    const formData = {};
    const checkboxes = {};
    formInputs.forEach((inputForm) => {
      const id = inputForm.id;
      const attrName = id.substring(inputForm.id.indexOf('form-') + 5);
      switch (inputForm.type) {
        case 'checkbox':
          // Agrupar los checkboxes por su atributo name
          if (!checkboxes[attrName]) {
            checkboxes[attrName] = [];
          }

          checkboxes[attrName].push(inputForm);
          // if (inputForm.checked !== false) {
          //   formData[attrName] = inputForm.value;
          // }
          break;
        case 'date':
          if (!M.utils.isNullOrEmpty(inputForm.value)) {
            const date = new Date(inputForm.value);
            formData[attrName] = date.toISOString().split('T')[0];
          }
          break;
        default:
          if (!M.utils.isNullOrEmpty(inputForm.value)) {
            // formData[attrName] = encodeURIComponent(inputForm.value);
            formData[attrName] = inputForm.value;
          }
      }
    });

    // Procesar los checkboxes agrupados
    Object.keys(checkboxes).forEach((name) => {
      const checkboxGroup = checkboxes[name];
      /* eslint-disable-next-line max-len */
      const checkedValues = checkboxGroup.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

      if (checkedValues.length === 1) {
        // Si solo hay un checkbox marcado, establecer el valor correspondiente en formData
        formData[name] = checkedValues[0];
      }
    });


    const propsKeysForm = Object.keys(formData);
    const propsValuesForm = Object.values(formData);

    const cDict = {};

    propsKeysForm.forEach((key, i) => {
      cDict[key] = propsValuesForm[i];
    });
    return cDict;
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
