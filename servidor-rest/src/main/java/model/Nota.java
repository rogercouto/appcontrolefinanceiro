package model;

import model.data.Entity;

public class Nota extends Entity{

	private Integer id;
	private Integer backupId;
	private String titulo;
	private String texto;
	private boolean arquivada;

	public Nota(){
		super();
	}

	public Integer getId(){
		return id;
	}

	public void setId(Integer id){
		this.id = id;
	}

	public Integer getBackupId(){
		return backupId;
	}

	public void setBackupId(Integer backupId){
		this.backupId = backupId;
	}

	public String getTitulo(){
		return titulo;
	}

	public void setTitulo(String titulo){
		this.titulo = titulo;
	}

	public String getTexto(){
		return texto;
	}

	public void setTexto(String texto){
		this.texto = texto;
	}

	public boolean isArquivada(){
		return arquivada;
	}

	public void setArquivada(boolean arquivada){
		this.arquivada = arquivada;
	}

	@Override
	public boolean equals(Object object){
		if (object == null)
			return false;
		if (object instanceof Nota) {
			Nota nota = (Nota) object;
			if (id == null || nota.getId() == null)
				return false;
			return id.compareTo(nota.getId()) == 0;
		}
		return false;
	}

}
