// js/models/Reserva.js

export class Reserva {
    constructor(id, clienteNome, petNome, dataInicio, dataFim, valorDiaria) {
        this.id = id;
        this.clienteNome = clienteNome;
        this.petNome = petNome;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.valorDiaria = valorDiaria;
        this.status = 'ativa'; // Status padrão: ativa, finalizada ou cancelada
    }

    // Método para calcular o valor total com base nos dias de estadia
    calcularTotalDias() {
        const inicio = new Date(this.dataInicio);
        const fim = new Date(this.dataFim);
        const diferencaTempo = fim - inicio;
        const dias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
        return dias > 0 ? dias * this.valorDiaria : this.valorDiaria;
    }
}