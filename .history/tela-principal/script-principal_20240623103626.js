document.addEventListener('DOMContentLoaded', () => {
    loadContratos();

    // Link de Configurações
    const configuracoesLink = document.getElementById('configuracoes-link');
    configuracoesLink.addEventListener('click', () => {
        alert('Ajuda');
    });

    // Link de Criar Novo Contrato
    const criarContratoLink = document.getElementById('criar-contrato-link');
    criarContratoLink.addEventListener('click', () => {
        window.location.href = '/criar-contrato';
    });

    // Navegação entre telas
    document.getElementById('manage-account-link').addEventListener('click', function() {
        document.body.classList.add('show-help-screen');
    });

    document.getElementById('back-button').addEventListener('click', function() {
        document.body.classList.remove('show-help-screen');
    });

    document.getElementById('update-info-link').addEventListener('click', function() {
        document.body.classList.add('show-update-screen');
    });

    document.getElementById('update-button').addEventListener('click', function() {
        // Adicionar lógica para atualizar informações
        alert('Informações atualizadas!');
        document.body.classList.remove('show-update-screen');
        document.body.classList.add('show-help-screen');
    });

    document.getElementById('logout-button').addEventListener('click', function() {
        // Adicionar lógica para terminar sessão
        alert('Sessão terminada!');
    });

    document.getElementById('update-back-button').addEventListener('click', function() {
        document.body.classList.remove('show-update-screen');
        document.body.classList.add('show-help-screen');
    });
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
                // Aqui você pode adicionar a ação que deseja quando o item for clicado
                alert(`Contrato: ${contrato.titulo}`);
            });
            contratosList.appendChild(contratoItem);
        });
    } catch (error) {
        console.error('Erro ao carregar contratos:', error.message);
    }
}
