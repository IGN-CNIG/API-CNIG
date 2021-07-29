# 📓 Apuntes

## ♟️ Snippets
### 🔸 JS Recorriendo un objeto, entradas, claves y valores

```javascript
// Objeto [featureFacade.getAttributes()]
Object.keys(featureFacade.getAttributes()).forEach((entry) => {
  console.log(`Clave ${entry}`);
});
Object.values(featureFacade.getAttributes()).forEach((entry) => {
  console.log(`Valor ${entry}`);
});
Object.entries(featureFacade.getAttributes()).forEach((entry) => {
  console.log(`Clave ${entry[0]} 👉 Valor ${entry[1]}`);
});
```

### 🔸 Configuración de Eslint

Utilizo el fichero **.eslintignore** para evitar que **ESlint** me de continuamente la tabarra. Al final del proyecto elimino el fichero para arreglar las cosas que hago mal:

```bash
**/*.js
```

Siempre podemos usar cláusulas del tipo

```javascript
/* eslint max-len: ["error", { "code": 150 }] */ // Para permitir comegtarios de hasta 150
/* eslint no-console: "error" */ // Permitir el uso de de salidas por consola
```

Para saltarnos las reglas predefinidas del *linter*.

### 🔸 JS - Búsquedas facetadas

Recursos para utilizar en las búsquedas facetadas

```javascript
/*
En contrar valores únicos en un array
https://www.etnassoft.com/2011/06/24/array-unique-eliminar-valores-duplicados-de-un-array-en-javascript/
*/
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

var myArr = [ 1, 2, 3, 'foo', 'bar', 'Hello World', 2, 3, 'bar', 1, 4, 5];
console.log( myArr.unique() ); // ["foo", "Hello World", 2, 3, "bar", 1, 4, 5]

/*
https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
*/
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

// usage example:
var a = ['a', 1, 'a', 2, '1'];
var unique = a.filter(onlyUnique);

console.log(unique); // ['a', 1, 2, '1']
```

### 🔸 Handlebars -  Aprendiendo a hacer helpers

* https://programacion.net/articulo/comenzando_con_handlebars_1376
* https://jonathanmh.com/handlebars-custom-helpers-chaining/

El siguiente código genera un saludo, compilando una plantilla con [handlebars](https://handlebarsjs.com/)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.1/handlebars.min.js"></script>
<script id="text-template" type="text/x-handlebars-template">
    <h3>{{greeting}}</h3>
</script>
 
<button id="show">Show</button>
<div id="content"></div>
 
<script>
Handlebars.registerHelper('greeting', function() {
    return new Handlebars.SafeString( '<i>Hello World</i>' );
});
 
document.getElementById('show').addEventListener('click', function () {
    var source = document.getElementById('text-template').innerHTML;
	var template = Handlebars.compile(source);
	var html = template();
 
    document.getElementById('content').innerHTML = html;
});
 
</script>
```

Este otro código utiliza helpers de Handlebars pasando parámetros

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.1/handlebars.min.js"></script>
<!-- Esta es la plantilla, emebida en un script. Ojo al atributo type que lleva -->
<script id="text-template" type="text/x-handlebars-template">
    {{link home}}<br>
    {{link perlmaven}}<br>
</script>

<!-- Desencadenantes de la compilación de la plantilla-->
<button id="show">Show</button>

<!-- Contenedor de la plantilla una vez compilada -->
<div id="content"></div>
 

<!-- JS principal-->
<script>

//Helper
Handlebars.registerHelper('link', function(obj) {
    var url  = obj.url;
    var text = obj.text;
    if (text == undefined) {
        text = url;
    }
    return new Handlebars.SafeString( '<a href="' + url + '">' + text + '</a>' );
});

// Al hacer clic en el botón se compila la plantilla
document.getElementById('show').addEventListener('click', function () {
    var source = document.getElementById('text-template').innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        'home' : {
           'url'  : '/',
           'text' : 'Code Maven'
        },
        'perlmaven' : {
            'url' : 'http://perlmaven.com/'
        }
    });
 
    // La plantilla compliada en la variable html se inserta en su contenedor
    document.getElementById('content').innerHTML = html;
});
 
</script>
```

