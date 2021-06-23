# M.plugin.MeasureBar

Herramienta de medición de áreas y distancias.  
Con clicks del ratón se establecen los vértices de la línea/área de medición.  
Manteniendo pulsado SHIFT, la línea/área de edición se dibuja a mano alzada.

# Dependencias

- measurebar.ol.min.js
- measurebar.ol.min.css

```html
 <link href="../../plugins/measurebar/measurebar.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/measurebar/measurebar.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:


- *position*.  Ubicación del plugin sobre el mapa (Default = 'TL')
  - 'BL' = Bottom left
  - 'BR' = Bottom right
  - 'TL' = Top left
  - 'TR' = Top right


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.MeasureBar({
      position: 'TR',
   });

   map.addPlugin(mp);

   mp.measurePosition_.impl_.setCoordLocationStart([-600000,4300000]]);
```
