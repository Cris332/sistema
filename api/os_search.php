<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir arquivos de conexão e modelo
include_once '../classes/Database.php';
include_once '../classes/OrdemServico.php';

// Instanciar banco de dados e objeto de ordem de serviço
$database = new Database();
$db = $database->getConnection();

$ordem = new OrdemServico($db);

// Obter parâmetros de pesquisa
$params = array();

// Verificar todos os possíveis parâmetros de pesquisa
if(isset($_GET['termo']) && !empty($_GET['termo'])) {
    $params['termo'] = $_GET['termo'];
}

if(isset($_GET['numero_os']) && !empty($_GET['numero_os'])) {
    $params['numero_os'] = $_GET['numero_os'];
}

if(isset($_GET['cliente']) && !empty($_GET['cliente'])) {
    $params['cliente'] = $_GET['cliente'];
}

if(isset($_GET['data_abertura']) && !empty($_GET['data_abertura'])) {
    $params['data_abertura'] = $_GET['data_abertura'];
}

if(isset($_GET['equipamento']) && !empty($_GET['equipamento'])) {
    $params['equipamento'] = $_GET['equipamento'];
}

// Buscar ordens de serviço com os parâmetros fornecidos
// Se não houver parâmetros, retorna todas as ordens de serviço
$stmt = empty($params) ? $ordem->readAll() : $ordem->searchAdvanced($params);
$num = $stmt->rowCount();

// Verificar se foram encontrados registros
if($num > 0) {
    // Array de ordens de serviço
    $ordens_arr = array();
    
    // Obter registros
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        
        $ordem_item = array(
            "codigoOS" => $CodigoOS,
            "numeroOS" => $NumeroOS,
            "dataAbertura" => $DataAbertura,
            "equipamento" => $Equipamento,
            "defeito" => $Defeito,
            "servico" => $Servico,
            "valorTotal" => $ValorTotal,
            "status" => $Status,
            "codigoCliente" => $CodigoCliente,
            "nomeCliente" => $NomeCliente,
            "codigoColaborador" => $CodigoColaborador
        );
        
        array_push($ordens_arr, $ordem_item);
    }
    
    // Definir código de resposta - 200 OK
    http_response_code(200);
    
    // Enviar resposta em formato JSON
    echo json_encode($ordens_arr);
} else {
    // Definir código de resposta - 404 Não encontrado
    http_response_code(404);
    
    // Informar ao usuário que não foram encontradas ordens de serviço
    echo json_encode(array());
}