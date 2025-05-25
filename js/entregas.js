/**
 * Sistema de Gerenciamento de Entregas
 * Este arquivo gerencia o simulador de entregas com mapa interativo
 * Permite ao usuário iniciar entregas e retiradas de ferramentas
 */

// Variáveis globais
let map;
let truckMarker;
let routePolyline;
let deliveryInProgress = false;
let startPoint = [-23.2983, -45.9658]; // Ponto inicial (R. Antônio Fogaça de Almeida, 355 - Jardim America, Jacareí - SP, 12322-030)
let destinationPoint;
let deliveryInterval;
let currentPosition;
let deliveryLog = [];

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se as funções de configuração estão disponíveis
    if (typeof carregarConfiguracoesSistema !== 'function') {
        console.error('Função carregarConfiguracoesSistema não encontrada. Usando configurações padrão.');
        // Configurações padrão caso a função não esteja disponível
        const configPadrao = {
            entregas: {
                velocidadeSimulacao: 2,
                mostrarRota: true,
                mostrarLog: true,
                centralPadrao: [-23.2983, -45.9658] // R. Antônio Fogaça de Almeida, 355 - Jardim America, Jacareí - SP
            }
        };
        
        // Inicializar o mapa com as configurações padrão
        initMap(configPadrao.entregas.centralPadrao);
        
        // Configurar os elementos da interface
        setupInterface();
        
        // Aplicar configurações específicas de entregas
        aplicarConfiguracoesEntregas(configPadrao.entregas);
    } else {
        // Carregar configurações do sistema
        const config = carregarConfiguracoesSistema();
        
        // Inicializar o mapa com as configurações carregadas
        initMap(config.entregas.centralPadrao);
        
        // Configurar os elementos da interface
        setupInterface();
        
        // Aplicar configurações do sistema se a função estiver disponível
        if (typeof aplicarConfiguracoesSistema === 'function') {
            aplicarConfiguracoesSistema(config);
        }
        
        // Aplicar configurações específicas de entregas
        aplicarConfiguracoesEntregas(config.entregas);
    }
});

// Função para inicializar o mapa
function initMap(centralCoords) {
    // Usar coordenadas fornecidas ou o padrão
    startPoint = centralCoords || startPoint;
    
    // Criar o mapa centrado na posição inicial com opções avançadas
    map = L.map('map', {
        center: startPoint,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        minZoom: 3,
        maxZoom: 20,
        zoomSnap: 0.5,
        zoomDelta: 0.5
    });
    
    // Definir camadas base de alta qualidade (múltiplas opções)
    const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    });
    
    // Cartograma CartoDB - Estilo limpo para visualização de rotas (camada padrão)
    const cartoDBVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
    
    // Imagens de satélite de alta resolução da Esri
    const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 20
    });
    
    // Mapa topográfico OpenTopoMap
    const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17
    });
    
    // Mapa em estilo escuro - ótimo para visualização noturna
    const cartoDBDarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
    
    // Mapa estilo aquarela - ótimo para visualização estética
    const stamenWatercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    });
    
    // Camadas claras para melhor contraste
    const cartoDBPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
    
    // Mapa de estradas - camada de alta qualidade para visualizar rotas
    const thunderForestTransport = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38', {
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        apikey: '6170aad10dfd42a38d4d8c709a536f38',
        maxZoom: 22
    });
    
    // Mapa de cíclismo - mostra detalhes de estradas e caminhos
    const thunderForestCycle = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38', {
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        apikey: '6170aad10dfd42a38d4d8c709a536f38',
        maxZoom: 22
    });
    
    // Organizar todas as camadas base para o controle de camadas
    const baseMaps = {
        "Navegador": cartoDBVoyager,
        "Satélite": esriWorldImagery,
        "OpenStreetMap": osmStandard,
        "Topográfico": openTopoMap,
        "Modo Noturno": cartoDBDarkMatter,
        "Minimalista": cartoDBPositron,
        "Aquarela": stamenWatercolor,
        "Transporte": thunderForestTransport,
        "Ciclovias": thunderForestCycle
    };
    
    // Adicionar camada padrão ao mapa
    cartoDBVoyager.addTo(map);
    
    // Adicionar controle de camadas com opções avançadas
    L.control.layers(baseMaps, null, {
        collapsed: false,
        position: 'topright',
        sortLayers: false
    }).addTo(map);
    
    // Adicionar escala no canto inferior
    L.control.scale({
        imperial: false,
        metric: true,
        position: 'bottomleft',
        maxWidth: 200
    }).addTo(map);
    
    // Adicionar controle de zoom com opções personalizadas
    L.control.zoom({
        position: 'bottomright',
        zoomInTitle: 'Aproximar',
        zoomOutTitle: 'Afastar'
    }).addTo(map);
    
    // Adicionar um mini-mapa para navegação mais fácil
    const miniMap = new L.Control.MiniMap(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), {
        toggleDisplay: true,
        minimized: false,
        position: 'bottomright',
        width: 150,
        height: 150,
        collapsedWidth: 24,
        collapsedHeight: 24,
        zoomLevelOffset: -5,
        zoomAnimation: true
    }).addTo(map);
    
    // Adicionar controle de localização para o usuário encontrar sua posição atual
    L.control.locate({
        position: 'topright',
        setView: 'untilPanOrZoom',
        flyTo: true,
        cacheLocation: true,
        icon: 'fa fa-location-arrow',
        iconLoading: 'fa fa-spinner fa-spin',
        showPopup: true,
        strings: {
            title: "Mostrar minha localização",
            popup: "Você está a {distance} {unit} desta localização",
            outsideMapBoundsMsg: "Você parece estar fora dos limites do mapa"
        },
        locateOptions: {
            enableHighAccuracy: true,
            watch: true
        },
        onLocationError: function(err) {
            alert(`Erro ao localizar: ${err.message}`);
            // Notificar por voz sobre o erro
            if (window.config && window.config.acessibilidade && window.config.acessibilidade.modoFala && window.falarTexto) {
                window.falarTexto("Não foi possível determinar sua localização atual.");
            }
        },
        onLocationFound: function(e) {
            // Notificar por voz sobre a localização encontrada
            if (window.config && window.config.acessibilidade && window.config.acessibilidade.modoFala && window.falarTexto) {
                window.falarTexto("Localização atual encontrada no mapa.");
            }
        }
    }).addTo(map);
    
    // Criar ícones personalizados de alta qualidade
    // Ícone para o caminhão com sombra e animação
    const truckIcon = L.divIcon({
        html: `
            <div class="truck-marker-container">
                <div class="truck-marker-shadow"></div>
                <i class="fas fa-truck-moving truck-icon"></i>
            </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    // Ícone para a central de distribuição com sombra
    const warehouseIcon = L.divIcon({
        html: `
            <div class="warehouse-marker-container">
                <div class="warehouse-marker-shadow"></div>
                <i class="fas fa-warehouse warehouse-icon"></i>
            </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    // Ícone para o destino com sombra
    const destinationIcon = L.divIcon({
        html: `
            <div class="destination-marker-container">
                <div class="destination-marker-shadow"></div>
                <i class="fas fa-map-marker-alt destination-icon"></i>
            </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 36]
    });
    
    // Adicionar marcador da central (fixo)
    const warehouseMarker = L.marker(startPoint, {icon: warehouseIcon, zIndexOffset: 1000}).addTo(map);
    warehouseMarker.bindPopup(
        `<div class="custom-popup">
            <h3>Central de Distribuição</h3>
            <p>Local de origem das entregas e retiradas</p>
            <p><small>Coordenadas: ${startPoint[0].toFixed(6)}, ${startPoint[1].toFixed(6)}</small></p>
        </div>`,
        {maxWidth: 300}
    ).openPopup();
    
    // Adicionar marcador para o caminhão (móvel)
    truckMarker = L.marker(startPoint, {icon: truckIcon, zIndexOffset: 2000}).addTo(map);
    truckMarker.bindPopup(
        `<div class="custom-popup">
            <h3>Veículo de Entrega</h3>
            <p>Realizando entregas e retiradas</p>
        </div>`,
        {maxWidth: 250}
    );
    
    // Adicionar estilos personalizados para marcadores
    if (!document.getElementById('mapa-estilos-personalizados')) {
        const style = document.createElement('style');
        style.id = 'mapa-estilos-personalizados';
        style.textContent = `
            .custom-div-icon {
                background: none;
                border: none;
            }
            
            /* Estilos para o ícone do caminhão */
            .truck-marker-container {
                position: relative;
                width: 40px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .truck-marker-shadow {
                position: absolute;
                width: 30px;
                height: 10px;
                background: rgba(0,0,0,0.3);
                border-radius: 50%;
                bottom: -2px;
                z-index: -1;
                filter: blur(2px);
            }
            
            .truck-icon {
                font-size: 24px;
                color: #2C5DE5;
                filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
                z-index: 10;
                animation: truckBounce 2s infinite;
            }
            
            /* Estilos para o ícone da central */
            .warehouse-marker-container {
                position: relative;
                width: 40px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .warehouse-marker-shadow {
                position: absolute;
                width: 30px;
                height: 10px;
                background: rgba(0,0,0,0.3);
                border-radius: 50%;
                bottom: -2px;
                z-index: -1;
                filter: blur(2px);
            }
            
            .warehouse-icon {
                font-size: 26px;
                color: #28a745;
                filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
                z-index: 10;
            }
            
            /* Estilos para o ícone de destino */
            .destination-marker-container {
                position: relative;
                width: 40px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .destination-marker-shadow {
                position: absolute;
                width: 20px;
                height: 8px;
                background: rgba(0,0,0,0.3);
                border-radius: 50%;
                bottom: -2px;
                z-index: -1;
                filter: blur(2px);
            }
            
            .destination-icon {
                font-size: 32px;
                color: #dc3545;
                filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
                z-index: 10;
                transform: translateY(-8px);
            }
            
            /* Animação para o ícone do caminhão */
            @keyframes truckBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-2px); }
            }
            
            /* Estilo para os popups personalizados */
            .custom-popup h3 {
                color: #2C5DE5;
                margin: 0 0 8px 0;
                font-size: 16px;
            }
            
            .custom-popup p {
                margin: 0 0 5px 0;
            }
            
            .leaflet-popup-content-wrapper {
                border-radius: 8px;
            }
            
            /* Estilo para rotas */
            .delivery-route {
                stroke-dasharray: 8, 12;
                animation: dashAnimation 500s linear infinite;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            
            @keyframes dashAnimation {
                to { stroke-dashoffset: -10000; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Adicionar evento de clique no mapa para facilitar a seleção de endereços
    map.on('click', function(e) {
        if (!deliveryInProgress) {
            document.getElementById('endereco').value = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
            
            // Remover marcador de destino anterior se existir
            if (destinationPoint) {
                map.eachLayer(function(layer) {
                    if (layer instanceof L.Marker && layer !== truckMarker && layer !== warehouseMarker) {
                        map.removeLayer(layer);
                    }
                });
            }
            
            // Remover rota anterior se existir
            if (routePolyline) {
                map.removeLayer(routePolyline);
            }
            
            // Adicionar novo marcador de destino com estilo personalizado
            destinationPoint = [e.latlng.lat, e.latlng.lng];
            L.marker(destinationPoint, {icon: destinationIcon, zIndexOffset: 1500}).addTo(map)
                .bindPopup(`<div class="custom-popup">
                    <h3>Destino Selecionado</h3>
                    <p>Clique em "Iniciar Operação" para começar</p>
                    <p><small>Coordenadas: ${destinationPoint[0].toFixed(6)}, ${destinationPoint[1].toFixed(6)}</small></p>
                </div>`, {maxWidth: 250})
                .openPopup();
                
            // Exibir rota imediatamente para melhor feedback visual
            const routePoints = criarRotaSimulada(startPoint, destinationPoint);
            routePolyline = L.polyline(routePoints, {
                color: '#3366cc',
                weight: 5,
                opacity: 0.8,
                lineJoin: 'round',
                lineCap: 'round',
                className: 'delivery-route'
            }).addTo(map);
            
            // Calcular distância e tempo estimado
            const distancia = calcularDistancia(startPoint, destinationPoint);
            const tempoEstimado = Math.round(distancia * 3); // 3 minutos por km
            document.getElementById('tempo-estimado').textContent = `Distância: ${distancia.toFixed(2)} km | Tempo estimado: ${tempoEstimado} min`;
            
            // Atualizar status
            document.getElementById('status-entrega').textContent = 'Destino selecionado';
            
            // Adicionar ao log
            adicionarLog(`Novo destino selecionado a ${distancia.toFixed(2)} km da central`);
            
            // Ajustar mapa para mostrar toda a rota
            const bounds = L.latLngBounds([startPoint, destinationPoint]).pad(0.1);
            map.fitBounds(bounds);
        }
    });
}

// Função para configurar a interface
function setupInterface() {
    // Botão para iniciar entrega
    document.getElementById('btn-iniciar').addEventListener('click', function() {
        if (!deliveryInProgress) {
            iniciarEntrega();
        }
    });
    
    // Botão para cancelar entrega
    document.getElementById('btn-cancelar').addEventListener('click', function() {
        if (deliveryInProgress) {
            cancelarEntrega();
        }
    });
    
    // Alternar entre entrega e retirada
    document.querySelectorAll('input[name="tipo-operacao"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            const btnIniciar = document.getElementById('btn-iniciar');
            if (this.value === 'entrega') {
                btnIniciar.textContent = 'Iniciar Entrega';
            } else {
                btnIniciar.textContent = 'Iniciar Retirada';
            }
        });
    });
}

// Função para iniciar a entrega ou retirada
function iniciarEntrega() {
    const endereco = document.getElementById('endereco').value;
    const cliente = document.getElementById('cliente').value;
    const item = document.getElementById('item').value;
    const tipoOperacao = document.querySelector('input[name="tipo-operacao"]:checked').value;
    
    if (!endereco) {
        mostrarNotificacao('Por favor, informe o endereço de destino');
        return;
    }
    
    if (!destinationPoint) {
        // Se o usuário digitou um endereço mas não clicou no mapa, gerar um ponto aleatório próximo
        const randomLat = startPoint[0] + (Math.random() - 0.5) * 0.1;
        const randomLng = startPoint[1] + (Math.random() - 0.5) * 0.1;
        destinationPoint = [randomLat, randomLng];
        
        // Adicionar marcador no mapa com ícone personalizado
        L.marker(destinationPoint, {icon: destinationIcon, zIndexOffset: 1500}).addTo(map)
            .bindPopup(`<div class="custom-popup">
                <h3>Destino Gerado Automaticamente</h3>
                <p>Baseado no endereço informado</p>
                <p><small>Coordenadas: ${destinationPoint[0].toFixed(6)}, ${destinationPoint[1].toFixed(6)}</small></p>
            </div>`, {maxWidth: 250})
            .openPopup();
            
        // Criar rota visual
        if (routePolyline) {
            map.removeLayer(routePolyline);
        }
        
        const routePoints = criarRotaSimulada(startPoint, destinationPoint);
        routePolyline = L.polyline(routePoints, {
            color: '#3366cc',
            weight: 5,
            opacity: 0.8,
            lineJoin: 'round',
            lineCap: 'round',
            className: 'delivery-route'
        }).addTo(map);
        
        // Ajustar visualização para mostrar toda a rota
        const bounds = L.latLngBounds([startPoint, destinationPoint]).pad(0.1);
        map.fitBounds(bounds);
    }
    
    // Atualizar status
    deliveryInProgress = true;
    document.getElementById('btn-iniciar').disabled = true;
    document.getElementById('btn-cancelar').disabled = false;
    
    // Desabilitar campos durante a entrega
    document.getElementById('endereco').disabled = true;
    document.getElementById('cliente').disabled = true;
    document.getElementById('item').disabled = true;
    document.querySelectorAll('input[name="tipo-operacao"]').forEach(radio => radio.disabled = true);
    
    // Atualizar status da entrega
    const statusText = tipoOperacao === 'entrega' ? 'Entrega em andamento' : 'Retirada em andamento';
    document.getElementById('status-entrega').textContent = statusText;
    
    // Calcular tempo estimado (simulado)
    const distancia = calcularDistancia(startPoint, destinationPoint);
    const tempoEstimado = Math.round(distancia * 3); // 3 minutos por km
    document.getElementById('tempo-estimado').textContent = `Tempo estimado: ${tempoEstimado} minutos`;
    
    // Adicionar ao log
    const operacaoTexto = tipoOperacao === 'entrega' ? 'Entrega' : 'Retirada';
    const itemTexto = item ? item : 'Item não especificado';
    const clienteTexto = cliente ? cliente : 'Cliente não especificado';
    adicionarLog(`${operacaoTexto} iniciada para ${clienteTexto}. Item: ${itemTexto}`);
    
    // Desenhar rota no mapa com estilo aprimorado
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    // Criar uma rota simulada com pontos intermediários usando a função melhorada
    const routePoints = criarRotaSimulada(startPoint, destinationPoint);
    routePolyline = L.polyline(routePoints, {
        color: '#3366cc',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round',
        className: 'delivery-route'
    }).addTo(map);
    
    // Ajustar visualização para mostrar toda a rota
    map.fitBounds(routePolyline.getBounds(), {padding: [50, 50]});
    
    // Notificar por voz se o sistema estiver ativado
    if (window.config && window.config.acessibilidade && window.config.acessibilidade.modoFala) {
        const mensagemVoz = tipoOperacao === 'entrega' ? 
            `Iniciando entrega para ${clienteTexto}. Distância de ${distancia.toFixed(1)} quilômetros.` : 
            `Iniciando retirada para ${clienteTexto}. Distância de ${distancia.toFixed(1)} quilômetros.`;
        
        if (window.falarTexto) {
            window.falarTexto(mensagemVoz);
        }
    }
    
    // Função para atualizar rotação do caminhão
    const atualizarRotacaoCaminhao = (posAtual, proxPos) => {
        if (!posAtual || !proxPos) return;
        
        // Calcular ângulo entre os pontos
        const dx = proxPos[1] - posAtual[1];
        const dy = proxPos[0] - posAtual[0];
        const angulo = Math.atan2(dx, dy) * (180 / Math.PI);
        
        // Atualizar estilo do ícone
        const iconElement = document.querySelector('.truck-icon');
        if (iconElement) {
            iconElement.style.transform = `rotate(${angulo}deg)`;
        }
    };
    
    // Função para seguir o caminhão suavemente
    const seguirCaminhao = (posicao) => {
        map.panTo(posicao, {
            animate: true,
            duration: 0.5,
            easeLinearity: 0.5
        });
    };
    
    // Iniciar simulação de movimento do caminhão
    currentPosition = [...startPoint];
    let step = 0;
    const totalSteps = 100; // Número de passos para a animação
    
    // Adicionar estilo para animação de conclusão
    if (!document.querySelector('.entrega-concluida-keyframes')) {
        const style = document.createElement('style');
        style.className = 'entrega-concluida-keyframes';
        style.textContent = `
            @keyframes entregaConcluida {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.5); }
            }
            
            .entrega-concluida {
                animation: entregaConcluida 1s ease-in-out;
                color: #28a745 !important;
            }
            
            .btn-pulse {
                animation: btnPulse 1s infinite;
            }
            
            @keyframes btnPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    deliveryInterval = setInterval(function() {
        if (step >= totalSteps) {
            // Chegou ao destino
            clearInterval(deliveryInterval);
            
            // Adicionar efeito visual ao chegar
            const iconElement = document.querySelector('.truck-icon');
            if (iconElement) {
                iconElement.classList.add('entrega-concluida');
                setTimeout(() => {
                    iconElement.classList.remove('entrega-concluida');
                }, 1500);
            }
            
            // Notificar por voz ao chegar
            if (window.config && window.config.acessibilidade && window.config.acessibilidade.modoFala && window.falarTexto) {
                const mensagemChegada = tipoOperacao === 'entrega' ? 
                    "Chegamos ao destino da entrega." : 
                    "Chegamos ao local de retirada.";
                window.falarTexto(mensagemChegada);
            }
            
            setTimeout(() => finalizarEntrega(tipoOperacao), 1500);
            return;
        }
        
        // Calcular nova posição
        const progress = step / totalSteps;
        const routeIndex = Math.floor(progress * (routePoints.length - 1));
        const nextRouteIndex = Math.min(routeIndex + 1, routePoints.length - 1);
        
        // Interpolação entre pontos da rota
        const segmentProgress = (progress * (routePoints.length - 1)) - routeIndex;
        currentPosition = [
            routePoints[routeIndex][0] + (routePoints[nextRouteIndex][0] - routePoints[routeIndex][0]) * segmentProgress,
            routePoints[routeIndex][1] + (routePoints[nextRouteIndex][1] - routePoints[routeIndex][1]) * segmentProgress
        ];
        
        // Atualizar posição do caminhão e sua rotação
        truckMarker.setLatLng(currentPosition);
        atualizarRotacaoCaminhao(routePoints[routeIndex], routePoints[nextRouteIndex]);
        
        // Seguir o caminhão a cada 10 passos
        if (step % 10 === 0) {
            seguirCaminhao(currentPosition);
        }
        
        // Atualizar informações na interface
        const remainingSteps = totalSteps - step;
        const tempoRestante = Math.ceil(remainingSteps / 10);
        const progresso = Math.floor((step / totalSteps) * 100);
        document.getElementById('tempo-estimado').textContent = 
            `Progresso: ${progresso}% | Tempo restante: aproximadamente ${tempoRestante} minutos`;
        
        // Notificar meio do percurso por voz
        if (step === Math.floor(totalSteps / 2) && 
            window.config && window.config.acessibilidade && 
            window.config.acessibilidade.modoFala && window.falarTexto) {
            window.falarTexto("Metade do percurso concluída.");
        }
        
        step++;
    }, 200); // Atualizar a cada 200ms
    
    // Mostrar notificação
    mostrarNotificacao(`${operacaoTexto} iniciada para ${endereco}`);
}

// Função para finalizar a entrega
function finalizarEntrega(tipoOperacao) {
    // Atualizar status
    deliveryInProgress = false;
    document.getElementById('btn-iniciar').disabled = false;
    document.getElementById('btn-cancelar').disabled = true;
    
    // Habilitar campos novamente
    document.getElementById('endereco').disabled = false;
    document.getElementById('cliente').disabled = false;
    document.getElementById('item').disabled = false;
    document.querySelectorAll('input[name="tipo-operacao"]').forEach(radio => radio.disabled = false);
    
    // Atualizar status da entrega
    const statusText = tipoOperacao === 'entrega' ? 'Entrega concluída com sucesso!' : 'Retirada concluída com sucesso!';
    document.getElementById('status-entrega').textContent = statusText;
    document.getElementById('tempo-estimado').textContent = '';
    
    // Adicionar ao log
    const operacaoTexto = tipoOperacao === 'entrega' ? 'Entrega' : 'Retirada';
    adicionarLog(`${operacaoTexto} concluída com sucesso!`);
    
    // Notificar por voz se o sistema estiver ativado
    if (window.config && window.config.acessibilidade && window.config.acessibilidade.modoFala && window.falarTexto) {
        window.falarTexto(`${operacaoTexto} concluída com sucesso! Retornando para a central.`);
    }
    
    // Adicionar efeito visual 
    const iconElement = document.querySelector('.truck-icon');
    if (iconElement) {
        iconElement.classList.add('entrega-concluida');
        setTimeout(() => {
            iconElement.classList.remove('entrega-concluida');
        }, 2000);
    }
    
    // Retornar o caminhão para a posição inicial
    setTimeout(function() {
        // Criar rota de retorno com estilo melhorado
        if (routePolyline) {
            map.removeLayer(routePolyline);
        }
        
        const routePoints = criarRotaSimulada(destinationPoint, startPoint);
        routePolyline = L.polyline(routePoints, {
            color: '#28a745', // Verde para rota de retorno
            weight: 5,
            opacity: 0.8,
            lineJoin: 'round',
            lineCap: 'round',
            className: 'delivery-route'
        }).addTo(map);
        
        // Animar retorno
        let step = 0;
        const totalSteps = 50; // Retorno mais rápido
        
        const returnInterval = setInterval(function() {
            if (step >= totalSteps) {
                clearInterval(returnInterval);
                truckMarker.setLatLng(startPoint);
                document.getElementById('status-entrega').textContent = 'Aguardando nova operação';
                adicionarLog('Veículo retornou à central');
                
                // Notificar por voz
                if (window.config && window.config.acessibilidade && window.config.acessibilidade.modoFala && window.falarTexto) {
                    window.falarTexto("Veículo retornou à central. Aguardando nova operação.");
                }
                
                return;
            }
            
            // Calcular nova posição
            const progress = step / totalSteps;
            const routeIndex = Math.floor(progress * (routePoints.length - 1));
            const nextRouteIndex = Math.min(routeIndex + 1, routePoints.length - 1);
            
            // Interpolação entre pontos da rota
            const segmentProgress = (progress * (routePoints.length - 1)) - routeIndex;
            const currentPosition = [
                routePoints[routeIndex][0] + (routePoints[nextRouteIndex][0] - routePoints[routeIndex][0]) * segmentProgress,
                routePoints[routeIndex][1] + (routePoints[nextRouteIndex][1] - routePoints[routeIndex][1]) * segmentProgress
            ];
            
            // Atualizar posição do caminhão
            truckMarker.setLatLng(currentPosition);
            
            // Atualizar rotação do ícone se possível
            if (iconElement) {
                const dx = routePoints[nextRouteIndex][1] - routePoints[routeIndex][1];
                const dy = routePoints[nextRouteIndex][0] - routePoints[routeIndex][0];
                const angulo = Math.atan2(dx, dy) * (180 / Math.PI);
                iconElement.style.transform = `rotate(${angulo}deg)`;
            }
            
            step++;
        }, 100);
        
        // Limpar campos
        document.getElementById('endereco').value = '';
        document.getElementById('cliente').value = '';
        document.getElementById('item').value = '';
        document.getElementById('observacoes').value = '';
        
        // Remover marcador de destino
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker && layer !== truckMarker && layer !== warehouseMarker) {
                map.removeLayer(layer);
            }
        });
        
        destinationPoint = null;
    }, 2000);
    
    // Mostrar notificação
    const operacaoTextoNotificacao = tipoOperacao === 'entrega' ? 'Entrega' : 'Retirada';
    mostrarNotificacao(`${operacaoTextoNotificacao} concluída com sucesso!`);
}

// ... (rest of the code remains the same)
// Função para cancelar a entrega
function cancelarEntrega() {
    // Parar a simulação
    clearInterval(deliveryInterval);
    
    // Atualizar status
    deliveryInProgress = false;
    document.getElementById('btn-iniciar').disabled = false;
    document.getElementById('btn-cancelar').disabled = true;
    
    // Habilitar campos novamente
    document.getElementById('endereco').disabled = false;
    document.getElementById('cliente').disabled = false;
    document.getElementById('item').disabled = false;
    document.querySelectorAll('input[name="tipo-operacao"]').forEach(radio => radio.disabled = false);
    
    // Atualizar status da entrega
    document.getElementById('status-entrega').textContent = 'Operação cancelada';
    document.getElementById('tempo-estimado').textContent = '';
    
    // Adicionar ao log
    adicionarLog('Operação cancelada pelo usuário');
    
    // Retornar o caminhão para a posição inicial
    truckMarker.setLatLng(startPoint);
    
    // Remover rota
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    // Mostrar notificação
    mostrarNotificacao('Operação cancelada');
}

// Função para adicionar entrada no log
function adicionarLog(mensagem) {
    const agora = new Date();
    const horaFormatada = agora.getHours().toString().padStart(2, '0') + ':' + 
                         agora.getMinutes().toString().padStart(2, '0') + ':' + 
                         agora.getSeconds().toString().padStart(2, '0');
    
    const logEntry = {
        timestamp: agora,
        mensagem: mensagem,
        horaFormatada: horaFormatada
    };
    
    deliveryLog.unshift(logEntry); // Adicionar no início para mostrar mais recentes primeiro
    
    // Limitar o log a 50 entradas
    if (deliveryLog.length > 50) {
        deliveryLog.pop();
    }
    
    // Atualizar a exibição do log
    atualizarExibicaoLog();
}

// Função para atualizar a exibição do log
function atualizarExibicaoLog() {
    const logContainer = document.getElementById('log-container');
    logContainer.innerHTML = '';
    
    deliveryLog.forEach(function(entry) {
        const logElement = document.createElement('div');
        logElement.className = 'log-entry';
        logElement.innerHTML = `<strong>${entry.horaFormatada}</strong>: ${entry.mensagem}`;
        logContainer.appendChild(logElement);
    });
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tempo = 3000) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = mensagem;
    notification.classList.add('show');
    
    setTimeout(function() {
        notification.classList.remove('show');
    }, tempo);
}

// Função para aplicar configurações específicas de entregas
function aplicarConfiguracoesEntregas(configEntregas) {
    // Aplicar velocidade de simulação
    const velocidade = configEntregas.velocidadeSimulacao || 2;
    // Quanto menor o valor, mais rápida a simulação (ajusta o intervalo de atualização)
    const intervaloBase = 300 - (velocidade * 40); // 100ms para velocidade 5, 300ms para velocidade 1
    
    // Configurar visibilidade do log
    const logContainer = document.querySelector('.delivery-log');
    if (logContainer) {
        logContainer.style.display = configEntregas.mostrarLog ? 'block' : 'none';
    }
    
    // Configurar visibilidade da rota
    if (!configEntregas.mostrarRota && routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    // Retornar configurações para uso em outras funções
    return {
        intervaloAtualizacao: intervaloBase,
        mostrarRota: configEntregas.mostrarRota
    };
}

// Função para calcular distância entre dois pontos (em km)
function calcularDistancia(ponto1, ponto2) {
    // Fórmula de Haversine para calcular distância entre coordenadas
    const R = 6371; // Raio da Terra em km
    const dLat = (ponto2[0] - ponto1[0]) * Math.PI / 180;
    const dLon = (ponto2[1] - ponto1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(ponto1[0] * Math.PI / 180) * Math.cos(ponto2[0] * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = R * c;
        
    return distancia;
}

// Função para criar uma rota simulada entre dois pontos
function criarRotaSimulada(inicio, fim) {
    const pontosRota = [inicio];
        
    // Calcular distância entre início e fim para ajustar o número de pontos
    const distancia = calcularDistancia(inicio, fim);
        
    // Aumentar número de pontos para rotas mais longas para melhor qualidade
    const numPontos = Math.max(10, Math.round(distancia * 3));
        
    const deltaLat = fim[0] - inicio[0];
    const deltaLng = fim[1] - inicio[1];
        
    // Calcular ponto médio com um pequeno desvio para maior naturalidade
    const meioLat = inicio[0] + deltaLat * 0.5 + (Math.random() - 0.5) * deltaLat * 0.3;
    const meioLng = inicio[1] + deltaLng * 0.5 + (Math.random() - 0.5) * deltaLng * 0.3;
    const pontoMedio = [meioLat, meioLng];
        
    // Adicionar pontos ao longo de uma curva de bezier para maior naturalidade
    for (let i = 1; i <= numPontos; i++) {
        const t = i / (numPontos + 1);
            
        // Usar curva quadrática (Bezier) para rota mais natural
        // P(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const tComp = 1 - t;
        const tSq = t * t;
        const tCompSq = tComp * tComp;
            
        const lat = tCompSq * inicio[0] + 2 * tComp * t * pontoMedio[0] + tSq * fim[0];
        const lng = tCompSq * inicio[1] + 2 * tComp * t * pontoMedio[1] + tSq * fim[1];
            
        // Adicionar pequena variação aleatória para ruas e desvios
        // Variação maior no meio da rota, menor no início/fim
        const variacao = 0.001 * Math.sin(t * Math.PI);
        const varLat = (Math.random() - 0.5) * variacao;
        const varLng = (Math.random() - 0.5) * variacao;
            
        pontosRota.push([lat + varLat, lng + varLng]);
    }
        
    pontosRota.push(fim);
    return pontosRota;
}