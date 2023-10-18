import { map as Mmap } from 'M/mapea';
import WMS from 'M/layer/WMS';
import COG from 'M/layer/COG';

const mapjs = Mmap({
  container: 'map',
  controls: ['scaleline', 'panzoombar'],
});
const layerUA = new WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});

const layerCOG = new COG({
  // url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif'
  url: 'http://ftpcdd.cnig.es/Vuelos_2021/Vuelos_2021/catalunya_2021/Costa/01.VF/01.08_PNOA_2021_CAT_COSTA_22cm_VF_img8c_rgb_hu31/h50_0219_fot_002-0001_cog.tif'
  // url: 'http://ftpcdd.cnig.es/Vuelos_2015_2016/Vuelos_2015/Baleares/1.VF/1.08_PNOA_L6_2015_BAL_25cm_VF_img8c_rgb_hu31/h50_0697_fot_002-0026.tif'
})

window.mapjs = mapjs;
mapjs.addWMS(layerUA);
mapjs.addCOG(layerCOG);
