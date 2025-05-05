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
let startPoint = [-23.550520, -46.633308]; // Ponto inicial (São Paulo)
let destinationPoint;
let deliveryInterval;
let currentPosition;
let deliveryLog = [];

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Carregar configurações do sistema
    const config = carregarConfiguracoesSistema();
    
    // Inicializar o mapa com as configurações carregadas
    initMap(config.entregas.centralPadrao);
    
    // Configurar os elementos da interface
    setupInterface();
    
    // Aplicar configurações do sistema
    aplicarConfiguracoesSistema(config);
    
    // Aplicar configurações específicas de entregas
    aplicarConfiguracoesEntregas(config.entregas);
});

// Função para inicializar o mapa
function initMap(centralCoords) {
    // Usar coordenadas fornecidas ou o padrão
    startPoint = centralCoords || startPoint;
    
    // Criar o mapa centrado na posição inicial
    map = L.map('map').setView(startPoint, 13);
    
    // Adicionar camada de mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Criar ícone personalizado para o caminhão
    const truckIcon = L.divIcon({
        html: '<i class="fas fa-truck" style="font-size: 24px; color: #3366cc;"></i>',
        className: 'truck-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    // Adicionar marcador do caminhão na posição inicial
    truckMarker = L.marker(startPoint, {icon: truckIcon}).addTo(map);
    truckMarker.bindPopup("Central de Entregas");
    
    // Adicionar marcador da central
    const warehouseIcon = L.divIcon({
        html: '<i class="fas fa-warehouse" style="font-size: 24px; color: #5cb85c;"></i>',
        className: 'warehouse-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const warehouseMarker = L.marker(startPoint, {icon: warehouseIcon}).addTo(map);
    warehouseMarker.bindPopup("Central de Entregas").openPopup();
    
    // Adicionar evento de clique no mapa para facilitar a seleção de endereços
    map.on('click', function(e) {
        if (!deliveryInProgress) {
            document.getElementById('endereco').value = `Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`;
            // Remover marcador de destino anterior se existir
            if (destinationPoint) {
                map.eachLayer(function(layer) {
                    if (layer instanceof L.Marker && layer !== truckMarker && layer !== warehouseMarker) {
                        map.removeLayer(layer);
                    }
                });
            }
            
            // Adicionar novo marcador de destino
            destinationPoint = [e.latlng.lat, e.latlng.lng];
            L.marker(destinationPoint).addTo(map)
                .bindPopup("Destino selecionado").openPopup();
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
        
        // Adicionar marcador no mapa
        L.marker(destinationPoint).addTo(map)
            .bindPopup("Destino gerado").openPopup();
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
    
    // Desenhar rota no mapa
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    // Criar uma rota simulada com alguns pontos intermediários
    const routePoints = criarRotaSimulada(startPoint, destinationPoint);
    routePolyline = L.polyline(routePoints, {color: '#3366cc', weight: 4}).addTo(map);
    
    // Ajustar visualização para mostrar toda a rota
    map.fitBounds(routePolyline.getBounds(), {padding: [50, 50]});
    
    // Iniciar simulação de movimento do caminhão
    currentPosition = [...startPoint];
    let step = 0;
    const totalSteps = 100; // Número de passos para a animação
    
    deliveryInterval = setInterval(function() {
        if (step >= totalSteps) {
            // Chegou ao destino
            clearInterval(deliveryInterval);
            finalizarEntrega(tipoOperacao);
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
        
        // Atualizar posição do caminhão
        truckMarker.setLatLng(currentPosition);
        
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
    
    // Retornar o caminhão para a posição inicial
    setTimeout(function() {
        // Criar rota de retorno
        if (routePolyline) {
            map.removeLayer(routePolyline);
        }
        
        const routePoints = criarRotaSimulada(destinationPoint, startPoint);
        routePolyline = L.polyline(routePoints, {color: '#5cb85c', weight: 4, dashArray: '5, 10'}).addTo(map);
        
        // Animar retorno
        let step = 0;
        const totalSteps = 50; // Retorno mais rápido
        
        const returnInterval = setInterval(function() {
            if (step >= totalSteps) {
                clearInterval(returnInterval);
                truckMarker.setLatLng(startPoint);
                document.getElementById('status-entrega').textContent = 'Aguardando nova operação';
                adicionarLog('Veículo retornou à central');
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
            
            // Atualizar posição do caminhão
            truckMarker.setLatLng(currentPosition);
            
            step++;
        }, 100);
        
        // Limpar campos
        document.getElementById('endereco').value = '';
        document.getElementById('cliente').value = '';
        document.getElementById('item').value = '';
        document.getElementById('observacoes').value = '';
        
        // Remover marcador de destino
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker && layer !== truckMarker) {
                if (!layer._icon.classList.contains('warehouse-marker')) {
                    map.removeLayer(layer);
                }
            }
        });
        
        destinationPoint = null;
    }, 2000);
    
    // Mostrar notificação
    const operacaoTextoNotificacao = tipoOperacao === 'entrega' ? 'Entrega' : 'Retirada';
    mostrarNotificacao(`${operacaoTextoNotificacao} concluída com sucesso!`);
}

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
    const routePoints = [inicio];
    const numPoints = 5; // Número de pontos intermediários
    
    // Gerar pontos intermediários com alguma variação para simular uma rota real
    for (let i = 1; i <= numPoints; i++) {
        const progress = i / (numPoints + 1);
        
        // Interpolação linear com alguma variação aleatória
        const lat = inicio[0] + (fim[0] - inicio[0]) * progress + (Math.random() - 0.5) * 0.01;
        const lng = inicio[1] + (fim[1] - inicio[1]) * progress + (Math.random() - 0.5) * 0.01;
        
        routePoints.push([lat, lng]);
    }
    
    routePoints.push(fim);
    return routePoints;
}