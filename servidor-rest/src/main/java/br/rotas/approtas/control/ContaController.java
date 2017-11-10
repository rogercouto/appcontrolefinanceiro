package br.rotas.approtas.control;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import model.Conta;
import model.dao.ContaDAO;
import model.data.ValidationException;


@RestController
@RequestMapping("/conta")
public class ContaController {

    @RequestMapping(value="list", method=RequestMethod.GET)
    public List<Conta> getList(int backupId){
        ContaDAO dao = new ContaDAO();
        return dao.findList("backup_id = ?", backupId);
    }

    @RequestMapping(value="insert", method=RequestMethod.POST)
    public ResponseEntity<?> insert(@RequestBody Conta[] contas){
        try {
            ContaDAO dao = new ContaDAO();
            for(Conta conta: contas){
                dao.insert(conta);
            }
            return ResponseEntity.ok().build();
        } catch (ValidationException e) {
            return ResponseEntity.unprocessableEntity().build();
        }
    }
	
}
