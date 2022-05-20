<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
  <%@ page import="es.cnig.mapea.plugins.PluginsManager" %>
    <%@ page import="es.cnig.mapea.parameter.adapter.ParametersAdapterV3ToV4" %>
      <%@ page import="java.util.Map" %>

        <!DOCTYPE html>
        <html lang="en">

        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="mapea" content="yes">
          <title>Visor base</title>
          <link type="text/css" rel="stylesheet" href="assets/css/apiign.ol.min.css">
          <link href="plugins/incicarto/incicarto.ol.min.css" rel="stylesheet" />
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
          <% Map<String, String[]> parameterMap = request.getParameterMap();
            PluginsManager.init (getServletContext());
            Map<String, String[]> adaptedParams = ParametersAdapterV3ToV4.adapt(parameterMap);
              String[] cssfiles = PluginsManager.getCSSFiles(adaptedParams);
              for (int i = 0; i < cssfiles.length; i++) { String cssfile=cssfiles[i]; %>
                <link type="text/css" rel="stylesheet" href="plugins/<%=cssfile%>">
                </link>
                <% } %>
        </head>

        <body>
          <div>
            <label for="selectPosicion">Selector de posición del plugin</label>
            <select name="position" id="selectPosicion">
              <option value="TL">Arriba Izquierda (TL)</option>
              <option value="TR" selected="selected">Arriba Derecha (TR)</option>
              <option value="BR">Abajo Derecha (BR)</option>
              <option value="BL">Abajo Izquierda (BL)</option>
            </select>
            <label for="selectCollapsed">Selector de collapsed</label>
            <select name="collapsed" id="selectCollapsed">
              <option value=""></option>
              <option value="true" selected="selected">true</option>
              <option value="false">false</option>
            </select>
            <label for="selectCollapsible">Selector de collapsible</label>
            <select name="collapsible" id="selectCollapsible">
              <option value=""></option>
              <option value="true" selected="selected">true</option>
              <option value="false">false</option>
            </select>
            <label for="inputBaseLayers">Parámetro baseLayers</label>
            <input type="text" name="baseLayers" id="inputBaseLayers">
            <select id="selectIntervals">
              <option selected></option>
              <option
                value='[["NACIONAL 1981-1986","1986","WMS*NACIONAL_1981-1986*https://www.ign.es/wms/pnoa-historico*NACIONAL_1981-1986"],["OLISTAT","1998","WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT"],["SIGPAC","2003","WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC"],["PNOA 2004","2004","WMS*pnoa2004*https://www.ign.es/wms/pnoa-historico*pnoa2004"],["PNOA 2005","2005","WMS*pnoa2005*https://www.ign.es/wms/pnoa-historico*pnoa2005"],["PNOA 2006","2006","WMS*pnoa2006*https://www.ign.es/wms/pnoa-historico*pnoa2006"],["PNOA 2010","2010","WMS*pnoa2010*https://www.ign.es/wms/pnoa-historico*pnoa2010"]]'>
                Ej: 7 Capas</option>
              <option
                value='[["NACIONAL 1981-1986","1986","WMS*NACIONAL_1981-1986*https://www.ign.es/wms/pnoa-historico*NACIONAL_1981-1986"],["OLISTAT","1998","WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT"],["SIGPAC","2003","WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC"],["PNOA 2004","2004","WMS*pnoa2004*https://www.ign.es/wms/pnoa-historico*pnoa2004"],["PNOA 2005","2005","WMS*pnoa2005*https://www.ign.es/wms/pnoa-historico*pnoa2005"],["PNOA 2006","2006","WMS*pnoa2006*https://www.ign.es/wms/pnoa-historico*pnoa2006"],["PNOA 2007","2007","WMS*pnoa2007*https://www.ign.es/wms/pnoa-historico*pnoa2007"],["PNOA 2008","2008","WMS*pnoa2008*https://www.ign.es/wms/pnoa-historico*pnoa2008"],["PNOA 2009","2009","WMS*pnoa2009*https://www.ign.es/wms/pnoa-historico*pnoa2009"],["PNOA 2010","2010","WMS*pnoa2010*https://www.ign.es/wms/pnoa-historico*pnoa2010"],["PNOA 2011","2011","WMS*pnoa2011*https://www.ign.es/wms/pnoa-historico*pnoa2011"],["PNOA 2012","2012","WMS*pnoa2012*https://www.ign.es/wms/pnoa-historico*pnoa2012"],["PNOA 2013","2013","WMS*pnoa2013*https://www.ign.es/wms/pnoa-historico*pnoa2013"],["PNOA 2014","2014","WMS*pnoa2014*https://www.ign.es/wms/pnoa-historico*pnoa2014"],["PNOA 2015","2015","WMS*pnoa2015*https://www.ign.es/wms/pnoa-historico*pnoa2015"],["PNOA 2016","2016","WMS*pnoa2016*https://www.ign.es/wms/pnoa-historico*pnoa2016"],["PNOA 2017","2017","WMS*pnoa2017*https://www.ign.es/wms/pnoa-historico*pnoa2017"],["PNOA 2018","2018","WMS*pnoa2018*https://www.ign.es/wms/pnoa-historico*pnoa2018"]]'>
                Ej: 18 capas</option>
            </select>
            <label for="selectVertical">Selector de orientacion</label>
            <select name="vertical" id="selectVertical">
              <option value=""></option>
              <option value="true" selected="selected">Vertical</option>
              <option value="false">Horizontal</option>
            </select>
            <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
          </div>
          <div id="mapjs" class="m-container"></div>
          <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
          <script type="text/javascript" src="js/apiign.ol.min.js"></script>
          <script type="text/javascript" src="js/configuration.js"></script>
          <script type="text/javascript" src="plugins/incicarto/incicarto.ol.min.js"></script>
          <script type="text/javascript" src="plugins/sharemap/sharemap.ol.min.js"></script>
          <% String[] jsfiles=PluginsManager.getJSFiles(adaptedParams); for (int i=0; i < jsfiles.length; i++) { String
            jsfile=jsfiles[i]; %>
            <script type="text/javascript" src="plugins/<%=jsfile%>"></script>

            <% } %>
              <script type="text/javascript">
                const urlParams = new URLSearchParams(window.location.search);
                M.language.setLang(urlParams.get('language') || 'es');

                const map = M.map({
                  container: 'mapjs',
                  center: [-467062.8225, 4683459.6216],
                  zoom: 6,
                });
                let mp, posicion, vertical, baseLayers = [["NACIONAL 1981-1986", "1986", "WMS*NACIONAL_1981-1986*https://www.ign.es/wms/pnoa-historico*NACIONAL_1981-1986"], ["OLISTAT", "1998", "WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT"], ["SIGPAC", "2003", "WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC"], ["PNOA 2004", "2004", "WMS*pnoa2004*https://www.ign.es/wms/pnoa-historico*pnoa2004"], ["PNOA 2005", "2005", "WMS*pnoa2005*https://www.ign.es/wms/pnoa-historico*pnoa2005"], ["PNOA 2006", "2006", "WMS*pnoa2006*https://www.ign.es/wms/pnoa-historico*pnoa2006"], ["PNOA 2010", "2010", "WMS*pnoa2010*https://www.ign.es/wms/pnoa-historico*pnoa2010"]];
                crearPlugin({
                  position: posicion,
                  baseLayers: baseLayers,
                });
                const selectPosicion = document.getElementById("selectPosicion");
                const selectCollapsed = document.getElementById("selectCollapsed");
                const selectCollapsible = document.getElementById("selectCollapsible");
                const inputBaseLayers = document.getElementById("inputBaseLayers");
                const selectIntervals = document.getElementById("selectIntervals");
                const selectVertical = document.getElementById("selectVertical");
                selectPosicion.addEventListener('change', cambiarTest);
                selectCollapsed.addEventListener('change', cambiarTest);
                selectCollapsible.addEventListener('change', cambiarTest);
                inputBaseLayers.addEventListener('change', cambiarTest);
                selectIntervals.addEventListener('change', () => {
                  inputBaseLayers.value = selectIntervals.value;
                  cambiarTest();
                });
                selectVertical.addEventListener('change', cambiarTest);

                function cambiarTest() {
                  let objeto = {}
                  objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
                  let collapsedValor = selectCollapsed.options[selectCollapsed.selectedIndex].value;
                  collapsed = collapsedValor != "" ? objeto.collapsed = (collapsedValor == "true") : "";
                  let collapsibleValor = selectCollapsible.options[selectCollapsible.selectedIndex].value;
                  collapsible = collapsibleValor != "" ? objeto.collapsible = (collapsibleValor == "true") : "";
                  objeto.baseLayers = inputBaseLayers.value != '' ? inputBaseLayers.value : baseLayers;
                  let verticalValor = selectVertical.options[selectVertical.selectedIndex].value;
                  vertical = verticalValor != "" ? objeto.vertical = (verticalValor == "true") : "";
                  map.removePlugins(mp);
                  crearPlugin(objeto);
                }
                function crearPlugin(propiedades) {


                  mp = new M.plugin.Incicarto({
                    collapsed: false,
                    collapsible: true,
                    position: 'TL',
                    /*wfszoom: 12,*/
                    /*precharged,*/
                    interfazmode: 'simple', //simple, advance, both
                    buzones: [{
                      name: 'Cartografía (MTN, BTN, RT, HY, Pob, BCN, Provinciales, escalas pequeñas)',
                      email: 'cartografia.ign@mitma.es',
                    },
                    {
                      name: 'Atlas Nacional de España',
                      email: 'ane@mitma.es',
                    },
                    {
                      name: 'Fototeca',
                      email: 'fototeca@cnig.es',
                    },
                    {
                      name: 'Geodesia',
                      email: 'buzon-geodesia@mitma.es',
                    },
                    {
                      name: 'Líneas Límite Municipales',
                      email: 'limites_municipales@mitma.es',
                    },
                    {
                      name: 'Nombres geográficos',
                      email: 'toponimia.ign@mitma.es',
                    },
                    {
                      name: 'Ocupación del suelo',
                      email: 'siose@mitma.es',
                    },
                    {
                      name: 'Teledetección',
                      email: 'pnt@mitma.es',
                    },
                    {
                      name: 'Documentación histórica, Archivo, Cartoteca y biblioteca',
                      email: 'documentacionign@mitma.es',
                    },
                    {
                      name: 'Registro Central de Cartografía',
                      email: 'rcc@mitma.es',
                    },
                    {
                      name: 'Naturaleza, Cultura y Ocio',
                      email: 'naturalezaculturaocio@mitma.es',
                    },
                    {
                      name: 'Cartociudad',
                      email: 'cartociudad@mitma.es',
                    },
                    {
                      name: 'Infraestructura de Datos Espaciales',
                      email: 'idee@mitma.es',
                    },
                    {
                      name: 'Sistemas de Información Geográfica (SIGNA)',
                      email: 'signa@mitma.es',
                    },
                    {
                      name: 'Volcanología',
                      email: 'volcanologia@mitma.es',
                    },
                    {
                      name: 'Red Sísmica Nacional',
                      email: 'sismologia@mitma.es',
                    }
                    ],
                    controllist: [
                      {
                        id: 'themeList',
                        name: 'Temas de errores',
                        mandatory: true,
                      },
                      {
                        id: 'errorList',
                        name: 'Tipos de errores',
                        mandatory: true,
                      },
                      {
                        id: 'productList',
                        name: 'Lista de productos',
                        mandatory: true,
                      }
                    ],
                    themeList: [
                      {
                        idTheme: 1,
                        nameTheme: 'No especificado',
                        emailTheme: 'consultas@cnig.es',
                      },
                      {
                        idTheme: 2,
                        nameTheme: 'Relieve',
                        emailTheme: 'cartografia.ign@mitma.es',
                      },
                      {
                        idTheme: 3,
                        nameTheme: 'Hidrografía',
                        emailTheme: 'cartografia.ign@mitma.es',
                      },
                      {
                        idTheme: 4,
                        nameTheme: 'Edificaciones',
                        emailTheme: 'cartografia.ign@mitma.es',
                      },
                      {
                        idTheme: 5,
                        nameTheme: 'Carretera',
                        emailTheme: 'cartociudad@mitma.es',
                      },
                      {
                        idTheme: 6,
                        nameTheme: 'Camino o senda',
                        emailTheme: 'cartociudad@mitma.es',
                      },
                      {
                        idTheme: 7,
                        nameTheme: 'Ferrocarriles',
                        emailTheme: 'cartociudad@mitma.es',
                      },
                      {
                        idTheme: 8,
                        nameTheme: 'Topónimo o nombre geográfico',
                        emailTheme: 'toponimia.ign@mitma.es',
                      },
                      {
                        idTheme: 9,
                        nameTheme: 'Límite de CCAA o municipio',
                        emailTheme: 'limites_municipales@mitma.es',
                      },
                      {
                        idTheme: 10,
                        nameTheme: 'Pruebas',
                        emailTheme: 'danielleon@guadaltel.com',
                      },
                      {
                        idTheme: 11,
                        nameTheme: 'Pruebas Guadaltel',
                        emailTheme: 'albertobuces@guadaltel.com',
                      },
                      {
                        idTheme: 12,
                        nameTheme: 'Pruebas IGN',
                        emailTheme: 'aurelio.aragon@cnig.es',
                      }
                    ],
                    errorList: [
                      'No especificado',
                      'Omisión',
                      'Comisión',
                      'Clasificación',
                      'Nombre',
                      'Valor del atributo',
                      'Forma',
                      'Localización',
                      'Otros',
                    ],
                    productList: [
                      'No especificado',
                      'Serie MTN25',
                      'Serie MTN50',
                      'BTN25',
                      'BTN100',
                      'MP200',
                      'BCN200',
                      'BCN500',
                      'Mapa Autonómico',
                      'Mapa España 1:500 000',
                      'Mapa España 1:1 000 000',
                      'Cartociudad',
                      'Redes de Transporte',
                      'Hidrografía',
                      'Poblaciones',
                      'Mundo real',
                      'IGN Base',
                      'Otros productos',
                    ],
                  });

                  map.addPlugin(mp);
                }
                mp2 = new M.plugin.ShareMap({
                  baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-core')) + "api-core/",
                  position: "TR",
                });
                map.addPlugin(mp2);
                const botonEliminar = document.getElementById("botonEliminar");
                botonEliminar.addEventListener("click", function () {
                  map.removePlugins(mp);
                });
              </script>
        </body>

        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-163660977-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'UA-163660977-1');
        </script>

        </html>
