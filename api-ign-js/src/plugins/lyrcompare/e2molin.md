# Despliegue del stack de desaroollo del plugin

## Instalar

El plugin necesita para funcionar la versión 1.2 de la APICNIG. El plugin viene sin los módulos de **NodeJS**. Lo primero es descomprimir el contenido del ZIP. Seguidamente ejecutamos el comando

```bash
npm install
```
**NodeJS** bajará todos los módulos necesarios para el stack de desarrollo y los almacenará en la carpeta *node_modules*.

Ahora ya podemos abrir el editor de código, se recomienda **Visual Studio Code**. Entre los scripts **NPM** tenemos uno que se llama *start*. Lo ejecutamos y en un puerto se nos abrirá un *virtual server* con una configuración de aplicación básica y el plugin. 

Si queremos compilar una versión para distribución ejecutamos el script de **NPM** *build*. Los ficheros resultantes se generarán en la carpeta *dist*, que se creará si no existe.

## Notas 
Cuando se activa el control, **SpyEye** pasaba la primera capa por defecto y un radio a traves del procedimeinto *effectSelected*. He modificado dicho procedimiento para que pase como parámetro una segunda capa. Aún mantengo el radio, que ahora no lo uso, pero que en el futuro utilizaré para pasar  un parñametro que me indique si la ventana de división es estática o sigue la posición del ratón.  

```javascript
this.getImpl().effectSelected(this.layerSelectedLeft,this.layerSelectedRight, this.radius);
```

## LA gestión de la posición del plugin.

Mapea por defcto funcioonaba con las herramientas a la derecha. Si un botón está a la derecha no hay problemas. Cuando trabajamos con botones a la izquierda, empiezan los líos. De entrada hay que meter una gestión del botón de cierre del panel en el código, cuando es algo que deberúia ser ajeno a la persona que hace el plugin

```javascript
  document.querySelector('.m-panel.m-plugin-lyrcompare').querySelector('.m-panel-btn.lyrcompare-icon').addEventListener('click', (evt) => {
    let buttonOpened = document.querySelector('.m-panel.m-plugin-lyrcompare.opened');
    if (buttonOpened !== null) {
      buttonOpened = buttonOpened.querySelector('.m-panel-btn.g-cartografia-flecha-izquierda');
    }
    if (buttonOpened && this.pluginOnLeft) {
      buttonOpened.classList.add('opened-left');
    }
  })
```





## Botonera de control del plugin

Parto de un código poco óptimo

```javascript
        //e2m: Toogle activate/desactivate vcurtain ---> comparisonMode=1
        this.template.querySelector('#m-lyrcompare-vcurtain').addEventListener('click', (evt) => {
          if (this.comparisonMode===0){
            this.comparisonMode = 1;         
            this.activateCurtain();
          }else if (this.comparisonMode===1){
            this.comparisonMode = 0;  
            this.deactivateCurtain();
          }else if ((this.comparisonMode===2) || (this.comparisonMode===3)){
            this.comparisonMode = 1;
            this.updateControls();
            this.getImpl().setComparisonMode(this.comparisonMode);
          }
        });

        //e2m: Toogle activate/desactivate hcurtain ---> comparisonMode=2
        this.template.querySelector('#m-lyrcompare-hcurtain').addEventListener('click', (evt) => {
          if (this.comparisonMode===0){
            this.comparisonMode = 2;         
            this.activateCurtain();
          }else if (this.comparisonMode===2){
            this.comparisonMode = 0;  
            this.deactivateCurtain();
          }else if ((this.comparisonMode===1) || (this.comparisonMode===3)){
            this.comparisonMode = 2;
            this.updateControls();
            this.getImpl().setComparisonMode(this.comparisonMode);
          }
        });

        //e2m: Toogle activate/desactivate multicurtain
        this.template.querySelector('#m-lyrcompare-multicurtain').addEventListener('click', (evt) => {

          if (this.comparisonMode===0){
            this.comparisonMode = 3;         
            this.activateCurtain();
          }else if (this.comparisonMode===3){
            this.comparisonMode = 0;  
            this.deactivateCurtain();
          }else if ((this.comparisonMode===1) || (this.comparisonMode===2)){
            this.comparisonMode = 3;
            this.updateControls();
            this.getImpl().setComparisonMode(this.comparisonMode);
          }
        });
```
Y lo paso a uno más compacto implementando un *foreach*.

```javascript
        //e2m: Toogle activate/desactivate vcurtain, hcurtain, multicurtain ---> comparisonMode = 1, 2, 3
        this.template.querySelectorAll('button[id^="m-lyrcompare-"]')
          .forEach((button, i) => {
              button.addEventListener('click', evt => {
                  if (this.comparisonMode===0){
                    this.comparisonMode = i + 1;
                    this.activateCurtain();
                    return;
                  }else if (this.comparisonMode===i + 1){
                    this.comparisonMode = 0;  
                    this.deactivateCurtain();
                    return;                    
                  }else{
                    this.comparisonMode = i+1;
                    this.updateControls();
                    this.getImpl().setComparisonMode(this.comparisonMode);
                  }
              })
          });
```

## relleno del template

Primero utilizaba un array con lel atributo *name*.

```javascript
      let names = this.layers.map(function(layer) {
        return layer instanceof Object ? { name: layer.name } : { name: layer };
      });
```
Ahora utilizo un atributo más completo con *name* y *legend*.

```javascript
      let capas = this.layers.map(function(layer) {
        return layer instanceof Object ? {  name: layer.name, legend: layer.legend} : { name: layer, legend: layer };
      });
```

## Fuentes

Snippets para insertar en el template 

```html
<!--Icono bundle izquierda-->
<i class="lyrcompare-font">&#xf0a8;</i>
<!--Icono bundle derecha-->
<i class="lyrcompare-font">&#xf0a9;</i>
```
