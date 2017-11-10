package model;

import model.data.Entity;

public class Backup extends Entity{

	private Integer id;
	private Integer usuarioId;
	private String dataHoraCriacao;

	public Backup(){
		super();
	}

	public Integer getId(){
		return id;
	}

	public void setId(Integer id){
		this.id = id;
	}

	public Integer getUsuarioId(){
		return usuarioId;
	}

	public void setUsuarioId(Integer usuarioId){
		this.usuarioId = usuarioId;
	}

	public String getDataHoraCriacao(){
		return dataHoraCriacao;
	}

	public void setDataHoraCriacao(String dataHoraCriacao){
		this.dataHoraCriacao = dataHoraCriacao;
	}

	@Override
	public boolean equals(Object object){
		if (object == null)
			return false;
		if (object instanceof Backup) {
			Backup backup = (Backup) object;
			if (id == null || backup.getId() == null)
				return false;
			return id.compareTo(backup.getId()) == 0;
		}
		return false;
	}

}
