import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ConfigProvider, TransacaoProvider } from '../../providers';
/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  private time: string;
  private notificacoesAtivas: boolean;
  private notificaCalendario: boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private configProvider: ConfigProvider,
    private transacaoProvider: TransacaoProvider
  ) {
    this.notificacoesAtivas = this.configProvider.isNotificacoesAtivas();
    const horario = this.configProvider.getHorarioNotificacao();
    this.time = '';
    if (horario.h < 10)
      this.time += '0';
    this.time += horario.h;
    this.time += ':';
    if (horario.m < 10)
      this.time += '0';
    this.time += horario.m;
    this.notificaCalendario = this.configProvider.isNotificaCalendario();
  }

  ionViewDidLoad() {}

  salvarConfigs(){
    this.configProvider.setNotificacoesAtivas(this.notificacoesAtivas);
    const h = Number(this.time.substring(0,2));
    const m = Number(this.time.substring(3,5));
    this.configProvider.setHorarioNotificacao(h, m);
    this.configProvider.setNotificacaoCalendario(this.notificaCalendario);
    this.transacaoProvider.atualizaNotificacoes();
  }

}
