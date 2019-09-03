<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="es.juntadeandalucia.mapea.plugins.PluginsManager"%>
<%@ page import="es.juntadeandalucia.mapea.parameter.adapter.ParametersAdapterV3ToV4"%>
<%@ page import="java.util.Map"%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="mapea" content="yes">
    <title>Visor base</title>
    <link type="text/css" rel="stylesheet" href="assets/css/apiign-1.0.0.ol.min.css">
    <link href="plugins/backimglayer/backimglayer.ol.min.css" rel="stylesheet" />
    </link>
    <style type="text/css">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
    </style>
    <%
      Map<String, String[]> parameterMap = request.getParameterMap();
      PluginsManager.init (getServletContext());
      Map<String, String[]> adaptedParams = ParametersAdapterV3ToV4.adapt(parameterMap);
      String[] cssfiles = PluginsManager.getCSSFiles(adaptedParams);
      for (int i = 0; i < cssfiles.length; i++) {
         String cssfile = cssfiles[i];
   %>
    <link type="text/css" rel="stylesheet" href="plugins/<%=cssfile%>">
    </link>
    <%
      } %>
</head>

<body>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.0.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.0.0.js"></script>
    <script type="text/javascript" src="plugins/backimglayer/backimglayer.ol.min.js"></script>
    <%
      String[] jsfiles = PluginsManager.getJSFiles(adaptedParams);
      for (int i = 0; i < jsfiles.length; i++) {
         String jsfile = jsfiles[i];
   %>
    <script type="text/javascript" src="plugins/<%=jsfile%>"></script>

    <%
      }
   %>
    <script type="text/javascript">
        const map = M.map({
            container: 'mapjs',
            controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location', 'backgroundlayers', 'getfeatureinfo'],
            zoom: 5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4683459.6216],
        });

        // const layerinicial = new M.layer.WMS({
        //     url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
        //     name: 'AU.AdministrativeBoundary',
        //     legend: 'Limite administrativo',
        //     tiled: false,
        // }, {});

        // const layerUA = new M.layer.WMS({
        //     url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
        //     name: 'AU.AdministrativeUnit',
        //     legend: 'Unidad administrativa',
        //     tiled: false
        // }, {});

        // const ocupacionSuelo = new M.layer.WMTS({
        //     url: 'http://wmts-mapa-lidar.idee.es/lidar',
        //     name: 'EL.GridCoverageDSM',
        //     legend: 'Modelo Digital de Superficies LiDAR',
        //     matrixSet: 'GoogleMapsCompatible',
        // }, {
        //     visibility: false,
        // });


        // const kml = new M.layer.KML('KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*false*false');

        // map.addLayers([ocupacionSuelo, layerinicial, layerUA, kml]);

        const mp = new BackImgLayer({
            position: 'TR',
            layerId: 0,
            layerVisibility: true,
            layerOpts: [{
                    id: 'mapa',
                    preview: '../src/facade/assets/images/mapea4sigc.png',
                    title: 'Mapa',
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseTodo',
                        legend: 'Mapa IGN',
                        matrixSet: 'GoogleMapsCompatible',
                    }, {
                        format: 'image/jpeg',
                    })],
                },
                {
                    id: 'imagen',
                    title: 'Imagen',
                    preview: '../src/facade/assets/images/osm.png',
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'Imagen (PNOA)',
                        matrixSet: 'GoogleMapsCompatible',
                    }, {
                        format: 'image/png',
                    })],
                },
                {
                    id: 'hibrido',
                    title: 'Híbrido',
                    preview: '../src/facade/assets/images/mapea4sigc.png',
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'Imagen (PNOA)',
                        matrixSet: 'GoogleMapsCompatible',
                    }, {
                        format: 'image/png',
                    }), new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseOrto',
                        matrixSet: 'GoogleMapsCompatible',
                        legend: 'Mapa IGN',
                    }, {
                        format: 'image/png',
                    })],
                },
            ],
        });

        map.addPlugin(mp);
    </script>
</body>

</html>