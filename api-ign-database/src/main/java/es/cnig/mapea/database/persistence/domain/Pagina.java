package es.cnig.mapea.database.persistence.domain;

import java.util.List;

public class Pagina {

	private int numPagina;
	
	private int tamPagina;
	
	private int totalElementos;
	
	private List results;
	
	public Pagina(){
		
	}

	public Pagina(int numPagina, int tamPagina, int totalElementos, List results) {
		this.numPagina = numPagina;
		this.tamPagina = tamPagina;
		this.totalElementos = totalElementos;
		this.results = results;
	}

	public int getNumPagina() {
		return numPagina;
	}

	public void setNumPagina(int numPagina) {
		this.numPagina = numPagina;
	}

	public int getTamPagina() {
		return tamPagina;
	}

	public void setTamPagina(int tamPagina) {
		this.tamPagina = tamPagina;
	}

	public int getTotalElementos() {
		return totalElementos;
	}

	public void setTotalElementos(int totalElementos) {
		this.totalElementos = totalElementos;
	}

	public List getResults() {
		return results;
	}

	public void setResults(List results) {
		this.results = results;
	}

}
