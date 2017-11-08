import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Conta } from '../../model';

@Injectable()
export class ContaProvider {

  constructor(public http: Http) {}
  
  getAll():Array<Conta>{
    const contas = new Array<Conta>();
    const data = localStorage['contas'];
    if (data){
      const array = JSON.parse(data);
      for (let object of array){
        const conta = new Conta();
        conta.id = object.id;
        conta.descricao = object.descricao;
        conta.saldo = object.saldo;
        conta.limite = object.limite;
        contas.push(conta);
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
    conta.id = new Date().getTime();
    contas.push(conta);
    localStorage['contas'] = JSON.stringify(contas);
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
