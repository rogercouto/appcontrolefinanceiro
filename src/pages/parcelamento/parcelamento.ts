import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ParcelamentosPage } from '../../pages';
import { Parcelamento } from '../../model';
import { ParcelamentoProvider, ConfigProvider } from '../../providers';

/**
 * Generated class for the ParcelamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parcelamento',
  templateUrl: 'parcelamento.html',
})
export class ParcelamentoPage {

  private parcelamento: Parcelamento;

  private tipo: string = 'debito';
  private tipoValor: string = 'total';
  private valor: number;
  private dataIni: string;
  private valorCalculado: string = '0,00';
  private valid: boolean;

  private colors = ["dark","dark","dark","dark"];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private parcelamentoProvider: ParcelamentoProvider,
    private configProvider: ConfigProvider
  ) {
    if (this.navParams.get('parcelamentoParam') != null){
      this.parcelamento = this.navParams.get('parcelamentoParam');
      this.dataIni = this.parcelamento.getDataIniStr();
      this.valor = this.parcelamento.valorTotal *-1;
      this.checkForm();
    }else{
      this.parcelamento = new Parcelamento();
    }
    this.parcelamento.contaId = this.configProvider.getIdContaSel();
  }

  ionViewDidLoad() {
  }

  checkDescr(): void{
    if (this.parcelamento.descricao != undefined && this.parcelamento.descricao.length > 0){
      this.colors[0] = "secondary";
    }else{
      this.colors[0] = "danger";
    }
    this.checkForm();
  }

  checkData(): void{
    if (this.dataIni != undefined){
      this.colors[1] = "secondary";
    }else{
      this.colors[1] = "danger";
    }
    this.checkForm();
  }

  checkValor(): void{
    if (this.valor != undefined && this.valor != 0){
      this.colors[2] = "secondary";
    }else{
      this.colors[2] = "danger";
    }
    this.checkForm();
  }

  checkParcelas(): void{
    if (this.parcelamento.numParcelas != undefined && this.parcelamento.numParcelas != 0){
      this.colors[3] = "secondary";
    }else{
      this.colors[3] = "danger";
    }
    this.checkForm();
  }

  checkForm(): void{
    if (this.valor != undefined && 
      this.valor != 0 && 
      this.parcelamento.numParcelas != undefined 
      && this.parcelamento.numParcelas > 0
    ){
      let tmp;
      if (this.tipoValor == 'total'){
        tmp = Number(this.valor / this.parcelamento.numParcelas);
      }else{
        tmp = Number(this.valor * this.parcelamento.numParcelas);
      }
      this.valorCalculado = tmp.toFixed(2).replace('.',',');
    }else{
      this.valorCalculado = '0,00';
    }
    if (this.parcelamento.descricao == undefined
      || this.valor == undefined
      || this.dataIni == undefined
      || this.parcelamento.numParcelas == undefined
    ){
        this.valid = false;
      }else{
        this.valid = true;
    }
  }

  salvaParcelamento(){
    this.parcelamento.numParcelas = Number(this.parcelamento.numParcelas);//anti-bug
    const tmpValor = this.tipoValor=='total' ? this.valor : (this.valor * this.parcelamento.numParcelas);
    this.parcelamento.valorTotal = Number(tmpValor * -1);
    this.parcelamento.dataIni = new Date(this.dataIni+' 00:00:00');
    if (this.parcelamento.id == null){
      this.parcelamento.id = new Date().getTime();
      this.parcelamentoProvider.insert(this.parcelamento);
    }else{
      console.log("Não implementado ainda!");
    }
    this.navCtrl.setRoot(ParcelamentosPage);
  }

  excluiParcelamento(){
    console.log("Não implementado ainda!");
  }

}
