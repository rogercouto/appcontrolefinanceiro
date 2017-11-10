package br.rotas.approtas.control;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import model.Transacao;
import model.dao.TransacaoDAO;
import model.data.ValidationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/transacao")
public class TransacaoController {

    @RequestMapping(value="list", method=RequestMethod.GET)
    public List<Transacao> getList(int backupId){
        TransacaoDAO dao = new TransacaoDAO();
        return dao.findList("backup_id = ?",backupId);
    }

    @RequestMapping(value="insert", method=RequestMethod.POST)
    public ResponseEntity<?> insert(@RequestBody Transacao[] transacoes){
        try {
            TransacaoDAO dao = new TransacaoDAO();
            for (Transacao transacao : transacoes){
                dao.insert(transacao);
            }
            return ResponseEntity.ok().build();
        } catch (ValidationException e) {
            return ResponseEntity.unprocessableEntity().build();
        }
    }
	
}
