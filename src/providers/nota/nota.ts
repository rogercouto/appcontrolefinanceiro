import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Nota } from '../../model';

export enum Visibilidade {
  ativas,
  arquivadas
}

@Injectable()
export class NotaProvider {

  constructor(public http: Http) {
  }

  /**
   * @param visibilidade:
   * 1: Ativas
   * 2: Inativas
   * 3: Todas
   */
  private getArray(visibilidade?: Visibilidade):Array<Nota>{
    const notas = new Array<Nota>();
    const data = localStorage['notas'];
    if (data){
      const array = JSON.parse(data);
      for (let object of array){
        if (visibilidade == Visibilidade.ativas && Boolean(object.arquivada))
          continue;
        else if (visibilidade == Visibilidade.arquivadas && !Boolean(object.arquivada))  
          continue;
        const nota = new Nota();
        nota.id = Number(object.id);
        nota.titulo = object.titulo;
        nota.texto = object.texto;
        nota.arquivada = Boolean(object.arquivada);
        notas.push(nota);
      }
    }
    return notas;
  }

  getAtivas():Array<Nota>{
    return this.getArray(Visibilidade.ativas);
  }

  getArquivadas():Array<Nota>{
    return this.getArray(Visibilidade.arquivadas);
  }
  
  getAll():Array<Nota>{
    return this.getArray();
  }

  insertNota(nota: Nota){
    nota.id = new Date().getTime();
    const notas = this.getAll();
    notas.push(nota);
    localStorage['notas'] = JSON.stringify(notas);
  }

  private findIndex(notaId: number, notas: Array<Nota>){
    for (let i = 0; i < notas.length; i++){
      if (notas[i].id == notaId)
        return i;
    }
    return -1;
  }

  updateNota(nota: Nota){
    const notas = this.getAll();
    const index = this.findIndex(nota.id, notas);
    notas[index] = nota;
    localStorage['notas'] = JSON.stringify(notas);
  }

  delete(nota: Nota){
    const notas = this.getAll();
    const index = this.findIndex(nota.id, notas);
    notas.splice(index, 1);
    localStorage['notas'] = JSON.stringify(notas);
  }

}
