import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ConfigProvider, ContaProvider, TransacaoProvider, NotaProvider,
   ParcelamentoProvider, BackupProvider, KeyProvider } from '../../providers';
import { Backup } from '../../model';
/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  private time: string;
  private notificacoesAtivas: boolean;
  private notificaCalendario: boolean;

  private conectado = false;
  private wait = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private configProvider: ConfigProvider,
    private contaProvider: ContaProvider,
    private transacaoProvider: TransacaoProvider,
    private notaProvider: NotaProvider,
    private parcelamentoProvider: ParcelamentoProvider,
    private keyProvider: KeyProvider,
    private backupProvider: BackupProvider,
    private alertCtrl: AlertController
  ) {
    this.notificacoesAtivas = this.configProvider.isNotificacoesAtivas();
    const horario = this.configProvider.getHorarioNotificacao();
    this.time = '';
    if (horario.h < 10)
      this.time += '0';
    this.time += horario.h;
    this.time += ':';
    if (horario.m < 10)
      this.time += '0';
    this.time += horario.m;
    this.notificaCalendario = this.configProvider.isNotificaCalendario();
    this.testaConexao();
  }

  ionViewDidLoad() {
  }

  private getContaArray(backupId: number){
    const contas = this.contaProvider.getAll();
    const array = new Array<any>();
    for (const conta of contas){
      const object = {id: conta.id, backupId: backupId, descricao: conta.descricao,
        saldo: conta.saldo, limite: conta.limite};
      array.push(object);
    }
    return array;
  }

  private getNotaArray(backupId: number){
    const notas = this.notaProvider.getAll();
    const array = new Array<any>();
    for (const nota of notas){
      const object = {id: nota.id, backupId: backupId, titulo: nota.titulo,
         texto: nota.texto, arquivada: nota.arquivada};
      array.push(object);
    }
    return array;
  }

  private getTransacaoArray(backupId: number){
    const transacoes = this.transacaoProvider.getAll();
    const array = new Array<any>();
    for (const transacao of transacoes){
      const object = {
        id: transacao.id,
        backupId: backupId,
        contaId: transacao.contaId,
        descricao: transacao.descricao,
        valor: transacao.valor,
        dataHoraVencimento: transacao.dataHoraVencimento,
        debitoAutomatico: transacao.debitoAutomatico,
        dataHoraPagamento: transacao.dataHoraPagamento,
        parcelamentoId: transacao.parcelamentoId,
        numParcela: transacao.numParcela
      };
      array.push(object);
    }
    return array;
  }
  
  private getParcelamentoArray(backupId: number){
    const parcelamentos = this.parcelamentoProvider.getAll();
    const array = new Array<any>();
    for (const parcelamento of parcelamentos){
      const object = {
        id: parcelamento.id,
        backupId: backupId,
        contaId: parcelamento.contaId,
        descricao: parcelamento.descricao,
        dataIni: parcelamento.dataIni,
        numParcelas: parcelamento.numParcelas,
        valorTotal: parcelamento.valorTotal,
        entrada: parcelamento.entrada,
        debitoAutomatico: parcelamento.debitoAutomatico
      };
      array.push(object);
    }
    return array;
  }

  alertErroConexao(){
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      subTitle: 'Não foi possível se conectar com o servidor!',
      buttons : ["Ok"]
    });
    alert.present();
  }

  private testaConexao(){
    if (this.configProvider.getUsuario() == null)
      return false;
    this.backupProvider.testaConnexao().subscribe(
      res => {
        if (res !== 'e'){
          this.conectado = true;
        }else{
          this.conectado = false;
        }
      }
    );
  }

  fazerBackup(){
    const backup = new Backup(
      this.keyProvider.genBackupKey(),
      this.configProvider.getUsuarioId(),
      new Date()
    );
    this.wait = true;
    this.backupProvider.salvaBackup(backup).subscribe(res => {
      if (res !== 'e') {
        console.log(res);
        this.backupProvider.salvaContas(this.getContaArray(backup.id)).subscribe( res=>{
          console.log(res);
          this.backupProvider.salvaNotas(this.getNotaArray(backup.id)).subscribe( res=>{
            console.log(res);
            this.backupProvider.salvaTransacoes(this.getTransacaoArray(backup.id)).subscribe( res=>{
              console.log(res);
              this.backupProvider.salvaParcelamentos(this.getParcelamentoArray(backup.id)).subscribe( res=>{
                console.log(res);
                this.wait = false;
              });  
            });
          });
        });
      }else{
        console.log('Erro ao se contectar!');
        this.wait = false;
      }
    });
  }

  haveData(key: string){
    const keys = ['keyGen','contas','contaSel','paginaSel','notas',
      'notificacoesAtivas','horarioNot','usaCalendario'];
    for (let k of keys){
      if (k == key)
        return true;
    }
    if (key.substring(0, 2) == 't_' || key.substring(0, 2) == 'p_')
      return true;
    return false;
  }

  limparBanco(){
    let alert = this.alertCtrl.create({
        title: 'Atenção',
        subTitle: 'Tem certesa que deseja excluir os dados locais?',
        buttons : [
          {
            text: "Ok",
            handler: data => {
              this.excluiDadosLocais();
              this.keyProvider.initialize();
              this.navCtrl.setRoot(ConfigPage);
            }
          },
          {
            text: "Cancelar",
          }
        ]
    });
    alert.present();
  }

  restaurarBackup(){
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      subTitle: 'Tem certesa que deseja susbtituir os dados locais pelo backup?',
      buttons : [
        {
          text: "Ok",
          handler: data => {
            try {
              this.restauraUltimoBackup();
            } catch (error) {
              this.alertErroConexao();
            }
          }
        },
        {
          text: "Cancelar",
        }
      ]
    });
    alert.present();
  }

  private excluiDadosLocais(){
    const keys = Array<string>();
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if (this.haveData(key))
        keys.push(key);
    }
    for(let key of keys){
      localStorage.removeItem(key);
    }
    this.configProvider.selecionaPagina(0);
  }

  private restauraUltimoBackup(){
    this.excluiDadosLocais();
    this.keyProvider.initialize();
    let lastKey;
    this.wait = true;
    this.backupProvider.restauraBackup().subscribe(
      backups => {
        if (backups.length == 0){
          this.wait = false;
          return;
        }
        const backup = backups[0];
        this.keyProvider.setBackupKey(backup.id);
        this.backupProvider.restauraContas(backup.id).subscribe(
          contas => {
            lastKey = 0;
            for (const conta of contas){
              this.contaProvider.insertFromBackup(conta);
              if (conta.id > lastKey)
                lastKey = conta.id;
            }
            this.keyProvider.setContaKeyKey(lastKey);
            this.backupProvider.restauraNotas(backup.id).subscribe(
              notas => {
                lastKey = 0;
                for (const nota of notas){
                  this.notaProvider.insertFromBackup(nota);
                  if (nota.id > lastKey)
                    lastKey = nota.id;
                }
                this.keyProvider.setNotaKey(lastKey);
                this.backupProvider.restauraTransacoes(backup.id).subscribe(
                  transacoes => {
                    lastKey = 0;
                    for (const transacao of transacoes){
                      this.transacaoProvider.insertFromBackup(transacao);
                      if (transacao.id > lastKey)
                        lastKey = transacao.id;
                    }          
                    this.keyProvider.setTransacaoKey(lastKey);
                    this.backupProvider.restauraParcelamentos(backup.id).subscribe(
                      parcelamentos => {
                        lastKey = 0;
                        for (const parcelamento of parcelamentos){
                          this.parcelamentoProvider.insertFromBackup(parcelamento);
                          if (parcelamento.id > lastKey)
                            lastKey = parcelamento.id;
                        }  
                        this.keyProvider.setParcelamentoKey(lastKey);
                        this.wait = false;
                      }
                    );
                  }
                );                
              }
            );             
          }
        );     
      }
    );
  }

  salvaNotificacoesAtivas(){
    this.configProvider.setNotificacoesAtivas(this.notificacoesAtivas);
    this.transacaoProvider.atualizaNotificacoes();
  }

  salvaHorarioNotificacao(){
    const h = Number(this.time.substring(0,2));
    const m = Number(this.time.substring(3,5));
    this.configProvider.setHorarioNotificacao(h, m);
    this.transacaoProvider.atualizaNotificacoes();
  }

  salvaNotificaCalendario(){
    this.configProvider.setNotificacaoCalendario(this.notificaCalendario);
  }

}
