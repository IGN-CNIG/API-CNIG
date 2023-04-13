# M.plugin.InfoCatastro

Muestra referencia catastral para un punto y provee de enlace a la información de la DGC.

## Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **infocatastro.ol.min.js**
- **infocatastro.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/infocatastro/infocatastro.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/infocatastro/infocatastro.ol.min.js"></script>
```

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
