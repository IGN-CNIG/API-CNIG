# M.plugin.GeometryDraw

Plugin que permite el dibujo y edición de geometrías sobre un mapa, así como su descarga.


# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **geometrydraw.ol.min.js**
- **geometrydraw.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/geometrydraw/geometrydraw.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/geometrydraw/geometrydraw.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si el plugin viene cerrado por defecto. Por defecto: true.
- **collapsible**: Indica si el plugin se puede cerrar. Por defecto: true.


# Parámetros API REST
```javascript
URL_API?geometrydraw=position*collapsed*collapsible
````
Ejemplo:
```javascript
http://mapea.desarrollo.guadaltel.es/api-core/?geometrydraw=BL*true*true
```


### Ejemplos de uso

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new GeometryDraw();

map.addPlugin(mp);
```

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new GeometryDraw({
  position: 'TL',
  collapsed: true,
  collapsible: true,

});

map.addPlugin(mp);
```
