/* eslint-disable no-console */
/**
 * @module M/impl/control/TopographicprofileControl
 */
import Profil from './profilcontrol';
import { getValue } from '../../../facade/js/i18n/language';

const PROFILE_URL = 'https://servicios.idee.es/wcs-inspire/mdt?request=GetCoverage&bbox=';
const PROFILE_URL_SUFFIX = '&service=WCS&version=1.0.0&coverage=Elevacion4258_500&' +
  'interpolationMethod=bilinear&crs=EPSG%3A4258&format=ArcGrid&width=2&height=2';

export default class TopographicprofileControl extends M.impl.Control {

  constructor(opts) {

    super();
    [this.distancePoinst_, this.mercator_, this.serviceURL, this.coordEPSG4326] = [opts.distance, 'EPSG:900913', opts.serviceURL, "EPSG:4326"];
    [this.projectionMap_, this.profil_, this.facadeMap_, this.vector_, this.source_, this.vectorProfile_, this.sourceProfile_, this.draw_, this.lineCoord_, this.pointsCoord_, this.dataPoints_, this.pt] = [null, null, null, null, null, null, null, null, null, null, null, null];
    [this.lineString_, this.feature_, this.style_] = [null, null, null];

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

    this.initOlLayers();
    // super addTo - don't delete
    super.addTo(map, html);
  }

  // Add your own functions
  initOlLayers() {
    this.style_ = function(evt) {
      let style;
      if (evt.getGeometry().getType() == 'LineString') {
        style = [new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#4286f4',
            width: 2
          })
        })];
      } else {
        style = [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: '#4286f4'
            })
          }),
          stroke: new ol.style.Stroke({
            color: '#4286f4',
            width: 2
          }),
          fill: new ol.style.Fill({
            color: '#4286f4'
          })
        })];
      }
      return style;
    }
    this.source_ = new ol.source.Vector({
      wrapX: false
    });
    this.vector_ = new ol.layer.Vector({
      source: this.source_,
      style: this.style_,
      name: 'capatopo'
    });
    this.sourceProfile_ = new ol.source.Vector();
    this.vectorProfile_ = new ol.layer.Vector({
      source: this.sourceProfile_,
    });
    this.vector_.setZIndex(1000);
    this.facadeMap_.getMapImpl().addLayer(this.vector_);
    this.projectionMap_ = this.facadeMap_.getProjection().code;


  }

  findNewPoints(originPoint, destPoint) {
    //let points = new Array();
    let addX, addY;
    let points = new String();
    let oriMete = ol.proj.transform(originPoint, this.projectionMap_, this.mercator_);
    let destMete = ol.proj.transform(destPoint, this.projectionMap_, this.mercator_);
    let angle = this.getAngleBetweenPoints(oriMete, destMete);
    let distance = this.getDistBetweenPoints(originPoint, destPoint);
    if (distance < 50) {
      return;
    }
    let distPoint = (distance / this.distancePoinst_ > this.distancePoinst_) ? distance / this.distancePoinst_ : this.distancePoinst_;
    for (let i = 0; i <= distance / distPoint; i++) {
      if (angle >= 0 && angle <= 90) {
        [addX, addY] = [1, 1];
      } else if (angle >= 90) {
        [addX, addY] = [-1, 1];
      } else if (angle <= 0 && angle >= -90) {
        [addX, addY] = [1, -1];
      } else {
        [addX, addY] = [-1, -1];
      }
      let newPointA = [(Math.cos(angle * Math.PI / 180) * (distPoint * i)) + oriMete[0], (Math.sin(angle * Math.PI / 180) * (distPoint * i)) + oriMete[1]];
      let newPointB = [(Math.cos(angle * Math.PI / 180) * ((distPoint * i) + addX)) + oriMete[0], (Math.sin(angle * Math.PI / 180) * ((distPoint * i) + addY)) + oriMete[1]];
      points += (ol.proj.transform(newPointA, this.mercator_, this.coordEPSG4326)) + ",";
      points += (ol.proj.transform(newPointB, this.mercator_, this.coordEPSG4326)) + "|";
    }

    return points;
  }


  getDistBetweenPoints(firstPoint, secondPoint) {
    let line = new ol.geom.LineString([ol.proj.transform(firstPoint, this.projectionMap_, this.mercator_), ol.proj.transform(secondPoint, this.projectionMap_, this.mercator_)]);
    return line.getLength();

  }

  getAngleBetweenPoints(firstPoint, secondPoint) {
    let p1 = {
      x: firstPoint[0],
      y: firstPoint[1]
    };
    let p2 = {
      x: secondPoint[0],
      y: secondPoint[1]
    };
    // angle in degrees
    let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    return angleDeg;
  }

  startLoad() {
    document.body.style.cursor = 'wait';
    this.deactivate();
    let panel = document.querySelector(".m-topographicprofile.activated");
    panel.style.pointerEvents = "none";

  }


  endLoad() {
    document.body.style.cursor = 'default';
    this.activate();
    let panel = document.querySelector(".m-topographicprofile.activated");
    panel.style.pointerEvents = "auto";
  }


  activate() {
    if (!this.draw_) {
      this.createIteraction("LineString");
    }
    this.facadeMap_.getMapImpl().addInteraction(this.draw_);
    document.querySelector('#m-topographicprofile-btn').classList.add('activated');
  }

  createIteraction(typeGeom) {
    this.draw_ = new ol.interaction.Draw({
      source: this.source_,
      type: /** @type {ol.geom.GeometryType} */ (typeGeom)
    });
    this.draw_.on('drawstart', function(evt) {
      this.projectionMap_ = this.facadeMap_.getProjection().code;
      this.clearLayer();
    }.bind(this));
    this.draw_.on('drawend', function(evt) {
      this.lineCoord_ = evt.feature.getGeometry().getCoordinates();
      // this.facadeMap_.getMapImpl().addInteraction(this.draw_);
      this.pointsCoord_ = new String();
      for (let i = 1; i < this.lineCoord_.length; i++) {
        this.pointsCoord_ = this.pointsCoord_.concat(this.findNewPoints(this.lineCoord_[i - 1], this.lineCoord_[i]));
      }
      this.getDataFromGGISCore();
    }.bind(this));
  }

  getDataFromGGISCore() {
    if (!this.pointsCoord_) return;
    let pointsBbox = this.pointsCoord_.split('|');
    const altitudes = [];
    const promises = [];
    pointsBbox = pointsBbox.filter((elem) => {
      return elem !== '' && elem.trim().length > 3;
    });

    pointsBbox.forEach((bbox) => {
      const url = `${PROFILE_URL}${bbox}${PROFILE_URL_SUFFIX}`;
      promises.push(M.remote.get(url));
    });

    Promise.all(promises).then((responses) => {
      responses.forEach((response) => {
        const alt = response.text.split('dy')[1].split(' ').filter((item) => {
          return item !== '';
        })[1];
        altitudes.push(parseFloat(alt));
      });

      const arrayXZY = [];
      altitudes.forEach((data, index) => {
        const points = pointsBbox[index].split(',');
        const center = ol.extent.getCenter([parseFloat(points[0]), parseFloat(points[1]),
          parseFloat(points[2]), parseFloat(points[3])
        ]);
        arrayXZY.push([center[0], center[1], data]);
      });
      this.controlProfile();

      const arrayXZY2 = arrayXZY.map((coord) => {
        return ol.proj.transform(coord, 'EPSG:4326', this.facadeMap_.getProjection().code);
      });

      this.lineString_.setCoordinates(arrayXZY2);
    }).catch(() => {
      M.dialog.error('No se han obtenido datos');
    });
    // this.deactivate();
  }


  controlProfile() {
    if (!this.profil_) {
      this.lineString_ = new ol.geom.LineString([]);
      this.feature_ = new ol.Feature({
        geometry: this.lineString_,
        name: 'Line'
      });
      this.sourceProfile_.addFeature(this.feature_);
      this.profil_ = new Profil({
        info: {
          zmin: getValue('profil.zmin'),
          zmax: getValue('profil.zmax'),
          altitude: getValue('profil.altitude'),
          distance: getValue('profil.distance'),
          ytitle: getValue('profil.ytitle'),
          xtitle: getValue('profil.xtitle'),
          altitudeUnits: 'm',
          "distanceUnitsM": 'm',
          'distanceUnitsKM': 'km'
        },
        projection: this.facadeMap_.getProjection().code,
        map: this.facadeMap_.getMapImpl(),
        source: this.source_
      });
      this.facadeMap_.getMapImpl().addControl(this.profil_);
      let drawPoint = function(e) {
        if (!this.pt) return;
        if (e.type == "over") { // Show point at coord
          this.pt.setGeometry(new ol.geom.Point(e.coord));
          this.pt.setStyle(null);
        } else { // hide point
          this.pt.setStyle([]);
        }
      }.bind(this);
      this.sourceProfile_.once('change', function(e) {
        if (this.sourceProfile_.getState() === 'ready') {
          this.profil_.setGeometry(this.sourceProfile_.getFeatures()[0]);
          this.pt = new ol.Feature(new ol.geom.Point([0, 0]));
          this.pt.setStyle([]);
          this.source_.addFeature(this.pt);
        }
      }.bind(this));

      this.profil_.on(["over", "out"], function(e) {
        if (e.type == "over") this.profil_.popup(e.coord[2] + " m");
        drawPoint(e);
      }.bind(this));

    }
    this.profil_.show();
  }

  deactivate() {
    if (this.draw_) {
      this.facadeMap_.getMapImpl().removeInteraction(this.draw_);
      this.clearLayer();
      document.querySelector('#m-topographicprofile-btn').classList.remove('activated');
    }
    //Aquí hay que poner que se cambie el estilo del botón
  }

  clearLayer() {
    this.source_.clear();
    if (this.profil_) {
      this.profil_.hide();
      this.sourceProfile_.clear();
      this.facadeMap_.getMapImpl().removeControl(this.profil_);
      this.profil_ = null;
    }
  }

  removeLayer() {
    this.deactivate();
    this.clearLayer();
    this.facadeMap_.getMapImpl().removeLayer(this.vector_);
  }

  destroy() {
    this.removeLayer();
    this.facadeMap_.getMapImpl().removeControl(this);
  }

  toggle() {
    if (this.profil_) {
      this.profil_.toggle();
    }
  }


}
