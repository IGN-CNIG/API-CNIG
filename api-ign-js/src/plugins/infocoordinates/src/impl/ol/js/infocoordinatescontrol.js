/* eslint-disable no-console */
/**
 * @module M/impl/control/InfocoordinatesControl
 */
export default class InfocoordinatesControl extends M.impl.Control {
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

    // super addTo - don't delete
    super.addTo(map, html);
  }

  // Add your own functions


  getCoordinates(feature, SRStarget, formatGMS) {
    //   Si es ETRS89 estará entre una longitud de -12 y 6:
    //               huso 29(-12 al -6)
    //               huso 30(-6 al 0)
    //               huso 31(0 al 6)

    //   Si es WGS84 estará entre una longitud de -24 y 6
    //               huso 27(-24 al -18)
    //               huso 28(-18 al -6)
    //               huso 29(-12 al -6)
    //               huso 30(-6 al 0)
    //               huso 31(0 al 6)

    //   Si es REGCAN95 estará entre una longitud de -24 y -6
    //             huso 27(-24 al - 18)
    //             huso 28(-18 al - 6)

    //   Para el resto de valores las coordenadas deben ser "--","--"*/
    let numPoint = feature.getId();
    let coordinatesFeature = feature.getAttribute('coordinates');

    let SRSfeature = feature.getAttribute('EPSGcode');
    let coordinatesGEOoutput = ol.proj.transform(coordinatesFeature, SRSfeature, SRStarget);

    let coordinatesGEOoutputLongitude = coordinatesGEOoutput[0];

    let zone;
    let projectionUTMCodeTarget = null;
    const NODATA = '--';
    let salida = {
      'NumPoint': numPoint,
      'projectionGEO': {
        'code': NODATA,
        'coordinatesGEO': {
          'longitude': NODATA,
          'latitude': NODATA,
        },
      },
      'projectionUTM': {
        'code': NODATA,
        'zone': NODATA,
        'coordinatesUTM': {
          'coordX': NODATA,
          'coordY': NODATA
        }
      }
    };

    if (coordinatesGEOoutputLongitude >= -24 && coordinatesGEOoutputLongitude <= 6) {
      zone = this.zoneCalc(coordinatesGEOoutputLongitude);
      if (SRStarget == 'EPSG:4326') {
        projectionUTMCodeTarget = this.projectionUTMcodeCalc(zone, 'EPSG:4326');
      } else if (SRStarget == 'EPSG:4258' && (coordinatesGEOoutputLongitude >= -12 && coordinatesGEOoutputLongitude <= 6)) {
        projectionUTMCodeTarget = this.projectionUTMcodeCalc(zone, 'EPSG:4258');
      } else if (SRStarget == 'EPSG:4081' && (coordinatesGEOoutputLongitude >= -24 && coordinatesGEOoutputLongitude <= -6)) {
        projectionUTMCodeTarget = this.projectionUTMcodeCalc(zone, 'EPSG:4081');
      }

      if (projectionUTMCodeTarget != null) {
        let coordinatesUTMoutput = ol.proj.transform(coordinatesFeature, SRSfeature, projectionUTMCodeTarget);

        salida = {
          'NumPoint': numPoint,
          'projectionGEO': {
            'code': SRStarget,
            'coordinatesGEO': {
              'longitude': coordinatesGEOoutput[0].toFixed(4),
              'latitude': coordinatesGEOoutput[1].toFixed(4),
            },
          },
          'projectionUTM': {
            'code': projectionUTMCodeTarget,
            'zone': zone,
            'coordinatesUTM': {
              'coordX': coordinatesUTMoutput[0].toFixed(2),
              'coordY': coordinatesUTMoutput[1].toFixed(2)
            }
          }
        }

        if (formatGMS == true) {
          let coordinateGGMMSS = ol.coordinate.toStringHDMS(coordinatesGEOoutput, 2);
          salida.projectionGEO.coordinatesGEO.latitude = coordinateGGMMSS.substr(0, 17);
          salida.projectionGEO.coordinatesGEO.longitude = coordinateGGMMSS.substr(17);
        }

      }
    }
    return salida
  }


  zoneCalc(coordinatesDEClongitude) {
    let zone;
    if (coordinatesDEClongitude > 0 && coordinatesDEClongitude <= 6) {
      zone = 31
    } else if (coordinatesDEClongitude >= -6 && coordinatesDEClongitude <= 0) {
      zone = 30;
    } else if (coordinatesDEClongitude >= -12 && coordinatesDEClongitude < -6) {
      zone = 29;
    } else if (coordinatesDEClongitude >= -18 && coordinatesDEClongitude < -12) {
      zone = 28
    } else if (coordinatesDEClongitude >= -24 && coordinatesDEClongitude < -18) {
      zone = 27
    } else {
      zone = null
    }
    return zone;
  }

  projectionUTMcodeCalc(zone, projectionGEOcode) {
    let projectionUTMcode;

    switch (projectionGEOcode) {
      case 'EPSG:4326':
        projectionUTMcode = 'EPSG:326' + zone;
        break;
      case 'EPSG:4258':
        projectionUTMcode = 'EPSG:258' + zone;
        break;
      case 'EPSG:4081':
        if (zone == 27) {
          projectionUTMcode = 'EPSG:4082';
        } else if (zone == 28) {
          projectionUTMcode = 'EPSG:4083';
        }
        break;
    }
    return projectionUTMcode
  }

  readAltitudeFromWCSservice(coord, srcMapa) {

    // 1.- transformo las coordenadas a EPSG4258 ya que el servicio WCS es en ese srs    
    let coordinatesEPSG4528 = ol.proj.transform(coord, srcMapa, 'EPSG:4258')

    // 2.- me genero un bbox de las coordenadas
    let bbox = [
      [coordinatesEPSG4528[0], coordinatesEPSG4528[1]],
      [coordinatesEPSG4528[0] + 0.000001, coordinatesEPSG4528[1] + 0.000001]
    ]

    // 3.- lanzo el servicio y el método devolverá un texto que lo recogerá una promesa
    const PROFILE_URL = 'https://servicios.idee.es/wcs-inspire/mdt?request=GetCoverage&bbox=';
    const PROFILE_URL_SUFFIX = '&service=WCS&version=1.0.0&coverage=Elevacion4258_5&' +
      'interpolationMethod=bilinear&crs=EPSG%3A4258&format=ArcGrid&width=2&height=2';
    const url = `${PROFILE_URL}${bbox}${PROFILE_URL_SUFFIX}`;

    return M.remote.get(url)

  }





































  activateClick(map) {
    // desactivo el zoom al dobleclick
    this.dblClickInteraction_.setActive(false);

    // añado un listener al evento dblclick
    const olMap = map.getMapImpl();
    olMap.on('dblclick', (evt) => {
      // disparo un custom event con las coordenadas del dobleclick
      const customEvt = new CustomEvent('mapclicked', {
        detail: evt.coordinate,
        bubbles: true,
      });
      map.getContainer().dispatchEvent(customEvt);
    });
  }

  deactivateClick(map) {
    // activo el zoom al dobleclick
    this.dblClickInteraction_.setActive(true);

    // elimino el listener del evento
    map.getMapImpl().removeEventListener('dblclick');
  }
}
