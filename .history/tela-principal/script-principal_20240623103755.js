document.addEventListener('DOMContentLoaded', () => {
    loadContratos();

    // Link de Gerir Conta
    document.getElementById('manage-account-link').addEventListener('click', function() {
        document.body.classList.add('show-help-screen');
    });

    // Voltar da tela de Definições de Conta
    document.getElementById('back-button').addEventListener('click', function() {
        document.body.classList.remove('show-help-screen');
    });

    // Link de Atualizar Informações
    document.getElementById('update-info-link').addEventListener('click', function() {
        document.body.classList.add('show-update-screen');
    });

    // Voltar da tela de Atualizar Informações
    document.getElementById('update-back-button').addEventListener('click', function() {
        document.body.classList.remove('show-update-screen');
    });

    // Link de Configurações
    document.getElementById('configuracoes-link').addEventListener('click', function() {
        window.location.href = '/configuracoes';
    });

    // Submissão do formulário de atualização de informações
    document.getElementById('update-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita o comportamento padrão do formulário (recarregar a página)
        
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
            document.body.classList.remove('show-update-screen'); // Fecha a tela de atualizar informações
            // Aqui você pode adicionar lógica adicional após a atualização, se necessário

        } catch (error) {
            console.error('Erro ao atualizar informações:', error.message);
        }
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

