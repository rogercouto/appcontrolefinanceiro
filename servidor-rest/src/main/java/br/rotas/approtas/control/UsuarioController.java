/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.rotas.approtas.control;

import model.Backup;
import model.dao.BackupDAO;
import model.data.ValidationException;
import java.util.List;
import model.Usuario;
import model.dao.UsuarioDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author roger
 */
@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    
    @RequestMapping(value="login", method=RequestMethod.GET)
    public List<Usuario> getList(String email, String senha){
        UsuarioDAO dao = new UsuarioDAO();
        return dao.findList("email=? AND senha=md5(?)", new Object[]{email,senha});
    }
    
    @RequestMapping(value="autologin", method=RequestMethod.GET)
    public List<Usuario> getListAuto(String email, String senha){
        UsuarioDAO dao = new UsuarioDAO();
        return dao.findList("email=? AND senha=?", new Object[]{email,senha});
    }
        
    @RequestMapping(value="insert", method=RequestMethod.POST)
    public ResponseEntity<?> insert(@RequestBody Usuario usuario){
        try {
            UsuarioDAO dao = new UsuarioDAO();
            dao.insert(usuario);
            return ResponseEntity.ok().build();
        } catch (ValidationException e) {
            return ResponseEntity.unprocessableEntity().build();
        }
    }
    
    public static void main(String[] args){
        UsuarioDAO dao = new UsuarioDAO();
        List<Usuario> list = dao.findList("email=? AND senha=md5(?)", new Object[]{"roger@teste.com","admin"});
        System.out.println(list.size());
    }
}