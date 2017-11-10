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
@RequestMapping("/backup")
public class BackupController {
    
    @RequestMapping(value="list", method=RequestMethod.GET)
    public List<Backup> getList(int usuarioId){
        BackupDAO dao = new BackupDAO();
        return dao.findList("usuario_id = ? ORDER BY backup_id DESC LIMIT 1", usuarioId);
    }
        
    @RequestMapping(value="insert", method=RequestMethod.POST)
    public ResponseEntity<?> insert(@RequestBody Backup backup){
        try {
            BackupDAO dao = new BackupDAO();
            dao.insert(backup);
            return ResponseEntity.ok().build();
        } catch (ValidationException e) {
            return ResponseEntity.unprocessableEntity().build();
        }
    }
    
    public static void main(String[] args){
        Backup backup = new Backup();
        
    }
}