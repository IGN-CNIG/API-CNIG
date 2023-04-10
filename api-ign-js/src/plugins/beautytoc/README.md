# M.plugin.BeautyTOC

Tabla de contenidos de fototeca. Consulta cobertura de vuelo sobre la vista.

## Api.json

INTEGRACIÓN DE PARÁMETROS EN API REST

OPCIONES:  
1. Nuevo parámetro en la API REST normalmente porque requiera parámetros de configuración.
Example: <url_mapea>?beautytoc=[params]

2. Nuevo valor para el parámetro plugins, el plugin no requiere configuración
Example: <url_mapea>?plugins=beautytoc

# Dependencias

- beautytoc.ol.min.js
- beautytoc.ol.min.css


```html
 <link href="../../plugins/beautytoc/beautytoc.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/beautytoc/beautytoc.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha. 
- **collapsed**: Indica si el plugin aparece por defecto colapsado o no. Por defecto: true.

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.BeautyTOC({
        postition: 'TL',
      });

   map.addPlugin(mp);
```


### Plugin sin parámetros

```
{
   "url": {
      "name": "beautytoc"
   },
   "constructor": "M.plugin.BeautyTOC"
}
```
### Plugin con parámetros

```
{
   "url": {
      "name": "beautytoc",
      "separator": "*"
   },
   "constructor": "M.plugin.BeautyTOC",
   "parameters": [{
     "type": "object",
     "properties": [{
       "type": "simple",
       "name": "position",
       "position": 0,
       "possibleValues": ["TL", "TR", "BL", "BR"]
     }, {
       "type": "boolean",
       "name": "collapsed",
       "position": 1
     }]
   }],
}
```
