package model;

import model.data.Entity;

public class Transacao extends Entity{

	private Integer id;
	private Integer backupId;
	private Integer contaId;
	private String descricao;
	private Number valor;
	private String dataHoraVencimento;
	private boolean debitoAutomatico;
	private String dataHoraPagamento;
	private Integer parcelamentoId;
	private Integer numParcela;

	public Transacao(){
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

	public Number getValor(){
		return valor;
	}

	public void setValor(Number valor){
		this.valor = valor;
	}

	public String getDataHoraVencimento(){
		return dataHoraVencimento;
	}

	public void setDataHoraVencimento(String dataHoraVencimento){
		this.dataHoraVencimento = dataHoraVencimento;
	}

	public boolean isDebitoAutomatico(){
		return debitoAutomatico;
	}

	public void setDebitoAutomatico(boolean debitoAutomatico){
		this.debitoAutomatico = debitoAutomatico;
	}

	public String getDataHoraPagamento(){
		return dataHoraPagamento;
	}

	public void setDataHoraPagamento(String dataHoraPagamento){
		this.dataHoraPagamento = dataHoraPagamento;
	}

	public Integer getParcelamentoId(){
		return parcelamentoId;
	}

	public void setParcelamentoId(Integer parcelamentoId){
		this.parcelamentoId = parcelamentoId;
	}

	public Integer getNumParcela(){
		return numParcela;
	}

	public void setNumParcela(Integer numParcela){
		this.numParcela = numParcela;
	}

	@Override
	public boolean equals(Object object){
		if (object == null)
			return false;
		if (object instanceof Transacao) {
			Transacao transacao = (Transacao) object;
			if (id == null || transacao.getId() == null)
				return false;
			return id.compareTo(transacao.getId()) == 0;
		}
		return false;
	}

}
