import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController } from 'ionic-angular';

import { HomePage, TransacoesPage } from '../pages';
import { Conta } from '../model';
import { ContaProvider, ConfigProvider } from '../providers';

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
    private configProvider: ConfigProvider,
    private alertCtrl: AlertController) 
    {
      this.initializeApp();
      this.pages = [
        { title: 'Contas', component: HomePage },      
        { title: 'Transações', component: TransacoesPage }
      ];
      const index = this.configProvider.getPaginaSel();//pagina acessada por útlimo
      this.rootPage = index < 0 ? HomePage : this.pages[index].component;
  }

  initializeApp() {
    this.contas = this.contaProvider.getContas();
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
    if (this.page == this.pages[1] && this.conta == null){
      let alert = this.alertCtrl.create({
        title: 'Nenhuma conta selecionada',
        subTitle: 'É necessário selecionar uma conta!',
        buttons: ['Ok']
      });
      alert.present();
    }else{
      this.configProvider.selectionaPagina(this.getPageIndex(page));
      this.nav.setRoot(this.page.component);
    }
  }

  comparaConta(c1: Conta, c2: Conta): boolean {
    return c1.id === c2.id;
  }

  trocaConta(conta : Conta){
    this.conta = conta;
    this.configProvider.selectionaConta(this.conta.id);
    if(!this.page)
      this.page = this.pages[0];
    if (this.page != null){
      this.nav.setRoot(this.page.component);
    }
  }

  menuOpened(){
    this.contas = this.contaProvider.getContas();
    const contaId = this.configProvider.getIdContaSel();
    this.conta = this.configProvider.getContaById(contaId, this.contas);
  }

}
