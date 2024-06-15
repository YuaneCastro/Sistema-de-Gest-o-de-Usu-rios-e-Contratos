document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const primeiro_nome = document.getElementById('primeiro_nome').value;
    const ultimo_nome = document.getElementById('ultimo_nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/cadastrar-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ primeiro_nome, ultimo_nome, email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Usuário cadastrado com sucesso');
            // Redirecionar para a tela principal
            window.location.href = '/tela-principal'; // ou outro caminho definido no servidor
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Erro ao cadastrar usuário');
    }
});
