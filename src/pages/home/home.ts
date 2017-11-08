import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ContaProvider, ConfigProvider } from '../../providers';
import { Conta } from '../../model';
import { ContaPage, TransferenciaPage } from '../../pages';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private contas: Array<Conta>;
  private contaSel: Conta = null;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private contaProvider : ContaProvider,
    private configProvider: ConfigProvider,
    private alertCtrl: AlertController ) 
    {      
      this.contas = this.contaProvider.getAll();
      const contaId = this.configProvider.getIdContaSel();
      this.contaSel = this.configProvider.getContaById(contaId, this.contas);
    }

   isSel(conta : Conta) : boolean{
    if (conta == null || this.contaSel == null)
      return false;
    if (conta.id == this.contaSel.id)
      return true;
    return false;
  }

  selecionaConta(conta: Conta){
    this.contaSel = conta;
    this.configProvider.selecionaConta(this.contaSel.id);
  }

  insereConta(){
    this.navCtrl.push(ContaPage, {contaParam: null});
  }

  editaConta(conta: Conta){
    this.navCtrl.push(ContaPage, {contaParam: conta});
  }

  transfereValor(conta: Conta){
    this.navCtrl.push(TransferenciaPage, {contaParam: conta});
  }

  excluiConta(conta: Conta){
    let prompt = this.alertCtrl.create({
      title: 'Atenção!',
      message: 'Deseja mesmo excluir a conta? ',
      buttons : [
       {
         text: "Sim",
         handler: data => {
          this.contaProvider.delete(conta);
          this.contas = this.contaProvider.getAll();
         }
       },
       {
         text: "Cancelar"
       }
      ]
      });
      prompt.present();
  }
}
