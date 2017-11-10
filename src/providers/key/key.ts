import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Classes em ordem alfabética
 */
enum KeyIndex{
  backup = 0,
  conta = 1,
  nota = 2,
  parcelamento = 3,
  transacao = 4
};
/*
  Generated class for the KeyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class KeyProvider {

  constructor(public http: Http) {
    this.initialize();
  }

  /**
   * Se nenhuma key foi gerada ainda ele seta 0 em todas as keys e guarda no banco local
   */
  initialize(){
    const data = localStorage['keyGen'];
    if (!data){
      const array = new Array<Number>();
      const keysLength = Object.keys(KeyIndex).length / 2;
      for (let i = 0; i < keysLength; i++){
        array.push(Number(0));
      }
      localStorage['keyGen'] = JSON.stringify(array);
    }
  }

  private getKey(index:number):number{
    const data = localStorage['keyGen'];
    const array = JSON.parse(data);
    const key = Number(array[index]+1); 
    array[index] = key;
    localStorage['keyGen'] = JSON.stringify(array);
    return key;
  }

  private setKey(index: number, key: number){
    const data = localStorage['keyGen'];
    const array = JSON.parse(data);
    array[index] = key;
    localStorage['keyGen'] = JSON.stringify(array);
  }

  genBackupKey():number{
    return this.getKey(KeyIndex.backup);
  }

  setBackupKey(key: number){
    this.setKey(KeyIndex.backup, key);
  }
  
  genContaKey():number{
    return this.getKey(KeyIndex.conta);
  }

  setContaKeyKey(key: number){
    this.setKey(KeyIndex.conta, key);
  }

  genNotaKey():number{
    return this.getKey(KeyIndex.nota);
  }

  setNotaKey(key: number){
    this.setKey(KeyIndex.nota, key);
  }
  
  genParcelamentoKey():number{
    return this.getKey(KeyIndex.parcelamento);
  }

  setParcelamentoKey(key: number){
    this.setKey(KeyIndex.parcelamento, key);
  }

  genTransacaoKey():number{
    return this.getKey(KeyIndex.transacao);
  }

  setTransacaoKey(key: number){
    this.setKey(KeyIndex.transacao, key);
  }

}
