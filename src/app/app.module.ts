import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { HomePage, ContaPage, TransacoesPage, DebitoPage, CreditoPage, ConfigPage } from '../pages';
import { ContaProvider } from '../providers';
import { TransacaoProvider } from '../providers/transacao/transacao';
import { ConfigProvider } from '../providers/config/config';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContaPage,
    TransacoesPage,
    DebitoPage,
    CreditoPage,
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
  ]
})
export class AppModule {}
