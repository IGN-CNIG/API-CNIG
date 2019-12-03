# M.plugin.IGNSearchLocator


Plugin que permite la búsqueda de Direcciones postales (Geocoder de Cartociudad) y Topónimos (Nomenclátor del IGN)

# Dependencias

- ignsearchlocator.ol.min.js
- ignsearchlocator.ol.min.css

```html
 <link href="../../plugins/ignsearchlocator/ignsearchlocator.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/ignsearchlocator/ignsearchlocator.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **servicesToSearch**. Servicio que se consulta
  - **'g'**: Consulta Geocoder
  - **'n'**: Consulta Topónimos
  - **'gn'** : Consulta Geocoder y Topónimos
- **maxResults**. Número de resultados en la consulta (10 por defecto)
- **noProcess**. En geocoder, indica las entidades que no se incluirán en los resultados.
  - Admite combinación de 'municipio,poblacion,toponimo'
  - Por defecto ('municipio,poblacion')
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
'Comunidad autónoma',
'Ciudad con estatuto de autonomía',
'Provincia',
'Municipio',
'poblacion',
'EATIM',
'Isla administrativa',
'Comarca administrativa',
'Jurisdicción',
// 'Capital de Estado',
// 'Capital de comunidad autónoma y ciudad con estatuto de autonomía',
// 'Capital de provincia',
'Capital de municipio',
'Capital de EATIM',
'Núcleos de población',
'Entidad colectiva',
'Entidad menor de población',
'Distrito municipal',
// 'Barrio',
'Entidad singular',
'Construcción/instalación abierta',
'Edificación',
'Vértice Geodésico',
'Hitos de demarcación territorial',
'Hitos en vías de comunicación',
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
'Aeropuerto',
'Aeródromo',
'Pista de aviación y helipuerto',
'Puerto de Estado',
'Instalación portuaria',
// 'Carretera',
'Camino y vía pecuaria',
// 'Vía urbana',
'Ferrocarril',
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

- **ignsearchlocator:entityFound**
  - Evento que se dispara cuando se ha localizado la búsqueda del plugin sobre el mapa.
  - Expone, como parámetro devuelto, el **extent** actual calculado en la búsqueda

```javascript
mp.on('ignsearchlocator:entityFound', (extent) => {
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

   const mp = new M.plugin.IGNSearchLocator({
        servicesToSearch: 'gn',
        maxResults: 10,
        isCollapsed: false,
      });

   map.addPlugin(mp);
```
