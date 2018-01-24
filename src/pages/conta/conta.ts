import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Conta, Transacao } from '../../model';
import { ContaProvider, TransacaoProvider } from '../../providers';
import { HomePage } from '../../pages';

/**
 * Generated class for the ContaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conta',
  templateUrl: 'conta.html',
})
export class ContaPage {

  public valid: boolean = false;
  public conta: Conta;

  public descrColor: string = "dark";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private contaProvider: ContaProvider, 
    private transacaoProvider: TransacaoProvider
  ) {
    if (navParams.get("contaParam")){
      this.conta = navParams.get("contaParam");
      this.valid = true;
    }else{
      this.conta = new Conta();
    }
  }

  checkForm(): void{
    if (this.conta.descricao != undefined && this.conta.descricao.length > 0){
      this.descrColor = "secondary";
      this.valid = true;
    }else{
      this.descrColor = "danger";
      this.valid = false;
    }
  }

  salvaConta(){
    let ajuste = 0;
    if (this.conta.id != undefined){
      const oldConta = this.contaProvider.get(this.conta.id);
      if (oldConta.saldo != this.conta.saldo){
        ajuste = this.conta.saldo - oldConta.saldo;
      }
    }
    if (this.conta.saldo == undefined)
      this.conta.saldo = Number(0);
    else
      this.conta.saldo = Number(this.conta.saldo);
    if (this.conta.limite == undefined)
      this.conta.limite = Number(0);
    else
      this.conta.limite = Number(this.conta.limite);  
    
    if (this.conta.id == null)
      this.contaProvider.insert(this.conta);
    else{
      if (ajuste != 0){
        const transacao = new Transacao();
        transacao.descricao = 'Ajuste';
        transacao.valor = Number(ajuste);
        transacao.contaId = this.conta.id;
        const now = new Date();
        transacao.dataHoraVencimento = now;
        transacao.dataHoraPagamento = now;
        transacao.debitoAutomatico = false;
        this.transacaoProvider.insert(transacao);
      }
      this.contaProvider.update(this.conta);
    }
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {
  }

}
