import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map';

import { ContaProvider } from '../';
import { ConfigProvider } from '../config/config';//gambiarra pra solucionar bug
import { Conta, Transacao} from '../../model';

/*
  Generated class for the TransacaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransacaoProvider {

  constructor(public http: Http, 
    private contaProvider: ContaProvider, 
    private configProvider: ConfigProvider,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController)
  {}

  getTransacoes(conta: Conta, periodo: string): Array<Transacao>{
    const key = 't_'+conta.id+'_'+periodo;
    const data = localStorage[key];
    if (data){
      let transacoes = JSON.parse(data) as Array<Transacao>;  
      let update = false;
      for (let transacao of transacoes) {
          transacao.valor = Number(transacao.valor); //gambi
          transacao.dataHoraVencimento = new Date(transacao.dataHoraVencimento); //gambi 2
          if (transacao.dataHoraPagamento == null && transacao.debitoAutomatico){
            let venc = new Date(transacao.dataHoraVencimento);
            venc.setHours(0);
            venc.setMinutes(0);
            venc.setSeconds(0);
            venc.setMilliseconds(0);
            let hoje = new Date();
            hoje.setHours(0);
            hoje.setMinutes(0);
            hoje.setSeconds(0);
            hoje.setMilliseconds(0);
            if (hoje >= venc){
                transacao.dataHoraPagamento = new Date();
                conta.saldo = Number(conta.saldo + transacao.valor);
                update = true;
            }
          }
      }
      if (update){
        localStorage[key] = JSON.stringify(transacoes);
        this.contaProvider.updateConta(conta);
      }
      return transacoes;
    }
    return [];
  }

  insertTransacao(conta: Conta, transacao: Transacao){
    const periodo = transacao.dataHoraVencimento.toISOString().substring(0, 7);
    const key = 't_'+conta.id+'_'+periodo;
    const transacoes : Array<Transacao> = this.getTransacoes(conta, periodo);
    transacao.dataHoraVencimento = new Date(transacao.dataHoraVencimento);//gambi
    transacao.id = new Date().getTime();
    transacoes.push(transacao);
    localStorage[key] = JSON.stringify(transacoes);
    this.atualizaNotificacoes();
  }

  private findTransacaoIndex(conta: Conta, transacao : Transacao): number{
    const periodo = transacao.dataHoraVencimento.toISOString().substring(0, 7);
    const transacoes = this.getTransacoes(conta, periodo);
    for (let i = 0; i < transacoes.length; i++){
      if (transacoes[i].id === transacao.id)
        return i;
    }
    return Number(-1);
  }

  updateTransacao(conta: Conta, transacao: Transacao){
    const periodo = transacao.dataHoraVencimento.toISOString().substring(0, 7);
    const transacoes = this.getTransacoes(conta, periodo);
    const index = this.findTransacaoIndex(conta, transacao);
    let updateConta = false;
    if (transacoes[index].dataHoraPagamento == null && transacao.dataHoraPagamento != null){
      //pagamento
      conta.saldo = Number(conta.saldo+transacao.valor);  
      updateConta = true;
    }else if (transacoes[index].dataHoraPagamento != null && transacao.dataHoraPagamento == null){
      //cancelamento de pagamento
      conta.saldo = Number(conta.saldo-transacao.valor);  
      updateConta = true;
    }
    transacoes[index] = transacao;
    const key = 't_'+conta.id+'_'+periodo;
    localStorage[key] = JSON.stringify(transacoes);
    if (updateConta){
      this.contaProvider.updateConta(conta);
    }
    this.atualizaNotificacoes();
  }

  deleteTransacao(conta: Conta, transacao: Transacao){
    if (transacao.dataHoraPagamento != null){
      conta.saldo = Number(conta.saldo-transacao.valor);
      //atualiza o saldo da conta caso já tenha sido paga
      this.contaProvider.updateConta(conta);
    }
    const periodo = transacao.dataHoraVencimento.toISOString().substring(0, 7);
    const transacoes = this.getTransacoes(conta, periodo);
    const index = this.findTransacaoIndex(conta, transacao);
    transacoes.splice(index ,1);
    const key = 't_'+conta.id+'_'+periodo;
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

  daysInMonth(month: number, year: number):number{
      return 32 - new Date(year, month-1, 32).getDate();
  }

  daysInPeriodo(key: string):number{
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

  atualizaNotificacoesOld(){
    this.localNotifications.cancelAll(); //Cancela todas as notificações
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,2) == 't_'){
        const data = localStorage[key];
        if (data){
          let transacoes = JSON.parse(data) as Array<Transacao>;  
          for (let transacao of transacoes) {
            if (this.ignoraNotificacao(transacao) || this.passouPrazo(transacao))
              continue;
            if (this.configProvider.isNotificacoesAtivas()){
              this.registraNotificacao(transacao);
            }
            if (this.configProvider.isNotificaCalendario()){
              //console.log('Criar notificação no calendário!');
            }
          }
        }
      }
      
    }
  }
  
}
