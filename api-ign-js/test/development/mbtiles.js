import { map } from 'M/mapea';
import { info } from 'M/dialog';
import MBTiles from 'M/layer/MBTiles';

const bbox = {
  x: { max: 37752.77805046586, min:-1127147.533015621},
  y: { max: 4827108.713010305, min:4246798.794269246}
}

const mapjs = map({
  container: 'map',
  bbox: bbox
});

function load() {
  const input = document.querySelector('#file-input');
  if (input.files.length > 0) {
    const file = input.files[0];
    const mbtiles = new MBTiles({
      name: file.name,
      legend: file.name,
      source: file,
    });
    mapjs.addLayers(mbtiles);
  } else {
    info('No hay fichero adjuntado.');
  }
}

document.body.onload = () => document.querySelector('#load-button').addEventListener('click', load);

window.map = mapjs;