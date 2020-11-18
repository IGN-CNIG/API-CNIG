import { map } from 'M/mapea';
import MBTiles from 'M/layer/MBTiles';

const mapjs = map({
  container: 'map',
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
    M.dialog.info('No hay fichero adjuntado.');
  }
}

document.body.onload = () => document.querySelector('#load-button').addEventListener('click', load);

window.map = mapjs;