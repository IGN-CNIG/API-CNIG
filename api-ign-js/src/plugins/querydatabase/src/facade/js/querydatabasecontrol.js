/**
 * @module M/control/QueryDatabaseControl
 */

 import QueryDatabaseImplControl from 'impl/querydatabasecontrol';
 import template from 'templates/querydatabase';
 import initialView from 'templates/initialview';
 import tabledata from 'templates/tabledata';
 import tablefilter from 'templates/tablefilter';
 import tabledatabases from 'templates/tabledatabases';
 import tabledatatables from 'templates/tabledatatables';
 import tableAttributes from 'templates/tableAttributes';
 import { getValue } from './i18n/language';
 import { concat } from 'async';
 
 export default class QueryDatabaseControl extends M.Control {
   /**
    * @classdesc
    * Main constructor of the class. Creates a PluginControl
    * control
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
 
   constructor(collapsed_, position_, connection_, styles_) {
     if (M.utils.isUndefined(QueryDatabaseImplControl)) {
       M.exception(getValue('exception.impl'));
     }
 
     const impl = new QueryDatabaseImplControl();
     super(impl, 'QueryDatabase');
  
     this.filtered = false;
 
     this.bboxfilter = false;
 
     this.collapsed = collapsed_;
 
     this.position = position_;

     this.connection = connection_;

     this.styles = styles_;

     this.token = this.getTokenByConnection();

     this.atributos = this.connection ? this.getArrayFormated(this.connection.attributes) : [];

     this.filters = this.connection ? this.getArrayFormated(this.connection.filters) : [];
 
     this.databaseLayer = new M.layer.Vector({
       extract: true,
       name: 'databaseLayer',
       source: this.getImpl().newVectorSource(false),
     });

     this.paginaActual = 1;

     this.moveEvents = [];

     this.elementos = [];

     this.cluster = false;
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
     this.map = map;
     return new Promise((success, fail) => {
       this.createInitialView(map);
       this.map.addLayers(this.databaseLayer); 
       success(this.html);
     });
   }

   createInitialTemplate(){
    const html = M.template.compileSync(template, {
      vars: {
        translations: {
          attribute_table: getValue('attribute_table'),
          clean_filters: getValue('clean_filters'),
          export: getValue('export'),
        },
      },
    });

    html.querySelector('#m-querydatabase-options-container').appendChild(this.initialView);
    this.html = html;
   }

   launchComun(html){
    this.html.querySelector('#m-querydatabase-table').innerHTML = '';
    this.html.querySelector('#m-querydatabase-options-information-container').innerHTML = ''; // e2m:borro contenido para evitar que concatene dentro ventanas de información
    this.html.querySelector('#m-querydatabase-options-information-container').appendChild(html);
   }
 
   /**
    * e2m:
    * Abre el sidepanel por código, al hacer clic sobre uno de los features de la capa vectorial
    * @param {*} html
    */
   launchDatabasesWindow(html) {
      this.launchComun(html);
      document.querySelector('#databases').addEventListener('click', (evt) => {
        if(evt.target.getAttribute('class') === 'showtables'){
          this.database = evt.target.getAttribute('id');
          this.paginaActual = 1;
          this.getTablasDisponibles();
        }
     });
   }

   launchInicial(){
    if(this.connection.table){
      this.tabla = this.connection.table;
      if(this.connection.schema){
        this.schema = this.connection.schema;
      }else{
        this.schema = 'public';
      }
      this.removeMapMoveEvents();
      this.drawTable(null);
      this.createFilterView();
      this.addMapMoveEvent(this.filtrarDatos.bind(this));
    }else{
      this.getTablasDisponibles();
    }
   }

   launchTablesWindow(html) {
      this.launchComun(html);
      this.removeMapMoveEvents();
      document.querySelector('#tables').addEventListener('click', (evt) => {
        if(evt.target.getAttribute('class') === 'filter'){
          const id = evt.target.parentNode.parentNode.getAttribute('id');
          const data = id.split('&');
          this.schema = data[0];
          this.tabla = data[1];
          this.paginaActual = 1;
          this.getColumnasTablas();
        }else if(evt.target.getAttribute('class') === 'drawtable'){
          const id = evt.target.parentNode.parentNode.getAttribute('id');
          const data = id.split('&');
          this.schema = data[0];
          this.tabla = data[1];
          this.drawTable(null);
          this.createFilterView();
          this.addMapMoveEvent(this.filtrarDatos.bind(this));
        }
     });
     this.addAtrasEvent(this.getBasesDatosDisponibles.bind(this));
    }

    launchAttributesWindow(html) {
      this.launchComun(html);
      this.addAtrasEvent(this.getTablasDisponibles.bind(this));
    }

    launchDataTable(html){
      this.launchComun(html);
      this.addAtrasEvent(this.getTablasDisponibles.bind(this));
    }

    addAtrasEvent(callback){
      document.querySelector('#atras').addEventListener('click', callback);
    }

    addPaginationEvent(callback){
      document.querySelector('#m-paginacion').addEventListener('click', (evt) => {
        if(evt.target.getAttribute('class').includes('m-grid-item')){
          if(evt.target.getAttribute('id') === 'primero'){
            this.paginaActual = 1;
          }else if(evt.target.getAttribute('id') === 'anterior' && this.paginaActual - 1 > 0){
            this.paginaActual--;
          }else if(evt.target.getAttribute('id') === 'siguiente' && this.paginaActual + 1 >= this.paginasTotales){
            this.paginaActual++;
          }else if(evt.target.getAttribute('id') === 'ultimo'){
            this.paginaActual = this.paginasTotales;
          }else if(evt.target.getAttribute('class').includes('pag-disponible')){
            this.paginaActual = Number.parseInt(evt.target.getAttribute('id'));
          }else{
            return;
          }
          callback();
        }
      });
    }
 
   /**
    * Creates initialview.html template dinamically.
    * @public
    * @function
    * @api
    * @param {Map} map
    */
   createInitialView(map) {
     const options = {};
     this.initialView = M.template.compileSync(initialView, options);
     this.createInitialTemplate();
     if(this.connection && this.connection.host && this.connection.port && this.connection.name
      && this.connection.user && this.connection.password){
      this.launchInicial();
     }else{
      this.getBasesDatosDisponibles();
     }
   }

   getBasesDatosDisponibles(){
    const url = `${M.config.MAPEA_URL}/api/database`;
    M.remote.get(url).then((response) => {
      const databases = JSON.parse(response.text);
      const html = M.template.compileSync(tabledatabases, {
        vars: {
          databases,
        },
      });
      this.launchDatabasesWindow(html);
    });
  }

  getTablasDisponibles(){
    let url = `${M.config.MAPEA_URL}/api/database/`;
    url = url.concat(this.token ? this.token : this.database).concat(`/tables?size=0`);
    if(this.token){
      url = url.concat('&token=true');
    }
    M.remote.get(url).then((response) => {
      const pagina = JSON.parse(response.text);
      const tables = pagina.results;
      const html = M.template.compileSync(tabledatatables, {
        vars: {
          tables,
        },
      });
      this.launchTablesWindow(html);
    });
  }

  getColumnasTablas(){
    let url = `${M.config.MAPEA_URL}/api/database/`;
    url = url.concat(this.token ? this.token : this.database)
      .concat(`/attributes/${this.tabla}?schema=${this.schema}&size=0`);
    if(this.token){
      url = url.concat('&token=true');
    }
    M.remote.get(url).then((response) => {
      const pagina = JSON.parse(response.text);
      const attributes = pagina.results;
      const html = M.template.compileSync(tableAttributes, {
        vars: {
          attributes,
        },
      });
      this.launchAttributesWindow(html);
    });
  }

  getDataTable(){
    let url = `${M.config.MAPEA_URL}/api/database/`;
    url = url.concat(this.token ? this.token : this.database)
      .concat(`/${this.tabla}/filtered?schema=${this.schema}&size=0`);
    if(this.token){
      url = url.concat('&token=true');
    }
    M.remote.get(url).then((response) => {
      const pagina = JSON.parse(response.text);
      const rows = pagina.results;
      const html = M.template.compileSync(tabledata, {
        vars : {
          rows,
        }
      });
      this.launchDataTable(html);
    });
  }

  drawTable(filtros){
    this.cluster = false;
    const geomBbox = this.buildGeomFromBbox();
    let url = `${M.config.MAPEA_URL}/api/database/`;
    url = url.concat(this.token ? this.token : this.database)
      .concat(`/${this.tabla}/filtered?schema=${this.schema}`);
    if(this.token){
      url = url.concat('&token=true');
    }
    url = url.concat(`&bbox=${geomBbox}`);
    const zoom = this.map.getZoom();
    url = url.concat(`&zoom=${zoom}`);
    if(filtros){
      url = url.concat(filtros);
    }
      M.remote.get(url).then((response) => {
        const pagina = JSON.parse(response.text);
        if(pagina && pagina.results){
          this.elementos = pagina.results;
          if(pagina.numPagina === -999){//Se devuelve cluster en vez de los datos de la tabla
            this.cluster = true;
          }
          this.drawElements();
          this.createDataView();
        }
      });
  }

  createDataView(){
    this.html.querySelector('#m-querydatabase-table-container').innerHTML = '';
    if(!this.cluster){
      const atributos = this.getAttributes();
      const elementos = this.getElementsWithAttributes();
      const html = M.template.compileSync(tabledata, {
        vars: {
          elementos,
          atributos,
        },
      });
      html.addEventListener('click', this.interaccionTabla.bind(this));
      this.html.querySelector('#m-querydatabase-table-container').appendChild(html);
    }
  }

  createFilterView(){
    const filters = this.connection && this.connection.table && this.connection.table === this.tabla ? this.filters : [];
    const html = M.template.compileSync(tablefilter, {
      vars: {
        filters,
      },
    });
    this.launchComun(html);
    let btnFiltrar = html.querySelector("#filtrar-elementos");
    if(btnFiltrar){
      btnFiltrar.addEventListener('click', this.filtrarDatos.bind(this));
    }
    html.querySelector('#atras').addEventListener('click', this.getTablasDisponibles.bind(this));
    this.createDataView();
  }

  filtrarDatos(){
    let filtros = '';
    const inputs = document.querySelectorAll('.filter-input');
    for(let i = 0; i < inputs.length; i++){
      let key = inputs[i].getAttribute('id');
      let value = inputs[i].value;
      if(value && key){
        value = escape(value);
        filtros = filtros.concat(`&${key}=${value}`);
      }
    }
    this.drawTable(filtros);
 }

  drawElements(){
    const features = [];
    for(let i = 0; i < this.elementos.length; i++){
      if(this.elementos[i].geometry){
        let feature = this.getFeatureFromElement(this.elementos[i]);
        features.push(feature);
        this.elementos[i].featureId = feature.getId();
      }
    }
    this.databaseLayer.removeFeatures(this.databaseLayer.getFeatures());
    this.databaseLayer.setStyle(null);
    if(features.length > 0){
      this.selectStyleLayer(features[0].getGeometry().type);
    }
    this.databaseLayer.addFeatures(features);
  }

  getFeatureFromElement(element){
    let format = new ol.format.WKT();
    let olGeom = format.readGeometryFromText(element.geometry)
      .transform(`EPSG:${element.srid}`, this.map_.getProjection().code);
    let feature = new M.Feature();
    let mGeom = {type: olGeom.getType(), coordinates: olGeom.getCoordinates()};
    feature.setGeometry(mGeom);
    delete element.geometry;
    delete element.srid;
    feature.setAttributes(element);
    if(this.cluster){
      feature.setStyle(this.getClusterStyle(element.elementos_cluster));
    }
    return feature;
  }

  selectStyleLayer(geomType){
    const style = this.getStyleByGeomType(geomType);
    this.databaseLayer.setStyle(style);
  }

  getStyleByGeomType(geomType){
    let style = null;
    if(geomType && this.styles && this.styles.default){
      if(geomType.includes('Point') && this.styles.default.point){
        style = this.styles.default.point;
      }else if(geomType.includes('LineString') && this.styles.default.line){
        style = this.styles.default.line;
      }else if(geomType.includes('Polygon') && this.styles.default.polygon){
        style = this.styles.default.polygon;
      }
    }
    return style;
  }

  getClusterStyle(numElementos){
    let style = this.getStyleByGeomType('Polygon').clone();
    if(!style){
      style = new M.style.Polygon({
        fill: {
          color: 'blue',
          opacity: 0.5
        },
        stroke: {
          color: blue
        }
      });
    }
    style.getOptions().label = {
      text: numElementos,
      align: M.style.align.CENTER,
      baseline: M.style.baseline.MIDDLE
    };
    return style;
  }

  getClusterStyle2(numElementos){
    let style = this.getStyleByGeomType('Point').clone();
    if(!style){
      style = new M.style.Point({
        fill: {
          color: 'blue',
          opacity: 0.5
        },
        stroke: {
          color: blue
        }
      });
    }
    style.getOptions().label = {
      text: numElementos,
      align: M.style.align.CENTER,
      baseline: M.style.baseline.MIDDLE
    };
    style.getOptions().icon = {
      form: M.style.form.MARKER,
      fontsize: 0.5,
      color: 'red',
      fill: 'red'
    };
    return style;
  }
 
   /**
    * Check if the layer is not added yet.
    * @public
    * @function
    * @param { String } name of layer to add.
    * @api stable
    */
   isNotAdded(layerName, htmlSelect) {
     const aChildren = [...htmlSelect.children];
     return !aChildren.some(o => o.innerHTML === layerName);
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
     return control instanceof QueryDatabaseControl;
   }
 
   addAbrePanelEvent() {
     const elem = document.querySelector('.m-panel.m-querydatabase.collapsed .m-panel-btn.icon-tabla');
     if (elem !== null) {
       elem.addEventListener('click', () => {
         const container = this.map_.getContainer().parentElement.parentElement;
         container.style.width = 'calc(100% - 530px)';
         container.style.position = 'fixed';
         if (this.position === 'TL') {
           container.style.left = '530px';
         } else {
           container.style.right = '530px';
         }
         this.map_.refresh();
         this.addCierraPanelEvent();
       });
     }
   }
 
   addCierraPanelEvent() {
     const elem = document.querySelector('.m-panel.m-querydatabase.opened .m-panel-btn');
     if (elem !== null) {
       elem.addEventListener('click', () => {
         const container = this.map_.getContainer().parentElement.parentElement;
         container.style.width = '100%';
         container.style.position = '';
         if (this.position_ === 'TL') {
           container.style.left = 'unset';
         } else {
           container.style.right = 'unset';
         }
 
         this.map_.refresh();
         this.addAbrePanelEvent();
       });
     }
   }
 
   initPanelAttributes() {
     if (this.collapsed) {
       this.addAbrePanelEvent();
     } else {
       this.addCierraPanelEvent();
       const container = this.map_.getContainer().parentElement.parentElement;
       container.style.width = 'calc(100% - 530px)';
       container.style.position = 'fixed';
       if (this.position === 'TL') {
         container.style.left = '530px';
       } else {
         container.style.right = '530px';
       }
       this.map_.refresh();
     }
   }

   buildGeomFromBbox(){
      let bbox = this.map.getBbox();
      let featureBbox = new M.Feature();
      let coordinates = [];
      coordinates.push([bbox.x.min, bbox.y.min]);
      coordinates.push([bbox.x.max, bbox.y.min]);
      coordinates.push([bbox.x.max, bbox.y.max]);
      coordinates.push([bbox.x.min, bbox.y.max]);
      coordinates.push([bbox.x.min, bbox.y.min]);
      let geomBbox = {
        type: 'Polygon',
        coordinates: [coordinates]
      };
      featureBbox.setGeometry(geomBbox);
      let format = new M.format.WKT();
      return format.write(featureBbox).replaceAll(' ', '$')+"srid"+this.map.getProjection().code.slice(5);
   }

   addMapMoveEvent(callback){
     this.map.getMapImpl().on('moveend', callback);
     this.moveEvents.push(callback);
   }

   removeMapMoveEvents(){
      for(let i = 0; i < this.moveEvents.length; i++){
        this.map.getMapImpl().un('moveend', this.moveEvents[i]);
      }
      this.moveEvents = [];
   }

   getTokenByConnection(){
      if(this.connection && this.connection.host && this.connection.port && this.connection.name
        && this.connection.user && this.connection.password){
        let token = `host=${this.connection.host}&port=${this.connection.port}&name=${this.connection.name}&user=${this.connection.user}&password=${this.connection.password}`;
        return btoa(token);
      }else{
        return '';
      }
   }

   getArrayFormated(array){
     let result = [];
     if(array && Array.isArray(array)){
      for(let i = 0; i < array.length; i++){
        let obj = {
          key: i,
          value: array[i],
        };
        result.push(obj);
      }
    }
     return result;
   }

   getElementsWithAttributes(){
      let result = [];
      for(let i = 0; i < this.elementos.length; i++){
        let obj = [];
        if(this.connection && this.connection.table && this.connection.table === this.tabla
          && this.atributos && this.atributos.length > 0){
          for(let j = 0; j < this.atributos.length; j++){
            obj.push(this.elementos[i][this.atributos[j].value]);
          }
        }else{
          obj = Object.values(this.elementos[i]).filter((v) => {if(!v.includes('mapea_feature')) return v;});
        }
        result.push({featureId: this.elementos[i].featureId, datos: obj});
      }
      return result;
   }

   getAttributes(){
      let result = [];
      if(this.connection && this.connection.table && this.connection.table === this.tabla
        && this.atributos && this.atributos.length > 0){
        result = this.atributos;
      }else if(this.elementos && this.elementos.length > 0){
        result = this.getArrayFormated(Object.keys(this.elementos[0]).filter((v) => {if(v !== 'featureId') return v;}));
      }
      return result;
   }

   interaccionTabla(evt){
    if(evt.target.localName === 'td'){
      this.resaltarElemento(evt.target.parentNode.id);
    }else if(evt.target.localName === 'tr'){
      this.resaltarElemento(evt.target.id);
    }
   }

   resaltarElemento(featureId){     
     let feature = this.databaseLayer.getFeatureById(featureId);
     this.cambiarEstiloFeature(feature);
   }

   cambiarEstiloFeature(feature){
    if(this.feature){
      this.feature.setStyle(null);
    }
    let style = null;
    if(this.styles && this.styles.select){
       let geomType = feature.getGeometry().type;
       if(geomType.includes('Point') && this.styles.select.point){
         style = this.styles.select.point;
       }else if(geomType.includes('LineString') && this.styles.select.line){
         style = this.styles.select.line;
       }else if(geomType.includes('Polygon') && this.styles.select.polygon){
         style = this.styles.select.polygon;
       }
    }
    feature.setStyle(style);
    this.feature = feature;
   }
}
 