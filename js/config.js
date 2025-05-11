/**
 * Sistema de Configurações Globais
 * Este arquivo gerencia as configurações do sistema e as aplica em todas as páginas
 * Inclui funções para salvar, carregar e restaurar configurações
 * 
 * Versão 2.0 - Implementação completa de todas as configurações
 */

// Variável global para rastrear o status da inicialização das configurações
window.sistemaConfigurado = false;

// Inicializar configurações quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de configurações...');
    
    // Carregar e aplicar configurações salvas
    const config = carregarConfiguracoesSistema();
    
    // Aplicar todas as configurações de uma vez
    aplicarConfiguracoesSistema(config);
    
    // Configurar elementos da página de opções se estiver nela
    configurarPaginaOpcoes();
    
    // Marcar sistema como configurado
    window.sistemaConfigurado = true;
    console.log('Sistema de configurações inicializado com sucesso.');
    
    // Adicionar indicador visual na página atual da navegação
    marcarPaginaAtualNavegacao();
    
    // Se a configuração de modo de fala estiver ativada, inicializá-la
    if (config.acessibilidade.modoFala) {
        try {
            if (typeof ativarModoFala === 'function') {
                ativarModoFala(true, config.acessibilidade.velocidadeFala || 1.0);
                console.log('Modo de fala ativado automaticamente.');
            }
        } catch (e) {
            console.error('Erro ao ativar modo de fala:', e);
        }
    }
});

// Função para configurar a página de opções
function configurarPaginaOpcoes() {
    // Verificar se estamos na página de opções
    if (window.location.href.includes('opcoes.html')) {
        const config = carregarConfiguracoesSistema();
        
        // Configurar os elementos da interface com os valores salvos
        document.getElementById('tema-escuro').checked = config.aparencia.temaEscuro;
        document.getElementById('fonte-grande').checked = config.aparencia.fonteGrande;
        document.getElementById('alto-contraste').checked = config.aparencia.altoContraste;
        document.getElementById('tamanho-fonte').value = config.aparencia.tamanhoFonte;
        document.getElementById('valor-fonte').textContent = `${config.aparencia.tamanhoFonte}px`;
        
        document.getElementById('leitor-tela').checked = config.acessibilidade.leitorTela;
        document.getElementById('navegar-teclado').checked = config.acessibilidade.navegarTeclado;
        document.getElementById('reducao-movimento').checked = config.acessibilidade.reducaoMovimento;
        
        document.getElementById('imprimir-logo').checked = config.impressao.logo;
        document.getElementById('imprimir-data').checked = config.impressao.data;
        document.getElementById('imprimir-cabecalho').checked = config.impressao.cabecalho;
        
        document.getElementById('notificar-os-nova').checked = config.notificacoes.osNova;
        document.getElementById('notificar-os-concluida').checked = config.notificacoes.osConcluida;
        document.getElementById('notificar-cliente-novo').checked = config.notificacoes.clienteNovo;
        document.getElementById('tempo-notificacao').value = config.notificacoes.tempo;
        document.getElementById('valor-tempo-notificacao').textContent = `${config.notificacoes.tempo}s`;
        
        document.getElementById('backup-automatico').checked = config.backup.automatico;
        document.getElementById('backup-nuvem').checked = config.backup.nuvem;
        document.getElementById('horario-backup').value = config.backup.horario;
        
        // Adicionar eventos para aplicar configurações em tempo real
        document.getElementById('tema-escuro').addEventListener('change', function() {
            aplicarTemaEscuro(this.checked);
        });
        
        document.getElementById('fonte-grande').addEventListener('change', function() {
            aplicarFonteGrande(this.checked);
        });
        
        document.getElementById('alto-contraste').addEventListener('change', function() {
            aplicarAltoContraste(this.checked);
        });
        
        document.getElementById('tamanho-fonte').addEventListener('input', function() {
            document.getElementById('valor-fonte').textContent = `${this.value}px`;
            aplicarTamanhoFonte(parseInt(this.value));
        });
        
        document.getElementById('leitor-tela').addEventListener('change', function() {
            aplicarOtimizacaoLeitorTela(this.checked);
        });
        
        document.getElementById('navegar-teclado').addEventListener('change', function() {
            aplicarNavegacaoTeclado(this.checked);
        });
        
        document.getElementById('reducao-movimento').addEventListener('change', function() {
            aplicarReducaoMovimento(this.checked);
        });
        
        document.getElementById('tempo-notificacao').addEventListener('input', function() {
            document.getElementById('valor-tempo-notificacao').textContent = `${this.value}s`;
        });
        
        // Adicionar eventos para salvar configurações
        document.getElementById('btn-salvar-opcoes').addEventListener('click', salvarConfiguracoes);
        document.getElementById('btn-restaurar-padrao').addEventListener('click', function() {
            const configPadrao = restaurarPadrao();
            mostrarNotificacao('Configurações restauradas para os valores padrão');
            // Recarregar a página para atualizar todos os controles
            setTimeout(() => window.location.reload(), 1500);
        });
        
        // Adicionar evento para backup manual
        document.getElementById('btn-backup-manual').addEventListener('click', realizarBackupManual);
    }
}


// Configurações padrão do sistema
const configuracoesDefault = {
    aparencia: {
        temaEscuro: false,
        fonteGrande: false,
        altoContraste: false,
        tamanhoFonte: 16
    },
    acessibilidade: {
        leitorTela: false,
        navegarTeclado: false,
        reducaoMovimento: false,
        modoFala: false,
        velocidadeFala: 1.0
    },
    impressao: {
        logo: true,
        data: true,
        cabecalho: true
    },
    notificacoes: {
        osNova: false,
        osConcluida: false,
        clienteNovo: false,
        tempo: 5
    },
    backup: {
        automatico: false,
        nuvem: false,
        horario: "23:00"
    },
    entregas: {
        velocidadeSimulacao: 2, // Velocidade da simulação (1-5)
        mostrarRota: true,      // Mostrar linha da rota no mapa
        mostrarLog: true,       // Mostrar histórico de entregas
        centralPadrao: [-23.550520, -46.633308] // Coordenadas da central (São Paulo)
    }
};

// Função para carregar configurações do localStorage
function carregarConfiguracoesSistema() {
    // Tentar recuperar do localStorage
    const configuracoesSalvas = localStorage.getItem('sistema_configuracoes');
    
    // Usar configurações padrão caso não exista nada salvo
    let config = JSON.parse(JSON.stringify(configuracoesDefault));
    
    // Se existirem configurações salvas, sobrescrever as padrões
    if (configuracoesSalvas) {
        const configSalvas = JSON.parse(configuracoesSalvas);
        
        // Mesclar configurações salvas com as padrão para garantir que todas as propriedades existam
        if (configSalvas.aparencia) {
            config.aparencia = {...config.aparencia, ...configSalvas.aparencia};
        }
        
        if (configSalvas.acessibilidade) {
            config.acessibilidade = {...config.acessibilidade, ...configSalvas.acessibilidade};
        }
        
        if (configSalvas.impressao) {
            config.impressao = {...config.impressao, ...configSalvas.impressao};
        }
        
        if (configSalvas.notificacoes) {
            config.notificacoes = {...config.notificacoes, ...configSalvas.notificacoes};
        }
        
        if (configSalvas.backup) {
            config.backup = {...config.backup, ...configSalvas.backup};
        }
        
        if (configSalvas.entregas) {
            config.entregas = {...config.entregas, ...configSalvas.entregas};
        }
    }
    
    return config;
}

// Função para aplicar tema escuro
function aplicarTemaEscuro(ativar) {
    if (ativar) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Função para aplicar alto contraste
function aplicarAltoContraste(ativar) {
    if (ativar) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

// Função para aplicar fonte grande
function aplicarFonteGrande(ativar) {
    document.documentElement.style.setProperty('--font-size-base', ativar ? 'var(--font-size-large)' : '16px');
}

// Função para aplicar tamanho de fonte personalizado
function aplicarTamanhoFonte(tamanho) {
    document.documentElement.style.setProperty('--font-size-base', `${tamanho}px`);
    document.documentElement.style.setProperty('--font-size-large', `${Number(tamanho) + 2}px`);
}

// Função para restaurar configurações padrão
function restaurarConfiguracoesDefault() {
    // Remover configurações do localStorage
    localStorage.removeItem('sistema_configuracoes');
    
    // Obter configurações padrão (cópia profunda para evitar referências)
    const configPadrao = JSON.parse(JSON.stringify(configuracoesDefault));
    
    // Aplicar as configurações padrão
    aplicarTemaEscuro(configPadrao.aparencia.temaEscuro);
    aplicarFonteGrande(configPadrao.aparencia.fonteGrande);
    aplicarAltoContraste(configPadrao.aparencia.altoContraste);
    aplicarTamanhoFonte(configPadrao.aparencia.tamanhoFonte);
    
    // Aplicar outras configurações de acessibilidade
    if (typeof aplicarOtimizacaoLeitorTela === 'function') {
        aplicarOtimizacaoLeitorTela(configPadrao.acessibilidade.leitorTela);
    }
    
    if (typeof aplicarNavegacaoTeclado === 'function') {
        aplicarNavegacaoTeclado(configPadrao.acessibilidade.navegarTeclado);
    }
    
    if (typeof aplicarReducaoMovimento === 'function') {
        aplicarReducaoMovimento(configPadrao.acessibilidade.reducaoMovimento);
    }
    
    // Retornar as configurações padrão para uso em outras funções
    return configPadrao;
}

// Alias para restaurarConfiguracoesDefault para manter compatibilidade
function restaurarPadrao() {
    return restaurarConfiguracoesDefault();
}

// Função para aplicar otimização para leitores de tela
function aplicarOtimizacaoLeitorTela(ativar) {
    if (ativar) {
        document.body.setAttribute('role', 'application');
        
        // Adicionar atributos ARIA para melhorar acessibilidade
        document.querySelectorAll('button').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
                if (el.title) {
                    el.setAttribute('aria-label', el.title);
                }
            }
        });
        
        // Adicionar roles para elementos de formulário
        document.querySelectorAll('form').forEach(form => {
            form.setAttribute('role', 'form');
        });
        
        // Adicionar descrições para campos obrigatórios
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(el => {
            el.setAttribute('aria-required', 'true');
        });
        
        // Melhorar navegação por seções
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
            el.setAttribute('tabindex', '0');
        });
        
        // Adicionar descrições para imagens sem alt
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', 'Imagem');
        });
    } else {
        document.body.removeAttribute('role');
        
        // Remover atributos adicionados
        document.querySelectorAll('[aria-required]').forEach(el => {
            el.removeAttribute('aria-required');
        });
        
        document.querySelectorAll('h1[tabindex], h2[tabindex], h3[tabindex], h4[tabindex], h5[tabindex], h6[tabindex]').forEach(el => {
            el.removeAttribute('tabindex');
        });
        
        document.querySelectorAll('form[role="form"]').forEach(form => {
            form.removeAttribute('role');
        });
    }
}

// Função para aplicar navegação por teclado aprimorada
function aplicarNavegacaoTeclado(ativar) {
    // Selecionar todos os elementos que podem receber foco
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    if (ativar) {
        // Adicionar classe para estilo de foco visível
        focusableElements.forEach(el => {
            el.classList.add('focus-visible');
        });
        
        // Adicionar atributos de acessibilidade
        document.querySelectorAll('button, a').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
                // Adicionar aria-label para botões sem texto
                if (el.title) {
                    el.setAttribute('aria-label', el.title);
                } else if (el.querySelector('i.fa, i.fas, i.far, i.fab')) {
                    // Tentar extrair o nome do ícone
                    const iconClass = Array.from(el.querySelector('i').classList)
                        .find(cls => !['fa', 'fas', 'far', 'fab'].includes(cls));
                    if (iconClass) {
                        el.setAttribute('aria-label', iconClass.replace('fa-', '').replace(/-/g, ' '));
                    }
                }
            }
        });
        
        // Adicionar navegação por teclas de atalho
        document.addEventListener('keydown', navegacaoTecladoHandler);
        
        // Adicionar tabindex a elementos que devem ser focáveis
        document.querySelectorAll('.option-title, .form-title, h2, h3').forEach(el => {
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });
    } else {
        // Remover classe de foco visível
        focusableElements.forEach(el => {
            el.classList.remove('focus-visible');
        });
        
        // Remover navegação por teclas de atalho
        document.removeEventListener('keydown', navegacaoTecladoHandler);
        
        // Remover tabindex de elementos não padrão
        document.querySelectorAll('.option-title[tabindex], .form-title[tabindex], h2[tabindex], h3[tabindex]').forEach(el => {
            el.removeAttribute('tabindex');
        });
    }
}

// Função para lidar com navegação por teclado
function navegacaoTecladoHandler(e) {
    // Teclas de atalho para navegação
    if (e.altKey) {
        // Alt + 1-4 para navegação principal
        if (e.key === '1') {
            e.preventDefault();
            const link = document.querySelector('nav ul li:nth-child(1) a');
            if (link) link.click();
        } else if (e.key === '2') {
            e.preventDefault();
            const link = document.querySelector('nav ul li:nth-child(2) a');
            if (link) link.click();
        } else if (e.key === '3') {
            e.preventDefault();
            const link = document.querySelector('nav ul li:nth-child(3) a');
            if (link) link.click();
        } else if (e.key === '4') {
            e.preventDefault();
            const link = document.querySelector('nav ul li:nth-child(4) a');
            if (link) link.click();
        }
    }
    
    // Tab para navegar entre elementos focáveis
    if (e.key === 'Tab') {
        // Adicionar classe visual temporária para mostrar o foco
        setTimeout(() => {
            const focusedElement = document.activeElement;
            if (focusedElement) {
                focusedElement.classList.add('keyboard-focus');
                setTimeout(() => {
                    focusedElement.classList.remove('keyboard-focus');
                }, 1000);
            }
        }, 10);
    }
}

// Função para reduzir animações
function aplicarReducaoMovimento(ativar) {
    if (ativar) {
        let style = document.getElementById('reducao-movimento-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'reducao-movimento-style';
            style.textContent = `
                * {
                    animation-duration: 0.001s !important;
                    transition-duration: 0.001s !important;
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        const style = document.getElementById('reducao-movimento-style');
        if (style) style.remove();
    }
}

// Função para aplicar todas as configurações
function aplicarConfiguracoesSistema(config) {
    // Verificar se as variáveis CSS base existem, se não, criar
    if (!document.querySelector(':root').style.getPropertyValue('--font-size-base')) {
        document.documentElement.style.setProperty('--font-size-base', '16px');
        document.documentElement.style.setProperty('--font-size-large', '18px');
        document.documentElement.style.setProperty('--background-color', '#f0f0f0');
        document.documentElement.style.setProperty('--text-color', '#333');
        document.documentElement.style.setProperty('--primary-color', '#6699cc');
        document.documentElement.style.setProperty('--secondary-color', '#3366cc');
        document.documentElement.style.setProperty('--content-bg', '#3366cc');
        document.documentElement.style.setProperty('--form-bg', '#e6e6e6');
        document.documentElement.style.setProperty('--option-bg', '#f9f9f9');
        document.documentElement.style.setProperty('--border-color', '#ddd');
        document.documentElement.style.setProperty('--contrast-text', '#000');
        document.documentElement.style.setProperty('--contrast-bg', '#fff');
        document.documentElement.style.setProperty('--success-color', '#5cb85c');
        document.documentElement.style.setProperty('--warning-color', '#f0ad4e');
    }

    // Aplicar tema e fonte
    aplicarTemaEscuro(config.aparencia.temaEscuro);
    aplicarFonteGrande(config.aparencia.fonteGrande);
    aplicarAltoContraste(config.aparencia.altoContraste);
    aplicarTamanhoFonte(config.aparencia.tamanhoFonte);
    
    // Aplicar acessibilidade
    aplicarOtimizacaoLeitorTela(config.acessibilidade.leitorTela);
    aplicarNavegacaoTeclado(config.acessibilidade.navegarTeclado);
    aplicarReducaoMovimento(config.acessibilidade.reducaoMovimento);
    
    // Aplicar configurações de impressão
    aplicarConfiguracoesImpressao(config.impressao);
    
    // Aplicar configurações de modo de fala se o script estiver disponível
    if (typeof ativarModoFala === 'function' && config.acessibilidade.modoFala) {
        ativarModoFala(config.acessibilidade.modoFala, config.acessibilidade.velocidadeFala);
    }
    
    // Adicionar estilos para foco visível se necessário
    if (!document.getElementById('focus-visible-style')) {
        const style = document.createElement('style');
        style.id = 'focus-visible-style';
        style.textContent = `
            .focus-visible:focus {
                outline: 3px solid orange !important;
                outline-offset: 3px;
            }
            
            .keyboard-focus {
                outline: 3px solid #4e73df !important;
                outline-offset: 3px;
                animation: pulse-focus 1s 1;
            }
            
            @keyframes pulse-focus {
                0% { outline-color: #4e73df; }
                50% { outline-color: #f6c23e; }
                100% { outline-color: #4e73df; }
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--primary-color);
                color: white;
                padding: 8px;
                z-index: 100;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Configurar notificações
    configurarNotificacoes(config.notificacoes);
}

// Esta função foi removida para evitar duplicação
// Agora usamos apenas restaurarConfiguracoesDefault() e seu alias restaurarPadrao()

// Função para salvar configurações do sistema
function salvarConfiguracoes() {
    // Obter valores dos elementos da página de opções
    const config = {
        aparencia: {
            temaEscuro: document.getElementById('tema-escuro').checked,
            fonteGrande: document.getElementById('fonte-grande').checked,
            altoContraste: document.getElementById('alto-contraste').checked,
            tamanhoFonte: parseInt(document.getElementById('tamanho-fonte').value)
        },
        acessibilidade: {
            leitorTela: document.getElementById('leitor-tela').checked,
            navegarTeclado: document.getElementById('navegar-teclado').checked,
            reducaoMovimento: document.getElementById('reducao-movimento').checked,
            modoFala: document.getElementById('modo-fala') ? document.getElementById('modo-fala').checked : false,
            velocidadeFala: document.getElementById('velocidade-fala') ? parseFloat(document.getElementById('velocidade-fala').value) : 1.0
        },
        impressao: {
            logo: document.getElementById('imprimir-logo').checked,
            data: document.getElementById('imprimir-data').checked,
            cabecalho: document.getElementById('imprimir-cabecalho').checked
        },
        notificacoes: {
            osNova: document.getElementById('notificar-os-nova').checked,
            osConcluida: document.getElementById('notificar-os-concluida').checked,
            clienteNovo: document.getElementById('notificar-cliente-novo').checked,
            tempo: parseInt(document.getElementById('tempo-notificacao').value)
        },
        backup: {
            automatico: document.getElementById('backup-automatico').checked,
            nuvem: document.getElementById('backup-nuvem').checked,
            horario: document.getElementById('horario-backup').value
        },
        entregas: carregarConfiguracoesSistema().entregas // Manter as configurações de entregas existentes
    };
    
    // Salvar no localStorage
    localStorage.setItem('sistema_configuracoes', JSON.stringify(config));
    
    // Aplicar configurações
    aplicarConfiguracoesSistema(config);
    
    // Mostrar notificação
    mostrarNotificacao('Configurações salvas com sucesso!');
    
    // Configurar backup automático se ativado
    if (config.backup.automatico) {
        configurarBackupAutomatico(config.backup.horario);
    }
    
    return config;
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, duracao = null) {
    const notification = document.getElementById('notification');
    if (!notification) {
        // Criar elemento de notificação se não existir
        const notif = document.createElement('div');
        notif.id = 'notification';
        notif.className = 'notification';
        notif.innerHTML = `<span id="notification-message">${mensagem}</span>`;
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.classList.add('show');
        }, 10);
        
        // Usar tempo das configurações ou padrão
        const config = carregarConfiguracoesSistema();
        const tempoDuracao = duracao || (config.notificacoes.tempo * 1000);
        
        setTimeout(() => {
            notif.classList.remove('show');
        }, tempoDuracao);
    } else {
        // Usar notificação existente
        notification.querySelector('#notification-message').textContent = mensagem;
        notification.classList.add('show');
        
        // Usar tempo das configurações ou padrão
        const config = carregarConfiguracoesSistema();
        const tempoDuracao = duracao || (config.notificacoes.tempo * 1000);
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, tempoDuracao);
    }
}

// Função para configurar notificações
function configurarNotificacoes(configNotificacoes) {
    // Esta função configura o comportamento das notificações
    // baseado nas preferências do usuário
    window.sistemaNotificacoes = {
        osNova: configNotificacoes.osNova,
        osConcluida: configNotificacoes.osConcluida,
        clienteNovo: configNotificacoes.clienteNovo,
        tempo: configNotificacoes.tempo
    };
    
    // Método para verificar se deve notificar
    window.deveNotificar = function(tipo) {
        return window.sistemaNotificacoes[tipo] === true;
    };
    
    // Método para obter tempo de notificação
    window.getTempoNotificacao = function() {
        return window.sistemaNotificacoes.tempo * 1000;
    };
}

// Função para aplicar configurações de impressão
function aplicarConfiguracoesImpressao(configImpressao) {
    // Salvar configurações para uso ao imprimir
    window.configuracoesImpressao = {
        logo: configImpressao.logo,
        data: configImpressao.data,
        cabecalho: configImpressao.cabecalho
    };
    
    // Adicionar estilo de impressão se não existir
    if (!document.getElementById('estilo-impressao')) {
        const style = document.createElement('style');
        style.id = 'estilo-impressao';
        style.textContent = `
            @media print {
                .no-print {
                    display: none !important;
                }
                
                body {
                    background-color: white !important;
                    color: black !important;
                }
                
                .print-header {
                    display: ${configImpressao.cabecalho ? 'block' : 'none'} !important;
                }
                
                .print-logo {
                    display: ${configImpressao.logo ? 'block' : 'none'} !important;
                }
                
                .print-date {
                    display: ${configImpressao.data ? 'block' : 'none'} !important;
                }
            }
        `;
        document.head.appendChild(style);
    } else {
        // Atualizar estilo existente
        const style = document.getElementById('estilo-impressao');
        style.textContent = `
            @media print {
                .no-print {
                    display: none !important;
                }
                
                body {
                    background-color: white !important;
                    color: black !important;
                }
                
                .print-header {
                    display: ${configImpressao.cabecalho ? 'block' : 'none'} !important;
                }
                
                .print-logo {
                    display: ${configImpressao.logo ? 'block' : 'none'} !important;
                }
                
                .print-date {
                    display: ${configImpressao.data ? 'block' : 'none'} !important;
                }
            }
        `;
    }
}

// Função para realizar backup manual
function realizarBackupManual() {
    // Em uma implementação real, aqui seria feita uma requisição ao servidor
    const date = new Date();
    const dataFormatada = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    const horaFormatada = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    // Simular salvamento do backup
    const backupData = {
        data: dataFormatada,
        hora: horaFormatada,
        tipo: 'manual',
        configuracoes: localStorage.getItem('sistema_configuracoes'),
        dados: 'Dados do sistema' // Em uma implementação real, seriam os dados do sistema
    };
    
    // Salvar no localStorage para simular
    const backups = JSON.parse(localStorage.getItem('sistema_backups') || '[]');
    backups.push(backupData);
    localStorage.setItem('sistema_backups', JSON.stringify(backups));
    
    // Mostrar notificação
    mostrarNotificacao(`Backup realizado com sucesso em ${dataFormatada} às ${horaFormatada}`);
    
    return backupData;
}

// Função para configurar backup automático
function configurarBackupAutomatico(horario) {
    // Extrair hora e minuto
    const [hora, minuto] = horario.split(':');
    
    // Obter a data atual
    const agora = new Date();
    
    // Configurar a hora para o backup
    let dataBackup = new Date();
    dataBackup.setHours(parseInt(hora), parseInt(minuto), 0, 0);
    
    // Se o horário já passou hoje, agendar para amanhã
    if (dataBackup < agora) {
        dataBackup.setDate(dataBackup.getDate() + 1);
    }
    
    // Calcular tempo até o backup (em milissegundos)
    const tempoAteBackup = dataBackup.getTime() - agora.getTime();
    
    // Remover timer existente
    if (window.timerBackup) {
        clearTimeout(window.timerBackup);
    }
    
    // Agendar o backup
    window.timerBackup = setTimeout(() => {
        realizarBackup();
        // Reagendar para o dia seguinte
        configurarBackupAutomatico(horario);
    }, tempoAteBackup);
    
    return { horario, proximoBackup: dataBackup };
}

// Função para marcar a página atual na navegação
function marcarPaginaAtualNavegacao() {
    // Obter o caminho da página atual
    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remover qualquer marcação de página atual
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.parentElement.classList.remove('active', 'pagina-atual');
    });
    
    // Encontrar o link correspondente à página atual e marcá-lo
    document.querySelectorAll('nav ul li a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === paginaAtual || 
                      (paginaAtual === 'index.html' && href === './') ||
                      href.endsWith(paginaAtual))) {
            link.parentElement.classList.add('active', 'pagina-atual');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
    
    // Adicionar estilos se não existirem
    if (!document.getElementById('estilo-pagina-atual')) {
        const style = document.createElement('style');
        style.id = 'estilo-pagina-atual';
        style.textContent = `
            .pagina-atual {
                font-weight: bold;
                border-bottom: 2px solid var(--primary-color);
            }
            .pagina-atual a {
                color: var(--primary-color) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar configurações quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const config = carregarConfiguracoesSistema();
    aplicarConfiguracoesSistema(config);
    
    // Adicionar link para pular para o conteúdo principal se não existir
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Adicionar id ao conteúdo principal se não existir
        const mainContent = document.querySelector('.content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('tabindex', '-1');
        }
    }
    
    // Configurar página de opções se estiver nela
    configurarPaginaOpcoes();
});