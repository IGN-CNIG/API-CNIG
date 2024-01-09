# M.plugin.InfoCatastro

Muestra referencia catastral para un punto y provee de enlace a la información de la DGC.

## Dependencias

- infocatastro.ol.min.js
- infocatastro.ol.min.css


```html
 <link href="../../plugins/infocatastro/infocatastro.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/infocatastro/infocatastro.ol.min.js"></script>
```

# Parámetros
El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right
- **tooltip**. Valor a usar para mostrar en el tooltip del plugin.
- **catastroWMS**. URL Catastro.

## Ejemplos de uso

### Ejemplo 1
```javascript
   const map = M.map({
     container: 'map'
   });

const mp = new M.plugin.InfoCatastro({
  RCCOOR_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR',
  CMC_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/ConsultaMunicipioCodigos',
  DNPRC_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/Consulta_DNPRC_Codigos',
  CPMRC_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_CPMRC',
  DNPPP_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/Consulta_DNPPP_Codigos',
  catastroWMS: {
    wms_url: 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
    name: 'Catastro',
  },
  position: 'TR'
});

map.addPlugin(mp);
```
