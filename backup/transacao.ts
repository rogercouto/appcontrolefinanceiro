import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

import { Conta, Transacao} from '../../model';

/*
  Generated class for the TransacaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransacaoProvider {

  private genId: number = 1;
  private transacoes: Array<Transacao> = [];

  constructor(public http: Http, private storage: Storage) {
  }

  getTransacoes(conta: Conta, periodo: string): Array<Transacao>{
    const key = conta.id+"-"+periodo;
    this.storage.get(key).then((data) => {
      this.transacoes = [];
      if (data != null){
        for (let obj of data) {
            this.transacoes.push(new Transacao(Number(obj.id), obj.descricao, Number(obj.valor), obj.dataHoraVenc, obj.debitoConta));
        }
      }
    });
    return this.transacoes;
  }

  insertTransacao(conta: Conta, transacao: Transacao){
    transacao.id = this.generateId();
    const periodo : string = transacao.dataHoraVenc.toString().substring(0, 7);
    this.getTransacoes(conta, periodo);
    this.transacoes.push(transacao);
    const key = conta.id+"-"+periodo;
    this.storage.set(key, this.transacoes);
  }

  generateId():number{
    const key = 'transacao-id';
    this.storage.get(key).then((data) => {
      if (data != null){
        this.genId = Number(data);
        this.genId += 1;
      }  
      this.storage.set(key, this.genId);
    });
    return this.genId;
  }

}
