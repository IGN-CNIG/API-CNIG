# M.plugin.IGNSearch


Plugin que permite la búsqueda de Direcciones postales (Geocoder de Cartociudad) y Topónimos (Nomenclátor del IGN)

# Dependencias

- ignsearch.ol.min.js
- ignsearch.ol.min.css

```html
 <link href="../../plugins/ignsearch/ignsearch.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/ignsearch/ignsearch.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **servicesToSearch**. Servicio que se consulta
  - **'g'**: Consulta Geocoder
  - **'n'**: Consulta Topónimos
  - **'gn'** : Consulta Geocoder y Topónimos
- **maxResults**. Número de resultados en cada una de las consultas a los diferentes servicios (Cada uno de estos servicios internamnete tiene tambien su limite de resultados, en geocoder, por ejemplo, es 5 )
- **noProcess**. En geocoder, indica las entidades que no se incluirán en los resultados.
  - Admite combinación de 'municipio,poblacion,toponimo'
  - Por defecto ('poblacion')
- **countryCode**. Código por defecto del país en la petición a geocoder. Por defecto countryCode = 'es'
- **isCollapsed**. Indica si se muestra el plugin cerrado (**true**) o con las búsquedas habilitadas visible (**false**).
- **resultVisibility**. Indica si se muestra o no la geometría del elemento localizado
- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right 
  - 'BL':bottom left 
  - 'BR':bottom right
- **nomenclatorSearchType**. En Nomenclátor, Array de cadenas que indica los tipos de entidad que se buscan en nomenclátor.
  - Por defecto se mantiene el siguiente array: 

```javascript
 ['Estado',
  // 'Comunidad autónoma',
  // 'Ciudad con estatuto de autonomía',
  'Provincia',
  // 'Municipio',
  'EATIM',
  'Isla administrativa',
  'Comarca administrativa',
  'Jurisdicción',
  // 'Capital de Estado',
  // 'Capital de comunidad autónoma y ciudad con estatuto de autonomía',
  // 'Capital de provincia',
  // 'Capital de municipio',
  // 'Capital de EATIM',
  // 'Entidad colectiva',
  'Entidad menor de población',
  'Distrito municipal',
  // 'Barrio',
  'Entidad singular',
  'Construcción/instalación abierta',
  'Edificación',
  // 'Vértice Geodésico',
  // 'Hitos de demarcación territorial',
  // 'Hitos en vías de comunicación',
  'Alineación montañosa',
  'Montaña',
  'Paso de montaña',
  'Llanura',
  'Depresión',
  'Vertientes',
  'Comarca geográfica',
  'Paraje',
  'Elemento puntual del paisaje',
  'Saliente costero',
  'Playa',
  'Isla',
  'Otro relieve costero',
  'Parque Nacional y Natural',
  'Espacio protegido restante',
  // 'Aeropuerto',
  // 'Aeródromo',
  // 'Pista de aviación y helipuerto',
  // 'Puerto de Estado',
  'Instalación portuaria',
  // 'Carretera',
  'Camino y vía pecuaria',
  // 'Vía urbana',
  // 'Ferrocarril',
  'Curso natural de agua',
  'Masa de agua',
  'Curso artificial de agua',
  'Embalse',
  'Hidrónimo puntual',
  'Glaciares',
  'Mar',
  'Entrante costero y estrecho marítimo',
  'Relieve submarino',
];
```
- **urlCandidates**. Url servicio candidates de geocoder. Por defecto 'http://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp'
- **urlFind**. Url servicio find de geocoder. Por defecto 'http://www.cartociudad.es/geocoder/api/geocoder/findJsonp'
- **urlReverse**. Url Servicio geocoding inverso. Por defecto 'http://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode'
- **urlPrefix**. Prefijo source servicio Nomenclátor. Por defecto 'http://www.idee.es/'
- **urlAssistant**. Url servicio SearchAssitant de Nomenclátor.
- **urlDispatcher**. Url servicio Dispatcher de Nomenclátor.

# Eventos

- **ignsearch:entityFound**
  - Evento que se dispara cuando se ha localizado la búsqueda del plugin sobre el mapa.
  - Expone, como parámetro devuelto, el **extent** actual calculado en la búsqueda

```javascript
mp.on('ignsearch:entityFound', (extent) => {
  // eslint-disable-next-line no-alert
  window.alert('Encontrado');
});
```

# Otros métodos

- **setResultVisibility( boolean )** 
  - Habilita o deshabilita la visualización de los resultados sobre el mapa


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.IGNSearch({
        servicesToSearch: 'gn',
        maxResults: 10,
        noProcess: 'poblacion',
        countryCode: 'es',
        isCollapsed: false,
        position: 'TL',
        reverse: true,

        urlCandidates: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/candidatesJsonp',
        urlFind: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/findJsonp',
        urlReverse: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/reverseGeocode',
      });

   map.addPlugin(mp);
```

