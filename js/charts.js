/**
 * Script para geração de gráficos do Sistema de Controle de Serviços
 * Utiliza a biblioteca Chart.js para renderizar gráficos
 */

// Configurações padrão para todos os gráficos
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,  // Proporção fixa para todos os gráficos
    layout: {
        padding: {
            top: 10,
            right: 25,
            bottom: 10,
            left: 25
        }
    }
};

// Função para inicializar os gráficos
function initCharts() {
    // Verificar se a biblioteca Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está disponível. Verifique se a biblioteca foi carregada corretamente.');
        return;
    }

    // Limpar gráficos existentes
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = '<canvas id="relatorio-chart"></canvas>';
    
    // Definir tamanho fixo para o container de gráficos
    chartContainer.style.height = '400px';
    chartContainer.style.minHeight = '400px';
    chartContainer.style.maxHeight = '400px';
    chartContainer.style.width = '100%';
    chartContainer.style.display = 'flex';
    chartContainer.style.justifyContent = 'center';
    chartContainer.style.alignItems = 'center';
    chartContainer.style.overflow = 'hidden';
    
    // Obter o contexto do canvas
    const ctx = document.getElementById('relatorio-chart').getContext('2d');
    
    // Obter o tipo de relatório atual
    const tipoRelatorio = document.getElementById('tipo-relatorio').value;
    
    // Gerar o gráfico apropriado com base no tipo de relatório
    switch(tipoRelatorio) {
        case 'os':
            gerarGraficoOS(ctx);
            break;
        case 'clientes':
            gerarGraficoClientes(ctx);
            break;
        case 'colaboradores':
            gerarGraficoColaboradores(ctx);
            break;
        case 'cargos':
            gerarGraficoCargos(ctx);
            break;
        case 'usuarios':
            gerarGraficoUsuarios(ctx);
            break;
        default:
            console.error('Tipo de relatório não suportado para gráficos.');
    }
}

// Função para gerar gráfico de Ordens de Serviço
function gerarGraficoOS(ctx) {
    // Obter dados da tabela de relatório
    const rows = document.querySelectorAll('#report-table-body tr');
    
    // Se não houver dados, exibir mensagem
    if (rows.length === 0 || rows[0].classList.contains('no-results') || rows[0].classList.contains('error')) {
        exibirMensagemSemDados();
        return;
    }
    
    // Preparar dados para o gráfico
    const dadosOS = {
        labels: [],
        valores: [],
        status: {}
    };
    
    // Extrair dados das linhas da tabela
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            // Extrair data e valor
            const data = cells[1].textContent;
            // Verificar se o último campo contém o valor
            let valorText = cells[cells.length - 1].textContent;
            // Remover R$ e converter para número
            valorText = valorText.replace(/[^0-9,]/g, '').replace(',', '.').trim();
            const valor = parseFloat(valorText) || 0;
            
            // Adicionar aos arrays de dados
            dadosOS.labels.push(data);
            dadosOS.valores.push(valor);
            
            // Se tiver status (índice 5 para tabela de OS)
            if (cells.length >= 7) {
                const status = cells[5].textContent;
                if (status && status !== '-') {
                    if (!dadosOS.status[status]) {
                        dadosOS.status[status] = 0;
                    }
                    dadosOS.status[status]++;
                }
            }
        }
    });
    
    // Verificar se temos dados para exibir
    if (dadosOS.labels.length === 0) {
        exibirMensagemSemDados();
        return;
    }
    
    // Criar gráfico de barras para valores
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dadosOS.labels,
            datasets: [{
                label: 'Valor (R$)',
                data: dadosOS.valores,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(2).replace('.', ',');
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Valores de Ordens de Serviço'
                }
            }
        }
    });
    
    // Se houver dados de status, criar um segundo gráfico (pizza)
    if (Object.keys(dadosOS.status).length > 0) {
        // Ajustar o container principal para acomodar dois gráficos lado a lado
        const chartContainer = document.querySelector('.chart-container');
        chartContainer.style.height = '400px'; // Altura fixa
        chartContainer.style.minHeight = '400px';
        chartContainer.style.maxHeight = '400px';
        chartContainer.style.display = 'flex'; // Usar flexbox para layout lado a lado
        chartContainer.style.flexDirection = 'row';
        chartContainer.style.justifyContent = 'space-between';
        chartContainer.style.alignItems = 'center';
        chartContainer.style.gap = '20px';
        
        // Ajustar o tamanho do primeiro gráfico
        const firstChartCanvas = document.getElementById('relatorio-chart');
        firstChartCanvas.style.width = '48%';
        firstChartCanvas.style.height = '100%';
        firstChartCanvas.style.maxHeight = '380px';
        
        // Criar um novo canvas para o gráfico de pizza com ID único
        const pieContainer = document.createElement('div');
        pieContainer.className = 'pie-chart-container';
        pieContainer.style.width = '48%';
        pieContainer.style.height = '100%';
        pieContainer.style.maxHeight = '380px';
        pieContainer.style.position = 'relative';
        pieContainer.innerHTML = '<h4 style="text-align: center; margin-bottom: 10px;">Distribuição por Status</h4><canvas id="status-chart"></canvas>';
        
        // Adicionar o container do gráfico de pizza ao container principal
        chartContainer.appendChild(pieContainer);
        
        // Obter o contexto do canvas após ele ser adicionado ao DOM
        const ctxPie = document.getElementById('status-chart').getContext('2d');
        
        // Cores para o gráfico de pizza
        const backgroundColors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
        ];
        
        // Criar gráfico de pizza
        new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: Object.keys(dadosOS.status),
                datasets: [{
                    data: Object.values(dadosOS.status),
                    backgroundColor: backgroundColors.slice(0, Object.keys(dadosOS.status).length),
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')).slice(0, Object.keys(dadosOS.status).length),
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
}

// Função para gerar gráfico de Clientes
function gerarGraficoClientes(ctx) {
    // Obter dados da tabela de relatório
    const rows = document.querySelectorAll('#report-table-body tr');
    
    // Se não houver dados, exibir mensagem
    if (rows.length === 0 || rows[0].classList.contains('no-results') || rows[0].classList.contains('error')) {
        exibirMensagemSemDados();
        return;
    }
    
    // Padronizar o tamanho do container de gráficos
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.style.height = '400px';
    chartContainer.style.minHeight = '400px';
    chartContainer.style.maxHeight = '400px';
    chartContainer.style.width = '100%';
    chartContainer.style.display = 'flex';
    chartContainer.style.justifyContent = 'center';
    chartContainer.style.alignItems = 'center';
    chartContainer.style.overflow = 'hidden';
    
    // Criar gráfico de pizza para distribuição de clientes por data de cadastro
    const dadosCadastro = {};
    
    // Agrupar clientes por mês/ano de cadastro
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            const dataCadastro = cells[5].textContent;
            if (dataCadastro && dataCadastro !== '-') {
                // Extrair mês e ano da data
                const partes = dataCadastro.split('/');
                if (partes.length === 3) {
                    const mesAno = `${partes[1]}/${partes[2]}`;
                    if (!dadosCadastro[mesAno]) {
                        dadosCadastro[mesAno] = 0;
                    }
                    dadosCadastro[mesAno]++;
                }
            }
        }
    });
    
    // Verificar se temos dados para exibir
    if (Object.keys(dadosCadastro).length === 0) {
        exibirMensagemSemDados();
        return;
    }
    
    // Ordenar as chaves por data
    const labels = Object.keys(dadosCadastro).sort((a, b) => {
        const [mesA, anoA] = a.split('/');
        const [mesB, anoB] = b.split('/');
        return (anoA - anoB) || (mesA - mesB);
    });
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Clientes Cadastrados',
                data: labels.map(label => dadosCadastro[label]),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Clientes Cadastrados por Período'
                }
            }
        }
    });
}

// Função para gerar gráfico de Colaboradores
function gerarGraficoColaboradores(ctx) {
    // Obter dados da tabela de relatório
    const rows = document.querySelectorAll('#report-table-body tr');
    
    // Se não houver dados, exibir mensagem
    if (rows.length === 0 || rows[0].classList.contains('no-results') || rows[0].classList.contains('error')) {
        exibirMensagemSemDados();
        return;
    }
    
    // Padronizar o tamanho do container de gráficos
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.style.height = '400px';
    chartContainer.style.minHeight = '400px';
    chartContainer.style.maxHeight = '400px';
    chartContainer.style.width = '100%';
    chartContainer.style.display = 'flex';
    chartContainer.style.justifyContent = 'center';
    chartContainer.style.alignItems = 'center';
    chartContainer.style.overflow = 'hidden';
    
    // Agrupar colaboradores por cargo
    const dadosCargos = {};
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
            const cargo = cells[3].textContent;
            if (cargo && cargo !== '-') {
                if (!dadosCargos[cargo]) {
                    dadosCargos[cargo] = 0;
                }
                dadosCargos[cargo]++;
            }
        }
    });
    
    // Verificar se temos dados para exibir
    if (Object.keys(dadosCargos).length === 0) {
        exibirMensagemSemDados();
        return;
    }
    
    // Cores para o gráfico
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)'
    ];
    
    // Criar gráfico de pizza
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(dadosCargos),
            datasets: [{
                data: Object.values(dadosCargos),
                backgroundColor: backgroundColors.slice(0, Object.keys(dadosCargos).length),
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')).slice(0, Object.keys(dadosCargos).length),
                borderWidth: 1
            }]
        },
        options: {
            ...chartOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de Colaboradores por Cargo'
                },
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Função para gerar gráfico de Cargos
function gerarGraficoCargos(ctx) {
    // Obter dados da tabela de relatório
    const rows = document.querySelectorAll('#report-table-body tr');
    
    // Se não houver dados, exibir mensagem
    if (rows.length === 0 || rows[0].classList.contains('no-results') || rows[0].classList.contains('error')) {
        exibirMensagemSemDados();
        return;
    }
    
    // Padronizar o tamanho do container de gráficos
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.style.height = '400px';
    chartContainer.style.minHeight = '400px';
    chartContainer.style.maxHeight = '400px';
    chartContainer.style.width = '100%';
    chartContainer.style.display = 'flex';
    chartContainer.style.justifyContent = 'center';
    chartContainer.style.alignItems = 'center';
    chartContainer.style.overflow = 'hidden';
    
    // Preparar dados para o gráfico
    const dadosCargos = [];
    const labelsCargos = [];
    
    // Extrair dados das linhas da tabela
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            // Extrair nome do cargo e descrição
            const nomeCargo = cells[1].textContent;
            
            // Adicionar aos arrays de dados
            labelsCargos.push(nomeCargo);
            dadosCargos.push(1); // Cada cargo conta como 1 no gráfico
        }
    });
    
    // Verificar se temos dados para exibir
    if (labelsCargos.length === 0) {
        exibirMensagemSemDados();
        return;
    }
    
    // Cores para o gráfico
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)'
    ];
    
    // Criar gráfico de barras horizontais
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelsCargos,
            datasets: [{
                label: 'Cargos',
                data: dadosCargos,
                backgroundColor: backgroundColors.slice(0, labelsCargos.length),
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')).slice(0, labelsCargos.length),
                borderWidth: 1
            }]
        },
        options: {
            ...chartOptions,
            indexAxis: 'y',  // Barras horizontais
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Cargos Cadastrados'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Função para gerar gráfico de Usuários
function gerarGraficoUsuarios(ctx) {
    // Obter dados da tabela de relatório
    const rows = document.querySelectorAll('#report-table-body tr');
    
    // Se não houver dados, exibir mensagem
    if (rows.length === 0 || rows[0].classList.contains('no-results') || rows[0].classList.contains('error')) {
        exibirMensagemSemDados();
        return;
    }
    
    // Padronizar o tamanho do container de gráficos
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.style.height = '400px';
    chartContainer.style.minHeight = '400px';
    chartContainer.style.maxHeight = '400px';
    chartContainer.style.width = '100%';
    chartContainer.style.display = 'flex';
    chartContainer.style.justifyContent = 'center';
    chartContainer.style.alignItems = 'center';
    chartContainer.style.overflow = 'hidden';
    
    // Agrupar usuários por nível
    const dadosNiveis = {};
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const nivel = cells[3].textContent;
            if (nivel) {
                if (!dadosNiveis[nivel]) {
                    dadosNiveis[nivel] = 0;
                }
                dadosNiveis[nivel]++;
            }
        }
    });
    
    // Verificar se temos dados para exibir
    if (Object.keys(dadosNiveis).length === 0) {
        exibirMensagemSemDados();
        return;
    }
    
    // Cores para o gráfico
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)'
    ];
    
    // Criar gráfico de pizza
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(dadosNiveis),
            datasets: [{
                data: Object.values(dadosNiveis),
                backgroundColor: backgroundColors.slice(0, Object.keys(dadosNiveis).length),
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')).slice(0, Object.keys(dadosNiveis).length),
                borderWidth: 1
            }]
        },
        options: {
            ...chartOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de Usuários por Nível'
                },
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Função para exibir mensagem quando não há dados para gráfico
function exibirMensagemSemDados(mensagem = 'Não há dados suficientes para gerar o gráfico.') {
    const chartContainer = document.querySelector('.chart-container');
    // Manter o tamanho padrão mesmo quando não há dados
    chartContainer.style.height = '400px';
    chartContainer.style.minHeight = '400px';
    chartContainer.style.maxHeight = '400px';
    chartContainer.style.display = 'flex';
    chartContainer.style.justifyContent = 'center';
    chartContainer.style.alignItems = 'center';
    
    chartContainer.innerHTML = `
        <div class="chart-placeholder" style="width: 100%; text-align: center;">
            <p>${mensagem}</p>
        </div>
    `;
}

// Exportar funções
window.chartFunctions = {
    initCharts,
    gerarGraficoOS,
    gerarGraficoClientes,
    gerarGraficoColaboradores,
    gerarGraficoCargos,
    gerarGraficoUsuarios
};