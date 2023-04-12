# M.plugin.Rescale


Plugin que permite hacer zoom a una escala elegida. El resultado mostrado es una aproximación a dicha escala, que equivale a los niveles de zoom de [GoogleMapsCompatible](https://docs.opengeospatial.org/is/17-083r2/17-083r2.html).


# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **rescale.ol.min.js**
- **rescale.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/rescale/rescale.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/rescale/rescale.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si el plugin viene colapsado por defecto (true/false). Por defecto: true.
- **collapsible**: Indica si se puede colapsar el plugin (true/false). Por defecto: true.
  
# Ejemplos de uso

```javascript
const mp = new M.plugin.Rescale();

map.addPlugin(mp);
```

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.Rescale({
        position: 'TL',
      });

   map.addPlugin(mp);
```
