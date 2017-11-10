package br.rotas.approtas.control;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import model.Parcelamento;
import model.dao.ParcelamentoDAO;
import model.data.ValidationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/parcelamento")
public class ParcelamentoController {

    @RequestMapping(value="list", method=RequestMethod.GET)
    public List<Parcelamento> getList(int backupId){
        ParcelamentoDAO dao = new ParcelamentoDAO();
        return dao.findList("backup_id = ?",backupId);
    }

    @RequestMapping(value="insert", method=RequestMethod.POST)
    public ResponseEntity<?> insert(@RequestBody Parcelamento[] parcelamentos){
        try {
            ParcelamentoDAO dao = new ParcelamentoDAO();
            for (Parcelamento parcelamento : parcelamentos){
                dao.insert(parcelamento);
            }
            return ResponseEntity.ok().build();
        } catch (ValidationException e) {
            return ResponseEntity.unprocessableEntity().build();
        }
    }
	    
}
