/**
 * @module M/control/WindowSyncControl
 */
import template from 'templates/windowsync';
import WindowSyncImplControl from 'impl/windowsynccontrol';
import { getValue } from './i18n/language';
import { getBaseLayers, getLayers } from './utils';
import { handlerErrorPluginWindowSync, handlerErrorURLWindowSync } from './errorhandling';

const MAPEA_LITE_URL = 'https://mapea-lite.desarrollo.guadaltel.es/api-core/';
const COMPONENTES_URL = 'https://componentes.cnig.es/api-core/';

export default class WindowSyncControl extends M.Control {
  /**
     * @classdesc
     * Main constructor of the class. Creates a PluginControl
     * control
     *
     * @constructor
     * @extends {M.Control}
     * @api stable
     */
  constructor({ controls, plugins, layersPlugin }, controlsLayers, map) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(WindowSyncImplControl)) {
      M.exception(getValue('exception'));
    }

    // 2. implementation of this control
    const impl = new WindowSyncImplControl();
    super(impl, 'WindowSync');
    impl.addTo(map);
    this.implControl_ = impl;

    /**
      * Name plugin
      * @private
      * @type {String}
      */
    this.name_ = 'WindowSyncControl';

    /**
      * Facade of the map
      * @private
      * @type {M.Map}
      */
    this.map_ = map;

    this.plugins = plugins;

    this.controls = controls;

    this.mapsWindows_ = [
      {
        id: window.crypto.randomUUID(),
        map,
      },
    ];
    // ? Referencia de los mapas que se van cargando
    this.implControl_.maps = this.mapsWindows_;

    this.layers = controlsLayers;

    this.pluginScript = this.getScriptAndLink('script');
    this.linksStyle = this.getScriptAndLink('link');

    this.activate = this.activate.bind(this);
    this.closeWindows = this.closeWindows.bind(this);
  }

  /**
     * This function creates the view
     *
     * @public
     * @function
     * @param {M.Map} map to add the control
     * @api stable
     */
  active(html) {
    const templateResult = new Promise((success, fail) => {
      const options = {
        jsonp: true,
        vars: {
          translations: {
            closeAll: getValue('closeAll'),
            openWindow: getValue('openWindow'),
          },
        },
      };

      this.template = M.template.compileSync(template, options);

      success(this.template);
    });

    templateResult
      .then((t) => {
        html.querySelector('#m-comparators-contents').appendChild(t);

        const btnOpenWindow = t.querySelector('#new_windowsync');
        const btnCloseWindow = t.querySelector('#deleteAll_windowsync');
        if (btnOpenWindow) {
          btnOpenWindow.addEventListener('click', this.activate);
        }

        if (btnCloseWindow) {
          btnCloseWindow.addEventListener('click', this.closeWindows);
        }
      });
  }


  /**
     * Activate Select/Input
     *
     * @public
     * @function
     * @api stable
     */
  activate() {
    const newWindow = window.open(`${window.location.href}`, '_blank', 'width=800,height=800');
    this.generateNewMap(newWindow);

    const intervalID = setInterval(() => {
      if (newWindow.NEW_API_MAP !== undefined) {
        this.addEventMap(newWindow);
        clearInterval(intervalID);
      }
    }, 500);
  }

  addEventMap(nWindow) {
    const newWindow = nWindow;

    const id = window.crypto.randomUUID();
    newWindow.ID_MAP = id;

    this.mapsWindows_.push({
      id,
      map: newWindow.NEW_API_MAP,
      window: newWindow,
    });

    this.handerCloseWindow(newWindow, id);

    newWindow.NEW_API_MAP.on(M.evt.COMPLETED, () => {
      this.implControl_.removeEventListeners(this.mapsWindows_);
      this.implControl_.handleMoveMap(this.mapsWindows_);
    });
  }

  handerCloseWindow(newWindow, id) {
    const timer = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(timer);
        // ? Se elimina por el indice para no perder la referencia
        const index = this.mapsWindows_.findIndex(obj => obj.id === id);
        this.mapsWindows_.splice(index, 1);
      }
    }, 1000);
  }

  generateNewMap(newWindow) {
    const centerMap = this.map_.getCenter();
    const center = JSON.stringify([centerMap.x, centerMap.y]);
    const projection = `${this.map_.getProjection().code}*${this.map_.getProjection().units}`;
    const zoom = this.map_.getZoom();
    const controls = JSON.stringify(this.controls);
    const plugins = this.generatePlugins() || '';
    const layers = JSON.stringify([...this.layers, ...getLayers(this.map_)]);
    const baseLayers = JSON.stringify(getBaseLayers(this.map_));

    const contenidoHTML = `
       <!DOCTYPE html>
       <html>
       <head>
           <title>Nueva Ventana</title>
           ${this.linksStyle.join(' ')}
           <style rel="stylesheet">
           html,
           body {
               margin: 0;
               padding: 0;
               height: 100%;
               overflow: hidden;
           }
       </style>
       </head>
       <body>
           <div id="map"></div>
           ${this.pluginScript.join(' ')}
           <script>
           const newMap = M.map({
             container: 'map',
             center: ${center},
             zoom: ${zoom},
             layers: ${baseLayers},
             projection: '${projection}',
             ${controls ? `controls:${controls}` : ''}
           });
           ${plugins}
           newMap.addLayers(${layers})
           window.NEW_API_MAP = newMap;
           </script>
       </body>
       </html>
       `;
    // Escribir el contenido en la nueva ventana
    newWindow.document.write(contenidoHTML);
  }

  /**
   * Devuelve los elementos link o script del html necesarios para cargar el
   * mapa, plugins, ...
   * @param {String} type script o link como valores posibles
   * @returns
   */
  getScriptAndLink(type) {
    const attr = type === 'link' ? 'href' : 'src';
    let elements = [...document.querySelectorAll(`${type}[${attr}*="${MAPEA_LITE_URL}"], ${type}[${attr}*="${COMPONENTES_URL}"]`)];
    if (elements.length === 0) {
      elements = this.getAPIRestScriptAndLink(type, attr);
    }
    return elements.map(l => l.outerHTML);
  }

  getAPIRestScriptAndLink(type, attr) {
    if (type === 'script') {
      return [...document.querySelectorAll(`${type}[${attr}*=".ol.min"]`), document.querySelector('script[src="js/configuration.js"]')];
    }
    return [...document.querySelectorAll(`${type}[${attr}*=".ol.min"]`)];
  }

  pluginScriptAndLinkAPI(style, script, name) {
    if (!style) {
      this.linksStyle.push(`<link type="text/css" rel="stylesheet" href="plugins/${name}/${name}.ol.min.css">`);
    }

    if (!script) {
      this.pluginScript.push(`<script type="text/javascript" src="plugins/${name}/${name}.ol.min.js"></script>`);
    }
  }

  generatePlugins() {
    if (this.plugins === undefined) {
      return '';
    }
    const plugins = this.plugins.map(({ name, params = {} }) => {
      this.handlePluginScrips(name);
      try {
        return `newMap.addPlugin(new M.plugin.${name}(${JSON.stringify(params)}));`;
      } catch (error) {
        handlerErrorPluginWindowSync(error, name);
        return '';
      }
    }, this);
    return plugins.join(' ');
  }

  closeWindows() {
    const baseMap = this.mapsWindows_[0];
    this.mapsWindows_.forEach(({ window }, i) => {
      if (i !== 0) {
        window.close();
      }
    });
    this.mapsWindows_ = [baseMap];
  }

  handlePluginScrips(name) {
    const style = this.getScriptAndLink('link').some(s => s.includes(`${name.toLowerCase()}.ol.min.css`));
    const script = this.getScriptAndLink('script').some(s => s.includes(`${name.toLowerCase()}.ol.min.js`));

    const currentUrl = window.location.href;
    if (currentUrl.includes('comparators') && (currentUrl.includes(MAPEA_LITE_URL) || currentUrl.includes(COMPONENTES_URL))) {
      this.pluginScriptAndLinkAPI(style, script, name.toLowerCase());
    } else {
      handlerErrorURLWindowSync(style, script, name);
    }
  }

  /**
     * Deactivate SpyEye
     *
     * @public
     * @function
     * @api stable
     */
  deactivate() {
    if (this.layerSelected === null) this.layerSelected = this.layers[0];

    if (this.template) this.template.remove();
    this.layerSelected = null;

    this.closeWindows();
  }

  destroy() {
    this.name_ = null;
    this.map_ = null;
    this.layers = null;

    this.closeWindows();
  }

  /**
     * This function compares controls
     *
     * @public
     * @function
     * @param {M.Control} control to compare
     * @api stable
     * @return {Boolean}
     */
  equals(control) {
    return control instanceof WindowSyncControl;
  }
}

