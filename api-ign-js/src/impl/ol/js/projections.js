import proj4 from 'proj4';
import OLProjection from 'ol/proj/Projection';
import { register } from 'ol/proj/proj4';
import { addEquivalentProjections } from 'ol/proj';

// EPSG:4258
const proj4258 = {
  def: '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
  extent: [-16.1, 32.88, 39.65, 84.17],
  codes: ['EPSG:4258', 'urn:ogc:def:crs:EPSG::4258', 'http://www.opengis.net/gml/srs/epsg.xml#4258'],
  units: 'd',
  metersPerUnit: 111319.49079327358,
};

// EPSG:25828
const proj25828 = {
  def: '+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  extent: [397101.09, 3638520.14, 1034670.43, 9625438.82],
  codes: ['EPSG:25828', 'urn:ogc:def:crs:EPSG::25828', 'http://www.opengis.net/gml/srs/epsg.xml#25828'],
  units: 'm',
};

// EPSG:25829
const proj25829 = {
  def: '+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  extent: [-164850.78, 3660417.01, 988728.57, 9567111.85],
  codes: ['EPSG:25829', 'urn:ogc:def:crs:EPSG::25829', 'http://www.opengis.net/gml/srs/epsg.xml#25829'],
  units: 'm',
};

// EPSG:25830
const proj25830 = {
  def: '+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  extent: [-729785.83, 3715125.82, 940929.67, 9518470.69],
  codes: ['EPSG:25830', 'urn:ogc:def:crs:EPSG::25830', 'http://www.opengis.net/gml/srs/epsg.xml#23030'],
  units: 'm',
};

// EPSG:25831
const proj25831 = {
  def: '+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  extent: [-1300111.74, 3804640.43, 893164.13, 9478718.31],
  codes: ['EPSG:25831', 'urn:ogc:def:crs:EPSG::25831', 'http://www.opengis.net/gml/srs/epsg.xml#25831'],
  units: 'm',
};

// EPSG:4230
const proj4230 = {
  def: '+proj=longlat +ellps=intl +no_defs',
  extent: [-16.09882145355955, 25.711114310330917, 48.60999527749605, 84.16977336415472],
  codes: ['EPSG:4230', 'urn:ogc:def:crs:EPSG::4230', 'http://www.opengis.net/gml/srs/epsg.xml#4230'],
  units: 'd',
  metersPerUnit: 111319.49079327358,
};

// EPSG:23028
const proj23028 = {
  def: '+proj=utm +zone=28 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs',
  extent: [997517.95, 3873475.61, 2024693.05, 8529441.99],
  codes: ['EPSG:23028', 'urn:ogc:def:crs:EPSG::23028', 'http://www.opengis.net/gml/srs/epsg.xml#23028'],
  units: 'm',
};

// EPSG:23029
const proj23029 = {
  def: '+proj=utm +zone=29 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs',
  extent: [448933.91, 3860083.93, 1860436.11, 8381369.16],
  codes: ['EPSG:23029', 'urn:ogc:def:crs:EPSG::23029', 'http://www.opengis.net/gml/srs/epsg.xml#23029'],
  units: 'm',
};

// EPSG:23030
const proj23030 = {
  def: '+proj=utm +zone=30 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs',
  extent: [-99844.71, 3879626.63, 1682737.72, 8251830.80],
  codes: ['EPSG:23030', 'urn:ogc:def:crs:EPSG::23030', 'http://www.opengis.net/gml/srs/epsg.xml#23030'],
  units: 'm',
};

// EPSG:23031
const proj23031 = {
  def: '+proj=utm +zone=31 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs',
  extent: [-650883.16, 3932764.97, 1493695.91, 8141744.84],
  codes: ['EPSG:23031', 'urn:ogc:def:crs:EPSG::23031', 'http://www.opengis.net/gml/srs/epsg.xml#23031'],
  units: 'm',
};

// EPSG:4326 WGS84 Geográficas
const proj4326 = {
  def: '+proj=longlat +datum=WGS84 +no_defs',
  extent: [-180, -90, 180, 90],
  codes: ['EPSG:4326', 'urn:ogc:def:crs:EPSG::4326', 'urn:ogc:def:crs:OGC:1.3:CRS84', 'http://www.opengis.net/def/crs/OGC/1.3/CRS84'],
  units: 'd',
  metersPerUnit: 111319.49079327358,
  axisOrientation: 'neu',
};

// EPSG:32627 WGS84 UTM huso 27N
const proj32627 = {
  def: '+proj=utm +zone=27 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
  extent: [166021.4431, 0.0000, 833978.5569, 9329005.1825],
  codes: ['EPSG:32627', 'urn:ogc:def:crs:EPSG::32627', 'http://www.opengis.net/gml/srs/epsg.xml#32627'],
  units: 'm',
};

// EPSG:32628 WGS84 UTM huso 28N
const proj32628 = {
  def: '+proj=utm +zone=28 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
  extent: [166021.44317933178, 0, 833978.5568206678, 9329005.18301614],
  codes: ['EPSG:32628', 'urn:ogc:def:crs:EPSG::32628', 'http://www.opengis.net/gml/srs/epsg.xml#32628'],
  units: 'm',
};

// EPSG:32629 WGS84 UTM huso 29N
const proj32629 = {
  def: '+proj=utm +zone=29 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
  extent: [166021.4431, 0.0000, 833978.5569, 9329005.1825],
  codes: ['EPSG:32629', 'urn:ogc:def:crs:EPSG::32629', 'http://www.opengis.net/gml/srs/epsg.xml#32629'],
  units: 'm',
};
// EPSG:32630 WGS84 UTM huso 30N
const proj32630 = {
  def: '+proj=utm +zone=30 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
  extent: [166021.4431, 0.0000, 833978.5569, 9329005.1825],
  codes: ['EPSG:32630', 'urn:ogc:def:crs:EPSG::32630', 'http://www.opengis.net/gml/srs/epsg.xml#32630'],
  units: 'm',
};

// EPSG:32631 WGS84 UTM huso 31N
const proj32631 = {
  def: '+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
  extent: [166021.4431, 0.0000, 833978.5569, 9329005.1825],
  codes: ['EPSG:32631', 'urn:ogc:def:crs:EPSG::32631', 'http://www.opengis.net/gml/srs/epsg.xml#32631'],
  units: 'm',
};

// EPSG:4081 REGCAN95 Geográficas
const proj4081 = {
  def: '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
  extent: [-21.93, 24.6, -11.75, 32.76],
  codes: ['EPSG:4081', 'urn:ogc:def:crs:EPSG::4081', 'http://www.opengis.net/gml/srs/epsg.xml#4081'],
  units: 'd',
  metersPerUnit: 111319.49079327358,
};

// EPSG:4082 REGCAN95 UTM huso 27N
const proj4082 = {
  def: '+proj=utm +zone=27 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  extent: [405849.71, 2720975.60, 1367994.77, 3662797.15],
  codes: ['EPSG:4082', 'urn:ogc:def:crs:EPSG::4082', 'http://www.opengis.net/gml/srs/epsg.xml#4082'],
  units: 'm',
};

// EPSG:4083 REGCAN95 UTM huso 28N
const proj4083 = {
  def: '+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
  extent: [-202677.94, 2738405.48, 804488.92, 3629357.10],
  codes: ['EPSG:4083', 'urn:ogc:def:crs:EPSG::4083', 'http://www.opengis.net/gml/srs/epsg.xml#4083'],
  units: 'm',
};

// All projections above
const projections = [
  proj4326,
  proj32627,
  proj32628,
  proj32629,
  proj32630,
  proj32631,
  proj4258,
  proj25829,
  proj25828,
  proj25830,
  proj25831,
  proj4230,
  proj23028,
  proj23029,
  proj23030,
  proj23031,
  proj4081,
  proj4082,
  proj4083,
];

const addProjections = (projectionsParam) => {
  // Register and publish projections
  projectionsParam.forEach((projection) => {
    projection.codes.forEach((code) => {
      proj4.defs(code, projection.def);
    });
    const olProjections = projection.codes.map((code) => {
      return new OLProjection({
        code,
        extent: projection.extent,
        units: projection.units,
        metersPerUnit: projection.metersPerUnit,
        axisOrientation: projection.axisOrientation,
      });
    });
    addEquivalentProjections(olProjections);
  });
};

// register proj4
addProjections(projections);
register(proj4);
