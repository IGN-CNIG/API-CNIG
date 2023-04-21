<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.InciCarto</small></h1>

# Descripción

Plugin que permite la identificación de incidencias sobre la cartografía. El usuario puede describir el error y si lo desea categorizar el error. Despúes el error puede notificarse por correo electrónico a uno de los buzones de incidencias habilitados o darse de alta en el gestor de incidencias.


# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **incicarto.ol.min.js**
- **incicarto.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/incicarto/incicarto.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/incicarto/incicarto.ol.min.js"></script>
```

# Caso práctico de uso

| | |
|:----:|:----:|
|<img src='./assets/incicarto-func01.png'  style='width:500px;'>|El usuario despliega la herramienta de notificación de incidencias y se sitúa en la zona donde ha encontrado el error.|
|El usuario elige entre las herramientas disponibles para señalar la incidencia; punto, línea o polígono. Se desplegará el menú de incidencias, desde donde podrá crear geometrías, editarlas y aplicarles un estilo.|<img src='./assets/incicarto-func02.png'  style='width:500px;'>|
|<img src='./assets/incicarto-func03.png'  style='width:500px;'>|Una vez creada la incidencia , el usuario puede modificarla en cualquier momento para redefinirla mejor o, borrarla, o incluso generar más incidencias presentes en la zona..|
|Una vez localizadas las incidencias de la zona de estudio, podemos notificar las incidencias para su corrección. Para ello pulsará en la herramienta con la campanilla.|<img src='./assets/incicarto-func04.png'  style='width:500px;'>|
|<img src='./assets/incicarto-func06.png'  style='width:500px;'>|En la ventana emergente podemos clasificar el error si tenemos datos o conocimientos para ello. También podemos introducir un correo electrónico para realizar un seguimiento de la incidencia y una pequeña descripción libre para documentar la incidencia.|

Disponemos de dos posibilidades para notificar la incidencia. 

* Mediante un correo electrónico dirigido al buzón de incidencias relacionado con la incidencia detectada.
* Al gestor de incidencias INCIGEO para su posterior asignación al servicio competente para su subsanación.


# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **collapsed**: Indica si el plugin viene cerrado por defecto (true/false). Por defecto: true.
- **collapsible**: Indica si el plugin se puede cerrar (true/false). Por defecto: true.
- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **prefixSubject**: Prefijo que llevará el *subject* del correo electrónico enviado.
- **interfazmode**: Indica la modalidad de envío de la incidencia.
  - 'simple': se usará un cleinte de correo para enviar la incidencia.
  - 'advance': se usará el gestor de incidencias INCIGEO.
- **buzones**: Contiene un array con los objetos qued definen el nombre y direcciones de los buzones de incidencias. Cada onjeto buzón contiene dos parámetros.
  - 'name': nombre del propietario del buzón de incidencias.
  - 'email': correo electrónico del buzón.
- **controllist**: Contiene un array enumerando las listas controladas con sus características.
  - 'id': identificador de la lista.
  - 'name': nombre de la lista.
  - 'mandatory': indica si el usuario está obligado a legir una opción.
- **themeList**: Lista de control con los temas por los que podemos clasificar una incidencia. los temas son objetos con las propiedades
  - 'idTheme': identificador de código de tema.
  - 'nameTheme': nombre del tema de error.
  - 'emailTheme': correo de la entidad responsable de subsanar este error.
- **errorList**: Lista de control con las posibles categorizaciones del error.
- **productList**: Lista de control con los productos del IGN en los que se ha detectado el error.
- **wfszoom**: Valor del zoom. Por defecto: 12.

# API-REST

```javascript
URL_API?incicarto=position*collapsed*collapsible*wfszoom
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
    <td>wfszoom</td>
    <td>Valor del zoom</td>
  </tr>
</table>


### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core?incicarto=BL*true*true*5
```

```
https://componentes.cnig.es/api-core?incicarto=BL*true*true
```

# Ejemplo de uso

```javascript
const mp = new M.plugin.Incicarto({
  collapsed: false,
  collapsible: true,
  position: 'TL',
  interfazmode:'both', //simple, advance, both
  buzones: [{
    name: 'Cartografía (MTN, BTN, RT, HY, Pob, BCN, Prvinciales, escalas pequeñas)',
    email: 'cartografia.ign@mitma.es',
  },
  {
    name: 'Atlas Nacional de España',
    email: 'ane@mitma.es',
  },
  {...},
  ],
  controllist:[
    {
      id: 'themeList',
      name:'Temas de errores',
      mandatory: true,
    },
    {
      id: 'errorList',
      name:'Tipos de errores',
      mandatory: true,
    },
    {
      id: 'productList',
      name:'Lista de productos',
      mandatory: true,
    }
  ],
  themeList: [
    {
      idTheme: 1,
      nameTheme: 'No especificado',
      emailTheme: 'consultas@cnig.es',
    },
    {
      idTheme: 2,
      nameTheme: 'Relieve',
      emailTheme: 'cartografia.ign@mitma.es',
    },
  ],
  errorList: [
    'No especificado',
    'Omisión',
    'Comisión',
    '...',
  ],
  productList: [
    'No especificado',
    'Serie MTN25',
    'Serie MTN50',
    '...',
  ],
});
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
