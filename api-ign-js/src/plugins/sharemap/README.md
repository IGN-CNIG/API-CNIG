
<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.ShareMap</small></h1>

# Descripción

Plugin que permite copiar la url del mapa actual visualizado.
Exporta la información de todas las capas cargadas en el mapa.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **sharemap.ol.min.js**
- **sharemap.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/sharemap/sharemap.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

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
- **shareLayer**: Define si se comparten todas las capas o ninguna, valor de tipo _Boolean_.
  - Por defecto: _false_
- **filterLayers**: Selecciona la capa a compartir por el nombre, valor de tipo _Array_. 
  - Por defecto: [ ].
  - ```Array<String>```: Los valores serán los nombres de la capa.

# Parámetros API REST
```
URL_API?sharemap=baseUrl*position*title*tooltip*btn*copyBtn
````
Ejemplo:
```
https://componentes.cnig.es/api-core/?sharemap=https://componentes.cnig.es/api-core/*BL*Compartir URL*Copiado*Aceptar*Copiar
```

# Ejemplos de uso

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
