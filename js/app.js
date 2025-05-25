/**
 * Script principal para o Sistema de Controle de Serviços
 */

// Funções globais para serem acessadas pelos botões da tabela de resultados
let carregarOS;
let fecharTelaPesquisa;
let imprimirOSPesquisa;

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('os-form');
    const numeroOSInput = document.getElementById('numero-os');
    const dataInput = document.getElementById('data');
    const equipamentoInput = document.getElementById('equipamento');
    const defeitoInput = document.getElementById('defeito');
    const servicoInput = document.getElementById('servico');
    const tecnicoInput = document.getElementById('tecnico');
    const valorTotalInput = document.getElementById('valor-total');
    const idClienteInput = document.getElementById('id-cliente');
    const clienteInput = document.getElementById('cliente');
    
    // Botões
    const btnNovo = document.getElementById('btn-novo');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnPesquisar = document.getElementById('btn-pesquisar');
    const btnExcluir = document.getElementById('btn-excluir');
    const btnImprimir = document.getElementById('btn-imprimir');
    
    // Variável para controlar se estamos editando uma OS existente
    let editando = false;
    let codigoOSAtual = null;
    
    // Inicializar data com a data atual
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    dataInput.value = dataFormatada;
    
    // Gerar número de OS automático (formato: OS + ano + mês + sequencial)
    function gerarNumeroOS() {
        const ano = hoje.getFullYear();
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
        const sequencial = Math.floor(Math.random() * 9000) + 1000; // Número aleatório entre 1000 e 9999
        return `OS${ano}${mes}${sequencial}`;
    }
    
    // Função para limpar o formulário
    function limparFormulario() {
        form.reset();
        dataInput.value = dataFormatada;
        numeroOSInput.value = gerarNumeroOS();
        editando = false;
        codigoOSAtual = null;
        btnExcluir.disabled = true;
    
        // Atualizar o título para "Nova Ordem de Serviço"
        atualizarTituloFormulario('novo');
    }
    
    // Função para carregar dados de um cliente pelo ID
    function carregarCliente(id) {
        fetch(`api/cliente_read_one.php?id=${id}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Cliente não encontrado');
                }
            })
            .then(data => {
                clienteInput.value = data.nome;
            })
            .catch(error => {
                alert(error.message);
                clienteInput.value = '';
            });
    }
    
    // Função para carregar uma OS pelo ID
    carregarOS = function(id) {
        fetch(`api/os_read_one.php?id=${id}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Ordem de serviço não encontrada');
                }
            })
            .then(data => {
                numeroOSInput.value = data.numeroOS;
                dataInput.value = data.dataAbertura;
                equipamentoInput.value = data.equipamento;
                defeitoInput.value = data.defeito;
                servicoInput.value = data.servico || '';
                tecnicoInput.value = data.tecnico || '';
                valorTotalInput.value = data.valorTotal || '';
                idClienteInput.value = data.codigoCliente;
                clienteInput.value = data.nomeCliente || '';
                
                editando = true;
                codigoOSAtual = data.codigoOS;
                btnExcluir.disabled = false;
            
                // Atualizar o título para "Editar Ordem de Serviço"
                atualizarTituloFormulario('editar');
            })
            .catch(error => {
                alert(error.message);
            });
    }
    
    // Função para salvar uma OS (criar nova ou atualizar existente)
    function salvarOS() {
        // Validar campos obrigatórios
        if (!numeroOSInput.value || !dataInput.value || !equipamentoInput.value || !defeitoInput.value || !idClienteInput.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Preparar dados para envio
        const osData = {
            numeroOS: numeroOSInput.value,
            dataAbertura: dataInput.value,
            equipamento: equipamentoInput.value,
            defeito: defeitoInput.value,
            servico: servicoInput.value,
            valorTotal: valorTotalInput.value || null,
            codigoCliente: idClienteInput.value
        };
        
        // Definir URL e método com base em se estamos editando ou criando
        let url = 'api/os_create.php';
        
        if (editando) {
            url = 'api/os_update.php';
            osData.codigoOS = codigoOSAtual;
        }
        
        // Enviar requisição
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(osData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (!editando && data.codigoOS) {
                codigoOSAtual = data.codigoOS;
                editando = true;
                btnExcluir.disabled = false;
                
                // Atualizar o título para "Editar Ordem de Serviço" após salvar
                atualizarTituloFormulario('editar');
            }
        })
        .catch(error => {
            alert('Erro ao salvar ordem de serviço: ' + error.message);
        });
    }
    
    // Função para excluir uma OS
    function excluirOS() {
        if (!codigoOSAtual) {
            alert('Nenhuma ordem de serviço selecionada.');
            return;
        }
        
        if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
            fetch('api/os_delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ codigoOS: codigoOSAtual })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                limparFormulario();
                
                // Atualizar o título para "Nova Ordem de Serviço" após excluir
                atualizarTituloFormulario('novo');
            })
            .catch(error => {
                alert('Erro ao excluir ordem de serviço: ' + error.message);
            });
        }
    }
    
    // Elementos da tela de pesquisa
    const searchScreen = document.getElementById('search-screen');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const btnExecutarPesquisa = document.getElementById('btn-executar-pesquisa');
    const btnLimparPesquisa = document.getElementById('btn-limpar-pesquisa');
    const searchNumeroOS = document.getElementById('search-numero-os');
    const searchCliente = document.getElementById('search-cliente');
    const searchDataAbertura = document.getElementById('search-data-abertura');
    const searchEquipamento = document.getElementById('search-equipamento');
    const resultsBody = document.getElementById('results-body');
    const noResultsMessage = document.getElementById('no-results-message');
    
    // Função para abrir a tela de pesquisa
    function pesquisarOS() {
        // Limpar campos e resultados anteriores
        limparFormularioPesquisa();
        
        // Atualizar o título para "Pesquisar Ordem de Serviço"
        atualizarTituloFormulario('pesquisar');
        
        // Exibir a tela de pesquisa
        searchScreen.style.display = 'flex';
    }
    
    // Função para fechar a tela de pesquisa
    fecharTelaPesquisa = function() {
        searchScreen.style.display = 'none';
    
        // Restaurar o título de acordo com o estado atual
        if (editando) {
            atualizarTituloFormulario('editar');
        } else {
            atualizarTituloFormulario('novo');
        }
    }
    
    // Função para limpar o formulário de pesquisa
    function limparFormularioPesquisa() {
        searchNumeroOS.value = '';
        searchCliente.value = '';
        // Não limpamos mais os outros campos pois não são mais utilizados
        resultsBody.innerHTML = '';
        noResultsMessage.style.display = 'none';
    }
    
    // Função para executar a pesquisa avançada
    function executarPesquisa() {
        // Construir os parâmetros de pesquisa
        const params = new URLSearchParams();
        
        if (searchNumeroOS.value) params.append('numero_os', searchNumeroOS.value);
        if (searchCliente.value) params.append('cliente', searchCliente.value);
        
        // Não utilizamos mais os campos de data e equipamento conforme solicitado
        // Permitir pesquisa sem filtros (retornará todas as ordens de serviço)
        
        // Limpar resultados anteriores
        resultsBody.innerHTML = '';
        noResultsMessage.style.display = 'none';
        
        // Executar a pesquisa
        fetch(`api/os_search.php?${params.toString()}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na pesquisa');
                }
            })
            .then(data => {
                if (data.length === 0) {
                    // Exibir mensagem de nenhum resultado
                    noResultsMessage.style.display = 'block';
                } else {
                    // Preencher a tabela com os resultados
                    data.forEach(os => {
                        const row = document.createElement('tr');
                        
                        // Formatar a data
                        const data = new Date(os.dataAbertura);
                        const dataFormatada = data.toLocaleDateString('pt-BR');
                        
                        // Formatar o valor
                        const valor = os.valorTotal ? parseFloat(os.valorTotal).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }) : '-';
                        
                        row.innerHTML = `
                            <td>${os.numeroOS}</td>
                            <td>${dataFormatada}</td>
                            <td>${os.nomeCliente || 'N/A'}</td>
                            <td>${os.equipamento}</td>
                            <td>${valor}</td>
                            <td>
                                <button class="action-btn edit-btn" data-id="${os.codigoOS}">Editar</button>
                                <button class="action-btn print-btn" data-id="${os.codigoOS}">Imprimir</button>
                            </td>
                        `;
                        
                        resultsBody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                alert('Erro na pesquisa: ' + error.message);
            });
    }
    
    // Função para imprimir OS a partir da tela de pesquisa
    imprimirOSPesquisa = function(codigoOS) {
        window.open(`imprimir_os.php?id=${codigoOS}`, '_blank');
    }
    
    // Função para imprimir a OS atual
    function imprimirOS() {
        if (!codigoOSAtual) {
            // Verificar se há um número de OS no campo, mesmo que não tenha sido salvo ainda
            const numeroOS = document.getElementById('numero-os').value;
            if (numeroOS) {
                // Tentar buscar a OS pelo número
                fetch(`api/os_search.php?numero_os=${numeroOS}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            // Usar o primeiro resultado encontrado
                            window.open(`imprimir_os.php?id=${data[0].codigoOS}`, '_blank');
                        } else {
                            alert('Ordem de serviço não encontrada. Salve-a primeiro.');
                        }
                    })
                    .catch(error => {
                        alert('Erro ao buscar ordem de serviço: ' + error.message);
                    });
            } else {
                alert('Nenhuma ordem de serviço selecionada para impressão.');
            }
            return;
        }
        
        // Em uma implementação real, você redirecionaria para uma página de impressão
        // ou abriria uma nova janela com o layout de impressão
        window.open(`imprimir_os.php?id=${codigoOSAtual}`, '_blank');
    }
    
    // Event listeners para os botões
    btnNovo.addEventListener('click', limparFormulario);
    btnSalvar.addEventListener('click', salvarOS);
    btnPesquisar.addEventListener('click', pesquisarOS);
    btnExcluir.addEventListener('click', excluirOS);
    btnImprimir.addEventListener('click', imprimirOS);
    
    // Event listeners para os botões da tela de pesquisa
    closeSearchBtn.addEventListener('click', fecharTelaPesquisa);
    btnExecutarPesquisa.addEventListener('click', executarPesquisa);
    btnLimparPesquisa.addEventListener('click', limparFormularioPesquisa);
    
    // Adicionar event listeners para os botões de editar e imprimir na tabela de resultados
    // Usando delegação de eventos para capturar cliques em botões que ainda não existem
    document.getElementById('results-body').addEventListener('click', function(e) {
        // Verificar se o clique foi em um botão de editar
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.getAttribute('data-id');
            carregarOS(id);
            fecharTelaPesquisa();
        }
        
        // Verificar se o clique foi em um botão de imprimir
        if (e.target.classList.contains('print-btn')) {
            const id = e.target.getAttribute('data-id');
            imprimirOSPesquisa(id);
        }
    });
    
    // Event listener para carregar cliente quando o ID é informado
    idClienteInput.addEventListener('blur', function() {
        if (this.value) {
            carregarCliente(this.value);
        } else {
            clienteInput.value = '';
        }
    });
    
    // Inicializar formulário
    limparFormulario();
    btnExcluir.disabled = true; // Desabilitar botão excluir inicialmente
    
    // Definir o título inicial
    atualizarTituloFormulario('novo');
});

// Função para atualizar o título do formulário de acordo com a ação atual
function atualizarTituloFormulario(acao) {
    const tituloFormulario = document.querySelector('.form-title');
    
    switch(acao) {
        case 'novo':
            tituloFormulario.textContent = 'Nova Ordem de Serviço';
            break;
        case 'editar':
            tituloFormulario.textContent = 'Editar Ordem de Serviço';
            break;
        case 'pesquisar':
            tituloFormulario.textContent = 'Pesquisar Ordem de Serviço';
            break;
        default:
            tituloFormulario.textContent = 'Ordem de Serviços';
            break;
    }
}
