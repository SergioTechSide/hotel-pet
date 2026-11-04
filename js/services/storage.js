// js/services/storage.js

const CHAVE_STORAGE = '@hotel_pet_reservas';

export const StorageService = {
    // Busca todas as reservas salvas no navegador
    obterReservas() {
        const dados = localStorage.getItem(CHAVE_STORAGE);
        return dados ? JSON.parse(dados) : [];
    },

    // Salva a lista completa de reservas no navegador
    salvarReservas(reservas) {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(reservas));
    },

    // Adiciona uma nova reserva à lista existente
    adicionarReserva(novaReserva) {
        const reservas = this.obterReservas();
        reservas.push(novaReserva);
        this.salvarReservas(reservas);
    }
};