import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Nota } from '../../model';
import { KeyProvider } from '../../providers/key/key';

export enum Visibilidade {
  ativas,
  arquivadas
}

@Injectable()
export class NotaProvider {

  constructor(public http: Http, private keyProvider: KeyProvider) {
  }

  private getNota(object: any):Nota{
    const nota = new Nota();
    nota.id = Number(object.id);
    nota.titulo = object.titulo;
    nota.texto = object.texto;
    nota.arquivada = Boolean(object.arquivada);
    return nota;
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
        notas.push(this.getNota(object));
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

  insert(nota: Nota){
    nota.id = this.keyProvider.genNotaKey();
    const notas = this.getAll();
    notas.push(nota);
    localStorage['notas'] = JSON.stringify(notas);
  }

  insertFromBackup(object: any):number{
    const nota = this.getNota(object);
    const notas = this.getAll();
    notas.push(nota);
    localStorage['notas'] = JSON.stringify(notas);
    return nota.id;
  }

  private findIndex(notaId: number, notas: Array<Nota>){
    for (let i = 0; i < notas.length; i++){
      if (notas[i].id == notaId)
        return i;
    }
    return -1;
  }

  update(nota: Nota){
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
