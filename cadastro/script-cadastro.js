document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/cadastrar-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, senha })
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
