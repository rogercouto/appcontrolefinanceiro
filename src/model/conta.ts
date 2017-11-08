export class Conta{

    constructor(
        public id?: number,
        public descricao?: string,
        public saldo?: number,
        public limite?: number
    ){}

    addValor(valor: number){
        let novoSaldo = this.saldo + valor;
        this.saldo = Number(novoSaldo);
    }

    subValor(valor: number){
        let novoSaldo = this.saldo - valor;
        this.saldo = Number(novoSaldo);
    }

    getSaldoDisponivel(){
        return Number(this.saldo+this.limite);
    }

}