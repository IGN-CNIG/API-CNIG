

export const dicAccesibilityButton = {
  'set-mirror-0': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa:',
        secondaryMap: 'Capas del mapa:',
      },
    },
  ],
  'set-mirror-1': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa derecho:',
        secondaryMap: 'Capas del mapa izquierdo:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa izquierdo:',
        secondaryMap: 'Capas del mapa derecho:',
      },
    },
  ],
  'set-mirror-2': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa superior:',
        secondaryMap: 'Capas del mapa superior:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa inferior:',
        secondaryMap: 'Capas del mapa inferior:',
      },
    },
  ],
  'set-mirror-3': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa derecho:',
        secondaryMap: 'Capas del mapa izquierdo:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa central:',
        secondaryMap: 'Capas del mapa central:',
      },
    },
    {
      id: 'mapLCSelect_label',
      text: {
        principalMap: 'Capas del mapa izquierdo:',
        secondaryMap: 'Capas del mapa derecho:',
      },
    }],
  'set-mirror-4': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa derecho:',
        secondaryMap: 'Capas del mapa izquierdo:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa central derecho:',
        secondaryMap: 'Capas del mapa central izquierdo:',
      },
    },
    {
      id: 'mapLCSelect_label',
      text: {
        principalMap: 'Capas del mapa central izquierdo:',
        secondaryMap: 'Capas del mapa central derecho:',
      },
    },
    {
      id: 'mapLDSelect_label',
      text: {
        principalMap: 'Capas del mapa izquierdo:',
        secondaryMap: 'Capas del mapa derecho:',
      },
    },
  ],
  'set-mirror-5': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa superior derecho:',
        secondaryMap: 'Capas del mapa superior izquierdo:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa superior izquierdo:',
        secondaryMap: 'Capas del mapa superior derecho:',
      },
    },
    {
      id: 'mapLCSelect_label',
      text: {
        principalMap: 'Capas del mapa inferior izquierdo:',
        secondaryMap: 'Capas del mapa inferior izquierdo:',
      },
    },
    {
      id: 'mapLDSelect_label',
      text: {
        principalMap: 'Capas del mapa inferior derecho:',
        secondaryMap: 'Capas del mapa inferior derecho:',
      },
    },
  ],
  'set-mirror-6': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del primer mapa:',
        secondaryMap: 'Capas del primer mapa:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del segundo mapa:',
        secondaryMap: 'Capas del segundo mapa:',
      },
    },
    {
      id: 'mapLCSelect_label',
      text: {
        principalMap: 'Capas del tercer mapa:',
        secondaryMap: 'Capas del tercer mapa:',
      },
    },
    {
      id: 'mapLDSelect_label',
      text: {
        principalMap: 'Capas del cuarto mapa:',
        secondaryMap: 'Capas del cuarto mapa:',
      },
    },
  ],
  'set-mirror-7': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa derecho:',
        secondaryMap: 'Capas del mapa izquierdo:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa central:',
        secondaryMap: 'Capas del mapa central:',
      },
    },
    {
      id: 'mapLCSelect_label',
      text: {
        principalMap: 'Capas del mapa izquierdo:',
        secondaryMap: 'Capas del mapa derecho:',
      },
    },
  ],
  'set-mirror-8': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa superior:',
        secondaryMap: 'Capas del mapa superior:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa izquierdo:',
        secondaryMap: 'Capas del mapa izquierdo:',
      },
    },
    {
      id: 'mapLCSelect_label',
      text: {
        principalMap: 'Capas del mapa derecho:',
        secondaryMap: 'Capas del mapa derecho:',
      },
    },
  ],
  'set-mirror-9': [
    {
      id: 'mapLASelect_label',
      text: {
        principalMap: 'Capas del mapa derecho:',
        secondaryMap: 'Capas del mapa izquierdo:',
      },
    },
    {
      id: 'mapLBSelect_label',
      text: {
        principalMap: 'Capas del mapa izquierdo:',
        secondaryMap: 'Capas del mapa derecho:',
      },
    },
    {
      id: 'mapLCSelect_label',
      text: {
        principalMap: 'Capas del mapa inferior:',
        secondaryMap: 'Capas del mapa inferior:',
      },
    },
  ],
};

export const getNameString = (value) => {
  const [type,, nameWMTS, nameWMS] = value.split('*');
  return (type === 'WMS') ? nameWMS : nameWMTS;
};

/**
 * @param {*} layer Capa del evento
 * @param {*} comparatorLayers Capas del comparador
 * @returns {Array} Capas del comparador activa y otras capas
 */
export const checkLayers = (layer, comparatorLayers) => {
  let activeLayerComparators = null;
  const otherLayers = [];

  layer.forEach((l) => {
    const some = comparatorLayers.some(c => l.name === getNameString(c));
    if (some) {
      activeLayerComparators = l;
    } else {
      otherLayers.push(l);
    }
  });

  return [activeLayerComparators, otherLayers];
};

/**
 * Este método se encarga de obtener los parámetros de la
 * capa
 * @function
 * @param {M.layer.WMS | M.layer.WMTS} layer Capa WMS o WMTS
 * @return {Array<String> | false} Array con las capas o false si no es un objeto
 */
export const transformToStringLayers = (layer, map, remove = true) => {
  if (layer.type === 'WMS') {
    const {
      url, name, legend, useCapabilities, options,
    } = layer;
    if (remove) { map.removeWMS(name); }
    return `WMS*${legend}*${url}*${name}*${options.format || 'image/png'}*${useCapabilities}`;
  } else if (layer.type === 'WMTS') {
    const {
      url, name, legend, matrixSet, options,
      // useCapabilities, transparent, options, displayInLayerSwitcher,
    } = layer;
    if (remove) { map.removeWMTS(name); }
    const { code } = map.getProjection();
    return `WMTS*${url}*${name}*${matrixSet || code}*${legend}*${options.format || 'image/png'}*false`;
  }

  return false; // No son objetos
};

export const transformToLayers = (layers, index) => {
  const transform = layers.map((layer) => {
    const urlLayer = layer.split('*');
    if (urlLayer[0].toUpperCase() === 'WMS') {
      const l = new M.layer.WMS({
        url: urlLayer[2],
        name: urlLayer[3],
        legend: urlLayer[1],
        format: urlLayer[4],
        useCapabilities: urlLayer[5] === 'true' || false,
      });
      l.setZIndex(index);
      return l;
    }

    const l = new M.layer.WMTS({
      url: urlLayer[1],
      name: urlLayer[2],
      legend: urlLayer[4],
      matrixSet: urlLayer[3],
      transparent: true, // Es una capa Overlay -> zIndex > 0
      displayInLayerSwitcher: false, // No aparece en el TOC
      queryable: false, // No GetFeatureInfo
      visibility: false, // Visible a false por defecto
      format: urlLayer[5],
      useCapabilities: urlLayer[6] === 'true' || false,
    });

    l.setZIndex(index);

    return l;
  });
  return transform;
};

