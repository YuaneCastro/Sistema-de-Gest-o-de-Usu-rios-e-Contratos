document.addEventListener('DOMContentLoaded', async function () {
    const form = document.querySelector('form');
    const logTableBody = document.querySelector('#logTableBody');
    const successMessage = document.querySelector('#successMessage');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = form.querySelector('#username').value;
        const email = form.querySelector('#email').value;
        const senha = form.querySelector('#senha').value;

        try {
            const response = await fetch('/configuracoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    senha: senha
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

    // Função para carregar os logs de atividades
    async function carregarLogsAtividades() {
        try {
            const response = await fetch('/log-atividades');
            if (!response.ok) {
                throw new Error('Erro ao carregar logs de atividades');
            }
            const logs = await response.json();

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
            // Tratar erro: exibir mensagem de erro para o usuário se necessário
        }
    }

    // Carrega os logs de atividades inicialmente ao carregar a página
    await carregarLogsAtividades();
});