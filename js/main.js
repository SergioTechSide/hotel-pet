// js/main.js
import { Reserva } from './models/Reserva.js';
import { StorageService } from './services/storage.js';

// Elementos da tela
const formReserva = document.getElementById('formReserva');
const tabelaReservas = document.getElementById('tabelaReservas');

// Função para desenhar as reservas na tabela HTML
// Função para desenhar as reservas na tabela HTML com botões de ação
function atualizarTabela() {
    const reservas = StorageService.obterReservas();
    tabelaReservas.innerHTML = '';

    reservas.forEach((reservaObj, index) => {
        const reserva = new Reserva(
            reservaObj.id,
            reservaObj.clienteNome,
            reservaObj.petNome,
            reservaObj.dataInicio,
            reservaObj.dataFim,
            reservaObj.valorDiaria
        );
        reserva.status = reservaObj.status || 'ativa';

        const valorTotal = reserva.calcularTotalDias();

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reserva.clienteNome}</td>
            <td>${reserva.petNome}</td>
            <td>${reserva.dataInicio}</td>
            <td>${reserva.dataFim}</td>
            <td>R$ ${valorTotal.toFixed(2)}</td>
            <td><strong>${reserva.status}</strong></td>
            <td>
                <button onclick="mudarStatusReserva('${reserva.id}')" style="background-color: #f39c12; padding: 5px 10px; font-size: 12px; margin-right: 5px;">Mudar Status</button>
                <button onclick="excluirReserva('${reserva.id}')" style="background-color: #e74c3c; padding: 5px 10px; font-size: 12px;">Excluir</button>
            </td>
        `;
        tabelaReservas.appendChild(tr);
    });
}
 
// Funções globais para gerenciar as ações da tabela
window.mudarStatusReserva = function(id) {
    const reservas = StorageService.obterReservas();
    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
        reserva.status = reserva.status === 'ativa' ? 'finalizada' : 'ativa';
        StorageService.salvarReservas(reservas);
        atualizarTabela();
    }
};

window.excluirReserva = function(id) {
    if (confirm('Tem certeza que deseja excluir esta reserva?')) {
        let reservas = StorageService.obterReservas();
        reservas = reservas.filter(r => r.id !== id);
        StorageService.salvarReservas(reservas);
        atualizarTabela();
    }
};

// Escutando o evento de envio do formulário
formReserva.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const clienteNome = document.getElementById('clienteNome').value;
    const petNome = document.getElementById('petNome').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const valorDiaria = parseFloat(document.getElementById('valorDiaria').value);

    // Gerando um ID único simples baseado no tempo atual
    const id = Date.now().toString();

    // Criando a nova instância da nossa classe Reserva
    const novaReserva = new Reserva(id, clienteNome, petNome, dataInicio, dataFim, valorDiaria);

    // Salvando no storage
    StorageService.adicionarReserva(novaReserva);

    // Limpando o formulário e atualizando a tabela na tela
    formReserva.reset();
    atualizarTabela();
    
    alert('Reserva cadastrada com sucesso!');
});

// Carregar as reservas assim que a página abrir
document.addEventListener('DOMContentLoaded', () => {
    atualizarTabela();
});