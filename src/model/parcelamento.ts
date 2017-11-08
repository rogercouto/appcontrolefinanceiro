export class Parcelamento{

    constructor(
        public id?: number,
        public contaId?: number,
        public descricao?: string,
        public dataIni?: Date,
        public numParcelas?: number,
        public valorTotal?: number,
        public entrada?: boolean
    ){
        this.entrada = false;
    }

    getDataIniStr(){
        return this.dataIni.toISOString().substring(0, 10);
    }

}