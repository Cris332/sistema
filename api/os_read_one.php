<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Incluir arquivos de conexão e modelo
include_once '../classes/Database.php';
include_once '../classes/OrdemServico.php';

// Instanciar banco de dados e objeto de ordem de serviço
$database = new Database();
$db = $database->getConnection();

$ordem = new OrdemServico($db);

// Definir ID da ordem de serviço a ser editada
$ordem->codigoOS = isset($_GET['id']) ? $_GET['id'] : die();

// Ler os detalhes da ordem de serviço
if($ordem->readOne($ordem->codigoOS)) {
    // Criar array
    $ordem_arr = array(
        "codigoOS" => $ordem->codigoOS,
        "numeroOS" => $ordem->numeroOS,
        "dataAbertura" => $ordem->dataAbertura,
        "equipamento" => $ordem->equipamento,
        "defeito" => $ordem->defeito,
        "servico" => $ordem->servico,
        "valorTotal" => $ordem->valorTotal,
        "status" => $ordem->status,
        "codigoCliente" => $ordem->codigoCliente,
        "nomeCliente" => $ordem->nomeCliente,
        "codigoColaborador" => $ordem->codigoColaborador
    );
    
    // Definir código de resposta - 200 OK
    http_response_code(200);
    
    // Enviar resposta em formato JSON
    echo json_encode($ordem_arr);
} else {
    // Definir código de resposta - 404 Não encontrado
    http_response_code(404);
    
    // Informar ao usuário que a ordem de serviço não existe
    echo json_encode(array("message" => "Ordem de serviço não encontrada."));
}