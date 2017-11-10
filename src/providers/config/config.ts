import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Conta, Usuario } from '../../model';

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

  getUsuarioId(){
    const usuario = this.getUsuario();
    if (usuario == null){
      console.log('Usuário não está logado');
      return 0;
    }
    return usuario.id;
  }

  setUsuario(usuario: Usuario){
    if (usuario == null){
      localStorage.removeItem('usuario');
      return;
    }
    localStorage['usuario'] = JSON.stringify(usuario);
  }

  getUsuario():Usuario{
    const data = localStorage['usuario'];
    if (data){
      const object = JSON.parse(data);
      return new Usuario(
        object.id,
        object.email,
        object.senha
      );
    }
    return null;
  }

  testaConnexao():Observable<String>{
    return this.http.get('http://localhost:8080/home')
      .map(() => ('Conexão efetuada com sucesso!')).catch(error => 'e');
  }
  
  login(email: string, senha: string): Observable<Array<Usuario>> {
    return this.http.get('http://localhost:8080/usuario/login?email='+email+'&senha='+senha)
      .map(response => response.json()).catch(error => 'e');
  }

  autoLogin(email: string, senha: string): Observable<Array<Usuario>> {
    return this.http.get('http://localhost:8080/usuario/autologin?email='+email+'&senha='+senha)
      .map(response => response.json()).catch(error => 'e');
  }

}
