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

// Verificar se o ID não está vazio
if(!empty($data->codigoOS)) {
    // Definir ID da ordem de serviço a ser excluída
    $id = $data->codigoOS;
    
    // Excluir a ordem de serviço
    if($ordem->delete($id)) {
        // Definir código de resposta - 200 OK
        http_response_code(200);
        
        // Informar ao usuário
        echo json_encode(array("message" => "Ordem de serviço excluída com sucesso."));
    } else {
        // Definir código de resposta - 503 serviço indisponível
        http_response_code(503);
        
        // Informar ao usuário
        echo json_encode(array("message" => "Não foi possível excluir a ordem de serviço."));
    }
} else {
    // Definir código de resposta - 400 requisição ruim
    http_response_code(400);
    
    // Informar ao usuário
    echo json_encode(array("message" => "Não foi possível excluir a ordem de serviço. ID não fornecido."));
}