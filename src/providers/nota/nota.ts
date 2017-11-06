import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Nota } from '../../model';

/*
  Generated class for the NotaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotaProvider {

  constructor(public http: Http) {
  }

  getNotas(vis?: number): Array<Nota>{
    const data = localStorage['notas'];
    if (data && vis != null && vis < 3){
      const tmpNotas = JSON.parse(data);
      const notas: Array<Nota> = [];
      if (vis == 1){
        for (let nota of tmpNotas){
            if (!nota.arquivada)
              notas.push(nota);
        }  
      }else if (vis == 2){
        for (let nota of tmpNotas){
          if (nota.arquivada)
            notas.push(nota);
        }
      }
      return notas;
    }
    return data? JSON.parse(data) as Array<Nota> : [];
  }

  insertNota(nota: Nota){
    nota.id = new Date().getTime();
    const notas = this.getNotas();
    notas.push(nota);
    localStorage['notas'] = JSON.stringify(notas);
  }

  private getNotaIndex(notaId: number, notas: Array<Nota>){
    for (let i = 0; i < notas.length; i++){
      if (notas[i].id == notaId)
        return i;
    }
    return -1;
  }

  updateNota(nota: Nota){
    const notas = this.getNotas();
    const index = this.getNotaIndex(nota.id, notas);
    notas[index] = nota;
    localStorage['notas'] = JSON.stringify(notas);
  }

  delete(nota: Nota){
    const notas = this.getNotas();
    const index = this.getNotaIndex(nota.id, notas);
    notas.splice(index, 1);
    localStorage['notas'] = JSON.stringify(notas);
  }

}
