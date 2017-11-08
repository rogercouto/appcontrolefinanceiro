export class Transacao{

    constructor(
        public id?: number,
        public contaId?: number,
        public descricao?: string,
        public valor?: number,
        public dataHoraVencimento?: Date,
        public debitoAutomatico?: boolean,
        public dataHoraPagamento?: Date,
        public parcelamentoId?: number,
        public numParcela?: number,
    ){}

    getPeriodo():string{
        return this.dataHoraVencimento.toISOString().substring(0, 7);
    }

    foiPaga():boolean{
        return Boolean(this.dataHoraPagamento != null);
    }

    isDebito():boolean{
        return Boolean(this.valor != undefined && this.valor < 0);
    }

}