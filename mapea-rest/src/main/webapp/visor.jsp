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
    <link type="text/css" rel="stylesheet" href="assets/css/mapea-5.1.0.ol.min.css">
    <link href="plugins/ignsearch/ignsearch.ol.min.css" rel="stylesheet" />
    <link href="plugins/attributions/attributions.ol.min.css" rel="stylesheet" />
    <link href="plugins/backgroundlayersselector/backgroundlayerselector.ol.min.css" rel="stylesheet" />
    <link href="plugins/xylocator/xylocator.ol.min.css" rel="stylesheet" />
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
    <link href="plugins/mousesrs/mousesrs.ol.min.css" rel="stylesheet" />
    <link href="plugins/zoomextent/zoomextent.ol.min.css" rel="stylesheet" />
    <link href="plugins/toc/toc.ol.min.css" rel="stylesheet" />
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
         if (cssfile.toLowerCase().indexOf("streetview") != -1) { %>
    <link href="plugins/streetview/streetview.min.css" rel="stylesheet" />
    <link href="http://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel="stylesheet">
    <% }
      } %>
</head>

<body>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/mapea-5.1.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-5.1.0.js"></script>
    <script type="text/javascript" src="plugins/ignsearch/ignsearch.ol.min.js"></script>
    <script type="text/javascript" src="plugins/attributions/attributions.ol.min.js"></script>
    <script type="text/javascript" src="plugins/backgroundlayersselector/backgroundlayerselector.ol.min.js"></script>
    <script type="text/javascript" src="plugins/xylocator/xylocator.ol.min.js"></script>
    <script type="text/javascript" src="plugins/sharemap/sharemap.ol.min.js"></script>
    <script type="text/javascript" src="plugins/zoomextent/zoomextent.ol.min.js"></script>
    <script type="text/javascript" src="plugins/mousesrs/mousesrs.ol.min.js"></script>
    <script type="text/javascript" src="plugins/toc/toc.ol.min.js"></script>
    <%
      String[] jsfiles = PluginsManager.getJSFiles(adaptedParams);
      for (int i = 0; i < jsfiles.length; i++) {
         String jsfile = jsfiles[i];
   %>
    <script type="text/javascript" src="plugins/<%=jsfile%>"></script>
    <%
         if (jsfile.toLowerCase().indexOf("streetview") != -1) { %>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>
    <% }
      }
   %>
    <script type="text/javascript">
        M.impl.Map.prototype.updateResolutionsFromBaseLayer = () => null;
        const map = M.map({
            container: 'mapjs',
            controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location'],
            zoom: 5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4683459.6216],
            getfeatureinfo: true,
        });

        const layerinicial = new M.layer.WMS({
            url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
            name: 'AU.AdministrativeBoundary',
            legend: 'Limite administrativo',
            tiled: false,
        }, {});

        const layerUA = new M.layer.WMS({
            url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
            name: 'AU.AdministrativeUnit',
            legend: 'Unidad administrativa',
            tiled: false
        }, {});


        const kml = new M.layer.KML('KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*false*false');

        map.addLayers([layerinicial, layerUA, kml]);

        const mp = new M.plugin.IGNSearch({
            servicesToSearch: 'gn',
            maxResults: 10,
            isCollapsed: false,
            noProcess: 'municipio,poblacion',
            countryCode: 'es',
            reverse: true, // reverse geocode button displayed
        });
        const mp2 = new M.plugin.Attributions({
            mode: 1,
            scale: 10000,
            defaultAttribution: 'Instituto Geográfico Nacional',
            defaultURL: 'https://www.ign.es/',
        });
        const mp3 = new M.plugin.ShareMap({
            baseUrl: 'https://mapea-lite.desarrollo.guadaltel.es/api-core/',
            position: 'BR',
        });
        const mp4 = new M.plugin.XYLocator({
            position: 'TL',
        });
        const mp5 = new M.plugin.BackgroundLayersSelector({
            position: 'TR',
            layerOpts: [{
                    id: 'mapa',
                    title: 'Mapa',
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseTodo',
                        legend: 'Callejero',
                        matrixSet: "GoogleMapsCompatible",
                        transparent: false,
                    }, {
                        format: 'image/jpeg',
                    })]
                },
                {
                    id: 'imagen',
                    title: 'Imagen',
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'Imagen',
                        matrixSet: "GoogleMapsCompatible",
                        transparent: false,
                    }, {
                        format: 'image/jpeg',
                    })]
                },
                {
                    id: 'hibrido',
                    title: 'Híbrido',
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'Imagen',
                        matrixSet: "GoogleMapsCompatible",
                    }, {
                        format: 'image/jpeg',
                    }), new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseOrto',
                        legend: 'Mapa IGN',
                        matrixSet: "GoogleMapsCompatible",
                    }, {
                        format: 'image/png',
                    }), ],
                },
            ],
        });
        const mp6 = new M.plugin.ZoomExtent();
        const mp7 = new M.plugin.MouseSRS({
            projection: 'EPSG:4326',
        });
        const mp8 = new M.plugin.TOC();

        map.addPlugin(mp);
        map.addPlugin(mp2);
        map.addPlugin(mp3);
        map.addPlugin(mp4);
        map.addPlugin(mp5);
        map.addPlugin(mp6);
        map.addPlugin(mp7);
        map.addPlugin(mp8);
        map.getImpl().refresh()
        // map.setZoom(5);
        // map.getMapImpl().getView().setMaxZoom(20);
        // map.getMapImpl().getView().setMinZoom(4);
    </script>
</body>

</html>