package model.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.Usuario;

import model.data.ValidationException;
import model.data.DAO;

public class UsuarioDAO extends DAO<Usuario>{

	@Override
	protected void initialize() {
		insertSql = "INSERT INTO usuario(email,senha) VALUES (?,?)";
		updateSql = "UPDATE usuario SET email=?,senha=? WHERE usuario_id=?";
		deleteSql = "DELETE FROM usuario WHERE usuario_id=?";
		selectSql = "SELECT * FROM usuario t1";
		getFilter = "usuario_id = ?";
		findFilters.add("UPPER(t1.email) LIKE ?");
		findFilters.add("UPPER(t1.senha) LIKE ?");
	}


	@Override
	protected int fillObject(PreparedStatement ps, Usuario usuario) throws SQLException {
		ps.setString(1,usuario.getEmail());
		ps.setString(2,usuario.getSenha());
		return 3;
	}

	@Override
	protected void fillPrimaryKey(int parameterIndex, PreparedStatement ps, Usuario usuario) throws SQLException {
		ps.setObject(parameterIndex++, usuario.getId());
	}

	@Override
	protected void beforeInsert(Usuario usuario) throws ValidationException {
		String nullError = "Dado(s) incompleto(s)!";
		if (usuario.getEmail() == null)
			throw new ValidationException(nullError);
		if (usuario.getSenha() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterInsert(int keyGen, Usuario usuario) throws ValidationException, SQLException {
		usuario.setId(keyGen);
	}

	@Override
	protected void beforeUpdate(Usuario usuario) throws ValidationException {
		if (usuario.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
		String nullError = "Dado(s) incompleto(s)!";
		if (usuario.getEmail() == null)
			throw new ValidationException(nullError);
		if (usuario.getSenha() == null)
			throw new ValidationException(nullError);
	}

	@Override
	protected void afterUpdate(Usuario usuario) throws ValidationException, SQLException{
	}

	@Override
	protected void beforeDelete(Usuario usuario) throws ValidationException {
		if (usuario.getId() == null)
			throw new RuntimeException("Primary key can't be null!");
	}

	@Override
	protected Usuario getEntity(ResultSet result) throws SQLException {
		Usuario usuario = new Usuario();
		usuario.setId((Integer) result.getObject("t1.usuario_id"));
		usuario.setEmail(result.getString("t1.email"));
		usuario.setSenha(result.getString("t1.senha"));
		return usuario;
	}

	@Override
	protected void fillSearch(PreparedStatement ps, String text) throws SQLException {
		ps.setString(1, "%"+text.toUpperCase()+"%");
		ps.setString(2, "%"+text.toUpperCase()+"%");
	}

}