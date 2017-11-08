import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ContaProvider, TransacaoProvider } from '../';
import { Parcelamento, Conta, Transacao} from '../../model';

/*
  Generated class for the ParcelamentoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParcelamentoProvider {

  constructor(public http: Http, 
    private contaProvider: ContaProvider, 
    private transacaoProvider: TransacaoProvider) {
  }

  insert(parcelamento: Parcelamento){
    const conta = this.contaProvider.get(parcelamento.contaId);
    const periodo = parcelamento.dataIni.toISOString().substring(0,7);
    const key = 'p_'+conta.id+'_'+periodo;
    const parcelamentos = this.getArray(conta, periodo);
    parcelamentos.push(parcelamento);
    localStorage[key] = JSON.stringify(parcelamentos);
    const data = parcelamento.dataIni;
    const valorParcela = Number(Math.round((parcelamento.valorTotal / parcelamento.numParcelas) * 100) / 100);
    for (let i = 0; i < parcelamento.numParcelas; i++){
      const num = i+1;
      const transacao = new Transacao();
      transacao.contaId = conta.id;
      transacao.descricao = parcelamento.descricao+" - "+num+"/"+parcelamento.numParcelas;
      transacao.dataHoraVencimento = data;
      if (i == 0 && parcelamento.entrada)
        transacao.dataHoraPagamento = data;
      if (i == 0){
        transacao.valor = Number(parcelamento.valorTotal - ((parcelamento.numParcelas-1)*valorParcela));
        if (parcelamento.entrada){
          transacao.dataHoraPagamento = data;
          conta.saldo = Number(conta.saldo + transacao.valor);
          this.contaProvider.update(conta);
        }
      }else{
        transacao.valor = valorParcela;
      } 
      this.transacaoProvider.insert(transacao);
      data.setMonth(data.getMonth()+1);
    }
  }

  getArray(conta: Conta, periodo: string):Array<Parcelamento>{
    const key = 'p_'+conta.id+'_'+periodo;
    const data = localStorage[key];
    if (data){
      const array = JSON.parse(data);
      const result = new Array<Parcelamento>();
      for (let object of array){
        const parcelamento = new Parcelamento();
        parcelamento.id = object.id;
        parcelamento.contaId = object.contaId;
        parcelamento.descricao = object.descricao;
        parcelamento.dataIni = new Date(object.dataIni);
        parcelamento.numParcelas = object.numParcelas;
        parcelamento.valorTotal = Number(object.valorTotal);
        parcelamento.entrada = object.entrada;
        result.push(parcelamento);
      }
      return result;
    }
    return new Array<Parcelamento>();
  }
  

}
