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


    document.getElementById('criar-contrato-link').addEventListener('click', function() {
        document.getElementById('criar-contrato-screen').style.display = 'block';
    });

    document.getElementById('criar-contrato-back-button').addEventListener('click', function() {
        document.getElementById('criar-contrato-screen').style.display = 'none';
    });

    document.getElementById('criar-contrato-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const data = {
            titulo: form.titulo.value,
            dataTermino: form['data-termino'].value,
            contratanteNome: form['contratante-nome'].value,
            contratanteNif: form['contratante-nif'].value,
            contratanteEndereco: form['contratante-endereco'].value,
            contratadoNome: form['contratado-nome'].value,
            contratadoNif: form['contratado-nif'].value,
            contratadoEndereco: form['contratado-endereco'].value
        };

        try {
            const response = await fetch('/api/contratos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Contrato criado com sucesso!');
                form.reset();
                document.getElementById('criar-contrato-screen').style.display = 'none';
            } else {
                throw new Error('Erro ao criar contrato');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao criar contrato');
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
          contratosList.appendChild(contratoItem);
      });
  } catch (error) {
      console.error('Erro ao carregar contratos:', error.message);
  }
}
