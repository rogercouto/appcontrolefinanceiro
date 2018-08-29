import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { ConfigProvider } from '../config/config';
import { Backup, Conta, Nota, Transacao, Parcelamento } from '../../model';
/*
  Generated class for the BackupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackupProvider {

  private readonly TEST_URL = 'http://localhost:8080/home';
  private readonly BACKUP_URL = 'http://localhost:8080/backup';
  private readonly CONTA_URL = 'http://localhost:8080/conta';
  private readonly NOTA_URL = 'http://localhost:8080/nota';
  private readonly TRANSACAO_URL = 'http://localhost:8080/transacao';
  private readonly PARCELAMENTO_URL = 'http://localhost:8080/parcelamento';

  public headers: Headers;

  constructor(public http: Http, private configProvider: ConfigProvider) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  salvaBackup(backup: Backup): Observable<String>{
    return this.http.post(this.BACKUP_URL + '/insert', JSON.stringify(backup), { headers: this.headers})
    .map(() => ('Backup realizado com sucesso!')).catch(error => 'e');
  }

  salvaContas(contas: Array<any>): Observable<String>{
    return this.http.post(this.CONTA_URL + '/insert', JSON.stringify(contas), { headers: this.headers})
    .map(() => ('Contas salvas com sucesso!'));
  }

  salvaNotas(notas: Array<any>): Observable<String>{
    return this.http.post(this.NOTA_URL + '/insert', JSON.stringify(notas), { headers: this.headers})
    .map(() => ('Notas salvas com sucesso!'));
  }

  salvaTransacoes(transacoes: Array<any>): Observable<String>{
    return this.http.post(this.TRANSACAO_URL + '/insert', JSON.stringify(transacoes), { headers: this.headers})
    .map(() => ('Transações salvas com sucesso!'));
  }

  salvaParcelamentos(parcelamentos: Array<any>): Observable<String>{
    return this.http.post(this.PARCELAMENTO_URL + '/insert', JSON.stringify(parcelamentos), { headers: this.headers})
    .map(() => ('Parcelamentos salvos com sucesso!'));
  }

  testaConnexao():Observable<String>{
    return this.http.get(this.TEST_URL).map(() => ('Conexão efetuada com sucesso!')).catch(error => 'e');
  }

  restauraBackup(): Observable<Array<Backup>> {
    return this.http.get(this.BACKUP_URL + '/list?usuarioId='+this.configProvider.getUsuarioId())
      .map(response => response.json()).catch(error => Observable.throw(error));
  }

  restauraContas(backupId: number): Observable<Array<Conta>>{
    return this.http.get(this.CONTA_URL + '/list?backupId='+backupId)
      .map(response => response.json());
  }
  restauraNotas(backupId: number): Observable<Array<Nota>>{
    return this.http.get(this.NOTA_URL + '/list?backupId='+backupId)
      .map(response => response.json());
  }
  restauraTransacoes(backupId: number): Observable<Array<Transacao>>{
    return this.http.get(this.TRANSACAO_URL + '/list?backupId='+backupId)
      .map(response => response.json());
  }
  restauraParcelamentos(backupId: number): Observable<Array<Parcelamento>>{
    return this.http.get(this.PARCELAMENTO_URL + '/list?backupId='+backupId)
      .map(response => response.json());
  }

}
