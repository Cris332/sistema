/**
 * Script para gerenciamento de relatórios do Sistema de Controle de Serviços
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de filtro
    const selectPeriodo = document.getElementById('periodo');
    const tipoRelatorio = document.getElementById('tipo-relatorio');
    
    // Botões
    const btnGerarRelatorio = document.getElementById('btn-gerar-relatorio');
    const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
    const btnExportarPDF = document.getElementById('btn-exportar-pdf');
    const btnExportarExcel = document.getElementById('btn-exportar-excel');
    
    // Elementos de exibição do relatório
    const reportTitle = document.querySelector('.report-title');
    const reportTable = document.querySelector('.report-table');
    const reportTableBody = document.getElementById('report-table-body');
    const reportSummary = document.querySelector('.report-summary');
    
    // Função para formatar data no padrão brasileiro
    function formatarData(dataString) {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }
    
    // Função para formatar valor monetário
    function formatarValor(valor) {
        if (!valor) return '-';
        return parseFloat(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
    
    // Função para obter datas com base no período selecionado
    function obterDatasDoPeríodo(periodo) {
        const hoje = new Date();
        let dataInicio, dataFim;
        
        switch(periodo) {
            case 'hoje':
                dataInicio = new Date(hoje);
                dataFim = new Date(hoje);
                break;
            case 'semana':
                dataInicio = new Date(hoje);
                dataInicio.setDate(hoje.getDate() - 7);
                dataFim = new Date(hoje);
                break;
            case 'mes':
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
                break;
            case 'trimestre':
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
                dataFim = new Date(hoje);
                break;
            case 'ano':
                dataInicio = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate());
                dataFim = new Date(hoje);
                break;
            case 'todos':
                return { dataInicio: null, dataFim: null };
            default:
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
        }
        
        return {
            dataInicio: dataInicio.toISOString().split('T')[0],
            dataFim: dataFim.toISOString().split('T')[0]
        };
    }
    
    // Função para gerar relatório de Ordens de Serviço
    function gerarRelatorioOS() {
        // Construir parâmetros de pesquisa
        const params = new URLSearchParams();
        
        // Obter datas com base no período selecionado
        const { dataInicio, dataFim } = obterDatasDoPeríodo(selectPeriodo.value);
        
        if (dataInicio) params.append('data_inicio', dataInicio);
        if (dataFim) params.append('data_fim', dataFim);
        
        // Atualizar título do relatório
        reportTitle.textContent = 'Relatório de Ordens de Serviço';
        
        // Configurar cabeçalhos da tabela
        const tableHead = reportTable.querySelector('thead');
        tableHead.innerHTML = `
            <tr>
                <th>Número OS</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Equipamento</th>
                <th>Técnico</th>
                <th>Status</th>
                <th>Valor</th>
            </tr>
        `;
        
        // Limpar corpo da tabela
        reportTableBody.innerHTML = '';
        
        // Buscar dados da API
        fetch(`api/relatorio_os.php?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Exibir mensagem de nenhum resultado
                    reportTableBody.innerHTML = `<tr><td colspan="7" class="no-results">Nenhuma ordem de serviço encontrada.</td></tr>`;
                    reportSummary.innerHTML = '';
                    return;
                }
                
                // Preencher tabela com os resultados
                data.registros.forEach(os => {
                    const row = document.createElement('tr');
                    
                    // Traduzir status
                    let statusTraduzido = '';
                    switch(os.status) {
                        case 'aberta': statusTraduzido = 'Aberta'; break;
                        case 'em_andamento': statusTraduzido = 'Em Andamento'; break;
                        case 'concluida': statusTraduzido = 'Concluída'; break;
                        case 'cancelada': statusTraduzido = 'Cancelada'; break;
                        default: statusTraduzido = os.status;
                    }
                    
                    row.innerHTML = `
                        <td>${os.numeroOS}</td>
                        <td>${formatarData(os.dataAbertura)}</td>
                        <td>${os.nomeCliente || 'N/A'}</td>
                        <td>${os.equipamento}</td>
                        <td>${os.nomeTecnico || 'N/A'}</td>
                        <td>${statusTraduzido}</td>
                        <td>${formatarValor(os.valorTotal)}</td>
                    `;
                    
                    reportTableBody.appendChild(row);
                });
                
                // Atualizar resumo
                reportSummary.innerHTML = `
                    <div class="summary-item">
                        <span class="summary-label">Total de Ordens de Serviço:</span>
                        <span class="summary-value">${data.resumo.total_registros}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Valor Total:</span>
                        <span class="summary-value">${formatarValor(data.resumo.valor_total)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Média por OS:</span>
                        <span class="summary-value">${formatarValor(data.resumo.media_valor)}</span>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Erro ao gerar relatório:', error);
                reportTableBody.innerHTML = `<tr><td colspan="7" class="error">Erro ao gerar relatório: ${error.message}</td></tr>`;
                reportSummary.innerHTML = '';
            })
            .finally(() => {
                // Inicializar gráficos após carregar os dados
                if (window.chartFunctions) {
                    window.chartFunctions.initCharts();
                }
            });
    }
    
    // Função para gerar relatório de Clientes
    function gerarRelatorioClientes() {
        // Atualizar título do relatório
        reportTitle.textContent = 'Relatório de Clientes';
        
        // Configurar cabeçalhos da tabela
        const tableHead = reportTable.querySelector('thead');
        tableHead.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Data Cadastro</th>
            </tr>
        `;
        
        // Limpar corpo da tabela
        reportTableBody.innerHTML = '';
        
        // Buscar dados da API
        fetch('api/relatorio_clientes.php')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Exibir mensagem de nenhum resultado
                    reportTableBody.innerHTML = `<tr><td colspan="6" class="no-results">Nenhum cliente encontrado.</td></tr>`;
                    reportSummary.innerHTML = '';
                    return;
                }
                
                // Preencher tabela com os resultados
                data.forEach(cliente => {
                    const row = document.createElement('tr');
                    
                    // Determinar se exibe CPF ou CNPJ
                    const documento = cliente.cpf || cliente.cnpj || '-';
                    
                    row.innerHTML = `
                        <td>${cliente.codigoCliente}</td>
                        <td>${cliente.nome}</td>
                        <td>${documento}</td>
                        <td>${cliente.telefone || '-'}</td>
                        <td>${cliente.email || '-'}</td>
                        <td>${formatarData(cliente.dataCadastro)}</td>
                    `;
                    
                    reportTableBody.appendChild(row);
                });
                
                // Atualizar resumo
                reportSummary.innerHTML = `
                    <div class="summary-item">
                        <span class="summary-label">Total de Clientes:</span>
                        <span class="summary-value">${data.length}</span>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Erro ao gerar relatório:', error);
                reportTableBody.innerHTML = `<tr><td colspan="6" class="error">Erro ao gerar relatório: ${error.message}</td></tr>`;
                reportSummary.innerHTML = '';
            })
            .finally(() => {
                // Inicializar gráficos após carregar os dados
                if (window.chartFunctions) {
                    window.chartFunctions.initCharts();
                }
            });
    }
    
    // Função para gerar relatório de Colaboradores
    function gerarRelatorioColaboradores() {
        // Atualizar título do relatório
        reportTitle.textContent = 'Relatório de Colaboradores';
        
        // Configurar cabeçalhos da tabela
        const tableHead = reportTable.querySelector('thead');
        tableHead.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Cargo</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Data Contratação</th>
            </tr>
        `;
        
        // Limpar corpo da tabela
        reportTableBody.innerHTML = '';
        
        // Buscar dados da API
        fetch('api/relatorio_colaboradores.php')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Exibir mensagem de nenhum resultado
                    reportTableBody.innerHTML = `<tr><td colspan="7" class="no-results">Nenhum colaborador encontrado.</td></tr>`;
                    reportSummary.innerHTML = '';
                    return;
                }
                
                // Preencher tabela com os resultados
                data.forEach(colaborador => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${colaborador.codigoColaborador}</td>
                        <td>${colaborador.nome}</td>
                        <td>${colaborador.cpf || '-'}</td>
                        <td>${colaborador.nomeCargo || '-'}</td>
                        <td>${colaborador.telefone || '-'}</td>
                        <td>${colaborador.email || '-'}</td>
                        <td>${formatarData(colaborador.dataContratacao)}</td>
                    `;
                    
                    reportTableBody.appendChild(row);
                });
                
                // Atualizar resumo
                reportSummary.innerHTML = `
                    <div class="summary-item">
                        <span class="summary-label">Total de Colaboradores:</span>
                        <span class="summary-value">${data.length}</span>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Erro ao gerar relatório:', error);
                reportTableBody.innerHTML = `<tr><td colspan="7" class="error">Erro ao gerar relatório: ${error.message}</td></tr>`;
                reportSummary.innerHTML = '';
            })
            .finally(() => {
                // Inicializar gráficos após carregar os dados
                if (window.chartFunctions) {
                    window.chartFunctions.initCharts();
                }
            });
    }
    
    // Função para gerar relatório de Cargos
    function gerarRelatorioCargos() {
        // Atualizar título do relatório
        reportTitle.textContent = 'Relatório de Cargos';
        
        // Configurar cabeçalhos da tabela
        const tableHead = reportTable.querySelector('thead');
        tableHead.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Nome do Cargo</th>
                <th>Descrição</th>
            </tr>
        `;
        
        // Limpar corpo da tabela
        reportTableBody.innerHTML = '';
        
        // Buscar dados da API
        fetch('api/relatorio_cargos.php')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Exibir mensagem de nenhum resultado
                    reportTableBody.innerHTML = `<tr><td colspan="3" class="no-results">Nenhum cargo encontrado.</td></tr>`;
                    reportSummary.innerHTML = '';
                    return;
                }
                
                // Preencher tabela com os resultados
                data.forEach(cargo => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${cargo.codigoCargo}</td>
                        <td>${cargo.nomeCargo}</td>
                        <td>${cargo.descricao || '-'}</td>
                    `;
                    
                    reportTableBody.appendChild(row);
                });
                
                // Atualizar resumo
                reportSummary.innerHTML = `
                    <div class="summary-item">
                        <span class="summary-label">Total de Cargos:</span>
                        <span class="summary-value">${data.length}</span>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Erro ao gerar relatório:', error);
                reportTableBody.innerHTML = `<tr><td colspan="3" class="error">Erro ao gerar relatório: ${error.message}</td></tr>`;
                reportSummary.innerHTML = '';
            })
            .finally(() => {
                // Inicializar gráficos após carregar os dados
                if (window.chartFunctions) {
                    window.chartFunctions.initCharts();
                }
            });
    }
    
    // Função para gerar relatório de Usuários
    function gerarRelatorioUsuarios() {
        // Atualizar título do relatório
        reportTitle.textContent = 'Relatório de Usuários';
        
        // Configurar cabeçalhos da tabela
        const tableHead = reportTable.querySelector('thead');
        tableHead.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Nível</th>
                <th>Data Cadastro</th>
            </tr>
        `;
        
        // Limpar corpo da tabela
        reportTableBody.innerHTML = '';
        
        // Buscar dados da API
        fetch('api/relatorio_usuarios.php')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Exibir mensagem de nenhum resultado
                    reportTableBody.innerHTML = `<tr><td colspan="5" class="no-results">Nenhum usuário encontrado.</td></tr>`;
                    reportSummary.innerHTML = '';
                    return;
                }
                
                // Preencher tabela com os resultados
                data.forEach(usuario => {
                    const row = document.createElement('tr');
                    
                    // Traduzir nível
                    let nivelTraduzido = '';
                    switch(usuario.nivel) {
                        case 'admin': nivelTraduzido = 'Administrador'; break;
                        case 'usuario': nivelTraduzido = 'Usuário'; break;
                        default: nivelTraduzido = usuario.nivel;
                    }
                    
                    row.innerHTML = `
                        <td>${usuario.codigoUsuario}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${nivelTraduzido}</td>
                        <td>${formatarData(usuario.dataCadastro)}</td>
                    `;
                    
                    reportTableBody.appendChild(row);
                });
                
                // Atualizar resumo
                reportSummary.innerHTML = `
                    <div class="summary-item">
                        <span class="summary-label">Total de Usuários:</span>
                        <span class="summary-value">${data.length}</span>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Erro ao gerar relatório:', error);
                reportTableBody.innerHTML = `<tr><td colspan="5" class="error">Erro ao gerar relatório: ${error.message}</td></tr>`;
                reportSummary.innerHTML = '';
            })
            .finally(() => {
                // Inicializar gráficos após carregar os dados
                if (window.chartFunctions) {
                    window.chartFunctions.initCharts();
                }
            });
    }
    
    // Função para gerar relatório com base no tipo selecionado
    function gerarRelatorio() {
        const tipo = tipoRelatorio.value;
        
        switch(tipo) {
            case 'os':
                gerarRelatorioOS();
                break;
            case 'clientes':
                gerarRelatorioClientes();
                break;
            case 'colaboradores':
                gerarRelatorioColaboradores();
                break;
            case 'cargos':
                gerarRelatorioCargos();
                break;
            case 'usuarios':
                gerarRelatorioUsuarios();
                break;
            default:
                alert('Tipo de relatório não implementado.');
        }
    }
    
    // Função para limpar filtros
    function limparFiltros() {
        selectPeriodo.value = 'mes';
        tipoRelatorio.value = 'os';
    }
    
    // Função para exportar para PDF (simulação)
    function exportarPDF() {
        // Verificar se a biblioteca jsPDF está disponível
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            alert('Biblioteca jsPDF não está disponível. Verifique se a biblioteca foi carregada corretamente.');
            return;
        }
        
        // Obter o tipo de relatório atual
        const tipoRelatorio = document.getElementById('tipo-relatorio').value;
        const titulo = document.querySelector('.report-title').textContent;
        
        // Criar instância do jsPDF
        const { jsPDF } = jspdf;
        const doc = new jsPDF('landscape');
        
        // Adicionar título
        doc.setFontSize(16);
        doc.text(titulo, 14, 15);
        
        // Adicionar data de geração
        doc.setFontSize(10);
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        doc.text(`Data de geração: ${dataAtual}`, 14, 22);
        
        // Obter dados da tabela
        const tabela = document.querySelector('.report-table');
        const cabecalhos = [];
        const dados = [];
        
        // Extrair cabeçalhos
        tabela.querySelectorAll('thead th').forEach(th => {
            cabecalhos.push(th.textContent);
        });
        
        // Extrair dados
        tabela.querySelectorAll('tbody tr').forEach(tr => {
            if (tr.classList.contains('no-results') || tr.classList.contains('error')) {
                return; // Pular linhas de mensagem
            }
            
            const linha = [];
            tr.querySelectorAll('td').forEach(td => {
                linha.push(td.textContent);
            });
            
            dados.push(linha);
        });
        
        // Verificar se há dados para exportar
        if (dados.length === 0) {
            alert('Não há dados para exportar.');
            return;
        }
        
        // Gerar tabela no PDF
        doc.autoTable({
            head: [cabecalhos],
            body: dados,
            startY: 25,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [102, 153, 204],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            }
        });
        
        // Adicionar resumo se existir
        const resumo = document.querySelector('.report-summary');
        if (resumo && resumo.textContent.trim() !== '') {
            const itensResumo = [];
            resumo.querySelectorAll('.summary-item').forEach(item => {
                const label = item.querySelector('.summary-label').textContent;
                const value = item.querySelector('.summary-value').textContent;
                itensResumo.push(`${label} ${value}`);
            });
            
            if (itensResumo.length > 0) {
                const finalY = doc.lastAutoTable.finalY + 10;
                doc.setFontSize(10);
                doc.text('Resumo:', 14, finalY);
                
                itensResumo.forEach((item, index) => {
                    doc.text(item, 14, finalY + 6 + (index * 5));
                });
            }
        }
        
        // Salvar o PDF
        doc.save(`relatorio_${tipoRelatorio}_${dataAtual.replace(/\//g, '-')}.pdf`);
    }
    
    // Função para exportar para Excel (simulação)
    function exportarExcel() {
        // Verificar se a biblioteca SheetJS está disponível
        if (typeof XLSX === 'undefined') {
            alert('Biblioteca SheetJS não está disponível. Verifique se a biblioteca foi carregada corretamente.');
            return;
        }
        
        // Obter o tipo de relatório atual
        const tipoRelatorio = document.getElementById('tipo-relatorio').value;
        const titulo = document.querySelector('.report-title').textContent;
        
        // Obter dados da tabela
        const tabela = document.querySelector('.report-table');
        const cabecalhos = [];
        const dados = [];
        
        // Extrair cabeçalhos
        tabela.querySelectorAll('thead th').forEach(th => {
            cabecalhos.push(th.textContent);
        });
        
        // Extrair dados
        tabela.querySelectorAll('tbody tr').forEach(tr => {
            if (tr.classList.contains('no-results') || tr.classList.contains('error')) {
                return; // Pular linhas de mensagem
            }
            
            const linha = {};
            tr.querySelectorAll('td').forEach((td, index) => {
                linha[cabecalhos[index]] = td.textContent;
            });
            
            dados.push(linha);
        });
        
        // Verificar se há dados para exportar
        if (dados.length === 0) {
            alert('Não há dados para exportar.');
            return;
        }
        
        // Criar planilha
        const ws = XLSX.utils.json_to_sheet(dados);
        
        // Definir largura das colunas
        const wscols = cabecalhos.map(() => ({ wch: 20 })); // Largura padrão para todas as colunas
        ws['!cols'] = wscols;
        
        // Criar workbook e adicionar a planilha
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, titulo);
        
        // Adicionar resumo em uma nova planilha se existir
        const resumo = document.querySelector('.report-summary');
        if (resumo && resumo.textContent.trim() !== '') {
            const resumoData = [];
            resumo.querySelectorAll('.summary-item').forEach(item => {
                const label = item.querySelector('.summary-label').textContent;
                const value = item.querySelector('.summary-value').textContent;
                resumoData.push({ 'Item': label, 'Valor': value });
            });
            
            if (resumoData.length > 0) {
                const wsResumo = XLSX.utils.json_to_sheet(resumoData);
                XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
            }
        }
        
        // Gerar nome do arquivo
        const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        const nomeArquivo = `relatorio_${tipoRelatorio}_${dataAtual}.xlsx`;
        
        // Salvar o arquivo
        XLSX.writeFile(wb, nomeArquivo);
    }
    
    // Event listeners para os botões
    btnGerarRelatorio.addEventListener('click', gerarRelatorio);
    btnLimparFiltros.addEventListener('click', limparFiltros);
    btnExportarPDF.addEventListener('click', exportarPDF);
    btnExportarExcel.addEventListener('click', exportarExcel);
    
    // Atualizar visibilidade do filtro de período com base no tipo de relatório
    tipoRelatorio.addEventListener('change', function() {
        const tipoSelecionado = tipoRelatorio.value;
        const filtroPeriodoContainer = document.getElementById('filtro-periodo-container');
        
        // Mostrar filtro de período apenas para relatórios que precisam de data
        if (tipoSelecionado === 'os') {
            filtroPeriodoContainer.style.display = 'block';
        } else {
            filtroPeriodoContainer.style.display = 'none';
        }
    });
    
    // Verificar visibilidade inicial
    tipoRelatorio.dispatchEvent(new Event('change'));
    
    // Já estamos controlando a visibilidade dos filtros acima
    // Não precisamos do código antigo que controlava os filtros removidos
    
    // Gerar relatório inicial (OS)
    gerarRelatorioOS();
});