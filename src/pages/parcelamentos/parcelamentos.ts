import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Parcelamento, Conta } from '../../model';
import { ParcelamentoPage } from '../../pages';
import { ParcelamentoProvider, ContaProvider, ConfigProvider } from '../../providers';
/**
 * Generated class for the ParcelamentosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parcelamentos',
  templateUrl: 'parcelamentos.html',
})
export class ParcelamentosPage {

  private conta: Conta;
  private parcelamentos : Array<Parcelamento>;
  private periodo: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private parcelamentoProvider: ParcelamentoProvider,
    private contaProvider: ContaProvider,
    private configProvider: ConfigProvider
  ) {
    this.periodo = new Date().toISOString().substring(0, 7);
    this.refresh();
  }
  
  refresh(){
    this.conta = this.contaProvider.get(this.configProvider.getIdContaSel());
    this.parcelamentos = this.parcelamentoProvider.getArray(this.conta, this.periodo);
  }

  ionViewDidLoad() {
  }

  novoParcelamento(){
    this.navCtrl.push(ParcelamentoPage, {parcelamentoParam: null});
  }
  
  editaParcelamento(parcelamento: Parcelamento){
    this.navCtrl.push(ParcelamentoPage, {parcelamentoParam: parcelamento});
  }

}
