package model;

import model.data.Entity;

public class Usuario extends Entity{

	private Integer id;
	private String email;
	private String senha;

	public Usuario(){
		super();
	}

	public Integer getId(){
		return id;
	}

	public void setId(Integer id){
		this.id = id;
	}

	public String getEmail(){
		return email;
	}

	public void setEmail(String email){
		this.email = email;
	}

	public String getSenha(){
		return senha;
	}

	public void setSenha(String senha){
		this.senha = senha;
	}

	@Override
	public boolean equals(Object object){
		if (object == null)
			return false;
		if (object instanceof Usuario) {
			Usuario usuario = (Usuario) object;
			if (id == null || usuario.getId() == null)
				return false;
			return id.compareTo(usuario.getId()) == 0;
		}
		return false;
	}

}
