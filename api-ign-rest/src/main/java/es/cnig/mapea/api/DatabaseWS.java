package es.cnig.mapea.api;

import java.io.File;
import java.io.FileInputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.UriInfo;

import org.json.JSONArray;
import org.json.JSONObject;

import es.cnig.mapea.builder.JSBuilder;
import es.cnig.mapea.database.persistence.domain.Columna;
import es.cnig.mapea.database.persistence.domain.DatosTabla;
import es.cnig.mapea.database.persistence.domain.Pagina;
import es.cnig.mapea.database.persistence.domain.Tabla;
import es.cnig.mapea.database.service.impl.DatabaseServiceImpl;
import es.cnig.mapea.database.utils.CustomDatasource;
import es.cnig.mapea.database.utils.CustomPagination;

/**
 * This class manages the available actions for database connection an user can execute
 * 
 * @author Guadaltel S.A.
 */
@Path("/database")
public class DatabaseWS {

	@Context
	private ServletContext context;
   
   /**
    * The available databases
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the javascript code
    */
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public Response showAvailableDatabases (@QueryParam("callback") String callbackFn) {
		JSONArray databases = new JSONArray();
      
		List<CustomDatasource> datasources = new DatabaseServiceImpl().obtenerDatasources();
		for(CustomDatasource ds : datasources){
    		JSONObject dsJson = new JSONObject();
    		dsJson.put("Nombre", ds.getNombre());
    		dsJson.put("Host", ds.getHost());
    		dsJson.put("Puerto", ds.getPuerto());
    		dsJson.put("NombreBD", ds.getNombreBd());
    		databases.put(dsJson);
		}
      
		return Response.ok(JSBuilder.wrapCallback(databases, callbackFn)).build();
	}

   /**
    * The available tables 
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback    * 
    * @param databaase the name of database
    * 
    * @return the javascript code
    */
	@GET
	@Path("/{database}/tables")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response showAvailableTables (@PathParam("database") String database,
		   @Context UriInfo uriInfo) {
		String callbackFn = null;
		Map<String, List<String>> params = uriInfo.getQueryParameters();
		if(params.containsKey("callback")){
			callbackFn = params.get("callback").get(0);
			params.remove("callback");
		}
		boolean token = false;
		if(params.containsKey("token")){
			token = Boolean.valueOf(params.get("token").get(0));
			params.remove("token");
		}
		Pagina pagina = new DatabaseServiceImpl().obtenerTablasGeometricasDataSource(database, obtenerPaginacion(params), token);
	    List<Tabla> listTables = pagina.getResults();
	    JSONArray tablesJSON = new JSONArray();
	    for (Tabla tabla : listTables) {
	    	JSONObject json = new JSONObject();
	    	json.put("Nombre", tabla.getNombre());
	    	json.put("Schema", tabla.getSchema());
	        tablesJSON.put(json);
	    }
	    if(pagina.getError() != null && !"".equals(pagina.getError())){
	    	return Response.serverError().entity(createErrorResponse(pagina.getError(), callbackFn)).build();
	    }else{
		    JSONObject jsonPagina = getJsonPagina(pagina);
		    jsonPagina.put("results", tablesJSON);
		    return Response.ok(JSBuilder.wrapCallback(jsonPagina, callbackFn)).build();
	    }
	}
   
   /**
    * The attributes of table
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * @param database the name of database
    * @param table the name of the table
    * 
    * @return the javascript code
    */
	@GET
	@Path("/{database}/attributes/{tabla}")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response showAttributes (@PathParam("database") String database, @PathParam("tabla") String tabla,
		   @Context UriInfo uriInfo) {
		JSONArray attributesJSON = new JSONArray();
		String schema = "public";
		String callbackFn = null;
		Map<String, List<String>> params = uriInfo.getQueryParameters(); 
		if(params.containsKey("schema")){
			schema = params.get("schema").get(0);
			params.remove("schema");
		}
		if(params.containsKey("callback")){
			callbackFn = params.get("callback").get(0);
			params.remove("callback");
		}
		boolean token = false;
		if(params.containsKey("token")){
			token = Boolean.valueOf(params.get("token").get(0));
			params.remove("token");
		}
		Pagina pagina = new DatabaseServiceImpl().obtenerColumnasTabla(database, schema, tabla, obtenerPaginacion(params), token);
		List<Columna> listAttributes = pagina.getResults();
		for(Columna col : listAttributes){
			JSONObject json = new JSONObject();
			json.put("Nombre", col.getNombre());
			json.put("TipoDato", col.getTipoDato());
			attributesJSON.put(json);
		}
		if(pagina.getError() != null && !"".equals(pagina.getError())){
	    	return Response.serverError().entity(createErrorResponse(pagina.getError(), callbackFn)).build();
	    }else{
			JSONObject jsonPagina = getJsonPagina(pagina);
			jsonPagina.put("results", attributesJSON);
			return Response.ok(JSBuilder.wrapCallback(jsonPagina, callbackFn)).build();
	    }
	}
   
   /**
    * Returns the filtered records from table
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * @param database the name of database
    * @param table the name of table 
    * 
    * @return the javascript code
    */
	@GET
	@Path("/{database}/{tabla}/filtered")
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML, MediaType.APPLICATION_OCTET_STREAM })
	public Response showRowsFiltered (@PathParam("database") String database, @PathParam("tabla") String tabla,
		   @Context UriInfo uriInfo) {
		JSONArray rowsJSON = new JSONArray();
		String schema = "public";
		String callbackFn = null;
		boolean token = false;
		boolean consumible = false;
		Map<String, List<String>> params = uriInfo.getQueryParameters(); 
		if(params.containsKey("schema")){
			schema = params.get("schema").get(0);
			params.remove("schema");
		}
		if(params.containsKey("callback")){
			callbackFn = params.get("callback").get(0);
			params.remove("callback");
		}
		if(params.containsKey("token")){
			token = Boolean.valueOf(params.get("token").get(0));
			params.remove("token");
		}
		if(params.containsKey("consumible")){
			consumible = Boolean.valueOf(params.get("consumible").get(0));
			params.remove("consumible");
		}
		Pagina pagina = new DatabaseServiceImpl().obtenerDatosFiltrados(database, schema, tabla, params, obtenerPaginacion(params), token);
		List<DatosTabla> data = pagina.getResults();
		for(DatosTabla dt : data){
    		rowsJSON.put(datosTablaToJson(dt));
		}
		if(pagina.getError() != null && !"".equals(pagina.getError())){
	    	return Response.serverError().entity(createErrorResponse(pagina.getError(), callbackFn))
					.header("Content-Type", MediaType.APPLICATION_JSON).build();
	    }else{
	    	if("mvt".equals(pagina.getFormato())){//formato mvt siempre es consumible
	    		JSONObject row = (JSONObject) rowsJSON.get(0);
				String rutaFile = row.getString(pagina.getFormato());
				File mvtFile = new File(rutaFile);
				return Response.ok(mvtFile)
						.header("Content-Disposition", "attachment; filename=\"mvt-cnig.mvt\"")
						.header("Content-Type", MediaType.APPLICATION_OCTET_STREAM)
						.build();
	    	}else if(consumible){
				if("wkt".equals(pagina.getFormato())){
					return Response.ok(JSBuilder.wrapCallback(rowsJSON, callbackFn))
							.header("Content-Type", MediaType.APPLICATION_JSON).build();
				}else{
					JSONObject row = (JSONObject) rowsJSON.get(0);
					String result = row.getString(pagina.getFormato());
					ResponseBuilder rb = Response.ok(JSBuilder.wrapCallback(result, callbackFn));
					if("kml".equals(pagina.getFormato()) || "gml".equals(pagina.getFormato())){
						rb.header("Content-Type", MediaType.APPLICATION_XML);
					}else{
						rb.header("Content-Type", MediaType.APPLICATION_JSON);
					}
					return rb.build();
				}
			}else{
				JSONObject jsonPagina = getJsonPagina(pagina);
				jsonPagina.put("results", rowsJSON);
				return Response.ok(JSBuilder.wrapCallback(jsonPagina, callbackFn))
						.header("Content-Type", MediaType.APPLICATION_JSON).build();
			}
	    }
	}
	
	@GET
	@Path("/{database}/{tabla}/sql")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response customQuery (@PathParam("database") String database, @PathParam("tabla") String tabla,
		   @Context UriInfo uriInfo){
		JSONArray rowsJSON = new JSONArray();
		String schema = "public";
		String callbackFn = null;
		Map<String, List<String>> params = uriInfo.getQueryParameters(); 
		if(params.containsKey("schema")){
			schema = params.get("schema").get(0);
			params.remove("schema");
		}
		if(params.containsKey("callback")){
			callbackFn = params.get("callback").get(0);
			params.remove("callback");
		}
		boolean token = false;
		if(params.containsKey("token")){
			token = Boolean.valueOf(params.get("token").get(0));
			params.remove("token");
		}
		Pagina pagina = new DatabaseServiceImpl().obtenerDatosPersonalizados(database, schema, tabla, params, obtenerPaginacion(params), token);
		if(pagina.getError() != null && !"".equals(pagina.getError())){
	    	return Response.serverError().entity(createErrorResponse(pagina.getError(), callbackFn))
					.header("Content-Type", MediaType.APPLICATION_JSON).build();
	    }else{
			List<DatosTabla> data = pagina.getResults();
			for(DatosTabla dt : data){
	    		rowsJSON.put(datosTablaToJson(dt));
			}
			JSONObject jsonPagina = getJsonPagina(pagina);
			jsonPagina.put("results", rowsJSON);
			return Response.ok(JSBuilder.wrapCallback(jsonPagina, callbackFn))
					.header("Content-Type", MediaType.APPLICATION_JSON).build();
	    }
	}
	
	/**
	* Returns the domain values from table column
	* 
	* @param callbackFn the name of the javascript
	* function to execute as callback
	* @param database the name of database
	* @param table the name of table 
	* 
	* @return the javascript code
	*/
	@GET
	@Path("/{database}/{tabla}/domain/{columna}")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response showDomainValues(@PathParam("database") String database, @PathParam("tabla") String tabla,
			@PathParam("columna") String columna, @Context UriInfo uriInfo){
		JSONArray domainJson = new JSONArray();
		String schema = "public";
		String callbackFn = null;
		Map<String, List<String>> params = uriInfo.getQueryParameters(); 
		if(params.containsKey("schema")){
			schema = params.get("schema").get(0);
			params.remove("schema");
		}
		if(params.containsKey("callback")){
			callbackFn = params.get("callback").get(0);
			params.remove("callback");
		}
		boolean token = false;
		if(params.containsKey("token")){
			token = Boolean.valueOf(params.get("token").get(0));
			params.remove("token");
		}
		List<String> domains = new DatabaseServiceImpl().obtenerValoresDominio(database, schema, tabla, columna, token);
		for(String d : domains){
			domainJson.put(d);
		}
		return Response.ok(JSBuilder.wrapCallback(domainJson, callbackFn)).build();
	}
   
	private CustomPagination obtenerPaginacion(Map<String, List<String>> params){
		CustomPagination paginacion = new CustomPagination();
		if(params.containsKey("size")){
			String size = params.get("size").get(0);
			paginacion.setSize(Integer.parseInt(size));
			params.remove("size");
		}
		if(params.containsKey("page")){
			String page = params.get("page").get(0);
			paginacion.setPage(Integer.parseInt(page));
			params.remove("page");
		}
		if(params.containsKey("formato")){
			String formato = params.get("formato").get(0);
			validateFormatGeom(formato);
			paginacion.setFormato(formato);
			params.remove("formato");
		}else{
			paginacion.setFormato("wkt");
		}
		return paginacion;
	}
   
	private JSONObject getJsonPagina(Pagina pagina){
		JSONObject jsonPagina = new JSONObject();
		jsonPagina.put("numPagina", pagina.getNumPagina());
		jsonPagina.put("tamPagina", pagina.getTamPagina());
		jsonPagina.put("totalElementos", pagina.getTotalElementos());
//		jsonPagina.put("error", pagina.getError());
		return jsonPagina;
	}
   
	private JSONObject datosTablaToJson(DatosTabla dt){
		JSONObject json = new JSONObject();
		Map<String, Object> mapAttributes = dt.getMapAttributes();
		Iterator<String> itKeys = mapAttributes.keySet().iterator();
		while(itKeys.hasNext()){
			String key = itKeys.next();
			Object value = mapAttributes.get(key);
			json.put(key, value);
		}
		return json;
	}
	
	private void validateFormatGeom(String formato){
		if(formato != null && !"".equals(formato)){
			if(!"wkt".equalsIgnoreCase(formato) || !"geojson".equalsIgnoreCase(formato) ||
					!"kml".equalsIgnoreCase(formato) || !"mvt".equalsIgnoreCase(formato) ||
					!"gml".equalsIgnoreCase(formato)){
				formato = "wkt";
			}
		}else{
			formato = "wkt";
		}
	}
	
	private String createErrorResponse(String description, String callbackFn){
		JSONObject response = new JSONObject();
		response.put("code", 500);
		response.put("description", description);
		return JSBuilder.wrapCallback(response, callbackFn);
	}
}
