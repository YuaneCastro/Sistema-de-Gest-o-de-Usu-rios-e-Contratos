d// script-atualizar.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const primeiroNome = form.querySelector('#primeiro_nome').value;
        const ultimoNome = form.querySelector('#ultimo_nome').value;
        const email = form.querySelector('#email').value;
        const senha = form.querySelector('#senha').value;

        try {
            const response = await fetch('/atualizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    primeiro_nome: primeiroNome,
                    ultimo_nome: ultimoNome,
                    email: email,
                    senha: senha
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar dados do usuário');
            }

            const responseData = await response.json();
            console.log('Dados atualizados:', responseData);
            
            // Redirecionar ou mostrar mensagem de sucesso
            window.location.href = `/atualizar?updated=true`; // Redireciona com parâmetro de atualização
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            // Tratar erro: exibir mensagem de erro para o usuário
        }
    });
});
