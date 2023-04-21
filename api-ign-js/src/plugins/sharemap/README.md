
<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.ShareMap</small></h1>

# Descripción

Plugin que permite copiar la url del mapa actual visualizado. Exporta la información de todas las capas cargadas en el mapa.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **sharemap.ol.min.js**
- **sharemap.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/sharemap/sharemap.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **tooltip**: Texto para el mensaje cuando se copia la cadena (Por defecto 'Copiado') (Se muestra al dejar el ratón encima del plugin como información).
- **baseUrl**: Url sobre la que está montada la instancia de mapea del tipo https://componentes.cnig.es/api-core/
- **title**: Título para la cabecera de la ventana (Por defecto 'Compartir Mapa').
- **btn**: Título para el botón Aceptar (Por defecto 'Aceptar').
- **copyBtn**: Título para el botón copiar (Por defecto 'Copiar url').
- **overwriteStyles**: Indica si se le quieren pasar estilos adicionales (Por defecto false).
- **styles**: Estilo a aplicar para sobreescribir.
  - **Ejemplo**
```javascript
'styles': {
 *  'primaryColor': 'yellow',
 *  'secondaryColor': 'green'
 *  }
```
- **text**: Texto del segundo título. 
- **copyBtnHtml**: Título para el segundo botón. 
- **minimize**: Genera URL minificada.
- **urlAPI**: URL API o URL Visor (API verdadero o predeterminado, visor falso).
- **shareLayer**: Define si se comparten todas las capas o ninguna, valor de tipo _Boolean_. Por defecto: false.
- **filterLayers**: Selecciona la capa a compartir por el nombre, valor de tipo _Array_. 
  - Por defecto: [ ].
  - ```Array<String>```: Los valores serán los nombres de la capa.

# API-REST

```javascript
URL_API?sharemap=baseUrl*position*minimize
```

<table>
  <tr>
    <td>Parámetros</td>
    <td>Opciones/Descripción</td>
  </tr>
  <tr>
    <td>baseUrl</td>
    <td>URL instancia de mapea</td>
  </tr>
  <tr>
    <td>position</td>
    <td>TR/TL/BR/BL</td>
  </tr>
  <tr>
    <td>minimize</td>
    <td>true/false</td>
  </tr>
</table>

### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core/?sharemap=https://componentes.cnig.es/api-core/*BL*true
```

```
https://componentes.cnig.es/api-core/?sharemap=https://componentes.cnig.es/api-core/
```

# Ejemplo de uso

```javascript
const map = M.map({
  container: 'map'
});

const mp = new M.plugin.ShareMap({
  baseUrl: 'https://componentes.cnig.es/api-core/',
  postition: 'TL',
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
