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
          alert('Login bem-sucedido');
          localStorage.setItem('token', data.token);
          // Redirecionar para outra página, se necessário
          window.location.href = '/some-other-page';
      } else {
          alert(data.message);
      }
  } catch (error) {
      alert('Erro ao fazer login');
  }
});
