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

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.MeasureBar({
      position: 'TR',
});

   map.addPlugin(mp);
```
