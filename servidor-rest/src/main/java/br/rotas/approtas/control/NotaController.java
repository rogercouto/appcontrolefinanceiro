package br.rotas.approtas.control;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import model.Nota;
import model.dao.NotaDAO;
import model.data.ValidationException;

@RestController
@RequestMapping("/nota")
public class NotaController {

    @RequestMapping(value="list", method=RequestMethod.GET)
    public List<Nota> getList(int backupId){
        NotaDAO dao = new NotaDAO();
        return dao.findList("backup_id = ?", backupId);
    }

    @RequestMapping(value="insert", method=RequestMethod.POST)
    public ResponseEntity<?> insert(@RequestBody Nota[] notas){
        try {
            NotaDAO dao = new NotaDAO();
            for (Nota nota : notas){
                dao.insert(nota);
            }
            return ResponseEntity.ok().build();
        } catch (ValidationException e) {
            return ResponseEntity.unprocessableEntity().build();
        }
    }
	
}
