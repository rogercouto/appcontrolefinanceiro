package model.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Nota;

import model.data.ValidationException;
import model.data.DAO;

public class NotaDAO extends DAO<Nota>{

	@Override
	protected void initialize() {
		insertSql = "INSERT INTO nota(nota_id,backup_id,titulo,texto,arquivada) VALUES (?,?,?,?,?)";
		updateSql = "UPDATE nota SET nota_id=?,backup_id=?,titulo=?,texto=?,arquivada=? WHERE nota_id=? AND backup_id=?";
		deleteSql = "DELETE FROM nota WHERE nota_id=? AND backup_id=?";
		selectSql = "SELECT * FROM nota t1";
		getFilter = "nota_id = ? AND backup_id = ?";
		findFilters.add("UPPER(t1.titulo) LIKE ?");
		findFilters.add("UPPER(t1.texto) LIKE ?");
	}


	@Override
	protected int fillObject(PreparedStatement ps, Nota nota) throws SQLException {
		ps.setObject(1,nota.getId());
		ps.setObject(2,nota.getBackupId());
		ps.setString(3,nota.getTitulo());
		ps.setString(4,nota.getTexto());
		ps.setBoolean(5,nota.isArquivada());
		return 6;
	}

	@Override
	protected void fillPrimaryKey(int parameterIndex, PreparedStatement ps, Nota nota) throws SQLException {
		ps.setObject(parameterIndex++, nota.getId());
		ps.setObject(parameterIndex++, nota.getBackupId());
	}

	@Override
	protected void beforeInsert(Nota nota) throws ValidationException {
		String nullError = "Dado(s) incompleto(s)!";
		if (nota.getId() == null)
			throw new ValidationException(nullError);
		if (nota.getBackupId() == null)
			throw new ValidationException(nullError);
		if (nota.getTitulo() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterInsert(int keyGen, Nota nota) throws ValidationException, SQLException {
	}

	@Override
	protected void beforeUpdate(Nota nota) throws ValidationException {
		if (nota.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
		String nullError = "Dado(s) incompleto(s)!";
		if (nota.getId() == null)
			throw new ValidationException(nullError);
		if (nota.getBackupId() == null)
			throw new ValidationException(nullError);
		if (nota.getTitulo() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterUpdate(Nota nota) throws ValidationException, SQLException{
	}

	@Override
	protected void beforeDelete(Nota nota) throws ValidationException {
		if (nota.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
	}

	@Override
	protected Nota getEntity(ResultSet result) throws SQLException {
		Nota nota = new Nota();
		nota.setId((Integer) result.getObject("t1.nota_id"));
		nota.setBackupId((Integer) result.getObject("t1.backup_id"));
		nota.setTitulo(result.getString("t1.titulo"));
		nota.setTexto(result.getString("t1.texto"));
		nota.setArquivada(result.getBoolean("t1.arquivada"));
		return nota;
	}

	@Override
	protected void fillSearch(PreparedStatement ps, String text) throws SQLException {
		ps.setString(1, "%"+text.toUpperCase()+"%");
		ps.setString(2, "%"+text.toUpperCase()+"%");
	}

}