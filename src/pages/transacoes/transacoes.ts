import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { DebitoPage, CreditoPage } from '../../pages';
import { Conta, Transacao } from '../../model';
import { TransacaoProvider, ContaProvider, ConfigProvider } from '../../providers';
/**
 * Generated class for the TransacoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transacoes',
  templateUrl: 'transacoes.html',
})
export class TransacoesPage {

  public conta: Conta;
  public periodo: string = new Date().toISOString().substring(0, 7);
  public transacoes: Array<Transacao> = [];
  public balancoPrevisto: number;
  public balancoAtual: number;
  public sortByDate:number = 1;
  public sortByPag:number = 1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private transacaoProvider: TransacaoProvider,
    private contaProvider: ContaProvider, 
    private configProvider: ConfigProvider,
    private alertCtrl: AlertController
  ) {
    const contaId = this.configProvider.getIdContaSel();
    this.conta = this.contaProvider.getConta(contaId);
  }

  ionViewDidLoad() {
    this.refresh();
  }

  calculaBalanco(){
    this.balancoAtual = 0;
    this.balancoPrevisto = 0;
    for (let transacao of this.transacoes){
      this.balancoPrevisto += transacao.valor;
      if (transacao.dataHoraPagamento != null)
        this.balancoAtual += transacao.valor;
    }
    this.balancoAtual = Number(this.balancoAtual);
    this.balancoPrevisto = Number(this.balancoPrevisto);
  }

  changeSortByDate(){
    this.sortByDate *= -1;
    this.refresh();
  }

  changeSortByPag(){
    this.sortByPag *= -1;
    this.refresh();
  }

  refresh(){
    this.transacoes = this.transacaoProvider.getTransacoes(this.conta, this.periodo);
    const sd = this.sortByDate;
    const sp = this.sortByPag;
    this.transacoes.sort(function(t1:Transacao,t2:Transacao){
      if (t1.dataHoraPagamento == null && t2.dataHoraPagamento != null)
        return (-1*sp);
      else if(t1.dataHoraPagamento != null && t2.dataHoraPagamento == null)
        return  (1*sp);
      else
        return  (t2.dataHoraVencimento.getTime() - t1.dataHoraVencimento.getTime()) * sd;
    });
    this.calculaBalanco();
  }

  debito(){
    this.navCtrl.push(DebitoPage, {contaParam: this.conta});
    this.refresh();
  }

  credito(){
    this.navCtrl.push(CreditoPage, {contaParam: this.conta});
    this.refresh();
  }

  selecionaTransacao(transacao: Transacao): void{
    let prompt = this.alertCtrl.create({
     title: 'Transação: '+transacao.descricao,
     message: 'Selecione a opção: ',
     buttons : [
      {
        text: "Editar",
        handler: data => {
          if (transacao.valor < 0)
            this.navCtrl.push(DebitoPage, {contaParam: this.conta, transacaoParam: transacao});
          else 
            this.navCtrl.push(CreditoPage, {contaParam: this.conta, transacaoParam: transacao}); 
        }
      },
      {
        text: "Excluir",
        handler: data => {
          let pronptExclude = this.alertCtrl.create({
            title: 'Atenção!',
            message: 'Confirma exclusão da transação?',
            buttons:[
              {
                text: 'Sim',
                handler: data =>{
                  this.transacaoProvider.deleteTransacao(this.conta, transacao);
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
        text: transacao.dataHoraPagamento == null ? "Pagar" : "Cancelar pagamento",
        handler: data => {
          if (transacao.dataHoraPagamento == null){
            const saldoDisponivel = Number(this.conta.saldo+this.conta.limite);
            if (transacao.valor < 0 && (saldoDisponivel+transacao.valor < 0)){
              let alert = this.alertCtrl.create({
                title: 'Saldo indisponível',
                subTitle: 'Não é possivel realizar o pagamento!',
                buttons: ['Ok']
              });
              alert.present();
            }else{
              transacao.dataHoraPagamento = new Date();
              this.calculaBalanco();
            }
          }else{
            transacao.dataHoraPagamento = null;
            if (transacao.debitoAutomatico)
              transacao.debitoAutomatico = false;
            this.calculaBalanco();
          }
          this.transacaoProvider.updateTransacao(this.conta, transacao);
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
 }

}
