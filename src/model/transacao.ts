export class Transacao{

    constructor(
        public id?: number,
        public descricao?: string,
        public valor?: number,
        public dataHoraVencimento?: Date,
        public debitoAutomatico?: boolean,
        public numParcela?: number,
        public dataHoraPagamento?: Date
    ){}

}