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

  public mostraBalanco = false;
  public totalCredito: number = 0;
  public totalCreditoPago: number = 0;
  public totalDebito: number = 0;
  public totalDebitoPago: number = 0;

  public sortByDate:number = 1;
  public sortByPag:number = 1;
  public dateRange: {min:string, max:string};
  public aviso:boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private transacaoProvider: TransacaoProvider,
    private contaProvider: ContaProvider, 
    private configProvider: ConfigProvider,
    private alertCtrl: AlertController
  ) {
    const contaId = this.configProvider.getIdContaSel();
    this.conta = this.contaProvider.get(contaId);
    this.dateRange = this.transacaoProvider.getDateRange();
  }

  ionViewDidLoad() {
    this.refresh();
  }

  calculaBalanco(){
    this.totalCredito = 0;
    this.totalCreditoPago = 0;
    this.totalDebito = 0;
    this.totalDebitoPago = 0;
    for (let transacao of this.transacoes){
      if (transacao.valor < 0){
        this.totalDebito += transacao.valor;
        if (transacao.dataHoraPagamento != null)
          this.totalDebitoPago += transacao.valor;
      }else{
        this.totalCredito += transacao.valor;
        if (transacao.dataHoraPagamento != null)
          this.totalCreditoPago += transacao.valor;
      }
    }
    this.totalCreditoPago = Number(this.totalCreditoPago);
    this.totalCredito = Number(this.totalCredito);
    this.totalDebitoPago = Number(this.totalDebitoPago);
    this.totalDebito = Number(this.totalDebito);
  }

  get totalDebitoPendente(){
    return Number(this.totalDebito - this.totalDebitoPago);
  }

  get totalCreditoPendente(){
    return Number(this.totalCredito - this.totalCreditoPago);
  }

  get totalPago(){
    return Number(this.totalCreditoPago + this.totalDebitoPago);
  }

  get totalPrevisto(){
    return Number(this.totalCredito + this.totalDebito);
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
    this.transacoes = this.transacaoProvider.getArray(this.conta.id, this.periodo);
    this.conta = this.contaProvider.get(this.configProvider.getIdContaSel());
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
    this.aviso = !this.transacaoProvider.temSaldo(this.conta, this.transacoes);
  }

  debito(){
    this.navCtrl.push(DebitoPage, {contaIdParam: this.conta.id});
    this.refresh();
  }

  credito(){
    this.navCtrl.push(CreditoPage, {contaIdParam: this.conta.id});
    this.refresh();
  }

  msgSaldoIndisponivel(){
    let alert = this.alertCtrl.create({
      title: 'Saldo indisponível',
      subTitle: 'Não é possivel realizar o pagamento!',
      buttons: ['Ok']
    });
    alert.present();
  }

  private excluiTransacao(transacao: Transacao){
    let pronptExclude = this.alertCtrl.create({
      title: 'Atenção!',
      message: 'Confirma exclusão da transação?',
      buttons:[
        {
          text: 'Sim',
          handler: data =>{
            this.transacaoProvider.delete(transacao);
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

  selecionaTransacao(transacao: Transacao): void{
    let prompt = this.alertCtrl.create({
     title: transacao.descricao,
     message: 'Selecione a opção: </strong>',
     buttons : [
      {
        text: "Editar",
        handler: data => {
          if (transacao.valor < 0)
            this.navCtrl.push(DebitoPage, {transacaoParam: transacao});
          else 
            this.navCtrl.push(CreditoPage, {transacaoParam: transacao}); 
        }
      },
      {
        text: "Excluir",
        handler: data => {
          this.excluiTransacao(transacao);
        }
      },
      {
        text: transacao.foiPaga() ? "Cancelar pagamento" : "Pagar",
        handler: data => {
          if (transacao.foiPaga()){
            transacao.dataHoraPagamento = null;
            if (transacao.debitoAutomatico)
              transacao.debitoAutomatico = false;
            this.calculaBalanco();
          }else{
            const previsaoSaldo = this.conta.getSaldoDisponivel()+transacao.valor;
            if (transacao.isDebito() && previsaoSaldo < 0){
              this.msgSaldoIndisponivel();
            }else{
              transacao.dataHoraPagamento = new Date();
              this.calculaBalanco();
            }
          }
          this.transacaoProvider.update(transacao);
          this.refresh();
        }
      },
      {
        text: "Cancelar"
      }
     ]
     });
     prompt.present();
 }

}
