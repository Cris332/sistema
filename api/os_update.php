<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir arquivos de conexão e modelo
include_once '../classes/Database.php';
include_once '../classes/OrdemServico.php';

// Instanciar banco de dados e objeto de ordem de serviço
$database = new Database();
$db = $database->getConnection();

$ordem = new OrdemServico($db);

// Obter dados enviados
$data = json_decode(file_get_contents("php://input"));

// Verificar se os dados não estão vazios
if(
    !empty($data->codigoOS) &&
    !empty($data->numeroOS) &&
    !empty($data->dataAbertura) &&
    !empty($data->equipamento) &&
    !empty($data->defeito) &&
    !empty($data->codigoCliente)
) {
    // Definir ID da ordem de serviço a ser atualizada
    $ordem->codigoOS = $data->codigoOS;
    
    // Definir valores da ordem de serviço
    $ordem->numeroOS = $data->numeroOS;
    $ordem->dataAbertura = $data->dataAbertura;
    $ordem->equipamento = $data->equipamento;
    $ordem->defeito = $data->defeito;
    $ordem->servico = $data->servico ?? '';
    $ordem->valorTotal = $data->valorTotal ?? null;
    $ordem->status = $data->status ?? 'aberta';
    $ordem->codigoCliente = $data->codigoCliente;
    $ordem->codigoColaborador = $data->codigoColaborador ?? null;
    
    // Atualizar a ordem de serviço
    if($ordem->update()) {
        // Definir código de resposta - 200 OK
        http_response_code(200);
        
        // Informar ao usuário
        echo json_encode(array("message" => "Ordem de serviço atualizada com sucesso."));
    } else {
        // Definir código de resposta - 503 serviço indisponível
        http_response_code(503);
        
        // Informar ao usuário
        echo json_encode(array("message" => "Não foi possível atualizar a ordem de serviço."));
    }
} else {
    // Definir código de resposta - 400 requisição ruim
    http_response_code(400);
    
    // Informar ao usuário
    echo json_encode(array("message" => "Não foi possível atualizar a ordem de serviço. Dados incompletos."));
}