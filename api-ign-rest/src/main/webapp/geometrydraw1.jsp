<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="es.cnig.mapea.plugins.PluginsManager"%>
<%@ page import="es.cnig.mapea.parameter.adapter.ParametersAdapterV3ToV4"%>
<%@ page import="java.util.Map"%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="mapea" content="yes">
    <title>Visor base</title>
    <link type="text/css" rel="stylesheet" href="assets/css/apiign.ol.min.css">
    <link href="plugins/geometrydraw/geometrydraw.ol.min.css" rel="stylesheet" />
    <link href="plugins/ignhelp/ignhelp.ol.min.css" rel="stylesheet" />
    <link href="plugins/overviewmap/overviewmap.ol.min.css" rel="stylesheet" />
    <link href="plugins/viewhistory/viewhistory.ol.min.css" rel="stylesheet" />
    <link href="plugins/rescale/rescale.ol.min.css" rel="stylesheet" />
    <link href="plugins/predefinedzoom/predefinedzoom.ol.min.css" rel="stylesheet" />
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
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/geometrydraw/geometrydraw.ol.min.js"></script>
    <script type="text/javascript" src="plugins/ignhelp/ignhelp.ol.min.js"></script>
    <script type="text/javascript" src="plugins/overviewmap/overviewmap.ol.min.js"></script>
    <script type="text/javascript" src="plugins/viewhistory/viewhistory.ol.min.js"></script>
    <script type="text/javascript" src="plugins/rescale/rescale.ol.min.js"></script>
    <script type="text/javascript" src="plugins/predefinedzoom/predefinedzoom.ol.min.js"></script>
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
            zoom: 5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4783459.6216],
        });

        const mp1 = new M.plugin.GeometryDraw({
            position: 'TR',
            collapsed: true,
            collapsible: true,
        });

        const mp2 = new M.plugin.IGNHelp({
            position: 'TR',
            helpLink: 'http://fototeca.cnig.es/help_es.pdf',
            contactEmail: 'fototeca@cnig.es',
        });

        const mp3 = new M.plugin.OverviewMap({
            position: 'BR',
        }, {
            collapsed: false,
            collapsible: true,
        });

        const mp4 = new M.plugin.PredefinedZoom({
            position: 'TR',
            savedZooms: [{
                name: 'Zoom a la extensión del mapa',
                bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
            }, ],
        });

        const mp5 = new M.plugin.Rescale({
            collapsible: true,
            collapsed: true,
            position: 'TR',
        });

        const mp6 = new M.plugin.ViewHistory({
            position: 'TL'
        });

        map.addPlugin(mp1);
        map.addPlugin(mp2);
        map.addPlugin(mp3);
        map.addPlugin(mp4);
        map.addPlugin(mp5);
        map.addPlugin(mp6);
    </script>
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-163660977-1"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-163660977-1');
</script>

</html>
