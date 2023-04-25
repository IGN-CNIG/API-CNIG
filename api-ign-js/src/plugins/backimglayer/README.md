<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.BackImgLayer</small></h1>

# Descripción

Plugin que permite la elección de la capa de fondo mediante la previsualización de las posibles capas.

# Dependencias
Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **backimglayer.ol.min.js**
- **backimglayer.ol.min.css**

```html
 <link href="https://componentes.cnig.es/api-core/plugins/backimglayer/backimglayer.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/backimglayer/backimglayer.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:


- **position**:  Ubicación del plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsible**: Indica si el plugin se puede collapsar en un botón (true/false). Por defecto: true.
- **collapsed**: Indica si el plugin viene colapsado de entrada (true/false). Por defecto: true.
- **layerId**: Índice de la capa que se quiera cargar por defecto. Por ejemplo, si se pasa el número 2 se mostrará la capa que se encuentre en la segunda posición.
- **columnsNumber**: Número de columnas que parametrizan la tabla de capas de fondo disponibles.
- **layerVisibility**: Valor que indica si se muestra la capa cargada o no.
- **layerOpts**: Array con las capas que se quieren utilizar como opciones para capa de fondo.
    - **id**: Identificador de la capa.
    - **preview**: Ruta a la imagen de previsualización que se muestra.
    - **title**: Nombre identificativo de la capa que se mostrará sobre la previsualización.
    - **layers**: Array con las capas que se quieren cargar al seleccionar esta opción.   
       - [Como añadir las capas y qué parámetros tiene que usar](https://github.com/IGN-CNIG/API-CNIG/wiki/Capas)
- **empty**: Habilita la posibilidad de mostrar el mapa sin las capas de fondo cargadas del plugin (capa de fondo "vacía"). Verdadero "true", se activa esta funcionalidad. Falso por defecto.
- **tooltip**: Información emergente para mostrar en el tooltip del plugin. Por defecto: "Capas de fondo".

# API-REST

```javascript
URL_API?backimglayer=position*!collapsible*!collapsed*!layerVisibility*!layerId*!columnsNumber*!ids*!titles
*!previews*!layers*!empty
```

<table>
    <tr>
        <td>Parámetros</td>
        <td>Opciones/Descripción</td>
    </tr>
    <tr>
        <td>position</td>
        <td>TR/TL/BR/BL</td>
    </tr>
     <tr>
        <td>collapsible</td>
        <td>true/false</td>
    </tr>
     <tr>
        <td>collapsed</td>
        <td>true/false</td>
    </tr>
     <tr>
        <td>layerVisibility</td>
        <td>true/false</td>
    </tr>
     <tr>
        <td>layerId</td>
        <td>Índice de la capa a cargar por defecto</td>
    </tr>
     <tr>
        <td>columnsNumber</td>
        <td>Número de columnas para la tabla de capas de fondo</td>
    </tr>
     <tr>
        <td>ids</td>
        <td>Identificadores de las capas separados por comas</td>
    </tr>
     <tr>
        <td>titles</td>
        <td>Nombre de las capas separados por comas</td>
    </tr>
     <tr>
        <td>previews</td>
        <td>URLs de las imágenes de previsualización de las capas separadas por comas</td>
    </tr>
     <tr>
        <td>layers</td>
        <td>Capas que se quieren cargar</td>
    </tr>
     <tr>
        <td>empty</td>
        <td>true/false</td>
    </tr>
</table>


### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core?backimglayer=TR*!true*!true*!true*!1*!2*!mapa,hibrido*!Mapa,Hibrido*!http://componentes.cnig.es/api-core/plugins/backimglayer/images/svqmapa.png,http://componentes.cnig.es/api-core/plugins/backimglayer/images/svqhibrid.png*!WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true,WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*true*!true
```

```
https://componentes.cnig.es/api-core?backimglayer=TR*!*!*!true*!1*!2*!mapa,hibrido*!Mapa,Hibrido*!http://componentes.cnig.es/api-core/plugins/backimglayer/images/svqmapa.png,http://componentes.cnig.es/api-core/plugins/backimglayer/images/svqhibrid.png*!WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true,WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*true*
```


# Eventos

- **backimglayer:activeChanges**
    - Evento que se dispara al seleccionar una capa de fondo.
    - Expone, como parámetro devuelto, el **identificador** de la capa de fondo seleccionada.

```javascript
pluginbackimglayer.on('backimglayer:activeChanges', (data) => {
    console.log(data.activeLayerId);
});
```

# Ejemplo de uso

```javascript
const map = M.map({
    container: 'map'
});
  
const mp = new M.plugin.BackImgLayer({
    position: 'TR',
    collapsible: true,
    collapsed: true,
    layerId: 0,
    columnsNumber: 2,
    layerVisibility: true,
    layerOpts: [{
        id: 'mapa',
        preview: 'plugins/backimglayer/images/svqmapa.png', // ruta relativa, edite por la deseada
        title: 'Mapa',
        layers: [new M.layer.WMTS({
            url: 'http://www.ign.es/wmts/ign-base?',
            name: 'IGNBaseTodo',
            legend: 'Mapa IGN',
            matrixSet: 'GoogleMapsCompatible',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/jpeg',
        })],
    },
    {
        id: 'imagen',
        title: 'Imagen',
        preview: 'plugins/backimglayer/images/svqimagen.png', // ruta relativa, edite por la deseada
        layers: [new M.layer.WMTS({
            url: 'http://www.ign.es/wmts/pnoa-ma?',
            name: 'OI.OrthoimageCoverage',
            legend: 'Imagen (PNOA)',
            matrixSet: 'GoogleMapsCompatible',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/jpeg',
        })],
    },
    {
        id: 'hibrido',
        title: 'Híbrido',
        preview: 'plugins/backimglayer/images/svqhibrid.png', // ruta relativa, edite por la deseada
        layers: [new M.layer.WMTS({
                url: 'http://www.ign.es/wmts/pnoa-ma?',
                name: 'OI.OrthoimageCoverage',
                legend: 'Imagen (PNOA)',
                matrixSet: 'GoogleMapsCompatible',
                transparent: true,
                displayInLayerSwitcher: false,
                queryable: false,
                visible: true,
                format: 'image/png',
            }),
            new M.layer.WMTS({
                url: 'http://www.ign.es/wmts/ign-base?',
                name: 'IGNBaseOrto',
                matrixSet: 'GoogleMapsCompatible',
                legend: 'Mapa IGN',
                transparent: false,
                displayInLayerSwitcher: false,
                queryable: false,
                visible: true,
                format: 'image/png',
            })
        ],
    },
    {
        id: 'lidar',
        preview: 'plugins/backimglayer/images/svqlidar.png', // ruta relativa, edite por la deseada
        title: 'LIDAR',
        layers: [new M.layer.WMTS({
            url: 'https://wmts-mapa-lidar.idee.es/lidar?',
            name: 'EL.GridCoverageDSM',
            legend: 'Modelo Digital de Superficies LiDAR',
            matrixSet: 'GoogleMapsCompatible',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/png',
        })],
    },
    ],
});

map.addPlugin(mp);
```

# 👨‍💻 Desarrollo

Para el stack de desarrollo de este componente se ha utilizado

* NodeJS Version: 14.16
* NPM Version: 6.14.11
* Entorno Windows.

## 📐 Configuración del stack de desarrollo / *Work setup*


### 🐑 Clonar el repositorio / *Cloning repository*

Para descargar el repositorio en otro equipo lo clonamos:

```bash
git clone [URL del repositorio]
```

### 1️⃣ Instalación de dependencias / *Install Dependencies*

```bash
npm i
```

### 2️⃣ Arranque del servidor de desarrollo / *Run Application*

```bash
npm run start
```

## 📂 Estructura del código / *Code scaffolding*

```any
/
├── src 📦                  # Código fuente
├── task 📁                 # EndPoints
├── test 📁                 # Testing
├── webpack-config 📁       # Webpack configs
└── ...
```
## 📌 Metodologías y pautas de desarrollo / *Methodologies and Guidelines*

Metodologías y herramientas usadas en el proyecto para garantizar el Quality Assurance Code (QAC)

* ESLint
  * [NPM ESLint](https://www.npmjs.com/package/eslint) \
  * [NPM ESLint | Airbnb](https://www.npmjs.com/package/eslint-config-airbnb)

## ⛽️ Revisión e instalación de dependencias / *Review and Update Dependencies*

Para la revisión y actualización de las dependencias de los paquetes npm es necesario instalar de manera global el paquete/ módulo "npm-check-updates".

```bash
# Install and Run
$npm i -g npm-check-updates
$ncu
```
