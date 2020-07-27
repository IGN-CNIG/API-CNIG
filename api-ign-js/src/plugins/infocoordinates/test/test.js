import Infocoordinates from 'facade/infocoordinates';

const map = M.map({
  container: 'mapjs',
  zoom: 7,
  center: [-467062.8225, 4783459.6216],

});


M.language.setLang('es');

const mp = new Infocoordinates({
  position: 'TR',
  decimalGEOcoord: 4,
  decimalUTMcoord: 4,
});

map.addPlugin(mp);
map.addPlugin(new M.plugin.Information({
  position: 'TR',
}));
map.addPlugin(new M.plugin.FullTOC({
  precharged: {
      groups: [{
              name: 'Hidrografía',
              services: [{
                  name: 'IDEE Hidrografía',
                  type: 'WMS',
                  url: 'http://servicios.idee.es/wms-inspire/hidrografia?',
                  white_list: ['HY.PhysicalWaters.Waterbodies', 'HY.PhysicalWaters.Wetland', 'HY.PhysicalWaters.Catchments'],
              }, ],
          },
          {
              name: 'Transporte',
              services: [{
                      name: 'IDEE - Red de transporte',
                      type: 'WMS',
                      url: 'http://servicios.idee.es/wms-inspire/transportes?',
                  },
                  {
                      name: 'ADIF - Red de transporte ferroviario',
                      type: 'WMS',
                      url: 'http://ideadif.adif.es/services/wms?',
                  },
              ],
          },
      ],
      services: [{
              name: 'Camino de Santiago',
              type: 'WMS',
              url: 'https://www.ign.es/wms-inspire/camino-santiago',
          },
          {
              name: 'Redes Geodésicas',
              type: 'WMS',
              url: 'https://www.ign.es/wms-inspire/redes-geodesicas',
          },
          {
              name: 'Planimetrías',
              type: 'WMS',
              url: 'https://www.ign.es/wms/minutas-cartograficas',
          },
          {
            name: 'Límites Administrativos',
            type: 'WMS',
            url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
          },
      ],
  },
}));

window.map = map;
