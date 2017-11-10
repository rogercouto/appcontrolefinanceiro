package model;

import model.data.Entity;

public class Parcelamento extends Entity{

	private Integer id;
	private Integer backupId;
	private Integer contaId;
	private String descricao;
	private String dataIni;
	private Integer numParcelas;
	private Number valorTotal;
	private boolean entrada;
	private boolean debitoAutomatico;

	public Parcelamento(){
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

	public Integer getContaId(){
		return contaId;
	}

	public void setContaId(Integer contaId){
		this.contaId = contaId;
	}

	public String getDescricao(){
		return descricao;
	}

	public void setDescricao(String descricao){
		this.descricao = descricao;
	}

	public String getDataIni(){
		return dataIni;
	}

	public void setDataIni(String dataIni){
		this.dataIni = dataIni;
	}

	public Integer getNumParcelas(){
		return numParcelas;
	}

	public void setNumParcelas(Integer numParcelas){
		this.numParcelas = numParcelas;
	}

	public Number getValorTotal(){
		return valorTotal;
	}

	public void setValorTotal(Number valorTotal){
		this.valorTotal = valorTotal;
	}

	public boolean isEntrada(){
		return entrada;
	}

	public void setEntrada(boolean entrada){
		this.entrada = entrada;
	}

	public boolean isDebitoAutomatico(){
		return debitoAutomatico;
	}

	public void setDebitoAutomatico(boolean debitoAutomatico){
		this.debitoAutomatico = debitoAutomatico;
	}

	@Override
	public boolean equals(Object object){
		if (object == null)
			return false;
		if (object instanceof Parcelamento) {
			Parcelamento parcelamento = (Parcelamento) object;
			if (id == null || parcelamento.getId() == null)
				return false;
			return id.compareTo(parcelamento.getId()) == 0;
		}
		return false;
	}

}
