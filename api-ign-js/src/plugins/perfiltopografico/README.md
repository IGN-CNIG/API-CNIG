# M.plugin.Perfiltopografico

Plugin que permite realizar un perfil longitudinal en función del eje que dibujemos en pantalla

![Imagen1](./img/perfiltopografico.png)

# Dependencias

- perfiltopografico.ol.min.js
- perfiltopografico.ol.min.css


```html
 <link href="../../plugins/perfiltopografico/perfiltopografico.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/perfiltopografico/perfiltopografico.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de _options_ con los siguientes atributos:

- **distance**. Número que indica la cantidad de intervalos o tramos en los que se dividirá el eje y se obtendrán las cotas. (Valor por defecto 30)

- **serviceURL**. URL del servicio sobre el que se consultará un punto XY y devolverá la cota del mismo.

# Eventos

# Otros métodos

# Ejemplos de uso

### Ejemplo 1
```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.Perfiltopografico();

   map.addPlugin(mp);
```
### Ejemplo 2
```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.Perfiltopografico({
      distance: 10
   });

map.addPlugin(mp);
```
