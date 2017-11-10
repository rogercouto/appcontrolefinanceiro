import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { KeyProvider } from '../../providers/key/key';
import { Conta } from '../../model';

@Injectable()
export class ContaProvider {

  constructor(public http: Http, private keyProvider: KeyProvider) {}
  
  private getConta(object: any){
    const conta = new Conta();
    conta.id = object.id;
    conta.descricao = object.descricao;
    conta.saldo = object.saldo;
    conta.limite = object.limite;
    return conta;
  }

  getAll():Array<Conta>{
    const contas = new Array<Conta>();
    const data = localStorage['contas'];
    if (data){
      const array = JSON.parse(data);
      for (let object of array){
        contas.push(this.getConta(object));
      }
    }
    return contas;
  }
  
  get(id: number): Conta{
    const contas = this.getAll();
    for (let conta of contas){
      if (id == conta.id)
        return conta;
    }
    return null;
  }

  insert(conta: Conta){
    const contas = this.getAll();
    conta.id = this.keyProvider.genContaKey();
    contas.push(conta);
    localStorage['contas'] = JSON.stringify(contas);
  }

  insertFromBackup(object: any):number{
    const conta = this.getConta(object)
    const contas = this.getAll();
    contas.push(conta);
    localStorage['contas'] = JSON.stringify(contas);
    return conta.id;
  }

  private findIndex(conta: Conta, contas: Array<Conta>){
    for (let i = 0; i < contas.length; i++){
      if (contas[i].id == conta.id)
        return i;
    }
    return Number(-1);
  }

  update(conta: Conta){
    const contas = this.getAll();
    const index = this.findIndex(conta, contas);
    contas[index] = conta;
    localStorage['contas'] = JSON.stringify(contas);
  }

  delete(conta: Conta){
    const data = localStorage['contaSel'];
    if (data){
      const contaSel = JSON.parse(data);
      if (contaSel.id == conta.id)
        localStorage.removeItem('contaSel');
    }
    const contas = this.getAll();
    const index = this.findIndex(conta, contas);
    contas.splice(index ,1);
    localStorage['contas'] = JSON.stringify(contas);
    //deletar transações da conta
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,15) == 't_'+conta.id){
        localStorage.removeItem[key];
      }
    }
  }

}
