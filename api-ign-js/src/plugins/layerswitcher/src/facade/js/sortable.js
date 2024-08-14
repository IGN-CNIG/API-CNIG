import Sortable from 'sortablejs';
import { getAllLayersGroup } from './groupLayers';

const LAYER_NOT_URL = ['OSM', 'GeoJSON', 'MBTilesVector', 'MBTiles', 'LayerGroup'];

const handleOnAdd = (map) => (evt) => {
  if (evt.to.classList.contains('m-layerswitcher-ullayers')
        && evt.from.classList.contains('m-layerswitcher-ullayers')) {
    return;
  }

  const from = evt.from.getAttribute('data-layer-name');
  const nameFrom = evt.item.getAttribute('data-layer-name');
  const nameTo = evt.to.getAttribute('data-layer-name');

  const isToMap = (evt.to.classList.contains('m-layerswitcher-ullayers')
      && evt.from.classList.contains('m-layerswitcher-ullayersGroup'));

  const layerTo = isToMap
    ? map
    : getAllLayersGroup(map).find((layer) => layer.name === nameTo);

  const isFromMap = (evt.from.classList.contains('m-layerswitcher-ullayers')
      && evt.to.classList.contains('m-layerswitcher-ullayersGroup'));

  const layerFrom = isFromMap
    ? map.getLayers().find((layer) => layer.name === nameFrom)
    : getAllLayersGroup(map).find((layer) => layer.name === nameFrom);

  if (isFromMap) {
    map.getLayers().forEach((layer) => {
      if (layer.name === nameFrom) {
        map.removeLayers(layer);
      }
    });
  } else {
    map.getImpl().getGroupedLayers().forEach((group) => {
      if (group.name === from) {
        group.removeLayers(layerFrom);
      }
    });
  }

  layerTo.addLayers(layerFrom);
};

const handleOnEnd = (map, overlayLayers) => (evt) => {
  const to = evt.to;
  const layers = (to.classList.contains('m-layerswitcher-ullayersGroup'))
    ? getAllLayersGroup(map).concat(overlayLayers)
    : map.getLayers();

  let maxZIndex = 0;

  const filterLayers = layers
    .filter(({ displayInLayerSwitcher }) => displayInLayerSwitcher === true);
  maxZIndex = Math.max(...(filterLayers.map((l) => {
    return l.getZIndex();
  })));

  [...to.children].forEach((elem) => {
    const name = elem.getAttribute('data-layer-name');
    const url = elem.getAttribute('data-layer-url') || undefined;
    const type = elem.getAttribute('data-layer-type');

    const filtered = layers.filter((layer) => {
      return layer.name === name && (layer.url === url
        || (layer.url === undefined && LAYER_NOT_URL.includes(layer.type)))
          && layer.type === type;
    });
    if (filtered.length > 0) {
      filtered[0].setZIndex(maxZIndex);
      maxZIndex -= 1;
    }
  });
};

const generateSortable = (map, overlayLayers) => {
  [...document.querySelectorAll('.nested-sortable')].forEach((nestedSortable) => {
    // eslint-disable-next-line no-new
    new Sortable(nestedSortable, {
      group: 'nested',
      animation: 150,
      fallbackOnBody: true,
      preventOnFilter: false,
      ghostClass: 'm-layerswitcher-gray-shadow',
      filter: '.m-layerswitcher-opacity',
      swapThreshold: 0.65,
      onAdd: handleOnAdd(map),
      onEnd: handleOnEnd(map, overlayLayers),
    });
  });
};

export default generateSortable;
