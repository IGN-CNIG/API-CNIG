package es.cnig.mapea.api;

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
import javax.ws.rs.core.MultivaluedMap;
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
@Produces({ MediaType.APPLICATION_JSON})
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
	public String showAvailableDatabases (@QueryParam("callback") String callbackFn) {
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
      
		return JSBuilder.wrapCallback(databases, callbackFn);
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
	public String showAvailableTables (@PathParam("database") String database,
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
	    JSONObject jsonPagina = getJsonPagina(pagina);
	    jsonPagina.put("results", tablesJSON);
	    return JSBuilder.wrapCallback(jsonPagina, callbackFn);
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
	public String showAttributes (@PathParam("database") String database, @PathParam("tabla") String tabla,
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
		JSONObject jsonPagina = getJsonPagina(pagina);
		jsonPagina.put("results", attributesJSON);
		return JSBuilder.wrapCallback(jsonPagina, callbackFn);
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
	public String showRowsFiltered (@PathParam("database") String database, @PathParam("tabla") String tabla,
		   @Context UriInfo uriInfo) {
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
		Pagina pagina = new DatabaseServiceImpl().obtenerDatosFiltrados(database, schema, tabla, params, obtenerPaginacion(params), token);
		List<DatosTabla> data = pagina.getResults();
		for(DatosTabla dt : data){
    		rowsJSON.put(datosTablaToJson(dt));
		}
		JSONObject jsonPagina = getJsonPagina(pagina);
		jsonPagina.put("results", rowsJSON);
		return JSBuilder.wrapCallback(jsonPagina, callbackFn);
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
	public String showDomainValues(@PathParam("database") String database, @PathParam("tabla") String tabla,
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
		return JSBuilder.wrapCallback(domainJson, callbackFn);
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
		return paginacion;
	}
   
	private JSONObject getJsonPagina(Pagina pagina){
		JSONObject jsonPagina = new JSONObject();
		jsonPagina.put("numPagina", pagina.getNumPagina());
		jsonPagina.put("tamPagina", pagina.getTamPagina());
		jsonPagina.put("totalElementos", pagina.getTotalElementos());
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
}
