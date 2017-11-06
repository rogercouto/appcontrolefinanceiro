import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TransacoesPage } from '../../pages';
import { Transacao, Conta } from '../../model';
import { TransacaoProvider } from '../../providers';
/**
 * Generated class for the DebitoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-debito',
  templateUrl: 'debito.html',
})
export class DebitoPage {

  public valid: boolean = false;
  public conta: Conta;
  public transacao: Transacao;
  public dataVenc: string;

  public colors: Array<string> = ["dark","dark","dark"];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private transacaoProvider: TransacaoProvider
  ) {
    this.conta = navParams.get("contaParam");
    if (navParams.get("transacaoParam")!= null){
      this.transacao = navParams.get("transacaoParam");
      this.dataVenc = this.transacao.dataHoraVencimento.toISOString().substring(0,10);
      if (this.transacao.valor < 0)
        this.transacao.valor *= -1;
    }else{
      this.transacao = new Transacao();
    } 
  }

  checkDescr(): void{
    if (this.transacao.descricao != undefined && this.transacao.descricao.length > 0){
      this.colors[0] = "secondary";
    }else{
      this.colors[0] = "danger";
    }
    this.checkForm();
  }

  checkValor(): void{
    if (this.transacao.valor != undefined && this.transacao.valor != 0){
      this.colors[1] = "secondary";
    }else{
      this.colors[1] = "danger";
    }
    this.checkForm();
  }

  checkVenc(): void{
    if (this.dataVenc != undefined){
      this.colors[2] = "secondary";
    }else{
      this.colors[2] = "danger";
    }
    this.checkForm();
  }

  checkForm(): void{
    if (this.transacao.descricao == undefined
      || this.transacao.valor == undefined
      || this.dataVenc == undefined)
    {
        this.valid = false;
      }else{
        this.valid = true;
    }
  }

  salvaDebito(){
    if (this.transacao.valor > 0)
      this.transacao.valor *= -1;
    this.transacao.dataHoraVencimento = new Date(this.dataVenc+' 00:00:00');
    if (this.transacao.id == null)
      this.transacaoProvider.insertTransacao(this.conta, this.transacao);
    else
      this.transacaoProvider.updateTransacao(this.conta, this.transacao);
      //tirei notificação daqui
    this.navCtrl.setRoot(TransacoesPage, { contaParam : this.conta});
  }

  ionViewDidLoad() {
  }

}
