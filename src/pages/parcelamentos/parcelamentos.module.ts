import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParcelamentosPage } from './parcelamentos';

@NgModule({
  declarations: [
    ParcelamentosPage,
  ],
  imports: [
    IonicPageModule.forChild(ParcelamentosPage),
  ],
})
export class ParcelamentosPageModule {}
