# M.plugin.Transparency

Plugin que permite aplicar un efecto de transparencia a la capa seleccionada.

![Imagen1](./img/transparency_1.png)
![Imagen1](./img/transparency_2.png)

# Dependencias

- transparency.ol.min.js
- transparency.ol.min.css


```html
 <link href="../../plugins/transparency/transparency.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/transparency/transparency.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **layer**. Parámetro obligatorio. Array que contiene el/los nombre/s de la/s capa/s (que está/n en el mapa) o la/s url en formato mapea para insertar una capa a través de servicios WMS ó WMTS. 
  A esta capa se le aplicará el efecto de transparencia.

- **position**. Indica la posición donde se mostrará el plugin.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right

- **radius**. Campo numérico que modifica el radio del efecto transparencia. Tiene un rango entre 30 y 200.

# Eventos

# Otros métodos

# Ejemplos de uso

## Ejemplo 1
Insertar un capa a través de un servicio WMS.
```javascript
  const mp = new M.plugin.Transparency({
  position: 'TL',
  layers: ['WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo'],
  collapsible: false
});

   map.addPlugin(mp);
```

## Ejemplo 2
Insertar dos capas a través de servicio WMS.
```javascript
  const mp = new M.plugin.Transparency({
  position: 'TL',
  layers: ['WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas', 'WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo']
});

   map.addPlugin(mp);
```

## Ejemplo 3
Insertar una capa WMTS por nombre.
```javascript
let wmts = new M.layer.WMTS({
  url: "http://www.ideandalucia.es/geowebcache/service/wmts",
  name: "toporaster",
  matrixSet: "EPSG:25830",
  legend: "Toporaster"
}, {
  format: 'image/png'
});
map.addWMTS(wmts);
  const mp = new M.plugin.Transparency({
  position: 'TL',
  layers: ['toporaster'],
});

   map.addPlugin(mp);
```


## Ejemplo 4
Especificar radio
```javascript
let wmts = new M.layer.WMTS({
  url: "http://www.ideandalucia.es/geowebcache/service/wmts",
  name: "toporaster",
  matrixSet: "EPSG:25830",
  legend: "Toporaster"
}, {
  format: 'image/png'
});
map.addWMTS(wmts);
  const mp = new M.plugin.Transparency({
  position: 'TL',
  layers: ['toporaster'],
  radius: 200
});

   map.addPlugin(mp);
```
