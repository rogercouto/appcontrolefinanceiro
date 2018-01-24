import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ContaProvider, TransacaoProvider } from '../';
import { Parcelamento, Conta, Transacao} from '../../model';

@Injectable()
export class ParcelamentoProvider {

  constructor(public http: Http, 
    private contaProvider: ContaProvider, 
    private transacaoProvider: TransacaoProvider) {
  }

  private getParcelamento(object: any):Parcelamento{
    const parcelamento = new Parcelamento();
    parcelamento.id = object.id;
    parcelamento.contaId = object.contaId;
    parcelamento.descricao = object.descricao;
    parcelamento.dataIni = new Date(object.dataIni);
    parcelamento.numParcelas = object.numParcelas;
    parcelamento.valorTotal = Number(object.valorTotal);
    parcelamento.entrada = object.entrada;
    parcelamento.debitoAutomatico = object.debitoAutomatico;
    return parcelamento;
  }

  getAll(): Array<Parcelamento>{
    const parcelamentos = new Array<Parcelamento>();
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,2) == 'p_'){
        const data = localStorage[key];
        if (data){
          const array = JSON.parse(data);
          for (let object of array){
            parcelamentos.push(this.getParcelamento(object));
          }
        }
      }
    }
    return parcelamentos;
  }

  getDateRange(): {min:string, max:string}{
    let minDate = new Date('2027-01-01');
    let maxDate = new Date('2017-01-01');
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,2) == 'p_'){
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

  getArray(conta: Conta, periodo: string):Array<Parcelamento>{
    const parcelamentos = new Array<Parcelamento>();
    const key = 'p_'+conta.id+'_'+periodo;
    const data = localStorage[key];
    if (data){
      const array = JSON.parse(data);
      for (let object of array){
        parcelamentos.push(this.getParcelamento(object));
      }
    }
    return parcelamentos;
  }
  
  private insertParcelas(conta: Conta, parcelamento: Parcelamento){
    const data = parcelamento.dataIni;
    const valorParcela = Number(Math.round((parcelamento.valorTotal / parcelamento.numParcelas) * 100) / 100);
    for (let i = 0; i < parcelamento.numParcelas; i++){
      const num = i+1;
      const transacao = new Transacao();
      transacao.parcelamentoId = parcelamento.id;
      transacao.numParcela = Number(num);
      transacao.contaId = conta.id;
      transacao.descricao = parcelamento.descricao+" - "+num+"/"+parcelamento.numParcelas;
      transacao.dataHoraVencimento = data;
      transacao.debitoAutomatico =  parcelamento.debitoAutomatico;
      if (i == 0 && parcelamento.entrada)
        transacao.dataHoraPagamento = data;
      if (i == 0){
        transacao.valor = Number(parcelamento.valorTotal - ((parcelamento.numParcelas-1)*valorParcela));
        if (parcelamento.entrada){
          transacao.dataHoraPagamento = data;
          //conta.saldo = Number(conta.saldo + transacao.valor);
          this.contaProvider.update(conta);
        }
      }else{
        transacao.valor = valorParcela;
      } 
      this.transacaoProvider.insert(transacao);
      data.setMonth(data.getMonth()+1);
    }
  }

  insert(parcelamento: Parcelamento){
    const conta = this.contaProvider.get(parcelamento.contaId);
    const periodo = parcelamento.dataIni.toISOString().substring(0,7);
    const key = 'p_'+conta.id+'_'+periodo;
    const parcelamentos = this.getArray(conta, periodo);
    parcelamentos.push(parcelamento);
    localStorage[key] = JSON.stringify(parcelamentos);
    this.insertParcelas(conta, parcelamento);   
  }

  insertFromBackup(object: any):number{
    const parcelamento = this.getParcelamento(object);
    const conta = this.contaProvider.get(parcelamento.contaId);
    const periodo = parcelamento.dataIni.toISOString().substring(0,7);
    const key = 'p_'+conta.id+'_'+periodo;
    const parcelamentos = this.getArray(conta, periodo);
    parcelamentos.push(parcelamento);
    localStorage[key] = JSON.stringify(parcelamentos);
    return parcelamento.id;
  }

  private getTransacao(object: any):Transacao{
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
  /**
   * Deleta todas as transações de um parcelamento
   * @param parcelamento
   */
  private deleteParcelas(parcelamento: Parcelamento){
    const conta = this.contaProvider.get(parcelamento.contaId);
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (key.substring(0,15) == 't_'+parcelamento.contaId){
        const data = localStorage[key];
        const array = JSON.parse(data);
        const transacoes = new Array<Transacao>();
        for (let object of array){
          const transacao = this.getTransacao(object);
          if (transacao.parcelamentoId != parcelamento.id){
            transacoes.push(transacao);
          }else{
            if (transacao.foiPaga())
              conta.subValor(transacao.valor);
          }
        }
        if (transacoes.length != array.length){
          localStorage[key] = JSON.stringify(transacoes);
        }
      }
    }
    this.contaProvider.update(conta);
  }

  private findIndex(parcelamento: Parcelamento, parcelamentos: Array<Parcelamento>):number{
    for (let i = 0; i < parcelamentos.length; i++){
      if (parcelamentos[i].id == parcelamento.id)
        return i;
    }
    return -1;
  }

  update(parcelamento: Parcelamento){
    this.deleteParcelas(parcelamento);
    const conta = this.contaProvider.get(parcelamento.contaId);
    const periodo = parcelamento.dataIni.toISOString().substring(0,7);
    const key = 'p_'+conta.id+'_'+periodo;
    const parcelamentos = this.getArray(conta, periodo);
    const index = this.findIndex(parcelamento, parcelamentos);
    parcelamentos[index] = parcelamento;
    localStorage[key] = JSON.stringify(parcelamentos);
    this.insertParcelas(conta, parcelamento);
  }

  delete(parcelamento: Parcelamento){
    this.deleteParcelas(parcelamento);
    const conta = this.contaProvider.get(parcelamento.contaId);
    const periodo = parcelamento.dataIni.toISOString().substring(0,7);
    const key = 'p_'+conta.id+'_'+periodo;
    const parcelamentos = this.getArray(conta, periodo);
    const index = this.findIndex(parcelamento, parcelamentos);
    parcelamentos.splice(index, 1);
    localStorage[key] = JSON.stringify(parcelamentos);
  }


}
