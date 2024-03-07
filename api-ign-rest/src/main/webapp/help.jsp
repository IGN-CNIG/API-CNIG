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
    <link href="plugins/help/help.ol.min.css" rel="stylesheet" />
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
    </link>
    <style type="text/css">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: auto;
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

    <div>
        <label for="selectPosition">Selector de posición del plugin</label>
        <select name="position" id="selectPosition">
            <option value="TL">Arriba Izquierda (TL)</option>
            <option value="TR" selected="selected">Arriba Derecha (TR)</option>
            <option value="BR">Abajo Derecha (BR)</option>
            <option value="BL">Abajo Izquierda (BL)</option>
        </select>
        <label for="inputTooltip">Tooltip</label>
        <input type="text" name="tooltip" id="inputTooltip">
        <label for="selectExtend">Extender contenido inicial</label>
        <select id="selectExtend">
            <option value="true" selected="selected">Sí</option>
            <option value="false">No</option>
        </select>
        <label for="areaHeader">Cabecera</label>
        <textarea id="areaHeader" rows="5" cols="20">
            {
                "images":[
                    "https://www.ign.es/IGNCNIG/Imagenes/Contenidos/IGN-Header-Tittle.png"
                ],
                "title":"Ayuda"
            }
        </textarea>
        <label for="areaInitial">Contenido Inicial</label>
        <textarea id="areaInitial" rows="5" cols="20">
            {
            "es":[
                {
                    "title":"Introducción",
                    "content":"<div><h2>Título introducción</h2><div><p>Contenido de introducción</p></div></div>",
                    "subContents":[
                        {
                        "title":"Introducción 2",
                        "content":"<div><h2>Título introducción 2</h2><div><p>Contenido de introducción 2</p></div></div>"
                        }
                    ]
                }
            ],
            "en":[
                {
                    "title":"Introduction",
                    "content":"<div><h2>Title introduction</h2><div><p>Introduction content</p></div></div>",
                    "subContents":[
                        {
                        "title":"Introduction 2",
                        "content":"<div><h2>Title introduction 2</h2><div><p>Introduction content 2</p></div></div>"
                        }
                    ]
                }
            ]
            }
        </textarea>
        <label for="areaFinal">Contenido Final</label>
        <textarea id="areaFinal" rows="5" cols="20">
            {
            "es":[
                {
                    "title":"Final",
                    "content":"<div><h2>Título final</h2><div><p>Contenido de final</p></div></div>",
                    "subContents":[
                        {
                        "title":"Final 2",
                        "content":"<div><h2>Título final 2</h2><div><p>Contenido de final 2</p></div></div>"
                        }
                    ]
                }
            ],
            "en":[
                {
                    "title":"Final",
                    "content":"<div><h2>Title Final</h2><div><p>Final content</p></div></div>",
                    "subContents":[
                        {
                        "title":"Final 2",
                        "content":"<div><h2>Title final 2</h2><div><p>Final content 2</p></div></div>"
                        }
                    ]
                }
            ]
            }
        </textarea>
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>

    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/help/help.ol.min.js"></script>
    <script type="text/javascript" src="plugins/sharemap/sharemap.ol.min.js"></script>
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
        const urlParams = new URLSearchParams(window.location.search);
        M.language.setLang(urlParams.get('language') || 'es');

        const map = M.map({
            container: 'mapjs',
            zoom: 5,
            maxZoom: 20,
            minZoom: 2,
            center: [-467062.8225, 4783459.6216],
        });

        let mp = null;

        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-core')) + "api-core/",
            position: "TR",
        });
        map.addPlugin(mp2);

        const selectPosition = document.getElementById("selectPosition");
        const selectExtend = document.getElementById("selectExtend");
        const inputTooltip = document.getElementById("inputTooltip");
        const areaHeader = document.getElementById("areaHeader");
        const areaInitial = document.getElementById("areaInitial");
        const areaFinal = document.getElementById("areaFinal");
        const botonEliminar = document.getElementById("botonEliminar");

        selectPosition.addEventListener('change', cambiarTest);
        selectExtend.addEventListener('change', cambiarTest);
        inputTooltip.addEventListener('change', cambiarTest);
        areaHeader.addEventListener('change', cambiarTest);
        areaInitial.addEventListener('change', cambiarTest);
        areaFinal.addEventListener('change', cambiarTest);
        botonEliminar.addEventListener("click", function() {
            map.removePlugins(mp);
        });


        function cambiarTest() {
            let objeto = {};
            objeto.position = selectPosition.options[selectPosition.selectedIndex].value;
            objeto.extendInitialExtraContents = selectExtend.options[selectExtend.selectedIndex].value === 'true' ? true : false;
            inputTooltip.value !== "" ? objeto.tooltip = inputTooltip.value : objeto.tooltip = "";
            areaHeader.value !== "" ? objeto.header = JSON.parse(areaHeader.value.trim()) : objeto.header = [];
            areaInitial.value !== "" ? objeto.initialExtraContents = JSON.parse(areaInitial.value.trim()) : objeto.initialExtraContents = [];
            areaFinal.value !== "" ? objeto.finalExtraContents = JSON.parse(areaFinal.value.trim()) : objeto.finalExtraContents = [];
            if (mp !== null) {
                map.removePlugins(mp);
            }
            crearPlugin(objeto);
        }

        function crearPlugin(propiedades) {
            mp = new M.plugin.Help(propiedades);
            map.addPlugin(mp);
        }

        cambiarTest();
    </script>
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CTLHMMB5YT"></script>
<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-CTLHMMB5YT');
</script>

</html>

