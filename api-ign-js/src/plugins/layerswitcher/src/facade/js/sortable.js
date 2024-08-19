import Sortable from 'sortablejs';
import { getAllLayersGroup } from './groupLayers';

const LAYER_NOT_URL = ['OSM', 'GeoJSON', 'MBTilesVector', 'MBTiles', 'LayerGroup'];

const handleOnAdd = (map) => (evt) => {
  // De mapa a mapa (no se hace nada)
  if (evt.to.classList.contains('m-layerswitcher-ullayers')
        && evt.from.classList.contains('m-layerswitcher-ullayers')) {
    return;
  }

  const nameFrom = evt.from.getAttribute('data-layer-name');
  const itemName = evt.item.getAttribute('data-layer-name');
  const nameTo = evt.to.getAttribute('data-layer-name');

  // De grupo a mapa
  const isToMap = (evt.to.classList.contains('m-layerswitcher-ullayers')
      && evt.from.classList.contains('m-layerswitcher-ullayersGroup'));

  // De mapa a grupo
  const isFromMap = (evt.from.classList.contains('m-layerswitcher-ullayers')
      && evt.to.classList.contains('m-layerswitcher-ullayersGroup'));

  // De grupo a grupo
  const isGroupToGroup = (evt.from.classList.contains('m-layerswitcher-ullayersGroup')
      && evt.to.classList.contains('m-layerswitcher-ullayersGroup'));

  const groupFrom = isToMap || isGroupToGroup
    ? map.getLayerGroup().find((g) => g.name === nameFrom) : null;
  const groupTo = isFromMap || isGroupToGroup
    ? map.getLayerGroup().find((g) => g.name === nameTo) : null;

  const item = isToMap || isGroupToGroup
    ? groupFrom.getLayers().find((l) => l.name === itemName)
    : map.getLayers().find((l) => l.name === itemName);

  if (isToMap || isGroupToGroup) {
    groupFrom.ungroup(item, true);
  }
  if (isFromMap || isGroupToGroup) {
    map.removeLayers(item);
    groupTo.addLayers(item);
  }
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
