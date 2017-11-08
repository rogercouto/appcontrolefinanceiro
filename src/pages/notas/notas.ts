import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Nota } from '../../model';
import { NotaProvider } from '../../providers';
import { NotaPage } from '../../pages';

/**
 * Generated class for the NotasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notas',
  templateUrl: 'notas.html',
})
export class NotasPage {

  private notas: Array<Nota> = [];
  private vis = 'ativas';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notaProvider: NotaProvider
  ) {
    this.refresh();
  }

  ionViewDidLoad() {
  }

  refresh(){
    if (this.vis == 'ativas'){
      this.notas = this.notaProvider.getAtivas();
    }else if (this.vis == 'arquivadas'){
      this.notas = this.notaProvider.getArquivadas();
    }else{
      this.notas = this.notaProvider.getAll();
    }
  }

  insere(){
    this.navCtrl.push(NotaPage, {notaParam: null});
    this.refresh();
  }

  select(nota: Nota){
    this.navCtrl.push(NotaPage, {notaParam: nota}); 
  }
    
}
