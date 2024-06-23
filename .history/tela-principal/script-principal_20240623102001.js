document.addEventListener('DOMContentLoaded', () => {
    loadContratos();
    const form = document.querySelector('form');
    const logTableBody = document.querySelector('#logTableBody');
    const successMessage = document.querySelector('#successMessage');

    form.addEventListener('submit', async function (event) {
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
            successMessage.style.display = 'block'; // Mostra mensagem de sucesso
            setTimeout(() => {
                successMessage.style.display = 'none'; // Esconde após alguns segundos
            }, 3000);
            form.reset(); // Limpa o formulário após a atualização
            // Após atualizar, recarrega os logs de atividade
            await carregarLogsAtividades();
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            // Tratar erro: exibir mensagem de erro para o usuário se necessário
        }
    });

    // Link de Novo Contrato
    document.getElementById('criar-contrato-link').addEventListener('click', function() {
        window.location.href = '/criar-contrato';
    });

    // Link de Gerir Conta
    document.getElementById('manage-account-link').addEventListener('click', function() {
        document.body.classList.add('show-help-screen');
    });
