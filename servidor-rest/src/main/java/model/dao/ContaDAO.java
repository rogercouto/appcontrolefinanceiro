package model.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Conta;

import model.data.ValidationException;
import model.data.DAO;

public class ContaDAO extends DAO<Conta>{

	@Override
	protected void initialize() {
		insertSql = "INSERT INTO conta(conta_id,backup_id,descricao,saldo,limite) VALUES (?,?,?,?,?)";
		updateSql = "UPDATE conta SET conta_id=?,backup_id=?,descricao=?,saldo=?,limite=? WHERE conta_id=? AND backup_id=?";
		deleteSql = "DELETE FROM conta WHERE conta_id=? AND backup_id=?";
		selectSql = "SELECT * FROM conta t1";
		getFilter = "conta_id = ? AND backup_id = ?";
		findFilters.add("UPPER(t1.descricao) LIKE ?");
	}


	@Override
	protected int fillObject(PreparedStatement ps, Conta conta) throws SQLException {
		ps.setObject(1,conta.getId());
		ps.setObject(2,conta.getBackupId());
		ps.setString(3,conta.getDescricao());
		ps.setObject(4,conta.getSaldo());
		ps.setObject(5,conta.getLimite());
		return 6;
	}

	@Override
	protected void fillPrimaryKey(int parameterIndex, PreparedStatement ps, Conta conta) throws SQLException {
		ps.setObject(parameterIndex++, conta.getId());
		ps.setObject(parameterIndex++, conta.getBackupId());
	}

	@Override
	protected void beforeInsert(Conta conta) throws ValidationException {
		String nullError = "Dado(s) incompleto(s)!";
		if (conta.getId() == null)
			throw new ValidationException(nullError);
		if (conta.getBackupId() == null)
			throw new ValidationException(nullError);
		if (conta.getDescricao() == null)
			throw new ValidationException(nullError);
		if (conta.getSaldo() == null)
			throw new ValidationException(nullError);
		if (conta.getLimite() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterInsert(int keyGen, Conta conta) throws ValidationException, SQLException {
	}

	@Override
	protected void beforeUpdate(Conta conta) throws ValidationException {
		if (conta.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
		String nullError = "Dado(s) incompleto(s)!";
		if (conta.getId() == null)
			throw new ValidationException(nullError);
		if (conta.getBackupId() == null)
			throw new ValidationException(nullError);
		if (conta.getDescricao() == null)
			throw new ValidationException(nullError);
		if (conta.getSaldo() == null)
			throw new ValidationException(nullError);
		if (conta.getLimite() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterUpdate(Conta conta) throws ValidationException, SQLException{
	}

	@Override
	protected void beforeDelete(Conta conta) throws ValidationException {
		if (conta.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
	}

	@Override
	protected Conta getEntity(ResultSet result) throws SQLException {
		Conta conta = new Conta();
		conta.setId((Integer) result.getObject("t1.conta_id"));
		conta.setBackupId((Integer) result.getObject("t1.backup_id"));
		conta.setDescricao(result.getString("t1.descricao"));
		conta.setSaldo((Number) result.getObject("t1.saldo"));
		conta.setLimite((Number) result.getObject("t1.limite"));
		return conta;
	}

	@Override
	protected void fillSearch(PreparedStatement ps, String text) throws SQLException {
		ps.setString(1, "%"+text.toUpperCase()+"%");
	}

}