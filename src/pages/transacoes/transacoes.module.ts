import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransacoesPage } from './transacoes';

@NgModule({
  declarations: [
    TransacoesPage,
  ],
  imports: [
    IonicPageModule.forChild(TransacoesPage),
  ],
})
export class TransacoesPageModule {}
