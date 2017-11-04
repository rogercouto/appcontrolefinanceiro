import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContaPage } from './conta';

@NgModule({
  declarations: [
    ContaPage,
  ],
  imports: [
    IonicPageModule.forChild(ContaPage),
  ],
})
export class ContasPageModule {}
