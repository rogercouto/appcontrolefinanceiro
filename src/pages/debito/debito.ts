import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

import { TransacoesPage } from '../../pages';
import { Transacao, Conta } from '../../model';
import { TransacaoProvider, ContaProvider, ConfigProvider } from '../../providers';
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
  public valor: string;
  public disableAuto: boolean = true;
  public local = "";

  public colors: Array<string> = ["dark","dark","dark"];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private transacaoProvider: TransacaoProvider,
    private contaProvider: ContaProvider,
    private configProvider: ConfigProvider,
    private calendar: Calendar,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
      .then((result: NativeGeocoderReverseResult) => this.local = result.locality.toString())
      .catch((error: any) => console.log(error));
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    if (navParams.get("transacaoParam")!= null){
      this.transacao = navParams.get("transacaoParam");
      this.dataVenc = this.transacao.dataHoraVencimento.toISOString().substring(0,10);
      this.transacao.valor *= -1;
      this.valor = Number(this.transacao.valor).toString();
    }else{
      this.transacao = new Transacao();
      this.transacao.contaId = navParams.get("contaIdParam");
    } 
    this.conta = this.contaProvider.get(this.transacao.contaId);
  }

  checkDescr(): void{
    if (this.transacao.descricao != undefined && this.transacao.descricao.length > 0){
      this.colors[0] = "secondary";
    }else{
      this.colors[0] = "danger";
    }
    this.checkForm();
  }

  checkAuto(){
    this.disableAuto = this.conta.getSaldoDisponivel() < Number(this.valor);
    if (this.dataVenc != undefined){
      const date = new Date(this.dataVenc+' 00:00:00'); 
      const now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      if (date > now){
        this.disableAuto = false;
      }
    }
  }

  checkValor(): void{
    if (Number(this.valor) != undefined && Number(this.valor) != 0){
      this.colors[1] = "secondary";
    }else{
      this.colors[1] = "danger";
    }
    this.checkAuto();
    this.checkForm();
  }

  checkVenc(): void{
    if (this.dataVenc != undefined){
      this.colors[2] = "secondary";
    }else{
      this.colors[2] = "danger";
    }
    this.checkAuto();
    this.checkForm();
  }

  checkForm(): void{
    if (this.transacao.descricao == undefined
      || this.valor == undefined
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
    this.transacao.valor = Number(this.valor);
    if (this.transacao.valor >= 0)
      this.transacao.valor = Number(this.transacao.valor*-1);
    if (this.transacao.id == null)
      this.transacaoProvider.insert(this.transacao);
    else
      this.transacaoProvider.update(this.transacao);
    if (!this.transacao.debitoAutomatico && this.configProvider.isNotificaCalendario()){
      const dataIni = this.transacao.dataHoraVencimento;
      const hNot = this.configProvider.getHorarioNotificacao();
      dataIni.setHours(hNot.h);
      dataIni.setMinutes(hNot.m);
      const dataFim = dataIni;
      dataFim.setHours(Number(hNot.h+1));
      const valor = (this.transacao.valor*-1).toFixed(0).replace('.',',');
      if (dataIni > new Date()){
        this.calendar.createEventInteractively("Débito: "+this.transacao.descricao+" - R$"+
          valor, this.local, null, dataIni, dataFim);
      }
    }  
    this.navCtrl.setRoot(TransacoesPage);
  }

  ionViewDidLoad() {}

}
