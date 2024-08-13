import Sortable from 'sortablejs';
import { getAllLayersGroup } from './groupLayers';

const generateSortable = (map) => {
  const layers = map.getLayers();

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
      onAdd: (evt) => {
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
      },
      onEnd: (evt) => {
        const from = evt.from;
        const filterLayers = layers
          .filter(({ displayInLayerSwitcher }) => displayInLayerSwitcher === true);
        let maxZIndex = Math.max(...(filterLayers.map((l) => {
          return l.getZIndex();
        })));

        [...from.children].forEach((elem) => {
          const name = elem.getAttribute('data-layer-name');
          const url = elem.getAttribute('data-layer-url') || undefined;
          const type = elem.getAttribute('data-layer-type');
          const filtered = layers.filter((layer) => {
            return layer.name === name && (layer.url === url || (layer.url === undefined && (layer.type === 'OSM' || layer.type === 'GeoJSON' || layer.type === 'MBTilesVector' || layer.type === 'MBTiles')))
                    && layer.type === type;
          });
          if (filtered.length > 0) {
            filtered[0].setZIndex(maxZIndex);
            maxZIndex -= 1;
          }
        });
      },
    });
  });
};

export default generateSortable;
