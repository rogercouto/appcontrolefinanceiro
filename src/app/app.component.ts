import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AlertController } from 'ionic-angular';

import { HomePage, TransacoesPage, NotasPage, ParcelamentosPage, ConfigPage } from '../pages';
import { Conta } from '../model';
import { ContaProvider, TransacaoProvider, ConfigProvider } from '../providers';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  pages: Array<{title: string, component: any}>;
  page: {title: string, component: any};

  contas: Array<Conta>;
  conta: Conta;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen, 
    private contaProvider: ContaProvider,
    private transacaoProvider: TransacaoProvider,
    private configProvider: ConfigProvider,    
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController) 
    {
      this.giveAlert();
      this.initializeApp();
      this.pages = [
        { title: 'Contas', component: HomePage },      
        { title: 'Transações', component: TransacoesPage },
        { title: 'Notas', component: NotasPage},
        { title: 'Parcelamentos', component: ParcelamentosPage},
        { title: 'Definições', component: ConfigPage}
      ];
      const index = this.configProvider.getPaginaSel();//pagina acessada por útlimo
      this.rootPage = index < 0 ? HomePage : this.pages[index].component;
  }

  giveAlert(){
    //let showT = false;
    this.localNotifications.on("click", (notification, state) => {
      //showT = true;
      let data = JSON.parse(notification.data);
      let alert = this.alertCtrl.create({
          title: notification.title,
          subTitle: data.message,
          buttons : [
            {
              text: "Ok",
              handler: data => {
                this.transacaoProvider.atualizaNotificacoes();
                this.openPage(this.pages[1]);
              }
          }]
      });
      alert.present();
    });
  }

  initializeApp() {
    this.contas = this.contaProvider.getAll();
    const contaId = this.configProvider.getIdContaSel();
    this.conta = this.configProvider.getContaById(contaId, this.contas);
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private getPageIndex(page: any) : number{
    for (let i = 0; i < this.pages.length; i++){
      if (page == this.pages[i])
        return i;
    }
    return -1;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.page = page;
    if ((this.page == this.pages[1] ||this.page == this.pages[3])&& this.conta == null){
      let alert = this.alertCtrl.create({
        title: 'Nenhuma conta selecionada',
        subTitle: 'É necessário selecionar uma conta!',
        buttons: ['Ok']
      });
      alert.present();
    }else{
      this.configProvider.selecionaPagina(this.getPageIndex(page));
      this.nav.setRoot(this.page.component);
    }
  }

  comparaConta(c1: Conta, c2: Conta): boolean {
    return c1.id === c2.id;
  }

  trocaConta(conta : Conta){
    this.conta = conta;
    this.configProvider.selecionaConta(this.conta.id);
    if(!this.page)
      this.page = this.pages[0];
    if (this.page != null){
      this.nav.setRoot(this.page.component);
    }
  }

  menuOpened(){
    this.contas = this.contaProvider.getAll();
    const contaId = this.configProvider.getIdContaSel();
    this.conta = this.configProvider.getContaById(contaId, this.contas);
  }

}
