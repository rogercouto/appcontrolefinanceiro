import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Conta } from '../../model';

/*
  Generated class for the ContaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContaProvider {

  constructor(public http: Http) {}

  getConta(id: number): Conta{
    const contas = this.getContas();
    for (let conta of contas){
      if (id == conta.id)
        return conta;
    }
    return null;
  }
  

  getContas() : Array<Conta>{
    const data = localStorage['contas'];
    if (data){
      let contas = JSON.parse(data) as Array<Conta>;  
      return contas;
    }else{
      return [];
    }
  }

  insertConta(conta: Conta){
    const contas = this.getContas();
    conta.id = new Date().getTime();
    contas.push(conta);
    localStorage['contas'] = JSON.stringify(contas);
  }

  private findContaIndex(conta : Conta): number{
    const contas = this.getContas();
    for (let i = 0; i < contas.length; i++){
      if (contas[i].id === conta.id)
        return i;
    }
    return Number(-1);
  }

  updateConta(conta: Conta){
    const index = this.findContaIndex(conta);
    const contas = this.getContas();
    contas[index] = conta;
    localStorage['contas'] = JSON.stringify(contas);
  }

  deleteConta(conta: Conta){
    const data = localStorage['contaSel'];
    if (data){
      const contaSel = JSON.parse(data);
      if (contaSel.id == conta.id)
        localStorage.removeItem('contaSel');
    }
    const index = this.findContaIndex(conta);
    const contas = this.getContas();
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
