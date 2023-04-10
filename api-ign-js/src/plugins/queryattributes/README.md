<p align="center">
  <img src="assets/logo-apicnig.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.QueryAttributes</small></h1>

<p align="center">
  <a title="MIT License" href="LICENSE.md">
    <img src="https://img.shields.io/badge/license-EUPL-blue.svg">
  </a>
  <a title="Node version" href="#">
    <img src="https://img.shields.io/badge/node-v14.16-blue">
  </a>  
  <a title="NPM version" href="#">
    <img src="https://img.shields.io/badge/npm-v6.14-blue">
  </a>  
  <br />
  <br />
</p>

## Descripción 👷

Plugin que permite aplicar filtros sobre las capas de un mapa y visualizar de forma gráfica las features que cumplen los filtros. Permite guardar consultas, combinarlas y exportar los resultados de estas.

## Dependencias 👷

- queryattributes.ol.min.js
- queryattributes.ol.min.css

```html
 <link href="../../plugins/queryattributes/queryattributes.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/queryattributes/queryattributes.ol.min.js"></script>
```

## Parámetros 👷

El constructor se inicializa con un JSON de _options_ con los siguientes atributos:

- **collapsed**: Indica si el plugin viene cerrado por defecto (true/false). Por defecto: true.
- **collapsible**: Indica si el plugin se puede cerrar (true/false). Por defecto: true.
- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **filters**: Cuando toma el valor false, en cada cambio de zoom muestra en la tabla los registros que se encuentran en el bounding box de la pantalla. Cuando toma valor true, muestra botones para establecer filtro por bounding box o por polígono trazado por el usuario. Por defecto: true.
- **refreshBBOXFilterOnPanning**: define el comportamiento del filtro de vista al activarse. Si es *true*, se reevalúa después de cada panning o cambio de zoom. Si su valor es *false*, sólo se aplica la primera vez con los elementos en pantalla, y no se vuelve a calcular después de cada panning. Por defecto es *false*.
- **configuration**: aquí definimos el aspecto y el tratamiento de los campos de la capa vectorial dentro de la tabla de atributos.
  - **layer**: nombre de la capa cuyos elementos se mostrarán en la tabla de atributos, especificada en su propiedad *name*.
  - **pk**: nombre del atributo que actúa como clave principal.
  - **initialsort**: aquí indicamos el campo por el que se ordena inicialmente
    - **name**: nombre del campo para ordenar.
    - **dir**: sentido de ordenación [asc, desc]
  - **columns**: array de objetos con la definición de los campos para la tabla de atributos

### 🔸 Definición de campos

Cada campo de la capa vectorial necesita un objeto para definirlo. Los atributos del objeto son

* **name**: nombre del campo en el *feature*.
* **alias**: denominación del campo para mostrar.
* **visible**: true/false. Se muestra o no en la tabla.
* **searchable**: true/false. Indicamos si el campo atiende a filtros de texto.
* **showpanelinfo**: true/false. Indicamos si el campo se muestra o no en la ventana de información.
* **align**: right/left. Alineación horizontal en la celdilla de la tabla
* **type**: tipo del campo
  * **string**: tipo de cadena. Por defecto.
  * **image**: contiene la URL de una imagen. La imagen se  mostrará en la tabla.
  * **linkURL**: contiene una URL. Se muestra dentro de un hipervínculo.
  * **buttonURL**: contiene una URL. Se muestra dentro de un botón.
  * **formatter**: repite un carácter formateado un número especificado de veces.
  * **percentage**: muestra el valor formateado en una barra de progreso.
* **typeparam**: parámetros para complementar al atributo *type*.
  * **buttonURL**: texto que figura en el botón.
  * **formatter**: valor que se repite.


## Ejemplo de definición del plugin

```javascript

const map = M.map({
  container: 'map'
});

const mp = new QueryAttributes({
  position: 'TL',
  collapsed: true,
  collapsible: true,
  filters: true,
  configuration: {
    layer: 'vertices',
    pk: 'id',
    initialSort: { name: 'nombre', dir: 'asc' },
    columns: [
      {
          name: 'id',
          alias: 'Identificador',
          visible: false,
          searchable: false ,
          showpanelinfo: true,
          align: 'right',
          type: 'string'},
      { name: 'nombre', alias: 'Nombre Vértice', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      { name: 'xutmetrs89', alias: 'Coordenada X', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      { name: 'yutmetrs89', alias: 'Coordenada Y', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      { name: 'horto', alias: 'Altitud Ortométrica', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      { name: 'calidad', alias: 'Calidad', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'formatter', typeparam:'⭐️'},
      { name: 'nivel', alias: 'Vida útil', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'percentage'},
      { name: 'urlficha', alias: 'URL PDF Ficha', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'linkURL'},
      { name: 'urlcdd', alias: 'Descargas', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'buttonURL', typeparam:'🔗 Acceder'},
      { name: 'nivel', alias: 'Vida útil', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'percentage'},
      { name: 'hojamtn50', alias: 'Hoja MTN50', visible: false, searchable: true, showpanelinfo: true, align: 'right', type: 'string'},
      { name: 'summary', alias: 'Localización', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string'},
      { name: 'imagemtn50', alias: 'Imagen Hoja MTN50', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'image'},
    ],
  }
});

map.addPlugin(mp);
```


## 📸 Capturas 👷

### 🔸 Elementos de estilo

||||
|:----:|:----:|:----:|
|string|Image|percentage|
|<img src='assets/elem-string.jpg' style='width:150px;'>|<img src='assets/elem-img.jpg' style='width:150px;'>|<img src='assets/elem-percentaje.jpg' style='width:150px;'>|
|linkURL|buttonURL|formatter|
|<img src='assets/elem-linkurl.jpg' style='width:150px;'>|<img src='assets/elem-buttonurl.jpg' style='width:150px;'>|<img src='assets/elem-formatter.jpg' style='width:150px;'>|

### 🔸 Tabla de elementos

<img src='assets/captura01.jpg' style='width:400px;'>

### 🔸 Ventana de información

<img src='assets/captura02.jpg' style='width:400px;'>
