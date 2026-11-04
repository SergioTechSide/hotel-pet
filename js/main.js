// js/main.js
import { Reserva } from './models/Reserva.js';
import { StorageService } from './services/storage.js';

// Elementos da tela de Reservas
const formReserva = document.getElementById('formReserva');
const tabelaReservas = document.getElementById('tabelaReservas');

// Elementos da tela de Configurações do Gerente
const formConfig = document.getElementById('formConfig');
const inputVagas = document.getElementById('vagasTotais');
const inputDiaria = document.getElementById('diariaPadrao');

// Elementos da Gestão de Usuários
const formUsuario = document.getElementById('formUsuario');
const tabelaUsuarios = document.getElementById('tabelaUsuarios');

// Função para desenhar as reservas na tabela HTML com botões de ação
function atualizarTabela() {
    if (!tabelaReservas) return;
    const reservas = StorageService.obterReservas();
    tabelaReservas.innerHTML = '';

    reservas.forEach((reservaObj) => {
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
                <button onclick="mudarStatusReserva('${reserva.id}')" style="background-color: #f39c12; color: white; padding: 5px 10px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; margin-right: 5px;">Mudar Status</button>
                <button onclick="excluirReserva('${reserva.id}')" style="background-color: #e74c3c; color: white; padding: 5px 10px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Excluir</button>
            </td>
        `;
        tabelaReservas.appendChild(tr);
    });
}

// Escutando o envio do formulário de Reserva
if (formReserva) {
    formReserva.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const clienteNome = document.getElementById('clienteNome').value;
        const petNome = document.getElementById('petNome').value;
        const dataInicio = document.getElementById('dataInicio').value;
        const dataFim = document.getElementById('dataFim').value;
        const valorDiaria = parseFloat(document.getElementById('valorDiaria').value);

        if (!dataInicio || !dataFim || dataInicio > dataFim) {
            alert('Por favor, verifique as datas de entrada e saída.');
            return;
        }

        const id = Date.now().toString();
        const novaReserva = new Reserva(id, clienteNome, petNome, dataInicio, dataFim, valorDiaria);

        StorageService.adicionarReserva(novaReserva);

        formReserva.reset();
        atualizarTabela();
        
        alert('Reserva cadastrada com sucesso!');
    });
}

// Funções globais para gerenciar as ações da tabela de reservas
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

// Gerenciamento do formulário de Configurações do Gerente
if (formConfig) {
    formConfig.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const configuracoes = {
            vagasTotais: parseInt(inputVagas.value),
            diariaPadrao: parseFloat(inputDiaria.value)
        };

        localStorage.setItem('hotelConfig', JSON.stringify(configuracoes));
        alert('Configurações atualizadas com sucesso!');
    });
}

// --- GESTÃO DE USUÁRIOS (Visão do Gerente) ---
function obterUsuarios() {
    return JSON.parse(localStorage.getItem('hotelUsuarios')) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem('hotelUsuarios', JSON.stringify(usuarios));
}

function atualizarTabelaUsuarios() {
    if (!tabelaUsuarios) return;
    const usuarios = obterUsuarios();
    tabelaUsuarios.innerHTML = '';

    usuarios.forEach((user) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td><strong>${user.funcao}</strong></td>
            <td>
                <button onclick="removerUsuario('${user.id}')" style="background-color: #e74c3c; color: white; padding: 5px 10px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Excluir</button>
            </td>
        `;
        tabelaUsuarios.appendChild(tr);
    });
}

if (formUsuario) {
    formUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nomeUsuario').value;
        const email = document.getElementById('emailUsuario').value;
        const funcao = document.getElementById('funcaoUsuario').value;

        const usuarios = obterUsuarios();
        const novoUsuario = {
            id: Date.now().toString(),
            nome,
            email,
            funcao
        };

        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);
        formUsuario.reset();
        atualizarTabelaUsuarios();
        alert('Usuário cadastrado com sucesso!');
    });
}

window.removerUsuario = function(id) {
    if (confirm('Deseja realmente remover este usuário?')) {
        let usuarios = obterUsuarios();
        usuarios = usuarios.filter(u => u.id !== id);
        salvarUsuarios(usuarios);
        atualizarTabelaUsuarios();
    }
};

// Inicialização única e unificada ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarTabela();
    atualizarTabelaUsuarios();
    
    // Carregar configurações salvas, se existirem
    const configSalvas = JSON.parse(localStorage.getItem('hotelConfig'));
    if (configSalvas && inputVagas && inputDiaria) {
        inputVagas.value = configSalvas.vagasTotais || 10;
        inputDiaria.value = configSalvas.diariaPadrao || 50.00;
    }
});