import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { ContaProvider } from '../';
import { Conta, Transacao} from '../../model';

/*
  Generated class for the TransacaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransacaoProvider {

  constructor(public http: Http, private contaProvider: ContaProvider) {
  }

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
  }

  
}
