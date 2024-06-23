document.addEventListener('DOMContentLoaded', () => {
    loadContratos();
    
    // Link de Novo Contrato
    document.getElementById('criar-contrato-link').addEventListener('click', function() {
        document.body.classList.add('show-contrato-screen');
    });
  
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
  
    // Voltar da tela de Criação de Contratos
    document.getElementById('contrato-back-button').addEventListener('click', function() {
        document.body.classList.remove('show-contrato-screen');
    });
  
    // Submissão do formulário de atualização de informações
    document.querySelector('form[action="/configuracoes"]').addEventListener('submit', async function(event) {
        event.preventDefault();
        
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
            // document.body.classList.remove('show-update-screen'); // Não remover a tela de atualização
            // Adicionar lógica adicional após a atualização, se necessário
  
        } catch (error) {
            console.error('Erro ao atualizar informações:', error.message);
        }
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
  
    // Botão de Logout
    document.getElementById('logout-button').addEventListener('click', function() {
        window.location.href = '/logout';
    });
  
    // Botão de Próximo na tela de Criação de Contratos
    document.getElementById('next-button').addEventListener('click', function() {
        alert('Avançar para a próxima etapa');
        // Adicione aqui a lógica para avançar para a próxima etapa da criação de contratos
    });
  });
  