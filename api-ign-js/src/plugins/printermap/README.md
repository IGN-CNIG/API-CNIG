## Descripción

Plugin de impresión a través del servicio Geoprint. Las capacidades del mismo definen las opciones de impresión disponibles: dpi, formatos y plantillas.

## Recursos y uso

- js: [https://mapea4-sigc.juntadeandalucia.es/plugins/printermap/printermap.ol.min.js](https://mapea4-sigc.juntadeandalucia.es/plugins/printermap/printermap.ol.min.js)
- css: [https://mapea4-sigc.juntadeandalucia.es/plugins/printermap/printermap.min.css](https://mapea4-sigc.juntadeandalucia.es/plugins/printermap/printermap.min.css)

Configuración por defecto sin parámetros:
```javascript
mapajs.addPlugin(new M.plugin.PrinterMap());
```
Establecimiento de parámetros y valores seleccionados por defecto en los selectores:
```javascript
mapajs.addPlugin(new M.plugin.PrinterMap({
  position: 'TR',
}));
```

## Ejemplo funcional

```
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.PrinterMap({
  position: 'TR',
}));
```

[JSFiddle de Mapea4](http://jsfiddle.net/sigcJunta/b6d4hd53/)  
