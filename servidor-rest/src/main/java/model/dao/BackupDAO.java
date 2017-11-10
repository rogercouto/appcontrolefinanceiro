package model.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Backup;

import model.data.ValidationException;
import model.data.DAO;

public class BackupDAO extends DAO<Backup>{

	@Override
	protected void initialize() {
		insertSql = "INSERT INTO backup(backup_id,usuario_id,data_hora_criacao) VALUES (?,?,?)";
		updateSql = "UPDATE backup SET backup_id=?,usuario_id=?,data_hora_criacao=? WHERE backup_id=? AND usuario_id=?";
		deleteSql = "DELETE FROM backup WHERE backup_id=? AND usuario_id=?";
		selectSql = "SELECT * FROM backup t1";
		getFilter = "backup_id = ? AND usuario_id = ?";
		findFilters.add("UPPER(t1.data_hora_criacao) LIKE ?");
	}


	@Override
	protected int fillObject(PreparedStatement ps, Backup backup) throws SQLException {
		ps.setObject(1,backup.getId());
		ps.setObject(2,backup.getUsuarioId());
		ps.setString(3,backup.getDataHoraCriacao());
		return 4;
	}

	@Override
	protected void fillPrimaryKey(int parameterIndex, PreparedStatement ps, Backup backup) throws SQLException {
		ps.setObject(parameterIndex++, backup.getId());
		ps.setObject(parameterIndex++, backup.getUsuarioId());
	}

	@Override
	protected void beforeInsert(Backup backup) throws ValidationException {
		String nullError = "Dado(s) incompleto(s)!";
		if (backup.getId() == null)
			throw new ValidationException(nullError);
		if (backup.getUsuarioId() == null)
			throw new ValidationException(nullError);
		if (backup.getDataHoraCriacao() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterInsert(int keyGen, Backup backup) throws ValidationException, SQLException {
	}

	@Override
	protected void beforeUpdate(Backup backup) throws ValidationException {
		if (backup.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
		String nullError = "Dado(s) incompleto(s)!";
		if (backup.getId() == null)
			throw new ValidationException(nullError);
		if (backup.getUsuarioId() == null)
			throw new ValidationException(nullError);
		if (backup.getDataHoraCriacao() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterUpdate(Backup backup) throws ValidationException, SQLException{
	}

	@Override
	protected void beforeDelete(Backup backup) throws ValidationException {
		if (backup.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
	}

	@Override
	protected Backup getEntity(ResultSet result) throws SQLException {
		Backup backup = new Backup();
		backup.setId((Integer) result.getObject("t1.backup_id"));
		backup.setUsuarioId((Integer) result.getObject("t1.usuario_id"));
		backup.setDataHoraCriacao(result.getString("t1.data_hora_criacao"));
		return backup;
	}

	@Override
	protected void fillSearch(PreparedStatement ps, String text) throws SQLException {
		ps.setString(1, "%"+text.toUpperCase()+"%");
	}

}