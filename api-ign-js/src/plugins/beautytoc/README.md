# M.plugin.BeautyTOC

Tabla de contenidos de fototeca. Consulta cobertura de vuelo sobre la vista.

# Dependencias
Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **beautytoc.ol.min.js**
- **beautytoc.ol.min.css**

```html
 <link href="https://componentes.cnig.es/api-core/plugins/beautytoc/beautytoc.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/beautytoc/beautytoc.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha. 
- **collapsed**: Indica si el plugin aparece por defecto colapsado o no. Por defecto: false.
- **tooltip**: Descripción emergente que se muestra sobre el plugin (se muestra al dejar el ratón encima del plugin como información). Por defecto, _Capas Adicionales_.

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
