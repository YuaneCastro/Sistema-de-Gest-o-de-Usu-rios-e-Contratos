// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  loadContratos();

  // Botão de Configurações
  const configuracoesBtn = document.getElementById('configuracoes-btn');
  configuracoesBtn.addEventListener('click', () => {
      window.location.href = '/configuracoes';
  });

  // Botão de Criar Novo Contrato
const criarContratoBtn = document.getElementById('criar-contrato-btn');
  criarContratoBtn.addEventListener('click', () => {
      window.location.href = '/criar-contrato';
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
          contratosList.appendChild(contratoItem);
      });
  } catch (error) {
      console.error('Erro ao carregar contratos:', error.message);
  }
}
