document.addEventListener('DOMContentLoaded', () => {
    loadContratos();

    const form = document.querySelector('form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = form.querySelector('#username').value;
        const email = form.querySelector('#email').value;
        try {
            const response = await fetch('/configuracoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                })
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar dados do usuário');
            }
            const responseData = await response.json();
            console.log('Dados atualizados:', responseData);
            form.reset(); // Limpa o formulário após a atualização
            await carregarLogsAtividades();
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
        }
    });

    document.getElementById('criar-contrato-link').addEventListener('click', function() {
        window.location.href = '/criar-contrato';
    });

    document.getElementById('manage-account-link').addEventListener('click', function() {
        document.body.classList.add('show-help-screen');
    });

    document.getElementById('back-button').addEventListener('click', function() {
        document.body.classList.remove('show-help-screen');
    });

    document.getElementById('update-info-link').addEventListener('click', function() {
        document.body.classList.add('show-update-screen');
    });

    document.getElementById('update-back-button').addEventListener('click', function() {
        document.body.classList.remove('show-update-screen');
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

        contratosList.innerHTML = '';

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

