document.addEventListener('DOMContentLoaded', () => {
    console.log("Script carregado");

    // Função para abrir modal
    function openModal(modal) {
        modal.style.display = "block";
    }

    // Função para fechar modal
    function closeModal(modal) {
        modal.style.display = "none";
    }

    // Exemplo de obtenção dos elementos modais e links
    var logModal = document.getElementById("logModal");
    var contratoModal = document.getElementById("contratoModal");
    var helpModal = document.getElementById("helpModal");
    var updateModal = document.getElementById("updateModal");

    var logLink = document.getElementById("log-atividades-link");
    var contratoLink = document.getElementById("criar-contrato-link");
    var manageAccountLink = document.getElementById("manage-account-link");
    var updateInfoLink = document.getElementById("update-info-link");

    // Event listeners para abrir modais
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

    // Event listeners para fechar modais
    var closeButtons = document.getElementsByClassName("close");
    Array.from(closeButtons).forEach(button => {
        button.onclick = function() {
            closeModal(button.closest(".modal"));
        }
    });

    // Event listener para fechar modal clicando fora dele
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    }

    // Carregar contratos ao iniciar a página
    loadContratos();
    carregarLogsAtividades();
});

async function loadContratos() {
    try {
        const contratos = await listContratosByUserId(1); // Substitua 1 pelo ID do usuário correto

        console.log('Contratos retornados:', contratos); // Verifique se os contratos estão sendo retornados corretamente

        const contratosList = document.getElementById('contratos-list');

        // Limpa a lista atual
        contratosList.innerHTML = '';

        // Adiciona cada contrato como um item de lista
        contratos.forEach((contrato) => {
            const contratoItem = document.createElement('div');
            contratoItem.classList.add('contrato-item');
            contratoItem.innerHTML = `
                <strong>${contrato.titulo}</strong> - Criado em ${new Date(contrato.data_criacao).toLocaleDateString()}
                <p>Outras informações do contrato...</p>
            `;
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
