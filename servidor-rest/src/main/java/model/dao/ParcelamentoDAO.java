package model.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Parcelamento;

import model.data.ValidationException;
import model.data.DAO;

public class ParcelamentoDAO extends DAO<Parcelamento>{

	@Override
	protected void initialize() {
		insertSql = "INSERT INTO parcelamento(parcelamento_id,backup_id,conta_id,descricao,data_ini,num_parcelas,valor_total,entrada,debito_automatico) VALUES (?,?,?,?,?,?,?,?,?)";
		updateSql = "UPDATE parcelamento SET parcelamento_id=?,backup_id=?,conta_id=?,descricao=?,data_ini=?,num_parcelas=?,valor_total=?,entrada=?,debito_automatico=? WHERE parcelamento_id=? AND backup_id=?";
		deleteSql = "DELETE FROM parcelamento WHERE parcelamento_id=? AND backup_id=?";
		selectSql = "SELECT * FROM parcelamento t1";
		getFilter = "parcelamento_id = ? AND backup_id = ?";
		findFilters.add("UPPER(t1.descricao) LIKE ?");
		findFilters.add("UPPER(t1.data_ini) LIKE ?");
	}


	@Override
	protected int fillObject(PreparedStatement ps, Parcelamento parcelamento) throws SQLException {
		ps.setObject(1,parcelamento.getId());
		ps.setObject(2,parcelamento.getBackupId());
		ps.setObject(3,parcelamento.getContaId());
		ps.setString(4,parcelamento.getDescricao());
		ps.setString(5,parcelamento.getDataIni());
		ps.setObject(6,parcelamento.getNumParcelas());
		ps.setObject(7,parcelamento.getValorTotal());
		ps.setBoolean(8,parcelamento.isEntrada());
		ps.setBoolean(9,parcelamento.isDebitoAutomatico());
		return 10;
	}

	@Override
	protected void fillPrimaryKey(int parameterIndex, PreparedStatement ps, Parcelamento parcelamento) throws SQLException {
		ps.setObject(parameterIndex++, parcelamento.getId());
		ps.setObject(parameterIndex++, parcelamento.getBackupId());
	}

	@Override
	protected void beforeInsert(Parcelamento parcelamento) throws ValidationException {
		String nullError = "Dado(s) incompleto(s)!";
		if (parcelamento.getId() == null)
			throw new ValidationException(nullError);
		if (parcelamento.getBackupId() == null)
			throw new ValidationException(nullError);
		if (parcelamento.getContaId() == null)
			throw new ValidationException(nullError);
		if (parcelamento.getDescricao() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterInsert(int keyGen, Parcelamento parcelamento) throws ValidationException, SQLException {
	}

	@Override
	protected void beforeUpdate(Parcelamento parcelamento) throws ValidationException {
		if (parcelamento.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
		String nullError = "Dado(s) incompleto(s)!";
		if (parcelamento.getId() == null)
			throw new ValidationException(nullError);
		if (parcelamento.getBackupId() == null)
			throw new ValidationException(nullError);
		if (parcelamento.getContaId() == null)
			throw new ValidationException(nullError);
		if (parcelamento.getDescricao() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterUpdate(Parcelamento parcelamento) throws ValidationException, SQLException{
	}

	@Override
	protected void beforeDelete(Parcelamento parcelamento) throws ValidationException {
		if (parcelamento.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
	}

	@Override
	protected Parcelamento getEntity(ResultSet result) throws SQLException {
		Parcelamento parcelamento = new Parcelamento();
		parcelamento.setId((Integer) result.getObject("t1.parcelamento_id"));
		parcelamento.setBackupId((Integer) result.getObject("t1.backup_id"));
		parcelamento.setContaId((Integer) result.getObject("t1.conta_id"));
		parcelamento.setDescricao(result.getString("t1.descricao"));
		parcelamento.setDataIni(result.getString("t1.data_ini"));
		parcelamento.setNumParcelas((Integer) result.getObject("t1.num_parcelas"));
		parcelamento.setValorTotal((Number) result.getObject("t1.valor_total"));
		parcelamento.setEntrada(result.getBoolean("t1.entrada"));
		parcelamento.setDebitoAutomatico(result.getBoolean("t1.debito_automatico"));
		return parcelamento;
	}

	@Override
	protected void fillSearch(PreparedStatement ps, String text) throws SQLException {
		ps.setString(1, "%"+text.toUpperCase()+"%");
		ps.setString(2, "%"+text.toUpperCase()+"%");
	}

}