document.addEventListener('DOMContentLoaded', () => {
    loadContratos();
    carregarLogsAtividades();

    // Função para abrir modal
    function openModal(modal) {
        modal.style.display = "block";
    }

    // Função para fechar modal
    function closeModal(modal) {
        modal.style.display = "none";
    }

    // Pega os modais
    var logModal = document.getElementById("logModal");
    var contratoModal = document.getElementById("contratoModal");
    var helpModal = document.getElementById("helpModal");
    var updateModal = document.getElementById("updateModal");

    // Pega os links que abrem os modais
    var logLink = document.getElementById("log-atividades-link");
    var contratoLink = document.getElementById("criar-contrato-link");
    var manageAccountLink = document.getElementById("manage-account-link");
    var updateInfoLink = document.getElementById("update-info-link");

    // Pega os elementos <span> que fecham os modais
    var closeButtons = document.getElementsByClassName("close");

    // Quando o usuário clicar nos links, abre os modais correspondentes
    logLink.onclick = function() {
        openModal(logModal);
    }

    contratoLink.onclick = function() {
        openModal(contratoModal);
    }

    manageAccountLink.onclick = function() {
        openModal(helpModal);
    }

    updateInfoLink.onclick = function() {
        openModal(updateModal);
    }

    // Quando o usuário clicar nos <span> (x), fecha os modais correspondentes
    for (let button of closeButtons) {
        button.onclick = function() {
            closeModal(button.closest(".modal"));
        }
    }

    // Quando o usuário clicar em qualquer lugar fora do modal, fecha o modal
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    }
    document.getElementById('logout-button').addEventListener('click', function() {
        window.location.href = '/logout';
    });
    // Link de Novo Contrato
    document.getElementById('criar-contrato-link').addEventListener('click', function() {
        openModal(contratoModal);
    });
    // Link de Gerir Conta
    document.getElementById('manage-account-link').addEventListener('click', function() {
        openModal(helpModal);
    });

    // Voltar da tela de Definições de Conta
    document.getElementById('back-button').addEventListener('click', function() {
        closeModal(helpModal);
    });

    // Link de Atualizar Informações
    document.getElementById('update-info-link').addEventListener('click', function() {
        openModal(updateModal);
    });

    // Voltar da tela de Atualizar Informações
    document.getElementById('update-back-button').addEventListener('click', function() {
        closeModal(updateModal);
    });

    // Voltar da tela de Criação de Contratos
    document.getElementById('contrato-back-button').addEventListener('click', function() {
        closeModal(contratoModal);
    });

    // Voltar para a tela inicial da tela de Criação de Contratos
    document.getElementById('contrato-back-to-main-button').addEventListener('click', function() {
        closeModal(contratoModal);
    });

    // Link de Log de Atividades
    document.getElementById('log-atividades-link').addEventListener('click', async function() {
        openModal(logModal);
        await carregarLogsAtividades();
    });

    // Voltar da tela de Log de Atividades
    document.getElementById('logs-back-button').addEventListener('click', function() {
        closeModal(logModal);
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
            closeModal(updateModal);

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
            const logTableBody = document.getElementById('logTableBody');

            // Limpa a tabela antes de adicionar novos registros
            logTableBody.innerHTML = '';

            logs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="tipo-${log.tipo_atividade.toLowerCase()}">${log.tipo_atividade}</td>
                    <td>${new Date(log.data_atividade).toLocaleString()}</td>
                `;
                logTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar logs de atividades:', error);
            // Tratar erro: exibir mensagem de erro para o usuário se necessário
        }
    }

    // Botão de Próximo na tela de Criação de Contratos
    document.getElementById('next-button').addEventListener('click', function() {
        alert('Próxima etapa do contrato');
    });
});
