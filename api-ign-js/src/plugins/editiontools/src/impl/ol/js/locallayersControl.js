export default class LocalLayersControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the LocalLayersControl.
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor() {
    super();
  }
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    this.element = html;

    const olMap = map.getMapImpl();
    ol.control.Control.call(this, {
      element: html,
      target: null,
    });
    olMap.addControl(this);
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  activate() {}

  /**
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {}

  /**
   *
   *
   * @param {any} layerName
   * @param {any} source
   * @memberof LocalLayersControl
   */
  loadGeoJSONLayer(layerName, source2) {
    let features = new ol.format.GeoJSON().readFeatures(source2, { featureProjection: this.facadeMap_.getProjection().code });
    features.forEach((feature) => {
      const style1 = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#0000FF', width: 8 }),
        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
      });
      const style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2,
          }),
          fill: new ol.style.Fill({
            color: '#7CFC00',
          }),
        }),
      });

      if (feature.getGeometry().getType() != 'Point' && feature.getGeometry().getType() != 'MultiPoint') {
        feature.setStyle(style1);
      } else {
        feature.setStyle(style2);
      }
    });
    features = this.convertToMFeature_(features);
    this.createLayer_(layerName, features);
    return features;
  }

  /**
   *
   *
   * @param {any} name
   * @param {any} source
   * @returns
   * @memberof LocalLayersControl
   */
  loadKMLLayer(layerName, source, extractStyles) {
    /*     let layer = new M.layer.KML({
          name: layerName,
          url: url,
          extract: true
        });
        this.facadeMap_.addLayers(layer);
        return layer.getFeatures(); */

    // FIXME: Es necesario usar la libreria base para leer las features y crear a partir de ellas una capa GeoJSON
    let features = new ol.format.KML({ extractStyles }).readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });
    features.forEach((feature) => {
      const style1 = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#0000FF', width: 8 }),
        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
      });
      const style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2,
          }),
          fill: new ol.style.Fill({
            color: '#7CFC00',
          }),
        }),
      });

      if (feature.getGeometry().getType() != 'Point' && feature.getGeometry().getType() != 'MultiPoint') {
        feature.setStyle(style1);
      } else {
        feature.setStyle(style2);
      }
    });
    features = this.convertToMFeature_(features);
    this.createLayer_(layerName, features);
    return features;
  }

  /**
   *
   *
   * @param {any} layerName
   * @param {any} source
   * @returns
   * @memberof LocalLayersControl
   */
  loadGPXLayer(layerName, source) {
    let features = new ol.format.GPX().readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });
    features.forEach((feature) => {
      const style1 = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#0000FF', width: 8 }),
        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
      });
      const style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 24,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2,
          }),
          fill: new ol.style.Fill({
            color: '#7CFC00',
          }),
        }),
      });

      if (feature.getGeometry().getType() != 'Point' && feature.getGeometry().getType() != 'MultiPoint') {
        feature.setStyle(style1);
      } else {
        feature.setStyle(style2);
      }
    });
    features = this.convertToMFeature_(features);
    this.createLayer_(layerName, features);
    return features;
  }

  createLayer_(layerName, features) {
    const layer = new M.layer.Vector({
      name: layerName,
    }, { displayInLayerSwitcher: true });
    layer.addFeatures(features);
    this.facadeMap_.addLayers(layer);
    layer.getImpl().getOL3Layer().set('vendor.mapaalacarta.selectable', true);
  }

  /**
   *
   *
   * @param {any} features
   * @memberof LocalLayersControl
   */
  centerFeatures(features) {
    if (!M.utils.isNullOrEmpty(features)) {
      const extent = M.impl.utils.getFeaturesExtent(features);
      this.facadeMap_.getMapImpl().getView().fit(extent, {
        duration: 500,
        minResolution: 1,
      });
    }
  }

  convertToMFeature_(features) {
    if (features instanceof Array) {
      return features.map((olFeature) => {
        const feature = new M.Feature(olFeature.getId(), {
          geometry: {
            coordinates: olFeature.getGeometry().getCoordinates(),
            type: olFeature.getGeometry().getType(),
          },
          properties: olFeature.getProperties(),
        });
        feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
        return feature;
      });
    }
  }
}
