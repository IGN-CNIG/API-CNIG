# M.plugin.Vectors

Plugin que permite el dibujo y edición de geometrías sobre un mapa, así como su descarga.


# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **vectors.ol.min.js**
- **vectors.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/vectors/vectors.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/vectors/vectors.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **collapsed**: Indica si el plugin viene cerrado por defecto (true/false). Por defecto: true.
- **collapsible**: Indica si el plugin se puede cerrar (true/false). Por defecto: true.
- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.

# Parámetros API REST
```javascript
URL_API?vectors=position*collapsed*collapsible
````
Ejemplo:
```javascript
https://componentes.cnig.es/api-core/?vectors=BL*true*true
```


# Ejemplos de uso

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new Vectors();

map.addPlugin(mp);
```

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new Vectors({
  collapsed: true,
  collapsible: true,
  position: 'TL',
});

map.addPlugin(mp);
```
