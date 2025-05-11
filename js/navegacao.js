/**
 * Sistema de Navegação Global
 * Este arquivo gerencia a navegação do sistema e a aplica em todas as páginas
 * Inclui suporte avançado para navegação por teclado, atalhos Alt e acessibilidade
 */

// Configuração global de navegação por teclado
let navegacaoTecladoAtiva = false;

// Mapa de atalhos de teclado (Alt + tecla)
const atalhosDoSistema = {
    // Atalhos de navegação entre páginas (Alt + Número)
    '1': 'index.html',        // Alt+1: Página inicial (Ordem de Serviço)
    '2': 'clientes.html',     // Alt+2: Clientes
    '3': 'relatorio.html',    // Alt+3: Relatórios
    '4': 'opcoes.html',       // Alt+4: Opções
    '5': 'ajuda.html',        // Alt+5: Ajuda
    '0': 'entregas.html',     // Alt+0: Entregas
    
    // Manter compatibilidade com atalhos antigos (Alt + Letra)
    'i': 'index.html',        // Alt+I: Página inicial (Ordem de Serviço)
    'r': 'relatorio.html',    // Alt+R: Relatórios
    'e': 'entregas.html',     // Alt+E: Entregas
    'a': 'ajuda.html',        // Alt+A: Ajuda
    'o': 'opcoes.html',       // Alt+O: Opções
    'c': 'clientes.html',     // Alt+C: Clientes
    
    // Atalhos de ações comuns
    's': 'salvar',           // Alt+S: Salvar formulário atual
    'p': 'pesquisar',        // Alt+P: Pesquisar
    'n': 'novo',             // Alt+N: Novo item
    'x': 'excluir',          // Alt+X: Excluir item
    'b': 'backup',           // Alt+B: Backup (na página de opções)
    'l': 'limpar',           // Alt+L: Limpar formulário
    'm': 'imprimir'          // Alt+M: Imprimir (Modificado para evitar conflito)
};

// Atalhos de acessibilidade (Alt+Shift+Letra)
const atalhosAcessibilidade = {
    'c': 'conteudo',         // Alt+Shift+C: Focar no conteúdo principal
    'm': 'menu',             // Alt+Shift+M: Focar no menu de navegação
    'f': 'formulario',       // Alt+Shift+F: Focar no primeiro campo de formulário
    'b': 'botao-principal',  // Alt+Shift+B: Focar no botão principal
    't': 'topo',             // Alt+Shift+T: Ir para o topo da página
    'h': 'ajuda-rapida'      // Alt+Shift+H: Mostrar dicas de ajuda rápida
};

// Inicializar navegação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o elemento de navegação existe
    const navElement = document.querySelector('nav ul');
    
    if (navElement) {
        // Limpar navegação existente
        navElement.innerHTML = '';
        
        // Adicionar links de navegação padrão
        const links = [
            { url: 'index.html', texto: 'Ordem de Serviço', atalho: 'I' },
            { url: 'relatorio.html', texto: 'Relatórios', atalho: 'R' },
            { url: 'entregas.html', texto: 'Entregas', atalho: 'E' },
            { url: 'ajuda.html', texto: 'Ajuda', atalho: 'A' },
            { url: 'opcoes.html', texto: 'Opções', atalho: 'O' }
        ];
        
        // Obter o caminho da página atual
        const paginaAtual = window.location.pathname.split('/').pop();
        
        // Adicionar cada link à navegação
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.texto;
            a.setAttribute('data-atalho', `Alt+${link.atalho}`);
            a.setAttribute('title', `${link.texto} (Alt+${link.atalho})`);
            
            // Marcar o link ativo
            if (paginaAtual === link.url) {
                a.classList.add('active');
            }
            
            // Adicionar classe para estilização de foco
            a.classList.add('focus-visible');
            
            li.appendChild(a);
            navElement.appendChild(li);
        });
    }
    
    // Carregar configurações do usuário
    carregarConfiguracoesNavegacao();
    
    // Inicializar manipuladores de eventos de teclado
    inicializarNavegacaoPorTeclado();
});

/**
 * Carrega as configurações de navegação do localStorage
 */
function carregarConfiguracoesNavegacao() {
    try {
        const configuracoesSalvas = localStorage.getItem('sistema_configuracoes');
        if (configuracoesSalvas) {
            const config = JSON.parse(configuracoesSalvas);
            // Verificar se a navegação por teclado está ativada
            if (config.acessibilidade && config.acessibilidade.navegacaoTeclado !== undefined) {
                navegacaoTecladoAtiva = config.acessibilidade.navegacaoTeclado;
                
                // Se estiver ativa, aplicar configurações avançadas
                if (navegacaoTecladoAtiva) {
                    document.body.classList.add('navegacao-teclado-ativa');
                }
            }
        }
    } catch (e) {
        console.error('Erro ao carregar configurações de navegação:', e);
    }
}

/**
 * Inicializa os manipuladores de eventos para navegação por teclado
 * - Atalhos Alt+Tecla para navegação rápida
 * - Navegação avançada entre elementos com Tab
 * - Setas direcionais para navegar entre elementos
 */
function inicializarNavegacaoPorTeclado() {
    // Manipular atalhos de teclado (Alt + tecla)
    document.addEventListener('keydown', function(e) {
        // Verificar se Alt está pressionado sem Shift
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            const tecla = e.key.toLowerCase();
            
            // Verificar se a tecla pressionada está no mapa de atalhos
            if (atalhosDoSistema.hasOwnProperty(tecla)) {
                const acao = atalhosDoSistema[tecla];
                
                // Navegação para outra página
                if (acao.endsWith('.html')) {
                    e.preventDefault();
                    window.location.href = acao;
                    return;
                }
                
                // Ações específicas
                switch (acao) {
                    case 'salvar':
                        e.preventDefault();
                        executarAcaoPorID(['btn-salvar', 'btn-salvar-opcoes']);
                        break;
                    case 'pesquisar':
                        e.preventDefault();
                        executarAcaoPorID(['btn-pesquisar', 'btn-executar-pesquisa']);
                        break;
                    case 'novo':
                        e.preventDefault();
                        executarAcaoPorID(['btn-novo']);
                        break;
                    case 'excluir':
                        e.preventDefault();
                        executarAcaoPorID(['btn-excluir']);
                        break;
                    case 'backup':
                        e.preventDefault();
                        executarAcaoPorID(['btn-backup-manual']);
                        break;
                    case 'limpar':
                        e.preventDefault();
                        executarAcaoPorID(['btn-limpar-pesquisa']);
                        break;
                    case 'imprimir':
                        e.preventDefault();
                        window.print();
                        break;
                }
            }
        }
        
        // Verificar se Alt+Shift está pressionado (atalhos de acessibilidade)
        else if (e.altKey && e.shiftKey && !e.ctrlKey) {
            const tecla = e.key.toLowerCase();
            
            // Verificar se a tecla pressionada está no mapa de atalhos de acessibilidade
            if (atalhosAcessibilidade.hasOwnProperty(tecla)) {
                e.preventDefault();
                const acao = atalhosAcessibilidade[tecla];
                
                // Executar ações de acessibilidade
                switch (acao) {
                    case 'conteudo':
                        // Focar no conteúdo principal
                        const conteudo = document.querySelector('#main-content') || 
                                         document.querySelector('.content') || 
                                         document.querySelector('main');
                        if (conteudo) {
                            conteudo.setAttribute('tabindex', '-1');
                            conteudo.focus();
                        }
                        break;
                        
                    case 'menu':
                        // Focar no menu de navegação
                        const menu = document.querySelector('nav ul');
                        if (menu) {
                            menu.setAttribute('tabindex', '-1');
                            menu.focus();
                        }
                        break;
                        
                    case 'formulario':
                        // Focar no primeiro campo de formulário
                        const primeiroInput = document.querySelector('input:not([type="hidden"])');
                        if (primeiroInput) {
                            primeiroInput.focus();
                        }
                        break;
                        
                    case 'botao-principal':
                        // Focar no botão principal da página
                        const botaoPrincipal = document.querySelector('#btn-salvar') || 
                                               document.querySelector('#btn-salvar-opcoes') || 
                                               document.querySelector('.btn-primary');
                        if (botaoPrincipal) {
                            botaoPrincipal.focus();
                        }
                        break;
                        
                    case 'topo':
                        // Ir para o topo da página
                        window.scrollTo(0, 0);
                        break;
                        
                    case 'ajuda-rapida':
                        // Mostrar dicas de ajuda rápida
                        mostrarAjudaRapida();
                        break;
                }
            }
        }
    });
    
    // Adicionar manipuladores para setas se a navegação por teclado estiver ativa
    if (navegacaoTecladoAtiva) {
        aplicarNavegacaoAvancada();
    }
    
    // Adicionar a função de ajuda rápida ao pressionar Alt+Shift+H
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            mostrarAjudaRapida();
        }
    });
    
    // Melhorar a visibilidade do foco para elementos focalizados por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('usando-teclado');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('usando-teclado');
    });
    
    // Adicionar suporte para navegação por setas em elementos interativos quando ativado
    if (navegacaoTecladoAtiva) {
        aplicarNavegacaoAvancada();
    }
}

/**
 * Executa a ação associada a um elemento pelo ID
 * @param {array} ids - Array de IDs de elementos para tentar executar a ação
 */
function executarAcaoPorID(ids) {
    for (const id of ids) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.click();
            return true;
        }
    }
    console.log('Elemento para ação não encontrado na página atual');
    return false;
}

/**
 * Aplica configurações avançadas de navegação por teclado
 * Inclui navegação por setas e grupos de elementos
 */
function aplicarNavegacaoAvancada() {
    // Adicionar tabindex aos elementos interativos se não tiverem
    document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"]').forEach(el => {
        if (!el.hasAttribute('tabindex') && !el.disabled && el.style.display !== 'none' && el.style.visibility !== 'hidden') {
            el.setAttribute('tabindex', '0');
        }
    });
    
    // Adicionar manipuladores de seta para navegação dentro de grupos (como menus, listas, etc)
    document.addEventListener('keydown', function(e) {
        if (!navegacaoTecladoAtiva) return;
        
        // Apenas processar teclas de navegação
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) === -1) return;
        
        const focusedElement = document.activeElement;
        if (!focusedElement) return;
        
        // Verificar se o elemento está em um grupo de navegação
        const isInNav = focusedElement.closest('nav') !== null;
        const isInList = ['UL', 'OL'].indexOf(focusedElement.parentElement.tagName) !== -1;
        const isInTabList = focusedElement.closest('[role="tablist"]') !== null;
        const isInForm = focusedElement.closest('form') !== null;
        
        // Navegação em menus horizontais
        if (isInNav && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
            const links = Array.from(focusedElement.closest('nav').querySelectorAll('a'));
            const currentIndex = links.indexOf(focusedElement);
            let nextIndex;
            
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % links.length;
            } else {
                nextIndex = (currentIndex - 1 + links.length) % links.length;
            }
            
            links[nextIndex].focus();
        }
        
        // Navegação em formulários com setas verticais
        if (isInForm && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault();
            const inputs = Array.from(focusedElement.closest('form').querySelectorAll('input:not([type="hidden"]), select, textarea, button'));
            const currentIndex = inputs.indexOf(focusedElement);
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % inputs.length;
            } else {
                nextIndex = (currentIndex - 1 + inputs.length) % inputs.length;
            }
            
            inputs[nextIndex].focus();
        }
    });
}

/**
 * Ativa ou desativa a navegação avançada por teclado
 * @param {boolean} ativar - Se a navegação por teclado deve ser ativada ou desativada
 */
function aplicarNavegacaoTeclado(ativar) {
    navegacaoTecladoAtiva = ativar;
    
    if (ativar) {
        document.body.classList.add('navegacao-teclado-ativa');
        aplicarNavegacaoAvancada();
    } else {
        document.body.classList.remove('navegacao-teclado-ativa');
    }
    
    // Salvar configuração no localStorage
    try {
        const configuracoesSalvas = localStorage.getItem('sistema_configuracoes');
        if (configuracoesSalvas) {
            const config = JSON.parse(configuracoesSalvas);
            if (!config.acessibilidade) {
                config.acessibilidade = {};
            }
            config.acessibilidade.navegacaoTeclado = ativar;
            localStorage.setItem('sistema_configuracoes', JSON.stringify(config));
        }
    } catch (e) {
        console.error('Erro ao salvar configurações de navegação por teclado:', e);
    }
    
    return true;
}

/**
 * Mostra uma caixa de diálogo com ajuda rápida sobre atalhos de teclado
 * Esta função é chamada quando o usuário pressiona Alt+Shift+H
 */
function mostrarAjudaRapida() {
    // Verificar se já existe uma caixa de ajuda rápida
    let ajudaRapida = document.getElementById('ajuda-rapida-teclado');
    
    // Se já existir, apenas mostrar se estiver oculta
    if (ajudaRapida) {
        if (ajudaRapida.style.display === 'none') {
            ajudaRapida.style.display = 'block';
        }
        return;
    }
    
    // Criar o elemento de ajuda rápida
    ajudaRapida = document.createElement('div');
    ajudaRapida.id = 'ajuda-rapida-teclado';
    ajudaRapida.className = 'ajuda-rapida-overlay';
    
    // Criar conteúdo da ajuda
    const conteudoAjuda = `
        <div class="ajuda-rapida-caixa">
            <div class="ajuda-rapida-titulo">
                <h3>Atalhos de Teclado</h3>
                <button class="fechar-ajuda-rapida">&times;</button>
            </div>
            <div class="ajuda-rapida-conteudo">
                <h4>Navegação entre Páginas (Alt + Número)</h4>
                <ul>
                    <li><strong>Alt+1</strong>: Página inicial</li>
                    <li><strong>Alt+2</strong>: Clientes</li>
                    <li><strong>Alt+3</strong>: Relatórios</li>
                    <li><strong>Alt+4</strong>: Opções</li>
                    <li><strong>Alt+5</strong>: Ajuda</li>
                    <li><strong>Alt+0</strong>: Entregas</li>
                </ul>
                
                <h4>Ações Comuns (Alt + Letra)</h4>
                <ul>
                    <li><strong>Alt+S</strong>: Salvar</li>
                    <li><strong>Alt+P</strong>: Pesquisar</li>
                    <li><strong>Alt+N</strong>: Novo</li>
                    <li><strong>Alt+X</strong>: Excluir</li>
                    <li><strong>Alt+L</strong>: Limpar</li>
                    <li><strong>Alt+M</strong>: Imprimir</li>
                    <li><strong>Alt+B</strong>: Backup</li>
                </ul>
                
                <h4>Navegação Avançada</h4>
                <ul>
                    <li><strong>Tab</strong>: Próximo elemento</li>
                    <li><strong>Shift+Tab</strong>: Elemento anterior</li>
                    <li><strong>Setas</strong>: Navegar entre itens</li>
                </ul>
                
                <h4>Acessibilidade (Alt+Shift+Letra)</h4>
                <ul>
                    <li><strong>Alt+Shift+C</strong>: Focar no conteúdo principal</li>
                    <li><strong>Alt+Shift+M</strong>: Focar no menu</li>
                    <li><strong>Alt+Shift+F</strong>: Focar no primeiro campo</li>
                    <li><strong>Alt+Shift+B</strong>: Focar no botão principal</li>
                    <li><strong>Alt+Shift+T</strong>: Ir para o topo</li>
                    <li><strong>Alt+Shift+H</strong>: Esta ajuda</li>
                </ul>
            </div>
        </div>
    `;
    
    ajudaRapida.innerHTML = conteudoAjuda;
    document.body.appendChild(ajudaRapida);
    
    // Adicionar estilos se ainda não existirem
    if (!document.getElementById('estilo-ajuda-rapida')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilo-ajuda-rapida';
        estilos.textContent = `
            .ajuda-rapida-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .ajuda-rapida-caixa {
                background-color: var(--form-bg, #fff);
                color: var(--text-color, #333);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                width: 80%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .ajuda-rapida-titulo {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid var(--border-color, #ddd);
            }
            
            .ajuda-rapida-titulo h3 {
                margin: 0;
                color: var(--primary-color, #6699cc);
            }
            
            .fechar-ajuda-rapida {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text-color, #333);
            }
            
            .ajuda-rapida-conteudo {
                padding: 16px;
            }
            
            .ajuda-rapida-conteudo h4 {
                margin-top: 16px;
                margin-bottom: 8px;
                color: var(--secondary-color, #3366cc);
            }
            
            .ajuda-rapida-conteudo ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .ajuda-rapida-conteudo li {
                margin-bottom: 4px;
            }
            
            .dark-theme .ajuda-rapida-caixa {
                background-color: var(--form-bg, #333);
                border: 1px solid var(--border-color, #555);
            }
        `;
        document.head.appendChild(estilos);
    }
    
    // Adicionar evento para fechar a ajuda
    const botaoFechar = ajudaRapida.querySelector('.fechar-ajuda-rapida');
    if (botaoFechar) {
        botaoFechar.addEventListener('click', function() {
            ajudaRapida.style.display = 'none';
        });
    }
    
    // Fechar a ajuda ao clicar fora da caixa
    ajudaRapida.addEventListener('click', function(e) {
        if (e.target === ajudaRapida) {
            ajudaRapida.style.display = 'none';
        }
    });
    
    // Fechar a ajuda ao pressionar Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && ajudaRapida.style.display !== 'none') {
            e.preventDefault();
            ajudaRapida.style.display = 'none';
        }
    });
}

// Inicializar a navegação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a navegação por teclado está ativada nas configurações
    carregarConfiguracoesNavegacao();
    
    // Inicializar sistema de navegação por teclado
    inicializarNavegacaoPorTeclado();
});