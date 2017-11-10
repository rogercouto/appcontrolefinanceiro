import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';

import { HomePage, ContaPage, TransacoesPage, DebitoPage, CreditoPage, NotasPage,
  ParcelamentosPage, ParcelamentoPage, NotaPage, ConfigPage, TransferenciaPage } from '../pages';

import { ContaProvider, TransacaoProvider, ConfigProvider, NotaProvider, 
  ParcelamentoProvider, BackupProvider, KeyProvider } from '../providers';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContaPage,
    TransacoesPage,
    DebitoPage,
    CreditoPage,
    NotasPage,
    NotaPage,
    TransferenciaPage,
    ParcelamentosPage,
    ParcelamentoPage,
    ConfigPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContaPage,
    TransacoesPage,
    DebitoPage,
    CreditoPage,
    NotasPage,
    NotaPage,
    TransferenciaPage,
    ParcelamentosPage,
    ParcelamentoPage,
    ConfigPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ContaProvider,
    TransacaoProvider,
    ConfigProvider,
    NotaProvider,
    ParcelamentoProvider,
    BackupProvider,
    KeyProvider
  ]
})
export class AppModule {}
