import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../../pages';
import { Conta, Transacao } from '../../model';
import { ContaProvider } from '../../providers/conta/conta';
import { TransacaoProvider } from '../../providers/transacao/transacao';
/**
 * Generated class for the TransferenciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transferencia',
  templateUrl: 'transferencia.html',
})
export class TransferenciaPage {

  private contas: Array<Conta> = [];

  private contaOrigem: Conta;
  private contaDestino: Conta;
  private descricaoOrigem: string;
  private descricaoDestino: string;
  private valor: number;
  private mesmaDescr: false;
  private valid: boolean = false;

  private colors: Array<string> = ["dark","dark","dark","dark"];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private contaProvider: ContaProvider, 
    private transacaoProvider: TransacaoProvider
  ) {
    this.contaOrigem = navParams.get("contaParam");
    const tmpContas = this.contaProvider.getContas();
    for(let conta of tmpContas){
      if (!this.comparaConta(conta, this.contaOrigem))
        this.contas.push(conta);
    }
  }

  ionViewDidLoad() {
  }

  comparaConta(c1: Conta, c2: Conta): boolean {
    return c1.id === c2.id;
  }
  
  selecionaConta(){
    this.colors[0] = "secondary";
    this.checkForm();
  }

  checkDescrOrigem(): void{
    if (this.descricaoOrigem != undefined && this.descricaoOrigem.length > 0){
      this.colors[1] = "secondary";
    }else{
      this.colors[1] = "danger";
    }
    this.checkForm();
  }

  checkDescrDestino(): void{
    if (this.descricaoDestino != undefined && this.descricaoDestino.length > 0){
      this.colors[2] = "secondary";
    }else{
      this.colors[2] = "danger";
    }
    this.checkForm();
  }

  checkValor(): void{
    if (this.valor != undefined && this.valor > 0){
      this.colors[3] = "secondary";
    }else{
      this.colors[3] = "danger";
    }
    this.checkForm();
  }

  checkForm(){
    if ( this.contaDestino == undefined
      || this.descricaoOrigem == undefined
      || (!this.mesmaDescr && this.descricaoDestino == undefined)
      || this.valor == undefined)
    {
        this.valid = false;
      }else{
        this.valid = true;
    }
  }

  confirma(){
    const now = new Date();
    const tOri = new Transacao();
    tOri.descricao = this.descricaoOrigem;
    tOri.valor = Number(this.valor * -1);
    tOri.dataHoraVencimento = now;
    tOri.dataHoraPagamento = now;
    this.transacaoProvider.insertTransacao(this.contaOrigem, tOri);
    const tDest = new Transacao();
    tDest.descricao = this.mesmaDescr ? this.descricaoOrigem : this.descricaoDestino;
    tDest.valor = Number(this.valor);
    tDest.dataHoraVencimento = now;
    tDest.dataHoraPagamento = now;
    this.transacaoProvider.insertTransacao(this.contaDestino, tDest);
    // se der tempo fazer essa parte na própria TransferenciaProvider
    this.contaOrigem.saldo = Number(this.contaOrigem.saldo-this.valor);
    this.contaProvider.updateConta(this.contaOrigem);
    this.contaDestino.saldo = Number(this.contaDestino.saldo+this.valor);
    this.contaProvider.updateConta(this.contaDestino);
    //
    this.navCtrl.setRoot(HomePage);
  }

}
