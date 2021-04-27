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

const CATASTRO = 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx';
const CODSI_CATALOG = 'http://www.idee.es/csw-codsi-idee/srv/spa/q?_content_type=json&bucket=s101&facet.q=type%2Fservice&fast=index&from=*1&serviceType=view&resultType=details&sortBy=title&sortOrder=asc&to=*2';
const CODSI_PAGESIZE = 9;

export default class FullTOCControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(http, https, precharged, codsi) {
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

    this.codsi = codsi;

    this.stateSelectAll = false;

    this.filterName = undefined;
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
        this.afterRender();
      });
    });
  }

  afterRender() {
    setTimeout(() => {
      this.template_.querySelector('.m-fulltoc-container .m-title .span-title').click();
    }, 500);
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
    let scroll;
    let notRender = false;
    if (!M.utils.isNullOrEmpty(evt.target)) {
      if (document.querySelector('.m-panel.m-plugin-fulltoc.opened ul.m-layers') !== null) {
        scroll = document.querySelector('.m-panel.m-plugin-fulltoc.opened ul.m-layers').scrollTop;
      }

      const layerName = evt.target.getAttribute('data-layer-name');
      const layerURL = evt.target.getAttribute('data-layer-url');
      if (!M.utils.isNullOrEmpty(layerName) && layerURL !== null) {
        evt.stopPropagation();
        const layer = this.map_.getLayers().filter((l) => {
          return l.name === layerName && l.url === layerURL;
        })[0];
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
              styles: layer.capabilitiesMetadata.style,
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
          const vars = {
            name: layer.name,
            title: layer.legend,
            abstract: layer.capabilitiesMetadata.abstract,
            translations: {
              title: getValue('title'),
              name: getValue('name'),
              abstract: getValue('abstract'),
              provider: getValue('provider'),
              query_metadata: getValue('query_metadata'),
              download_center: getValue('download_center'),
              see_more: getValue('see_more'),
              metadata_abstract: getValue('metadata_abstract'),
              responsible: getValue('responsible'),
              access_constraints: getValue('access_constraints'),
              use_constraints: getValue('use_constraints'),
              online_resources: getValue('online_resources'),
            },
          };

          if (layer.type === 'WMS') {
            const murl = layer.capabilitiesMetadata.metadataURL;
            vars.metadata = !M.utils.isNullOrEmpty(murl) ? murl[0].OnlineResource : '';
            if (!M.utils.isNullOrEmpty(layer.capabilitiesMetadata.attribution)) {
              vars.provider = `${layer.capabilitiesMetadata.attribution.Title}`;
              if (layer.capabilitiesMetadata.attribution.OnlineResource !== undefined) {
                vars.provider += `<p><a class="m-fulltoc-provider-link" href="${layer.capabilitiesMetadata.attribution.OnlineResource}" target="_blank">${layer.capabilitiesMetadata.attribution.OnlineResource}</a></p>`;
              }
            }
          } else if (layer.type === 'WMTS') {
            if (!M.utils.isNullOrEmpty(layer.capabilitiesMetadata.attribution)) {
              vars.provider = `${layer.capabilitiesMetadata.attribution.ProviderName}` +
              `<p><a class="m-fulltoc-provider-link" href="${layer.capabilitiesMetadata.attribution.ProviderSite}" target="_blank">${layer.capabilitiesMetadata.attribution.ProviderSite}</a></p>`;
              const sc = layer.capabilitiesMetadata.attribution.ServiceContact;
              if (!M.utils.isNullOrEmpty(sc) && !M.utils.isNullOrEmpty(sc.ContactInfo)) {
                const mail = sc.ContactInfo.Address.ElectronicMailAddress;
                vars.provider += `<p><a class="m-fulltoc-provider-link" href="mailto:${mail}">${mail}</a></p>`;
              }
            }
          }

          if (!M.utils.isNullOrEmpty(vars.metadata) && M.utils.isUrl(vars.metadata)) {
            M.remote.get(vars.metadata).then((response) => {
              const metadataText = response.text;
              const unfiltered = metadataText.split('<gmd:MD_DigitalTransferOptions>')[1].split('<gmd:URL>').filter((elem) => {
                return elem.indexOf('centrodedescargas') > -1 && elem.indexOf('atom') === -1;
              });

              if (unfiltered.length > 0) {
                const downloadCenter = unfiltered[0].split('</gmd:URL>')[0].trim();
                vars.downloadCenter = downloadCenter;
              }

              const transfer = metadataText.split('<gmd:MD_DigitalTransferOptions>')[1].split('<gmd:onLine>');
              const dataid = metadataText.split('<gmd:MD_DataIdentification>')[1];
              const legal = metadataText.split('<gmd:MD_LegalConstraints>')[1];
              let metadataService;
              let metadataAbstract;
              let responsible;
              let accessConstraint;
              let useConstraint;
              let onlineResources;

              try {
                metadataService = dataid.split('<gmd:CI_Citation>')[1].split('</gmd:CI_Citation>')[0]
                  .split('CharacterString>')[1].split('</gco')[0].trim();
              } catch (err) {
                metadataService = '';
              }

              try {
                metadataAbstract = dataid.split('<gmd:abstract>')[1].split('</gmd:abstract>')[0]
                  .split('CharacterString>')[1].split('</gco')[0].trim();
              } catch (err) {
                metadataAbstract = '';
              }

              try {
                const poc = dataid.split('<gmd:pointOfContact>')[1];
                responsible = poc.split('<gmd:organisationName>')[1]
                  .split('</gmd:organisationName>')[0].split('CharacterString>')[1].split('</gco')[0].trim();
                if (poc.indexOf('<gmd:CI_OnlineResource>') > -1) {
                  const link = poc.split('<gmd:CI_OnlineResource>')[1].split('<gmd:URL>')[1].split('</gmd:URL>')[0].trim();
                  responsible = `<a href="${link}" target="_blank">${responsible}</a>`;
                }
              } catch (err) {
                responsible = '';
              }

              try {
                accessConstraint = legal.split('<gmd:accessConstraints>')[1].split('<gmd:MD_RestrictionCode')[1]
                  .split('>')[1].split('<')[0].trim();
              } catch (err) {
                accessConstraint = '';
              }

              try {
                useConstraint = legal.split('<gmd:useConstraints>')[1].split('<gmd:MD_RestrictionCode')[1]
                  .split('>')[1].split('<')[0].trim();
              } catch (err) {
                useConstraint = '';
              }

              try {
                if (transfer.length > 0) {
                  onlineResources = [];
                  transfer.forEach((t) => {
                    if (t.indexOf('<gmd:name>') > -1 && t.indexOf('<gmd:URL>')) {
                      const link = {
                        name: t.split('<gmd:name>')[1].split('</gmd:name>')[0].split('CharacterString>')[1].split('</gco')[0].trim(),
                        url: t.split('<gmd:URL>')[1].split('</gmd:URL>')[0].trim(),
                      };

                      onlineResources.push(link);
                    }
                  });
                }
              } catch (err) {
                onlineResources = '';
              }

              if (!M.utils.isNullOrEmpty(metadataService)) {
                vars.metadataService = metadataService;
                vars.extended = true;
              }

              if (!M.utils.isNullOrEmpty(metadataAbstract)) {
                vars.metadataAbstract = metadataAbstract;
                vars.extended = true;
              }

              if (!M.utils.isNullOrEmpty(responsible)) {
                vars.responsible = responsible;
                vars.extended = true;
              }

              if (!M.utils.isNullOrEmpty(accessConstraint)) {
                vars.accessConstraint = accessConstraint;
                vars.extended = true;
              }

              if (!M.utils.isNullOrEmpty(useConstraint)) {
                vars.useConstraint = useConstraint;
                vars.extended = true;
              }

              if (!M.utils.isNullOrEmpty(onlineResources)) {
                vars.onlineResources = onlineResources;
                vars.extended = true;
              }

              this.renderInfo(vars);
            }).catch((err) => {
              this.renderInfo(vars);
            });
          } else {
            this.renderInfo(vars);
          }
        }
      } else if (evt.target.classList.contains('m-fulltoc-addservice')) {
        const precharged = this.precharged;
        const hasPrecharged = (precharged.groups !== undefined && precharged.groups.length > 0) ||
          (precharged.services !== undefined && precharged.services.length > 0);
        const codsiActive = this.codsi;
        const addServices = M.template.compileSync(addServicesTemplate, {
          jsonp: true,
          parseToHtml: false,
          vars: {
            precharged,
            hasPrecharged,
            codsiActive,
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
          if (document.querySelector('#m-fulltoc-addservices-list-btn') !== null) {
            document.querySelector('#m-fulltoc-addservices-list-btn').addEventListener('click', e => this.showSuggestions(e));
          }

          if (document.querySelector('#m-fulltoc-addservices-codsi-btn') !== null) {
            document.querySelector('#m-fulltoc-addservices-codsi-btn').addEventListener('click', e => this.showCODSI(e));
            document.querySelector('#m-fulltoc-addservices-codsi-filter-btn').addEventListener('click', (e) => {
              this.loadCODSIResults(1);
            });

            document.querySelector('#m-fulltoc-addservices-codsi-search-input').addEventListener('keypress', (e) => {
              if (e.keyCode === 13) {
                this.loadCODSIResults(1);
              }
            });

            document.querySelector('#m-fulltoc-addservices-codsi-clean-btn').addEventListener('click', (e) => {
              document.querySelector('#m-fulltoc-addservices-codsi-search-input').value = '';
              this.loadCODSIResults(1);
            });
          }


          document.querySelector('#m-fulltoc-addservices-search-btn').addEventListener('click', (e) => {
            this.filterName = undefined;
            this.readCapabilities(e);
          });

          document.querySelector('#m-fulltoc-addservices-search-input').addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
              this.filterName = undefined;
              this.readCapabilities(e);
            }
          });

          document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
          const button = document.querySelector('div.m-dialog.info div.m-button > button');
          button.innerHTML = getValue('close');
          button.style.width = '75px';
          button.style.backgroundColor = '#71a7d3';
          document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').addEventListener('keyup', (e) => {
            const url = document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').value.trim();
            document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').value = url;
          });

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
      this.render(scroll);
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
      const elem = document.querySelector('#m-fulltoc-information .show-more-metadata');
      if (elem !== null) {
        elem.addEventListener('click', () => {
          const block = document.querySelector('#m-fulltoc-information .more-metadata');
          if (block.style.display !== 'block') {
            block.style.display = 'block';
            elem.innerHTML = `<span class="icon-colapsar"></span>&nbsp;${getValue('see_less')}`;
          } else {
            block.style.display = 'none';
            elem.innerHTML = `<span class="icon-desplegar"></span>&nbsp;${getValue('see_more')}`;
          }
        });
      }
    }, 10);
  }

  showSuggestions() {
    if (document.querySelector('#m-fulltoc-addservices-codsi') !== null) {
      document.querySelector('#m-fulltoc-addservices-codsi').style.display = 'none';
    }

    document.querySelector('#m-fulltoc-addservices-results').innerHTML = '';
    document.querySelector('#m-fulltoc-addservices-suggestions').style.display = 'block';
  }

  showCODSI() {
    document.querySelector('#m-fulltoc-addservices-results').innerHTML = '';
    document.querySelector('#m-fulltoc-addservices-codsi').style.display = 'block';
    document.querySelector('#m-fulltoc-addservices-suggestions').style.display = 'none';
    this.loadCODSIResults(1);
  }

  loadCODSIResults(pageNumber) {
    document.querySelector('#m-fulltoc-addservices-codsi-results').innerHTML = '<p class="m-fulltoc-loading"><span class="icon-spinner" /></p>';
    const query = document.querySelector('#m-fulltoc-addservices-codsi-search-input').value.trim();
    const start = 1 + ((pageNumber - 1) * CODSI_PAGESIZE);
    const end = pageNumber * CODSI_PAGESIZE;
    let url = CODSI_CATALOG.split('*1').join(`${start}`).split('*2').join(`${end}`);
    if (query !== '') {
      url += `&any=*${query}*`;
    }

    M.remote.get(url).then((response) => {
      const data = JSON.parse(response.text);
      const total = data.summary['@count'];
      const results = [];
      if (data.metadata !== undefined) {
        data.metadata.forEach((m) => {
          let links = [];
          if (Array.isArray(m.link)) {
            m.link.forEach((l) => {
              let parts = [];
              if (l.indexOf('||') > -1) {
                parts = l.split('||').filter((part) => {
                  return part.indexOf('http://') > -1 || part.indexOf('https://') > -1;
                });
              } else if (l.indexOf('|') > -1) {
                parts = l.split('|').filter((part) => {
                  return part.indexOf('http://') > -1 || part.indexOf('https://') > -1;
                });
              }

              links = links.concat(parts);
            });
          } else {
            let parts = [];
            if (m.link.indexOf('||') > -1) {
              parts = m.link.split('||').filter((part) => {
                return part.indexOf('http://') > -1 || part.indexOf('https://') > -1;
              });
            } else if (m.link.indexOf('|') > -1) {
              parts = m.link.split('|').filter((part) => {
                return part.indexOf('http://') > -1 || part.indexOf('https://') > -1;
              });
            }

            links = links.concat(parts);
          }

          if (links.length > 0) {
            results.push({
              title: m.title || m.defaultTitle,
              url: links[0].split('?')[0],
            });
          }
        });
      }

      this.renderCODSIResults(results);
      this.renderCODSIPagination(pageNumber, total);
    }).catch((err) => {
      M.dialog.error(getValue('exception.codsi'));
    });
  }

  renderCODSIResults(results) {
    document.querySelector('#m-fulltoc-addservices-codsi-results').innerHTML = '';
    if (results.length > 0) {
      let textResults = '<table><tbody>';
      results.forEach((r) => {
        textResults += `<tr><td><span class="m-fulltoc-codsi-result" data-link="${r.url}">${r.title}</span></td></tr>`;
      });

      textResults += '</tbody></table>';
      document.querySelector('#m-fulltoc-addservices-codsi-results').innerHTML = textResults;
      document.querySelectorAll('#m-fulltoc-addservices-codsi-results .m-fulltoc-codsi-result').forEach((elem) => {
        elem.addEventListener('click', (evt) => {
          const url = elem.getAttribute('data-link');
          document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').value = url;
          this.filterName = undefined;
          this.readCapabilities(evt);
        });
      });
    } else {
      document.querySelector('#m-fulltoc-addservices-codsi-results').innerHTML = `<div class="codsi-no-results">${getValue('exception.codsi_no_results')}</div>`;
    }
  }

  renderCODSIPagination(pageNumber, total) {
    document.querySelector('#m-fulltoc-addservices-codsi-pagination').innerHTML = '';
    if (total > 0) {
      const numPages = Math.ceil(total / CODSI_PAGESIZE);
      let buttons = '';
      for (let i = 1; i <= numPages; i += 1) {
        if (i === pageNumber) {
          buttons += `<button class="m-fulltoc-addservices-pagination-btn" disabled>${i}</button>`;
        } else {
          buttons += `<button class="m-fulltoc-addservices-pagination-btn">${i}</button>`;
        }
      }

      document.querySelector('#m-fulltoc-addservices-codsi-pagination').innerHTML = buttons;
      document.querySelectorAll('#m-fulltoc-addservices-codsi-pagination button').forEach((elem, index) => {
        elem.addEventListener('click', () => {
          this.loadCODSIResults(index + 1);
        });
      });
    }
  }

  loadSuggestion(evt) {
    const url = evt.target.getAttribute('data-link');
    try {
      const group = evt.target.parentElement.parentElement.parentElement;
      const nameGroup = group.querySelector('span.m-fulltoc-suggestion-caret').innerText;
      this.filterName = nameGroup;
      if (group.localName === 'tbody') {
        this.filterName = 'none';
      }
      /* eslint-disable no-empty */
    } catch (err) {}
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
    const scroll = document.querySelector('.m-panel.m-plugin-fulltoc.opened ul.m-layers').scrollTop;
    const styleSelected = document.querySelector('#m-fulltoc-change-config #m-fulltoc-style-select').value;
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
          this.render(scroll);
        }
      }
    }
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
          const isRaster = ['wms', 'wmts'].indexOf(layer.type.toLowerCase()) > -1;
          const isNotWMSFull = !((layer.type === M.layer.type.WMS) &&
          M.utils.isNullOrEmpty(layer.name));
          return (isTransparent && displayInLayerSwitcher && isRaster && isNotWMSFull);
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
            drag_drop: getValue('drag_drop'),
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
  render(scroll) {
    this.getTemplateVariables(this.map_).then((templateVars) => {
      const html = M.template.compileSync(template, {
        vars: templateVars,
      });

      this.registerImgErrorEvents_(html);
      this.template_.innerHTML = html.innerHTML;
      const layerList = this.template_.querySelector('.m-fulltoc-container .m-layers');
      const layers = templateVars.layers;
      if (layerList !== null) {
        Sortable.create(layerList, {
          animation: 150,
          ghostClass: 'm-fulltoc-gray-shadow',
          filter: '.m-opacity-container',
          preventOnFilter: false,
          onEnd: (evt) => {
            const from = evt.from;
            let maxZIndex = Math.max(...(layers.map((l) => {
              return l.getZIndex();
            })));
            from.querySelectorAll('li.m-layer div.m-visible-control span').forEach((elem) => {
              const name = elem.getAttribute('data-layer-name');
              const url = elem.getAttribute('data-layer-url');
              const filtered = layers.filter((layer) => {
                return layer.name === name && layer.url === url;
              });

              if (filtered.length > 0) {
                filtered[0].setZIndex(maxZIndex);
                maxZIndex -= 1;
              }
            });
          },
        });

        if (scroll !== undefined) {
          document.querySelector('.m-panel.m-plugin-fulltoc.opened ul.m-layers').scrollTop = scroll;
        }
      }
    });
  }

  registerImgErrorEvents_(html) {
    const imgElements = html.querySelectorAll('img');
    Array.prototype.forEach.call(imgElements, (imgElem) => {
      imgElem.addEventListener('error', (evt) => {
        const layerName = evt.target.getAttribute('data-layer-name');
        const layerURL = evt.target.getAttribute('data-layer-url');
        const legendErrorUrl = M.utils.concatUrlPaths([M.config.THEME_URL,
          M.layer.WMS.LEGEND_ERROR]);
        const layer = this.map_.getLayers().filter((l) => {
          return l.name === layerName && l.url === layerURL;
        })[0];
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
    const hasMetadata = !M.utils.isNullOrEmpty(layer.capabilitiesMetadata) &&
      !M.utils.isNullOrEmpty(layer.capabilitiesMetadata.abstract);
    return new Promise((success, fail) => {
      const layerVarTemplate = {
        visible: (layer.isVisible() === true),
        id: layer.name,
        title: layerTitle,
        outOfRange: !layer.inRange(),
        opacity: layer.getOpacity(),
        metadata: hasMetadata,
        type: layer.type,
        hasStyles: hasMetadata && layer.capabilitiesMetadata.style.length > 1,
        url: layer.url,
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

  /**
   * This function reads service capabilities
   *
   * @function
   * @private
   * @param {Event} evt - Click event
   */
  readCapabilities(evt) {
    if (document.querySelector('#m-fulltoc-addservices-codsi') !== null) {
      document.querySelector('#m-fulltoc-addservices-codsi').style.display = 'none';
    }

    evt.preventDefault();
    let HTTPeval = false;
    let HTTPSeval = false;
    document.querySelector('#m-fulltoc-addservices-suggestions').style.display = 'none';
    const url = document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').value.trim().split('?')[0];
    const type = (document.getElementById('m-fulltoc-addservices-wmts').checked || url.indexOf('wmts') > -1) ? 'WMTS' : 'WMS';
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
            const promise = new Promise((success, reject) => {
              const id = setTimeout(() => reject(), 15000);
              M.remote.get(M.utils.getWMTSGetCapabilitiesUrl(url)).then((response) => {
                clearTimeout(id);
                success(response);
              });
            });

            promise.then((response) => {
              try {
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
              } catch (err) {
                M.dialog.error(getValue('exception.capabilities'));
              }
            }).catch((err) => {
              M.dialog.error(getValue('exception.capabilities'));
            });
          } else {
            const promise = new Promise((success, reject) => {
              const id = setTimeout(() => reject(), 15000);
              M.remote.get(M.utils.getWMSGetCapabilitiesUrl(url, '1.3.0')).then((response) => {
                clearTimeout(id);
                success(response);
              });
            });

            promise.then((response) => {
              try {
                const getCapabilitiesParser = new M.impl.format.WMSCapabilities();
                const getCapabilities = getCapabilitiesParser.read(response.xml);
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
              } catch (err) {
                M.dialog.error(getValue('exception.capabilities'));
              }
            }).catch((err) => {
              const promise2 = new Promise((success, reject) => {
                const id = setTimeout(() => reject(), 15000);
                M.remote.get(M.utils.getWMTSGetCapabilitiesUrl(url)).then((response) => {
                  clearTimeout(id);
                  success(response);
                });
              });

              promise2.then((response) => {
                try {
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
                } catch (error) {
                  M.dialog.error(getValue('exception.capabilities'));
                }
              }).catch((eerror) => {
                M.dialog.error(getValue('exception.capabilities'));
              });
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
    if (this.filterName === undefined) {
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
          if (service.type === layer.type && service.url === layer.url) {
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
              if (service.type === layer.type && service.url === layer.url) {
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

  getParents(capabilities, layer) {
    const name = layer.name;
    const layers = capabilities.Capability.Layer.Layer;
    let parent;
    layers.forEach((l) => {
      if (l.Name !== name && l.Layer !== undefined && l.Layer.length > 0) {
        const filtered = l.Layer.filter((ll) => {
          return ll.Name === name;
        });

        if (filtered.length > 0) {
          parent = l.Title;
        } else if (M.utils.isObject(l.Layer.Layer) && l.Layer.Layer.Name === name) {
          parent = `${l.Title} - ${l.Layer.Layer.Title}`;
        } else if (M.utils.isArray(l.Layer) && l.Layer.length > 0) {
          const innerFiltered = l.Layer.filter((ll) => {
            return ll.Name === name;
          });

          if (innerFiltered.length > 0) {
            parent = `${l.Title} - ${l.Layer.Title}`;
          } else {
            const innerInnerFiltered = l.Layer.filter((ll) => {
              let contains = false;
              if (ll.Layer !== undefined && ll.Layer.length > 0) {
                contains = ll.Layer.filter((lll) => {
                  return lll.Name === name;
                }).length > 0;
              }

              return contains;
            });

            if (innerInnerFiltered.length > 0) {
              parent = `${l.Title} - ${innerInnerFiltered[0].Title}`;
            }
          }
        }
      }
    });

    if (parent !== undefined) {
      /* eslint-disable no-param-reassign */
      layer.legend = `${parent} - ${layer.legend}`;
    }
  }

  /**
   * This function shows results
   *
   * @function
   * @private
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

    const container = document.querySelector('#m-fulltoc-addservices-results');
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
          let contact = `${sp.ProviderName}<p><a class="m-fulltoc-provider-link" href="${sp.ProviderSite}" target="_blank">${sp.ProviderSite}</a></p>`;
          const ci = sp.ServiceContact.ContactInfo;
          if (!M.utils.isNullOrEmpty(sp.ServiceContact) && !M.utils.isNullOrEmpty(ci)) {
            const mail = ci.Address.ElectronicMailAddress;
            contact += `<p><a class="m-fulltoc-provider-link" href="mailto:${mail}">${mail}</a></p>`;
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
      M.utils.enableTouchScroll(container);
      const results = container.querySelectorAll('span.m-check-fulltoc-addservices');
      for (let i = 0; i < results.length; i += 1) {
        results[i].addEventListener('click', evt => this.registerCheck(evt));
      }

      const resultsNames = container.querySelectorAll('.table-results .table-container table tbody tr td.table-layer-name');
      for (let i = 0; i < resultsNames.length; i += 1) {
        resultsNames[i].addEventListener('click', evt => this.registerCheckFromName(evt));
      }


      container.querySelector('#m-fulltoc-addservices-selectall').addEventListener('click', evt => this.registerCheck(evt));
      container.querySelector('.m-fulltoc-addservices-add').addEventListener('click', evt => this.addLayers(evt));
      const elem = container.querySelector('.m-fulltoc-show-capabilities');
      elem.addEventListener('click', () => {
        const block = container.querySelector('.m-fulltoc-capabilities-container');
        if (block.style.display !== 'block') {
          block.style.display = 'block';
          elem.innerHTML = `<span class="icon-colapsar"></span>&nbsp;${getValue('hide_service_info')}`;
        } else {
          block.style.display = 'none';
          elem.innerHTML = `<span class="icon-desplegar"></span>&nbsp;${getValue('show_service_info')}`;
        }
      });
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
   * This function registers the marks or unmarks check and click allselect from layer name
   *
   * @function
   * @private
   * @param {Event} evt - Event
   */
  registerCheckFromName(evt) {
    const e = (evt || window.event);
    e.target.parentElement.querySelector('span.m-check-fulltoc-addservices').click();
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
          const name = this.capabilities[j].name;
          if (elmSel[i].id === name || elmSel[i].name === name) {
            if (this.capabilities[j].url.indexOf(CATASTRO) > -1) {
              this.capabilities[j].version = '1.1.1';
            }

            this.capabilities[j].tiled = this.capabilities[j].type === 'WMTS';
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
            }

            layers.push(this.capabilities[j]);
          }
        }
      }

      this.map_.addLayers(layers);
      this.afterRender();
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
    if (document.querySelector('#m-fulltoc-addservices-codsi') !== null) {
      document.querySelector('#m-fulltoc-addservices-codsi').style.display = 'none';
    }

    document.querySelector('#m-fulltoc-addservices-results').innerHTML = '';
    document.querySelector('#m-fulltoc-addservices-suggestions').style.display = 'none';
    document.querySelector('div.m-dialog #m-fulltoc-addservices-search-input').value = '';
  }
}
