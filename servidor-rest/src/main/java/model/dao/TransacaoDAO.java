package model.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Transacao;

import model.data.ValidationException;
import model.data.DAO;

public class TransacaoDAO extends DAO<Transacao>{

	@Override
	protected void initialize() {
		insertSql = "INSERT INTO transacao(transacao_id,backup_id,conta_id,descricao,valor,data_hora_vencimento,debito_automatico,data_hora_pagamento,parcelamento_id,num_parcela) VALUES (?,?,?,?,?,?,?,?,?,?)";
		updateSql = "UPDATE transacao SET transacao_id=?,backup_id=?,conta_id=?,descricao=?,valor=?,data_hora_vencimento=?,debito_automatico=?,data_hora_pagamento=?,parcelamento_id=?,num_parcela=? WHERE transacao_id=? AND backup_id=?";
		deleteSql = "DELETE FROM transacao WHERE transacao_id=? AND backup_id=?";
		selectSql = "SELECT * FROM transacao t1";
		getFilter = "transacao_id = ? AND backup_id = ?";
		findFilters.add("UPPER(t1.descricao) LIKE ?");
		findFilters.add("UPPER(t1.data_hora_vencimento) LIKE ?");
		findFilters.add("UPPER(t1.data_hora_pagamento) LIKE ?");
	}


	@Override
	protected int fillObject(PreparedStatement ps, Transacao transacao) throws SQLException {
		ps.setObject(1,transacao.getId());
		ps.setObject(2,transacao.getBackupId());
		ps.setObject(3,transacao.getContaId());
		ps.setString(4,transacao.getDescricao());
		ps.setObject(5,transacao.getValor());
		ps.setString(6,transacao.getDataHoraVencimento());
		ps.setBoolean(7,transacao.isDebitoAutomatico());
		ps.setString(8,transacao.getDataHoraPagamento());
		ps.setObject(9,transacao.getParcelamentoId());
		ps.setObject(10,transacao.getNumParcela());
		return 11;
	}

	@Override
	protected void fillPrimaryKey(int parameterIndex, PreparedStatement ps, Transacao transacao) throws SQLException {
		ps.setObject(parameterIndex++, transacao.getId());
		ps.setObject(parameterIndex++, transacao.getBackupId());
	}

	@Override
	protected void beforeInsert(Transacao transacao) throws ValidationException {
		String nullError = "Dado(s) incompleto(s)!";
		if (transacao.getId() == null)
			throw new ValidationException(nullError);
		if (transacao.getBackupId() == null)
			throw new ValidationException(nullError);
		if (transacao.getContaId() == null)
			throw new ValidationException(nullError);
		if (transacao.getValor() == null)
			throw new ValidationException(nullError);
		if (transacao.getDataHoraVencimento() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterInsert(int keyGen, Transacao transacao) throws ValidationException, SQLException {
	}

	@Override
	protected void beforeUpdate(Transacao transacao) throws ValidationException {
		if (transacao.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
		String nullError = "Dado(s) incompleto(s)!";
		if (transacao.getId() == null)
			throw new ValidationException(nullError);
		if (transacao.getBackupId() == null)
			throw new ValidationException(nullError);
		if (transacao.getContaId() == null)
			throw new ValidationException(nullError);
		if (transacao.getValor() == null)
			throw new ValidationException(nullError);
		if (transacao.getDataHoraVencimento() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterUpdate(Transacao transacao) throws ValidationException, SQLException{
	}

	@Override
	protected void beforeDelete(Transacao transacao) throws ValidationException {
		if (transacao.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
	}

	@Override
	protected Transacao getEntity(ResultSet result) throws SQLException {
		Transacao transacao = new Transacao();
		transacao.setId((Integer) result.getObject("t1.transacao_id"));
		transacao.setBackupId((Integer) result.getObject("t1.backup_id"));
		transacao.setContaId((Integer) result.getObject("t1.conta_id"));
		transacao.setDescricao(result.getString("t1.descricao"));
		transacao.setValor((Number) result.getObject("t1.valor"));
		transacao.setDataHoraVencimento(result.getString("t1.data_hora_vencimento"));
		transacao.setDebitoAutomatico(result.getBoolean("t1.debito_automatico"));
		transacao.setDataHoraPagamento(result.getString("t1.data_hora_pagamento"));
		transacao.setParcelamentoId((Integer) result.getObject("t1.parcelamento_id"));
		transacao.setNumParcela((Integer) result.getObject("t1.num_parcela"));
		return transacao;
	}

	@Override
	protected void fillSearch(PreparedStatement ps, String text) throws SQLException {
		ps.setString(1, "%"+text.toUpperCase()+"%");
		ps.setString(2, "%"+text.toUpperCase()+"%");
		ps.setString(3, "%"+text.toUpperCase()+"%");
	}

}