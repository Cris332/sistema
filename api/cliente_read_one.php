<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Incluir arquivos de conexão e modelo
include_once '../classes/Database.php';
include_once '../classes/Cliente.php';

// Instanciar banco de dados e objeto de cliente
$database = new Database();
$db = $database->getConnection();

$cliente = new Cliente($db);

// Definir ID do cliente a ser lido
$cliente->codigoCliente = isset($_GET['id']) ? $_GET['id'] : die();

// Ler os detalhes do cliente
if($cliente->readOne($cliente->codigoCliente)) {
    // Criar array
    $cliente_arr = array(
        "codigoCliente" => $cliente->codigoCliente,
        "nome" => $cliente->nome,
        "cpf" => $cliente->cpf,
        "cnpj" => $cliente->cnpj,
        "telefone" => $cliente->telefone,
        "email" => $cliente->email,
        "endereco" => $cliente->endereco,
        "dataCadastro" => $cliente->dataCadastro
    );
    
    // Definir código de resposta - 200 OK
    http_response_code(200);
    
    // Enviar resposta em formato JSON
    echo json_encode($cliente_arr);
} else {
    // Definir código de resposta - 404 Não encontrado
    http_response_code(404);
    
    // Informar ao usuário que o cliente não existe
    echo json_encode(array("message" => "Cliente não encontrado."));
}