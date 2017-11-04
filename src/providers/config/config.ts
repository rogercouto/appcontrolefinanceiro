import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Conta } from '../../model';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  constructor(public http: Http) {
  }

  selectionaConta(id : number){
    localStorage['contaSel'] = JSON.stringify(id);
  }

  getIdContaSel() : number{
    const data = localStorage['contaSel'];
    return data ? JSON.parse(data) : null;
  }

  getContaById(id: number, contas: Array<Conta>) : Conta{
    for (let conta of contas){
      if (id == conta.id)
        return conta;
    }
    return null;
  }


  selectionaPagina(index : number){
    localStorage['paginaSel'] = JSON.stringify(index);
  }

  getPaginaSel() : number{
    const data = localStorage['paginaSel'];
    return data ? Number(JSON.parse(data)) : Number(0);
  }

}
