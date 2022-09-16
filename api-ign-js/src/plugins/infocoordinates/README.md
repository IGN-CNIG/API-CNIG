# M.plugin.Infocoordinates

Tras hacer click en el mapa, muestra las coordenadas geográficas y proyectadas de ese punto con posibilidad de cambiarlas a ETRS89, WGS84 o REGCAN95 y además cambiar el formato a las geográficas entre decimal y GGMMSS.

## Dependencias

- infocoordinates.ol.min.js
- infocoordinates.ol.min.css


```html
 <link href="../../plugins/infocoordinates/infocoordinates.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/infocoordinates/infocoordinates.ol.min.js"></script>
```
# Parámetros

El constructor se inicializa con un JSON de _options_ con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left
  - 'TR':top right (por defecto)
  - 'BL':bottom left
  - 'BR':bottom right
- **decimalGEOcoord**. Indica el número de decimales de las coordenadas geográficas.
- **decimalUTMcoord**. Indica el número de decimales de las coordenadas proyectadas en UTM.
## Eventos

## Otros métodos

## Ejemplos de uso

### Ejemplo 1
```javascript
   const map = M.map({
     container: 'map'
   });

const mp = new M.plugin.Infocoordinates();

map.addPlugin(mp);
```

### Ejemplo 2
```javascript
   const map = M.map({
     container: 'map'
   });

const mp = new M.plugin.Infocoordinates({
   position: 'TL',
   decimalGEOcoord: 4,
   decimalUTMcoord: 2
   
});

map.addPlugin(mp);
```