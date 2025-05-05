/**
 * Sistema de Navegação Global
 * Este arquivo gerencia a navegação do sistema e a aplica em todas as páginas
 */

// Inicializar navegação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o elemento de navegação existe
    const navElement = document.querySelector('nav ul');
    
    if (navElement) {
        // Limpar navegação existente
        navElement.innerHTML = '';
        
        // Adicionar links de navegação padrão
        const links = [
            { url: 'index.html', texto: 'Ordem de Serviço' },
            { url: 'relatorio.html', texto: 'Relatórios' },
            { url: 'entregas.html', texto: 'Entregas' },
            { url: 'ajuda.html', texto: 'Ajuda' },
            { url: 'opcoes.html', texto: 'Opções' }
        ];
        
        // Obter o caminho da página atual
        const paginaAtual = window.location.pathname.split('/').pop();
        
        // Adicionar cada link à navegação
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.texto;
            
            // Marcar o link ativo
            if (paginaAtual === link.url) {
                a.classList.add('active');
            }
            
            li.appendChild(a);
            navElement.appendChild(li);
        });
    }
});