document.addEventListener('DOMContentLoaded', () => {
    loadContratos();
  
    // Link de Novo Contrato
    document.getElementById('criar-contrato-link').addEventListener('click', function() {
        document.getElementById('contrato-screen').classList.add('active');
    });
  
    // Link de Gerir Conta
    document.getElementById('manage-account-link').addEventListener('click', function() {
        document.getElementById('help-screen').classList.add('active');
    });
  
    // Voltar da tela de Definições de Conta
    document.getElementById('back-button').addEventListener('click', function() {
        document.getElementById('help-screen').classList.remove('active');
    });
  
    // Link de Atualizar Informações
    document.getElementById('update-info-link').addEventListener('click', function() {
        document.getElementById('update-screen').classList.add('active');
    });
  
    // Voltar da tela de Atualizar Informações
    document.getElementById('update-back-button').addEventListener('click', function() {
        document.getElementById('update-screen').classList.remove('active');
    });
  
    // Voltar da tela de Criação de Contratos
    document.getElementById('contrato-back-button').addEventListener('click', function() {
        document.getElementById('contrato-screen').classList.remove('active');
    });
  
    // Voltar para a tela inicial da tela de Criação de Contratos
    document.getElementById('contrato-back-to-main-button').addEventListener('click', function() {
        document.getElementById('contrato-screen').classList.remove('active');
    });
  
    // Link de Log de Atividades
    document.getElementById('log-atividades-link').addEventListener('click', async function() {
        document.getElementById('logs-screen').classList.add('active');
        await carregarLogsAtividades();
    });
  
    // Voltar da tela de Log de Atividades
    document.getElementById('logs-back-button').addEventListener('click', function() {
        document.getElementById('logs-screen').classList.remove('active');
    });
  
    // Submissão do formulário de atualização de informações
    document.querySelector('form[action="/configuracoes"]').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(this);
            const response = await fetch('/configuracoes', {
                method: 'POST',
                body: formData
            });
  
            if (!response.ok) {
                throw new Error('Erro ao atualizar informações');
            }
  
            alert('Informações atualizadas com sucesso!');
            // document.getElementById('update-screen').classList.remove('active'); // Não remover a tela de atualização
            // Adicionar lógica adicional após a atualização, se necessário
  
        } catch (error) {
            console.error('Erro ao atualizar informações:', error.message);
        }
    });
  
    async function loadContratos() {
        try {
            const response = await fetch('/contratos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });
  
            if (!response.ok) {
                throw new Error('Erro ao carregar contratos');
            }
  
            const contratos = await response.json();
            const contratosList = document.getElementById('contratos-list');
  
            // Limpa a lista atual
            contratosList.innerHTML = '';
  
            // Adiciona cada contrato como um item de lista
            contratos.forEach((contrato) => {
                const contratoItem = document.createElement('li');
                contratoItem.classList.add('contrato-item');
                contratoItem.innerHTML = `<strong>${contrato.titulo}</strong> - Criado em ${new Date(contrato.data_criacao).toLocaleDateString()}`;
                contratoItem.addEventListener('click', () => {
                    alert(`Contrato: ${contrato.titulo}`);
                });
                contratosList.appendChild(contratoItem);
            });
        } catch (error) {
            console.error('Erro ao carregar contratos:', error.message);
        }
    }
  
    async function carregarLogsAtividades() {
        try {
            const response = await fetch('/log-atividades');
            if (!response.ok) {
                throw new Error('Erro ao carregar logs de atividades');
            }
            const logs = await response.json();
            const logTableBody = document.querySelector('#logTableBody');
            logTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos registros
            logs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${log.tipo_atividade}</td>
                    <td>${new Date(log.data_atividade).toLocaleString()}</td>
                `;
                logTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar logs de atividades:', error);
        }
    }
  
    // Botão de Próximo na tela de Criação de Contratos
    document.getElementById('next-button').addEventListener('click', function() {
        alert('Próxima etapa do contrato');
    });
  });
  
  