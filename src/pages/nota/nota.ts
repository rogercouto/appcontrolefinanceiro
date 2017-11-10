import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { NotaProvider } from '../../providers';
import { Nota } from '../../model';
import { NotasPage } from '../../pages';
/**
 * Generated class for the NotaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nota',
  templateUrl: 'nota.html',
})
export class NotaPage {

  private nota: Nota;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notaProvider: NotaProvider,
    private alertCtrl: AlertController
  ) {
    if (this.navParams.get('notaParam') != null)
      this.nota = this.navParams.get('notaParam') as Nota;
    else
      this.nota = new Nota();  
  }

  ionViewDidLoad() {
  }

  salvar(){
    if (this.nota.id == null)
      this.notaProvider.insert(this.nota);
    else      
      this.notaProvider.update(this.nota);
    this.navCtrl.setRoot(NotasPage);
  }

  excluir(){
    let pronptExclude = this.alertCtrl.create({
      title: 'Atenção!',
      message: 'Confirma exclusão da nota?',
      buttons:[
        {
          text: 'Sim',
          handler: data =>{
            this.notaProvider.delete(this.nota);
            this.navCtrl.setRoot(NotasPage);
          }
        },
        {
          text: 'Não'
        }
      ]
    });
    pronptExclude.present();
  }

}
