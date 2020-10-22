# M.plugin.XYLocator


Plugin que permite localizar las coordenas introducidas por el usuario en un Sistema de referencia determinado.
Las coordenadas son transformadas a proyección que tenga el mapa en ese momento.

# Dependencias

- xylocator.ol.min.js
- xylocator.ol.min.css


```html
 <link href="../../plugins/xylocator/xylocator.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/xylocator/xylocator.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **projections**. Proyecciones de origen que se mostrarán para seleccionar las coordenadas a localizar.
** Por defecto los valores posibles son:

```javascript
[
    { title: 'ETRS89 (4258)', code: 'EPSG:4258', units: 'd' },
    { title: 'WGS84 (4326)', code: 'EPSG:4326', units: 'd' },
    { title: 'WGS84 (3857)', code: 'EPSG:3857', units: 'm' },
    { title: 'ETRS89/UTM zone 31N (25831)', code: 'EPSG:25831', units: 'm' },
    { title: 'ETRS89/UTM zone 30N (25830)', code: 'EPSG:25830', units: 'm' },
    { title: 'ETRS89/UTM zone 29N (25829)', code: 'EPSG:25829', units: 'm' },
    { title: 'ETRS89/UTM zone 28N (25828)', code: 'EPSG:25828', units: 'm' },
  ]
```

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right 
  - 'BL':bottom left 
  - 'BR':bottom right

# Eventos

- **xylocator:locationCentered**
  - Evento que se dispara cuando se ha localizado la búsqueda del plugin sobre el mapa.
  - Expone, como parámetro devuelto, el **punto** actual calculado en la búsqueda

```javascript
mp.on('xylocator:locationCentered', (data) => {
   window.alert(`zoom: ${data.zoom}
   center: ${data.center[0].toFixed(2)}, ${data.center[1].toFixed(2)}`);
});
```
# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.XYLocator({
        postition: 'TL',
      });

   map.addPlugin(mp);
```

```javascript
const mp = new M.plugin.XYLocator({
  projections: [
    { title: 'WGS84 (4326)', code: 'EPSG:4326', units: 'd' },
    { title: 'ETRS89/UTM zone 31N (25831)', code: 'EPSG:25831', units: 'm' },
  ],
  position: 'TL',
});

map.addPlugin(mp);
```
