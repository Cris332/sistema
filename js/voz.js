/**
 * Sistema de voz - Funcionalidade de leitura de texto ao passar o mouse
 * Implementa síntese de voz em todo o sistema com voz feminina
 */

// Variáveis globais para síntese de voz
let speechSynthesis;
let voice;
let speechRate = 1.0;
let modoDeFalaAtivo = false;
let eventosAdicionados = false;
let tentativasDeInicializacao = 0;
const maxTentativas = 5;

/**
 * Inicializa o sistema de voz e carrega as configurações do usuário
 */
function inicializarSistemaDeVoz() {
    console.log('Inicializando sistema de voz...');
    // Carregar configurações do localStorage
    const configuracoesSalvas = localStorage.getItem('sistema_configuracoes');
    if (configuracoesSalvas) {
        try {
            const config = JSON.parse(configuracoesSalvas);
            
            // Verificar se o modo de fala está ativado nas configurações
            if (config.acessibilidade && config.acessibilidade.modoFala !== undefined) {
                modoDeFalaAtivo = config.acessibilidade.modoFala;
                console.log('Modo de fala:', modoDeFalaAtivo ? 'ATIVADO' : 'desativado');
                
                // Definir velocidade da fala se configurada
                if (config.acessibilidade.velocidadeFala !== undefined) {
                    speechRate = parseFloat(config.acessibilidade.velocidadeFala);
                    console.log('Velocidade de fala:', speechRate);
                }
                
                // Se o modo de fala estiver ativado, inicializar a síntese de voz
                if (modoDeFalaAtivo) {
                    inicializarSinteseDeFala();
                }
            } else {
                console.log('Configurações de voz não encontradas, usando padrão (desativado)');
            }
        } catch (e) {
            console.error('Erro ao processar configurações:', e);
        }
    } else {
        console.log('Nenhuma configuração salva encontrada');
    }
    
    // Configurar eventos para garantir que a voz funcione mesmo se a página for carregada assincronamente
    configureEventosGlobais();
}

/**
 * Configura todos os eventos globais necessários para o sistema de voz funcionar
 * em todas as páginas e com qualquer dinamicidade
 */
function configureEventosGlobais() {
    if (eventosAdicionados) return;
    eventosAdicionados = true;
    
    // Garantir que o sistema seja inicializado quando o DOM for carregado
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM carregado, verificando sistema de voz...');
        if (modoDeFalaAtivo && !speechSynthesis) {
            inicializarSinteseDeFala();
        }
        
        // Aplicar eventos a todos os elementos da página
        if (modoDeFalaAtivo) {
            adicionarEventosDeVoz();
            // Anuncio de boas-vindas na página inicial
            if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                setTimeout(() => {
                    falarTexto('Bem-vindo ao Sistema de Controle de Serviços. Navegue com o mouse sobre os elementos para ouvir sua descrição.');
                }, 1000);
            }
        }
    });
    
    // Observar mudanças no DOM para adicionar eventos a novos elementos
    if (window.MutationObserver) {
        const observador = new MutationObserver(function(mutacoes) {
            if (modoDeFalaAtivo) {
                mutacoes.forEach(function(mutacao) {
                    if (mutacao.addedNodes && mutacao.addedNodes.length > 0) {
                        // Adicionar eventos aos novos elementos
                        setTimeout(adicionarEventosDeVoz, 100);
                    }
                });
            }
        });
        
        // Observar todo o corpo do documento para adição de novos elementos
        observador.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
    
    // Ajuste para páginas com conteúdo carregado via AJAX
    if (window.jQuery) {
        jQuery(document).ajaxComplete(function() {
            if (modoDeFalaAtivo) {
                setTimeout(adicionarEventosDeVoz, 200);
            }
        });
    }
}

/**
 * Inicializa a API de síntese de voz
 */
function inicializarSinteseDeFala() {
    if ('speechSynthesis' in window) {
        console.log('Inicializando Web Speech API...');
        speechSynthesis = window.speechSynthesis;
        
        // Esperar as vozes carregarem
        speechSynthesis.onvoiceschanged = function() {
            console.log('Vozes carregadas, selecionando voz feminina...');
            selecionarVozFeminina();
        };
        
        // Tentar obter as vozes imediatamente (para navegadores que já tenham carregado)
        selecionarVozFeminina();
        
        // Adicionar eventos de mouseover a todos os elementos interativos
        adicionarEventosDeVoz();
        return true;
    } else {
        console.error('API de síntese de voz não suportada neste navegador');
        return false;
    }
}

/**
 * Seleciona uma voz feminina em português para a síntese de voz
 */
function selecionarVozFeminina() {
    if (!speechSynthesis) return;
    
    const voices = speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
        if (tentativasDeInicializacao < maxTentativas) {
            // Tentar novamente após um curto período
            console.log('Nenhuma voz disponível ainda, tentando novamente...');
            tentativasDeInicializacao++;
            setTimeout(selecionarVozFeminina, 500);
        } else {
            console.warn('Não foi possível carregar as vozes após várias tentativas');
        }
        return;
    }
    
    // Listar todas as vozes disponíveis no console para depuração
    console.log('Vozes disponíveis:', voices.map(v => `${v.name} (${v.lang})`).join(', '));
    
    // Tentar encontrar vozes femininas em português
    let vozFeminina = voices.find(v => 
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('feminino')) && 
        (v.lang.startsWith('pt') || v.lang.startsWith('pt-BR')));
    
    // Se não encontrar uma voz feminina em português, tenta qualquer voz feminina
    if (!vozFeminina) {
        vozFeminina = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('feminino'));
    }
    
    // Se ainda não encontrar, usa qualquer voz em português
    if (!vozFeminina) {
        vozFeminina = voices.find(v => v.lang.startsWith('pt') || v.lang.startsWith('pt-BR'));
    }
    
    // Se não encontrar nenhuma das opções acima, usa a voz padrão
    voice = vozFeminina || voices[0];
    
    console.log('Voz selecionada:', voice ? voice.name : 'Nenhuma voz disponível');
    
    // Testar a voz selecionada com uma mensagem curta
    if (voice && modoDeFalaAtivo) {
        setTimeout(() => {
            console.log('Testando voz...');
            const testUtterance = new SpeechSynthesisUtterance('Sistema de voz inicializado.');
            testUtterance.voice = voice;
            testUtterance.lang = 'pt-BR';
            testUtterance.rate = speechRate;
            window.speechSynthesis.speak(testUtterance);
        }, 1000);
    }
}

/**
 * Fala um texto usando a voz selecionada
 * @param {string} texto - O texto a ser falado
 */
function falarTexto(texto) {
    if (!window.speechSynthesis || !modoDeFalaAtivo) {
        console.log('Fala desativada ou API não disponível');
        return;
    }
    
    if (!voice) {
        console.log('Nenhuma voz selecionada, tentando inicializar novamente...');
        selecionarVozFeminina();
        if (!voice) return;
    }
    
    console.log('Falando:', texto.substring(0, 50) + (texto.length > 50 ? '...' : ''));
    
    // Cancelar qualquer fala anterior
    window.speechSynthesis.cancel();
    
    // Criar nova instância de fala
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.voice = voice;
    utterance.rate = speechRate;
    utterance.lang = 'pt-BR';
    
    // Adicionar manipulador de erros
    utterance.onerror = function(e) {
        console.error('Erro na síntese de voz:', e);
    };
    
    // Falar o texto
    window.speechSynthesis.speak(utterance);
}

/**
 * Função que trata o evento de mouseover
 * @param {Event} e - O evento de mouseover
 */
function handleMouseOver(e) {
    if (!modoDeFalaAtivo) return;
    
    // Evitar processar o mesmo elemento duas vezes em um curto período
    const now = Date.now();
    const lastSpokenTime = e.target._lastSpokenTime || 0;
    if (now - lastSpokenTime < 1000) return; // Evitar repetir o mesmo elemento em menos de 1 segundo
    e.target._lastSpokenTime = now;
    
    let texto = '';
    
    try {
        // Verificar se o elemento é um ícone dentro de um botão
        // Isso é importante porque muitas vezes o usuário passa o mouse sobre o ícone, não sobre o botão
        if (e.target.tagName === 'I' && (e.target.classList.contains('fas') || e.target.classList.contains('far') || e.target.classList.contains('fab'))) {
            const classes = Array.from(e.target.classList);
            const parentButton = e.target.closest('button');
            
            if (parentButton) {
                // O ícone está dentro de um botão, usar a lógica de descrição de botões
                if (parentButton.id) {
                    switch(parentButton.id) {
                        case 'btn-novo':
                            texto = 'Botão Novo. Cria uma nova ordem de serviço.'; 
                            break;
                        case 'btn-salvar':
                            texto = 'Botão Salvar. Salva a ordem de serviço atual.';
                            break;
                        case 'btn-pesquisar':
                            texto = 'Botão Pesquisar. Abre a tela de pesquisa de ordens de serviço.';
                            break;
                        case 'btn-excluir':
                            texto = 'Botão Excluir. Remove a ordem de serviço atual.';
                            break;
                        case 'btn-imprimir':
                            texto = 'Botão Imprimir. Imprime a ordem de serviço atual.';
                            break;
                        case 'close-search-btn':
                            texto = 'Botão Fechar. Fecha a tela de pesquisa.';
                            break;
                        default:
                            // Identificar pelo tipo de ícone
                            if (classes.includes('fa-file')) {
                                texto = 'Botão Novo. Cria uma nova ordem de serviço.';
                            } else if (classes.includes('fa-save')) {
                                texto = 'Botão Salvar. Salva a ordem de serviço atual.';
                            } else if (classes.includes('fa-search')) {
                                texto = 'Botão Pesquisar. Busca ordens de serviço.';
                            } else if (classes.includes('fa-trash-alt')) {
                                texto = 'Botão Excluir. Remove a ordem de serviço atual.';
                            } else if (classes.includes('fa-print')) {
                                texto = 'Botão Imprimir. Imprime a ordem de serviço atual.';
                            } else {
                                texto = parentButton.getAttribute('aria-label') || parentButton.title || parentButton.textContent || 'Botão';
                            }
                    }
                } else {
                    // Identificar pelo tipo de ícone
                    if (classes.includes('fa-file')) {
                        texto = 'Botão Novo. Cria uma nova ordem de serviço.';
                    } else if (classes.includes('fa-save')) {
                        texto = 'Botão Salvar. Salva a ordem de serviço atual.';
                    } else if (classes.includes('fa-search')) {
                        texto = 'Botão Pesquisar. Busca ordens de serviço.';
                    } else if (classes.includes('fa-trash-alt')) {
                        texto = 'Botão Excluir. Remove a ordem de serviço atual.';
                    } else if (classes.includes('fa-print')) {
                        texto = 'Botão Imprimir. Imprime a ordem de serviço atual.';
                    } else {
                        texto = parentButton.getAttribute('aria-label') || parentButton.title || parentButton.textContent || 'Botão';
                    }
                }
            } else {
                // É um ícone fora de um botão, descrevê-lo pelo tipo
                if (classes.includes('fa-file')) {
                    texto = 'Ícone de arquivo ou documento novo';
                } else if (classes.includes('fa-save')) {
                    texto = 'Ícone de salvar';
                } else if (classes.includes('fa-search')) {
                    texto = 'Ícone de pesquisa';
                } else if (classes.includes('fa-trash-alt')) {
                    texto = 'Ícone de exclusão';
                } else if (classes.includes('fa-print')) {
                    texto = 'Ícone de impressão';
                } else {
                    texto = e.target.getAttribute('aria-label') || e.target.title || 'Ícone';
                }
            }
        }
        // Determinar o texto a ser lido com base no tipo de elemento
        else if (e.target.tagName === 'INPUT') {
            if (e.target.type === 'checkbox') {
                if (e.target.labels && e.target.labels.length > 0) {
                    texto = e.target.labels[0].textContent;
                    if (e.target.checked) {
                        texto += ' - Marcado';
                    } else {
                        texto += ' - Não marcado';
                    }
                } else if (e.target.id) {
                    // Tentar encontrar label pelo ID
                    const label = document.querySelector(`label[for="${e.target.id}"]`);
                    if (label) {
                        texto = label.textContent;
                        if (e.target.checked) {
                            texto += ' - Marcado';
                        } else {
                            texto += ' - Não marcado';
                        }
                    }
                }
            } else if (e.target.type === 'range') {
                const label = document.querySelector(`label[for="${e.target.id}"]`);
                if (label) {
                    texto = label.textContent + ' Valor atual: ' + e.target.value;
                }
            } else if (e.target.type === 'button' || e.target.type === 'submit') {
                texto = e.target.value || e.target.innerText || 'Botão';
            } else {
                const label = document.querySelector(`label[for="${e.target.id}"]`);
                if (label) {
                    texto = label.textContent + (e.target.value ? ': ' + e.target.value : '');
                } else {
                    texto = e.target.placeholder || e.target.value || 'Campo de entrada';
                }
            }
        } else if (e.target.tagName === 'SELECT') {
            const label = document.querySelector(`label[for="${e.target.id}"]`);
            if (label) {
                texto = label.textContent + ': ' + (e.target.options[e.target.selectedIndex] ? e.target.options[e.target.selectedIndex].text : '');
            } else {
                texto = e.target.options[e.target.selectedIndex] ? e.target.options[e.target.selectedIndex].text : '';
            }
        } else if (e.target.tagName === 'A') {
            texto = e.target.getAttribute('aria-label') || e.target.title || e.target.textContent || 'Link';
            // Adicionar informação se o link for externo
            if (e.target.href && !e.target.href.startsWith(window.location.origin) && !e.target.href.startsWith('#')) {
                texto += ' - Link externo';
            }
        } else if (e.target.tagName === 'BUTTON') {
            // Identificar botões específicos com base nos IDs para fornecer descrições mais detalhadas
            if (e.target.id) {
                switch(e.target.id) {
                    case 'btn-novo':
                        texto = 'Botão Novo. Cria uma nova ordem de serviço.'; 
                        break;
                    case 'btn-salvar':
                        texto = 'Botão Salvar. Salva a ordem de serviço atual.';
                        break;
                    case 'btn-pesquisar':
                        texto = 'Botão Pesquisar. Abre a tela de pesquisa de ordens de serviço.';
                        break;
                    case 'btn-excluir':
                        texto = 'Botão Excluir. Remove a ordem de serviço atual.';
                        break;
                    case 'btn-imprimir':
                        texto = 'Botão Imprimir. Imprime a ordem de serviço atual.';
                        break;
                    case 'close-search-btn':
                        texto = 'Botão Fechar. Fecha a tela de pesquisa.';
                        break;
                    case 'btn-executar-pesquisa':
                        texto = 'Botão Pesquisar. Executa a pesquisa com os critérios informados.';
                        break;
                    case 'btn-limpar-pesquisa':
                        texto = 'Botão Limpar. Limpa os campos de pesquisa.';
                        break;
                    case 'btn-salvar-opcoes':
                        texto = 'Botão Salvar Configurações. Salva todas as configurações e preferências do sistema.';
                        break;
                    case 'btn-restaurar-padrao':
                        texto = 'Botão Restaurar Padrões. Retorna todas as configurações para os valores padrões de fábrica.';
                        break;
                    case 'btn-backup-manual':
                        texto = 'Botão Realizar Backup Agora. Cria um backup imediato dos dados do sistema.';
                        break;
                    default:
                        // Se não for um botão conhecido pelo ID, verifica o título ou conteúdo
                        texto = e.target.getAttribute('aria-label') || e.target.title || e.target.textContent || 'Botão';
                }
            }
            // Se não tiver ID, verifica se tem um ícone FontAwesome e usa isso para identificar o botão
            else if (e.target.querySelector('i.fas, i.far, i.fab')) {
                const icone = e.target.querySelector('i.fas, i.far, i.fab');
                const classes = Array.from(icone.classList);
                
                if (classes.includes('fa-file')) {
                    texto = 'Botão Novo. Cria uma nova ordem de serviço.';
                } else if (classes.includes('fa-save')) {
                    texto = 'Botão Salvar. Salva a ordem de serviço atual.';
                } else if (classes.includes('fa-search')) {
                    texto = 'Botão Pesquisar. Busca ordens de serviço.';
                } else if (classes.includes('fa-trash-alt')) {
                    texto = 'Botão Excluir. Remove a ordem de serviço atual.';
                } else if (classes.includes('fa-print')) {
                    texto = 'Botão Imprimir. Imprime a ordem de serviço atual.';
                } else {
                    texto = e.target.getAttribute('aria-label') || e.target.title || e.target.textContent || 'Botão';
                }
            }
            // Se não tiver ID nem ícone FontAwesome, usa o título ou conteúdo
            else {
                texto = e.target.getAttribute('aria-label') || e.target.title || e.target.textContent || 'Botão';
            }
        } else if (e.target.tagName === 'IMG') {
            texto = e.target.alt || e.target.title || 'Imagem';
        } else if (e.target.tagName === 'TH' || e.target.tagName === 'TD') {
            texto = e.target.textContent || 'Célula de tabela';
        } else if (e.target.tagName === 'LABEL') {
            texto = e.target.textContent || 'Rótulo';
        } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(e.target.tagName)) {
            texto = e.target.textContent || 'Título';
        } else if (e.target.tagName === 'LI') {
            texto = e.target.textContent || 'Item de lista';
        } else if (e.target.tagName === 'P') {
            texto = e.target.textContent || 'Parágrafo';
        } else if (e.target.tagName === 'SPAN') {
            texto = e.target.textContent || 'Texto';
        } else if (e.target.tagName === 'DIV') {
            // Para DIVs, verificar se tem um role ARIA ou classe especial
            if (e.target.getAttribute('role')) {
                texto = e.target.textContent || `${e.target.getAttribute('role')}`;
            } else if (e.target.className) {
                // Se tem uma classe especial, usamos ela como contexto
                const classes = e.target.className.split(' ');
                if (classes.some(cls => cls.includes('option') || cls.includes('card') || cls.includes('btn') || cls.includes('button'))) {
                    texto = e.target.textContent || 'Opção';
                } else if (classes.some(cls => cls.includes('header') || cls.includes('title'))) {
                    texto = e.target.textContent || 'Título';
                } else {
                    texto = e.target.textContent || 'Conteúdo';
                }
            } else {
                texto = e.target.textContent || 'Conteúdo';
            }
        } else {
            texto = e.target.textContent || 'Elemento';
        }
    } catch (err) {
        console.error('Erro ao processar texto para fala:', err);
        texto = e.target.textContent || 'Elemento';
    }
    
    // Limitar o tamanho do texto para evitar falas muito longas
    if (texto && texto.length > 200) {
        texto = texto.substring(0, 197) + '...';
    }
    
    // Falar o texto se não estiver vazio
    if (texto && texto.trim()) {
        falarTexto(texto.trim());
    }
}

/**
 * Adiciona eventos de mouseover para todos os elementos relevantes da página
 */
function adicionarEventosDeVoz() {
    if (!modoDeFalaAtivo) return;
    
    console.log('Adicionando eventos de voz a todos os elementos...');
    
    // Remover eventos existentes para evitar duplicação
    const elementosComEvento = document.querySelectorAll('[data-voz-ativo]');
    elementosComEvento.forEach(el => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeAttribute('data-voz-ativo');
    });
    
    // Seletores para elementos comuns em todas as páginas
    const seletores = [
        // Navegação e ações
        'a', 'button', 'input', 'select', 'textarea', 'label',
        // Cabeçalhos e textos
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li',
        // Tabelas
        'td', 'th', 'tr', 'thead', 'tbody', 'table',
        // Elementos de formulário
        'form', 'fieldset', 'legend',
        // Elementos especializados do sistema
        '.option-item', '.form-title', '.report-title', '.section-title',
        '.accordion-header', '.accordion-content', '.tab-button', '.tab-content',
        '.help-section-icon', '.notification-message', '.summary-item',
        '.report-card', '.chart-container', '.delivery-card', '.modal-content',
        '.search-container', '.form-container', '.form-group', '.form-control',
        '.btn', '.btn-primary', '.btn-secondary', '.btn-success',
        // Elementos de diálogo
        'dialog', '.modal', '.modal-header', '.modal-body', '.modal-footer',
        // Especificidades da página inicial
        '.os-form', '.client-info', '.equipment-info', '.service-info',
        '.status-section', '.actions-section', '.search-screen',
        // Elementos comuns em todas as páginas
        '.container', '.content', 'header', 'footer', 'nav', 'main', 'aside'
    ];
    
    try {
        // Adicionar evento para todos os elementos selecionados
        document.querySelectorAll(seletores.join(', ')).forEach(el => {
            if (!el.hasAttribute('data-voz-ativo')) { // Evitar duplicação
                el.addEventListener('mouseover', handleMouseOver);
                el.setAttribute('data-voz-ativo', 'true');
            }
        });
        
        // Para garantir que absolutamente todos os elementos tenham o evento,
        // também adicionamos a todos os filhos do body com conteúdo de texto
        document.querySelectorAll('body *').forEach(el => {
            if (!el.hasAttribute('data-voz-ativo') && el.textContent.trim()) {
                el.addEventListener('mouseover', handleMouseOver);
                el.setAttribute('data-voz-ativo', 'true');
            }
        });
        
        console.log('Eventos de voz adicionados com sucesso!');
    } catch (err) {
        console.error('Erro ao adicionar eventos de voz:', err);
    }
}

/**
 * Ativa ou desativa o modo de fala
 * @param {boolean} ativar - Se o modo de fala deve ser ativado ou desativado
 * @param {number} velocidade - A velocidade da fala (opcional)
 */
function ativarModoFala(ativar, velocidade = 1.0) {
    modoDeFalaAtivo = ativar;
    speechRate = velocidade;
    
    if (ativar) {
        // Inicializar a síntese de voz se ainda não tiver sido inicializada
        if (!eventosAdicionados) {
            inicializarSinteseDeFala();
            adicionarEventosDeVoz();
        }
        console.log('Modo de fala ativado com velocidade ' + velocidade);
        try {
            const configuracoesSalvas = localStorage.getItem('sistema_configuracoes');
            if (configuracoesSalvas) {
                const config = JSON.parse(configuracoesSalvas);
                if (!config.acessibilidade) {
                    config.acessibilidade = {};
                }
                config.acessibilidade.modoFala = true;
                config.acessibilidade.velocidadeFala = velocidade;
                localStorage.setItem('sistema_configuracoes', JSON.stringify(config));
            }
        } catch (e) {
            console.error('Erro ao salvar configurações de voz:', e);
        }
        
        return true;
    } else {
        // Cancelar qualquer fala em andamento
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        // Remover eventos de mouseover para não acionar mais a fala
        const elementosComEvento = document.querySelectorAll('[data-voz-ativo]');
        elementosComEvento.forEach(el => {
            el.removeEventListener('mouseover', handleMouseOver);
            el.removeAttribute('data-voz-ativo');
        });
        
        // Guardar as configurações no localStorage para persistência
        try {
            const configuracoesSalvas = localStorage.getItem('sistema_configuracoes');
            if (configuracoesSalvas) {
                const config = JSON.parse(configuracoesSalvas);
                if (!config.acessibilidade) {
                    config.acessibilidade = {};
                }
                config.acessibilidade.modoFala = false;
                localStorage.setItem('sistema_configuracoes', JSON.stringify(config));
            }
        } catch (e) {
            console.error('Erro ao salvar configurações de voz:', e);
        }
        
        return true;
    }
}

// Inicializar o sistema de voz quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', inicializarSistemaDeVoz);
