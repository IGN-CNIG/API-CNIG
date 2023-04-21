<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.OverviewMap</small></h1>

# Descripción

Plugin que muestra una previsualización de la zona donde está centrado el mapa.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **overviewmap.ol.min.js**
- **overviewmap.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/overviewmap/overviewmap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/overviewmap/overviewmap.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con dos objetos JSON. El primero contiene el atributo 'position' y el segundo los atributos 'collapsed' y 'collapsible', descritos a continuación:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si el plugin aparece abierto por defecto (true/false).  Por defecto: false.
- **collapsible**: Indica si el plugin puede abrirse y cerrarse (true) o si permanece siempre abierto (false).  Por defecto: false.
- **fixed**: Indica si el mapa del plugin permanece a un zoom fijo (true/false).
- **zoom**: Indica el nivel del zoom al que permanecerá fijo el mapa del plugin.
- **baseLayer**: URL de la capa base si se quiere prefijar una en el plugin overviewmap.

# API-REST

```javascript
URL_API?overviewmap=position*!collapsed*!collapsible*!fixed*!zoom*!baseLayer
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
    <td>collapsed</td>
    <td>true/false</td>
  </tr>
   <tr>
    <td>collapsible</td>
    <td>true/false</td>
  </tr>
   <tr>
    <td>fixed</td>
    <td>true/false</td>
  </tr>
   <tr>
    <td>zoom</td>
    <td>Nivel de zoom del mapa</td>
  </tr>
  <tr>
    <td>baseLayer</td>
    <td>URL de la capa base</td>
  </tr>
</table>


### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core?overviewmap?TR*!true*!true*!true*!5*!WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico?*PNOA2017*true*true
```

```
https://componentes.cnig.es/api-core?overviewmap?TR*!true*!true
```

# Ejemplo de uso

```javascript
  const map = M.map({
    container: 'map'
  });

  const mp = new M.plugin.OverviewMap({
    position: 'BR',
    fixed: true,
    zoom: 4,
    //baseLayer: 'WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico?*PNOA2017*true*true', Ejemplo WMS
    baseLayer: 'WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true', //Ejemplo WMTS
  }, {
    collapsed: false,
    collapsible: true,
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
