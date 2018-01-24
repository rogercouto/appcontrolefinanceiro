import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map';

import { ContaProvider } from '../';
import { ConfigProvider } from '../config/config';//gambiarra pra solucionar bug
import { KeyProvider } from '../key/key';//gambiarra pra solucionar bug
import { Transacao, Conta} from '../../model';

@Injectable()
export class TransacaoProvider {

  constructor(public http: Http, 
    private contaProvider: ContaProvider, 
    private configProvider: ConfigProvider,
    private keyProvider: KeyProvider,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController)
  {}

  private precisaPagar(transacao: Transacao){
    if (transacao.dataHoraPagamento != null || !transacao.debitoAutomatico)
      return false;
    let venc = transacao.dataHoraVencimento;
    venc.setHours(0);
    venc.setMinutes(0);
    venc.setSeconds(0);
    venc.setMilliseconds(0);
    let hoje = new Date();
    hoje.setHours(0);
    hoje.setMinutes(0);
    hoje.setSeconds(0);
    hoje.setMilliseconds(0);
    if (hoje >= venc)
      return true;
    return false;    
  }

  getTransacao(object: any):Transacao{
    const transacao = new Transacao();
    transacao.id = Number(object.id);
    transacao.descricao = object.descricao;
    transacao.contaId = Number(object.contaId);
    transacao.valor = Number(object.valor);
    transacao.dataHoraVencimento = new Date(object.dataHoraVencimento);
    transacao.debitoAutomatico = object.debitoAutomatico;
    if (object.dataHoraPagamento != null)
      transacao.dataHoraPagamento = new Date(object.dataHoraPagamento);
    transacao.parcelamentoId = Number(object.parcelamentoId);
    transacao.numParcela = Number(object.numParcela);
    return transacao;
  }

  getAll(): Array<Transacao>{
    const transacoes = new Array<Transacao>();
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,2) == 't_'){
        const data = localStorage[key];
        if (data){
          const array = JSON.parse(data);
          for (let object of array){
            const transacao = this.getTransacao(object);
            transacoes.push(transacao);
          }
        }
      }
    }
    return transacoes;
  }

  getDateRange(): {min:string, max:string}{
    let minDate = new Date('2027-01-01');
    let maxDate = new Date('2017-01-01');
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,2) == 't_'){
        const stringArray = key.split('_');
        let date = new Date(stringArray[2]+'-01 00:00:00');
        if (date < minDate)
          minDate = date;
        if (date > maxDate)
          maxDate = date;
      }
    }
    maxDate.setDate(31);
    return {min: minDate.toISOString().substring(0,10), max: maxDate.toISOString().substring(0,10)};
  }

  mostraAlerta(titulo: string, mensagem: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensagem,
      buttons: ['Ok']
    });
    alert.present();
  }

  temSaldo(conta: Conta, array : Array<Transacao>): boolean {
    for (let object of array){
      const transacao = this.getTransacao(object);
      if (this.precisaPagar(transacao)){
        conta.saldo = Number(conta.saldo + transacao.valor);
        if (conta.saldo < conta.limite){
          return false;
        }
      }
    }
    return true;
  }

  getArray(contaId: number, periodo: string): Array<Transacao>{
    const transacoes = new Array<Transacao>();
    const conta = this.contaProvider.get(contaId);
    const key = 't_'+conta.id+'_'+periodo;
    const data = localStorage[key];
    if (data){
      const array = JSON.parse(data);
      let update = false;
      for (let object of array){
        const transacao = this.getTransacao(object);
        transacoes.push(transacao);
        if (this.precisaPagar(transacao)){
          conta.saldo = Number(conta.saldo + transacao.valor);
          if (conta.saldo >= conta.limite){
            transacao.dataHoraPagamento = new Date();
            update = true;
          }
        }
      }
      if (update){
        localStorage[key] = JSON.stringify(transacoes);//atualiza as transações
        this.contaProvider.update(conta);
      }
    }
    return transacoes;
  }

  insert(transacao: Transacao){
    const periodo = transacao.dataHoraVencimento.toISOString().substring(0, 7);
    const key = 't_'+transacao.contaId+'_'+periodo;
    const transacoes = this.getArray(transacao.contaId, periodo);
    transacao.id = this.keyProvider.genTransacaoKey();
    if (this.precisaPagar(transacao)){
      const conta = this.contaProvider.get(transacao.contaId);
      if (conta.saldo >= conta.getSaldoDisponivel()){
        conta.addValor(transacao.valor);
        this.contaProvider.update(conta);
        transacao.dataHoraPagamento = new Date();
      }else{
        this.mostraAlerta('Saldo insuficiente!','Pagamento em aberto!');
      }
    }else if (transacao.foiPaga()){
      const conta = this.contaProvider.get(transacao.contaId);
      conta.addValor(transacao.valor);
      this.contaProvider.update(conta);
    }
    transacoes.push(transacao);
    localStorage[key] = JSON.stringify(transacoes);
    this.atualizaNotificacoes();
  }

  insertFromBackup(object: any):number{
    const transacao = this.getTransacao(object);
    const periodo = transacao.dataHoraVencimento.toISOString().substring(0, 7);
    const key = 't_'+transacao.contaId+'_'+periodo;
    const transacoes = this.getArray(transacao.contaId, periodo);
    transacoes.push(transacao);
    localStorage[key] = JSON.stringify(transacoes);
    return transacao.id;
  }

  private findIndex(transacao: Transacao, transacoes: Array<Transacao>){
    for (let i = 0; i < transacoes.length; i++){
      if (transacoes[i].id === transacao.id)
        return i;
    }
    return Number(-1);
  }

  update(transacao: Transacao){
    const transacoes = this.getArray(transacao.contaId, transacao.getPeriodo());
    const index = this.findIndex(transacao, transacoes);
    const conta = this.contaProvider.get(transacao.contaId);
    let updateConta = false;
    if (!transacoes[index].foiPaga() && transacao.foiPaga()){
      conta.addValor(transacao.valor);
      updateConta = true;
    }else if (transacoes[index].foiPaga() && !transacao.foiPaga()){
      conta.subValor(transacao.valor);
      updateConta = true;
    }else if (transacoes[index].foiPaga() && transacao.foiPaga()){
      conta.subValor(transacoes[index].valor);
      conta.addValor(transacao.valor);
      updateConta = true;
    }
    transacoes[index] = transacao;
    const key = 't_'+transacao.contaId+'_'+transacao.getPeriodo();
    localStorage[key] = JSON.stringify(transacoes);
    if (updateConta){
      this.contaProvider.update(conta);
    }
    this.atualizaNotificacoes();
  }

  delete(transacao: Transacao){
    const conta = this.contaProvider.get(transacao.contaId);
    if (transacao.foiPaga()){
      conta.subValor(transacao.valor);
      this.contaProvider.update(conta);
    }
    const transacoes = this.getArray(transacao.contaId, transacao.getPeriodo());
    const index = this.findIndex(transacao, transacoes);
    transacoes.splice(index, 1);
    const key = 't_'+transacao.contaId+'_'+transacao.getPeriodo();
    localStorage[key] = JSON.stringify(transacoes);
    this.atualizaNotificacoes();
  }

  passouPrazo(transacao: Transacao){
    const horarioNot = this.configProvider.getHorarioNotificacao();
    const prazo = new Date(transacao.dataHoraVencimento);
    prazo.setHours(horarioNot.h);
    prazo.setMinutes(horarioNot.m);
    prazo.setSeconds(0);
    prazo.setMilliseconds(0);
    const agora = new Date();
    return agora >= prazo;
  }

  ignoraNotificacao(transacao: Transacao):boolean{    
    if (transacao.debitoAutomatico)  
      return true;
    if (transacao.dataHoraPagamento != null)
      return true;
    return false;
  }

  registraNotificacao(transacao: Transacao){
    const dataHoraNot = new Date(transacao.dataHoraVencimento);
    const debito = transacao.valor < 0;
    const valor = debito ? transacao.valor*-1 : transacao.valor;
    const horarioNot = this.configProvider.getHorarioNotificacao();
    dataHoraNot.setHours(horarioNot.h);
    dataHoraNot.setMinutes(horarioNot.m);
    let alert = this.alertCtrl.create({
      title: 'Notificação registrada: ',
      subTitle: 'Data:'+dataHoraNot.toLocaleString()+' Valor: '+valor,
      buttons: ['Ok']
    });
    alert.present();
    const msg = (debito?'Débito':'Crédito')+
      ' de R$ '+
      valor.toFixed(2).toString().replace('.',',')+
      ' referente a '+
      transacao.descricao+
      ' vencendo hoje!';
    this.localNotifications.schedule({
      title: 'Atenção',
      text: msg,
      at: dataHoraNot,
      data: { message: msg },
      led: 'FF0000'
    });
  }

  private daysInMonth(month: number, year: number):number{
      return 32 - new Date(year, month-1, 32).getDate();
  }

  private daysInPeriodo(key: string):number{
    const month = Number(key.substring(21, 23));
    const year = Number(key.substring(16, 20));
    return this.daysInMonth(month, year);
  }

  registraProximaNotificacao(transacao: Transacao){
    const dataHoraNot = new Date(transacao.dataHoraVencimento);
    const horarioNot = this.configProvider.getHorarioNotificacao();
    dataHoraNot.setHours(horarioNot.h);
    dataHoraNot.setMinutes(horarioNot.m);
    /*
    let alert = this.alertCtrl.create({
      title: 'Próxima notificação: ',
      subTitle: 'Data:'+dataHoraNot.toLocaleString(),
      buttons: ['Ok']
    });
    alert.present();
    */
    this.localNotifications.schedule({
      title: 'Atenção',
      text: 'Você tem transações pendentes para hoje!',
      at: dataHoraNot,
      data: { message: 'Você tem transações pendentes para hoje!' },
      led: 'FF0000'
    });
  }
  
  atualizaNotificacoes(){
    if (!this.configProvider.isNotificacoesAtivas() && !this.configProvider.isNotificaCalendario())
      return;
    this.localNotifications.cancelAll();
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,2) == 't_'){
        const lastDay = this.daysInPeriodo(key);
        const strDate = key.substring(16, 23)+"-"+lastDay+" 23:59:59";
        const date = new Date(strDate);
        const now = new Date();
        if(now >= date)
          continue;
        const data = localStorage[key];
        if (!data)
          continue;
        let transacoes = JSON.parse(data) as Array<Transacao>;
        transacoes.sort(function(t1:Transacao,t2:Transacao){
          return  (new Date(t1.dataHoraVencimento).getTime() - new Date(t2.dataHoraVencimento).getTime());
        });
        for (let transacao of transacoes) {
          if (!this.ignoraNotificacao(transacao) && !this.passouPrazo(transacao)){
            this.registraProximaNotificacao(transacao);
            return;
          }
        }  
      }
    }
  }

}
