
import olOSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'

export const OSM = new TileLayer({
    source: new olOSM()
})