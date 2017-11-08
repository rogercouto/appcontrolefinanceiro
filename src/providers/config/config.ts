import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Conta } from '../../model';

@Injectable()
export class ConfigProvider {

  constructor(public http: Http) {
  }

  selecionaConta(id : number){
    localStorage['contaSel'] = JSON.stringify(id);
  }

  getIdContaSel() : number{
    const data = localStorage['contaSel'];
    return data ? Number(JSON.parse(data)) : null;
  }

  getContaById(id: number, contas: Array<Conta>) : Conta{
    for (let conta of contas){
      if (id == conta.id)
        return conta;
    }
    return null;
  }

  selecionaPagina(index : number){
    localStorage['paginaSel'] = JSON.stringify(index);
  }

  getPaginaSel() : number{
    const data = localStorage['paginaSel'];
    return data ? Number(JSON.parse(data)) : Number(0);
  }

  getHorarioNotificacao() : {h: number, m: number}{
    const data = localStorage['horarioNot'];
    return data ? JSON.parse(data): {h:0, m:0};
  }

  setHorarioNotificacao(horas: number, minutos:number){
    const hn = {h:horas, m:minutos}
    localStorage['horarioNot'] = JSON.stringify(hn);
  }
  
  setNotificacoesAtivas(notificacoesAtivas: boolean){
    localStorage['notificacoesAtivas'] = JSON.stringify(notificacoesAtivas);
  }

  isNotificacoesAtivas(): boolean{
    const data = localStorage['notificacoesAtivas'];
    return data ? Boolean(JSON.parse(data)) : false;
  }

  setNotificacaoCalendario(usaCalendario: boolean){
    localStorage['usaCalendario'] = JSON.stringify(usaCalendario);
  }

  isNotificaCalendario(): boolean{
    const data = localStorage['usaCalendario'];
    return data ? Boolean(JSON.parse(data)) : false;
  }

}
