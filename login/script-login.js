document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/tela-principal';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Erro ao fazer login');
    }
});
