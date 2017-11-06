import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
  private vis: number = 1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notaProvider: NotaProvider,
    private alertCtrl: AlertController
  ) {
    this.notas = this.notaProvider.getNotas(this.vis);
  }

  ionViewDidLoad() {
  }

  refresh(){
    this.notas = this.notaProvider.getNotas(this.vis);
  }

  insere(){
    this.navCtrl.push(NotaPage, {notaParam: null});
    this.refresh();
  }

  select(nota: Nota){
    this.navCtrl.push(NotaPage, {notaParam: nota}); 
    /*
    let prompt = this.alertCtrl.create({
      title: 'Ações',
      message: 'Selecione a opção: ',
      buttons : [
       {
         text: "Editar",
         handler: data => {
          this.navCtrl.push(NotaPage, {notaParam: nota}); 
         }
       },
       {
         text: "Excluir",
         handler: data => {
           let pronptExclude = this.alertCtrl.create({
             title: 'Atenção!',
             message: 'Confirma exclusão da nota?',
             buttons:[
               {
                 text: 'Sim',
                 handler: data =>{
                   this.notaProvider.delete(nota);
                   this.refresh();
                 }
               },
               {
                 text: 'Não'
               }
             ]
           });
           pronptExclude.present();
         }
       },
       {
         text: !nota.arquivada ? "Arquivar" : "Desarquivar",
         handler: data => {
          nota.arquivada = !nota.arquivada; 
          this.notaProvider.updateNota(nota);
          this.refresh();
         }
       },
       {
         text: "Cancelar",
         handler: data => {
         }
       }
      ]
      });
      prompt.present();
      this.refresh();
      */
    }
    
}
