package model;

import model.data.Entity;

public class Conta extends Entity{

	private Integer id;
	private Integer backupId;
	private String descricao;
	private Number saldo;
	private Number limite;

	public Conta(){
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

	public String getDescricao(){
		return descricao;
	}

	public void setDescricao(String descricao){
		this.descricao = descricao;
	}

	public Number getSaldo(){
		return saldo;
	}

	public void setSaldo(Number saldo){
		this.saldo = saldo;
	}

	public Number getLimite(){
		return limite;
	}

	public void setLimite(Number limite){
		this.limite = limite;
	}

	@Override
	public boolean equals(Object object){
		if (object == null)
			return false;
		if (object instanceof Conta) {
			Conta conta = (Conta) object;
			if (id == null || conta.getId() == null)
				return false;
			return id.compareTo(conta.getId()) == 0;
		}
		return false;
	}

}
