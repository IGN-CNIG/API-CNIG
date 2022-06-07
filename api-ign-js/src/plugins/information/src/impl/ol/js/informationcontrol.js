/**
 * @module M/impl/control/InformationControl
 */

import informationPopupTemplate from '../../../templates/information_popup';
import informationLayersTemplate from '../../../templates/information_layers';
import { getValue } from '../../../facade/js/i18n/language';

/**
 * Regular expressions of Information
 * @type {object}
 * @public
 * @api
 */
const regExs = {
  gsResponse: /^results[\w\s\S]*'http:/i,
  msNewFeature: /feature(\s*)(\w+)(\s*):/i,
  gsNewFeature: /#newfeature#/,
  gsGeometry: /geom$/i,
  msGeometry: /boundedby$/i,
  msUnsupportedFormat: /error(.*)unsupported(.*)info_format/i,
};

const POPUP_TITLE = getValue('title');

export default class InformationControl extends M.impl.Control {
  constructor(format, featureCount, buffer) {
    super({});

    /**
     * Format to request information
     *
     * @type {string}
     * @private
     */
    this.format_ = format;

    if ((M.utils.normalize(this.format_) === 'plain') || (M.utils.normalize(this.format_) === 'text/plain')) {
      this.format_ = 'text/plain';
    } else if ((M.utils.normalize(this.format_) === 'gml') || (M.utils.normalize(this.format_) === 'application/vnd.ogc.gml')) {
      this.format_ = 'application/vnd.ogc.gml';
    } else {
      this.format_ = 'text/html';
    }

    /**
     * Maximum feature count
     *
     * @private
     * @type {Integer}
     */
    this.featureCount_ = featureCount;

    /**
     * Buffer for click information
     *
     * @private
     * @type {Integer}
     */
    this.buffer_ = buffer;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;
  }

  /**
   * This function adds the control to the specified map
   *
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api
   */
  addTo(map, html) {
    super.addTo(map, html);
    this.facadeMap_ = map;
    map.getMapImpl().addControl(this);
  }

  /**
   * This function adds the event singleclick to the specified map
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.addOnClickEvent_();
  }

  /**
   * This function remove the event singleclick to the specified map
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.deleteOnClickEvent_();
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   * @export
   */
  destroy() {
    this.deactivate();
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }

  /**
   * This function remove the event singleclick to the specified map
   *
   * @private
   * @function
   */
  deleteOnClickEvent_() {
    ol.Observable.unByKey(this.clickEventKey_);
    document.querySelector('.m-control.m-container.m-information-container').classList.remove('activated');
  }

  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  addOnClickEvent_() {
    const olMap = this.facadeMap_.getMapImpl();
    this.clickEventKey_ = olMap.on('singleclick', e => this.buildUrl_(M.dialog, e));
    document.querySelector('.m-control.m-container.m-information-container').classList.add('activated');
  }

  /**
   * This function builds the query URL and show results
   *
   * @private
   * @function
   * @param {ol.MapBrowserPointerEvent} evt - Browser point event
   */
  buildUrl_(dialogParam, evt) {
    this.evt = evt;
    const olMap = this.facadeMap_.getMapImpl();
    const wmsInfoURLS = this.buildWMSInfoURL(this.facadeMap_.getWMS());
    const wmtsInfoURLS = this.buildWMTSInfoURL(this.facadeMap_.getWMTS());
    const layerNamesUrls = [...wmtsInfoURLS, ...wmsInfoURLS]
      .filter(layer => !M.utils.isNullOrEmpty(layer));
    if (layerNamesUrls.length > 0) {
      this.showInfoFromURL_(layerNamesUrls, evt.coordinate, olMap);
    } else {
      dialogParam.info(getValue('not_queryable'));
    }
  }

  /**
   * @function
   * @public
   * @api
   */
  buildWMSInfoURL(wmsLayers) {
    const olMap = this.facadeMap_.getMapImpl();
    const viewResolution = olMap.getView().getResolution();
    const srs = this.facadeMap_.getProjection().code;
    return wmsLayers.map((layer) => {
      const olLayer = layer.getImpl().getOL3Layer();
      let param;
      if (layer.isVisible() && layer.isQueryable() && !M.utils.isNullOrEmpty(olLayer)) {
        param = {};
        const informationParams = {
          INFO_FORMAT: this.format_,
          FEATURE_COUNT: this.featureCount_,
        };
        const regexBuffer = /buffer/i;
        const source = olLayer.getSource();
        const coord = this.evt.coordinate;
        // const url = source.getGetFeatureInfoUrl(coord, viewResolution, srs, informationParams);
        if (!regexBuffer.test(layer.url)) {
          informationParams.BUFFER = this.buffer_;
        }
        const url = source.getFeatureInfoUrl(coord, viewResolution, srs, informationParams);
        param = { layer: layer.legend || layer.name, url };
      }
      return param;
    });
  }

  /**
   * @function
   * @public
   * @api
   */
  buildWMTSInfoURL(wmtsLayers) {
    return wmtsLayers.map((layer) => {
      let param;
      if (layer.isVisible() && layer.isQueryable() && !M.utils.isNullOrEmpty(layer)) {
        param = {};
        const infoFormat = this.format_;
        const coord = this.evt.coordinate;
        const url = layer.getFeatureInfoUrl(coord, this.facadeMap_.getZoom(), infoFormat).replace('row=-', 'row=');
        param = { layer: layer.legend || layer.name, url };
      }
      return param;
    });
  }

  /**
   * This function specifies whether the information is valid
   *
   * @param {string} info - Information to validate
   * @param {string} formato - Specific format to validate
   * @returns {boolean} res - Is valid or not format
   * @private
   * @function
   */
  static insert(info, formato) {
    let res = false;
    switch (formato) {
      case 'text/html':
        // ex
        const infoContainer = document.createElement('div');
        infoContainer.innerHTML = info;
        // content
        let content = '';
        Array.prototype.forEach.call(infoContainer.querySelectorAll('body'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('div'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('table'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('b'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('span'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('input'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('a'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('img'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('p'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('ul'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('li'), (element) => {
          content += element.innerHTML.trim();
        });

        if ((content.length > 0) && !/WMS\s+server\s+error/i.test(info)) {
          res = true;
        }
        break;

      case 'application/vnd.ogc.gml': // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        const formater = new ol.format.WFS();
        const features = formater.readFeatures(info);
        res = (features.length > 0);
        break;

      case 'text/plain': // exp reg
        if (!/returned\s+no\s+results/i.test(info) && !/features\s+were\s+found/i.test(info) && !/:$/i.test(info)) {
          res = true;
        }
        break;
      default:
    }
    return res;
  }

  /**
   * This function formats the response
   *
   * @param {string} info - Information to formatting
   * @param {string} formato - Specific format
   * @param {string} layername - Layer name
   * @returns {string} information - Formatted information
   * @private
   * @function
   */
  formatInfo(info, formato, layerName) {
    let formatedInfo = null;
    switch (formato) {
      case 'text/html': // ex
        formatedInfo = info;
        break;
      case 'application/vnd.ogc.gml': // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        // let formater = new ol.format.GML();
        // let feature = formater.readFeatures(info)[0];
        const formater = new ol.format.WFS();
        const features = formater.readFeatures(info);
        formatedInfo = '';
        features.forEach((feature) => {
          const attr = feature.getKeys();
          formatedInfo += '<div class=\'divinfo\'>';
          formatedInfo += `<table class='mapea-table'><tbody><tr><td class='header' colspan='3'>' ${M.utils.beautifyAttribute(layerName)} '</td></tr>'`;
          for (let i = 0, ilen = attr.length; i < ilen; i += 1) {
            const attrName = attr[i];
            const attrValue = feature.get(attrName);

            formatedInfo += '<tr><td class="key"><b>';
            formatedInfo += M.utils.beautifyAttribute(attrName);
            formatedInfo += '</b></td><td class="value">';
            formatedInfo += attrValue;
            formatedInfo += '</td></tr>';
          }
          formatedInfo += '</tbody></table></div>';
        });
        break;
      case 'text/plain': // exp reg
        if (regExs.gsResponse.test(info)) {
          formatedInfo = this.txtToHtmlGeoserver(info, layerName);
        } else {
          formatedInfo = this.txtToHtmlMapserver(info, layerName);
        }
        break;
      default:
    }
    return formatedInfo;
  }

  /**
   * This function indicates whether the format is accepted by the layer - Specific format text/html
   *
   * @param {string} info - Response to consult layer
   * @param {string} formato - Specific format
   * @returns {boolean} unsupported - It indicates whether the format is accepted
   * @private
   * @function
   */
  static unsupportedFormat(info, formato) {
    let unsupported = false;
    if (formato === 'text/html') {
      unsupported = regExs.msUnsupportedFormat.test(info);
    }
    return unsupported;
  }

  /**
   * This function return formatted information. Specific Geoserver
   *
   * @private
   * @function
   * @param {string} info - Information to formatting
   * @param {string} layername - Layer name
   * @returns {string} html - Information formated
   */
  txtToHtmlGeoserver(info, layerName) {
    // get layer name from the header
    // let layerName = info.replace(/[\w\s\S]*\:(\w*)\'\:[\s\S\w]*/i, "$1");
    // remove header
    let infoVar = info;

    infoVar = infoVar.replace(/[\w\s\S]*':/i, '');

    infoVar = infoVar.replace(/---(-*)(n+)---(-*)/g, '#newfeature#');

    const attrValuesString = infoVar.split('\n');

    let html = '<div class=\'divinfo\'>';

    // build the table
    html += `<table class='mapea-table'><tbody><tr><td class='header' colspan='3'>${M.utils.beautifyAttribute(layerName)}</td></tr>`;

    for (let i = 0, ilen = attrValuesString.length; i < ilen; i += 1) {
      const attrValueString = attrValuesString[i].trim();
      if (attrValueString.indexOf('=') !== -1) {
        const attrValue = attrValueString.split('=');
        const attr = attrValue[0].trim();
        let value = '-';
        if (attrValue.length > 1) {
          value = attrValue[1].trim();
          if (value.length === 0 || value === 'null') {
            value = '-';
          }
        }

        if (regExs.gsGeometry.test(attr) === false) {
          html += '<tr><td class="key"><b>';
          html += M.utils.beautifyAttribute(attr);
          html += '</b></td><td class="value">';
          html += value;
          html += '</td></tr>';
        }
      } else if (regExs.gsNewFeature.test(attrValueString)) {
        // set new header
        html += `<tr><td class="header" colspan="3">${M.utils.beautifyAttribute(layerName)}</td></tr>`;
      }
    }

    html += '</tbody></table></div>';

    return html;
  }

  /**
   * This function return formatted information. Specific Mapserver
   *
   * @private
   * @function
   * @param {string} info - Information to formatting
   * @returns {string} html - Information formated
   */
  txtToHtmlMapserver(info) {
    let infoVar = info;
    // remove header
    infoVar = infoVar.replace(/[\w\s\S]*(layer)/i, '$1');

    // get layer name
    const layerName = infoVar.replace(/layer(\s*)'(\w+)'[\w\s\S]*/i, '$2');

    // remove layer name
    infoVar = infoVar.replace(/layer(\s*)'(\w+)'([\w\s\S]*)/i, '$3');

    // remove feature number
    infoVar = infoVar.replace(/feature(\s*)(\w*)(\s*)(:)([\w\s\S]*)/i, '$5');

    // remove simple quotes
    infoVar = infoVar.replace(/'/g, '');

    // replace the equal (=) with (;)
    infoVar = infoVar.replace(/=/g, ';');

    const attrValuesString = infoVar.split('\n');

    let html = '';
    const htmlHeader = `<table class='mapea-table'><tbody><tr><td class='header' colspan='3'>${M.utils.beautifyAttribute(layerName)}</td></tr>`;

    for (let i = 0, ilen = attrValuesString.length; i < ilen; i += 1) {
      const attrValueString = attrValuesString[i].trim();
      const nextAttrValueString = attrValuesString[i] ? attrValuesString[i].trim() : '';

      const attrValue = attrValueString.split(';');
      const attr = attrValue[0].trim();
      let value = '-';
      if (attrValue.length > 1) {
        value = attrValue[1].trim();
        if (value.length === 0) {
          value = '-';
        }
      }

      if (attr.length > 0) {
        if (regExs.msNewFeature.test(attr)) {
          if ((nextAttrValueString.length > 0) &&
            !regExs.msNewFeature.test(nextAttrValueString)) {
            // set new header
            html += `<tr><td class='header' colspan='3'>${M.utils.beautifyAttribute(layerName)}</td><td></td></tr>`;
          }
        } else {
          html += '<tr><td class="key"><b>';
          html += M.utils.beautifyAttribute(attr);
          html += '</b></td><td class="value">';
          html += value;
          html += '</td></tr>';
        }
      }
    }

    if (html.length > 0) {
      html = `${htmlHeader + html}</tbody></table>`;
    }

    return html;
  }

  /**
   * This function displays information in a popup
   *
   * @private
   * @function
   * @param {array<object>} layerNamesUrls - Consulted layers
   * @param {array} coordinate - Coordinate position onClick
   * @param {olMap} olMap - Map

   */
  showInfoFromURL_(layerNamesUrls, coordinate, olMap) {
    const htmlAsText = M.template.compileSync(informationPopupTemplate, {
      vars: {
        info: getValue('querying'),
      },
      parseToHtml: false,
    });

    const infos = [];
    const formato = String(this.format_);
    let contFull = 0;
    const loadingInfoTab = {
      icon: 'g-cartografia-info',
      title: POPUP_TITLE,
      content: htmlAsText,
    };
    let popup = this.facadeMap_.getPopup();

    if (M.utils.isNullOrEmpty(popup)) {
      popup = new M.Popup();
      popup.addTab(loadingInfoTab);
      this.facadeMap_.addPopup(popup, coordinate);
    } else {
      const hasExternalContent =
        popup.getTabs().some(tab => tab.title !== POPUP_TITLE);
      if (!hasExternalContent) {
        this.facadeMap_.removePopup();
        popup = new M.Popup();
        popup.addTab(loadingInfoTab);
        this.facadeMap_.addPopup(popup, coordinate);
      } else {
        popup.addTab(loadingInfoTab);
      }
    }
    layerNamesUrls.forEach((layerNameUrl) => {
      const url = layerNameUrl.url;
      const layerName = layerNameUrl.layer;
      M.remote.get(url).then((response) => {
        popup = this.facadeMap_.getPopup();
        if (response.code === 200 && response.error === false) {
          const info = response.text;
          if (InformationControl.insert(info, formato) === true) {
            const formatedInfo = this.formatInfo(info, formato, layerName);
            infos.push({ formatedInfo, layerName });
          } else if (InformationControl.unsupportedFormat(info, formato)) {
            infos.push({
              formatedInfo: getValue('unsupported_format'),
              layerName,
            });
          }
        }
        contFull += 1;
        if (layerNamesUrls.length === contFull && !M.utils.isNullOrEmpty(popup)) {
          popup.removeTab(loadingInfoTab);
          if (infos.length === 0) {
            popup.addTab({
              icon: 'g-cartografia-info',
              title: POPUP_TITLE,
              content: getValue('no_info'),
            });
          } else {
            const popupContent = M.template.compileSync(informationLayersTemplate, {
              vars: {
                layers: infos,
                info_of: getValue('info_of'),
              },
              parseToHtml: false,
            });
            popup.addTab({
              icon: 'g-cartografia-info',
              title: POPUP_TITLE,
              content: popupContent,
              listeners: [{
                selector: '.m-information-content-info div.m-arrow-right',
                all: true,
                type: 'click',
                callback: e => this.toogleSection(e),
              }],
            });
          }
        }
      });
    });
    this.popup_ = popup;
  }

  /**
   * This functions handle the close/open beahaviour of the sections feature info
   * @function
   */
  toogleSection(e) {
    const { target } = e;
    const { parentElement } = target.parentElement;
    const content = parentElement.querySelector('.m-information-content-info-body');
    if (content.classList.contains('m-content-collapsed')) {
      content.classList.remove('m-content-collapsed');
      target.classList.remove('m-arrow-right');
      target.classList.add('m-arrow-down');
      const coordinates = this.popup_.getCoordinate();
      // if (!M.utils.isNullOrEmpty(this.popup_.getImpl().panIntoView)) {
      this.popup_.getImpl().panIntoView(coordinates);
      // }
    } else {
      content.classList.add('m-content-collapsed');
      target.classList.add('m-arrow-right');
      target.classList.remove('m-arrow-down');
    }
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  getElement() {
    return this.element;
  }
}
