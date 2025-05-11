<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir arquivos de conexão e classe
include_once '../classes/Database.php';
include_once '../classes/Cliente.php';

// Instanciar banco de dados
$database = new Database();
$db = $database->getConnection();

// Instanciar objeto cliente
$cliente = new Cliente($db);

// Consulta SQL para buscar todos os clientes
$query = "SELECT * FROM CLIENTE ORDER BY Nome ASC";

try {
    // Preparar declaração
    $stmt = $db->prepare($query);
    
    // Executar consulta
    $stmt->execute();
    
    // Verificar se há registros
    if($stmt->rowCount() > 0) {
        // Array de clientes
        $clientes_arr = array();
        
        // Recuperar registros
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $cliente_item = array(
                "codigoCliente" => $CodigoCliente,
                "nome" => $Nome,
                "cpf" => $CPF,
                "cnpj" => $CNPJ,
                "telefone" => $Telefone,
                "email" => $Email,
                "endereco" => $Endereco,
                "dataCadastro" => $DataCadastro
            );
            
            array_push($clientes_arr, $cliente_item);
        }
        
        // Retornar dados em formato JSON
        echo json_encode($clientes_arr);
    } else {
        // Nenhum cliente encontrado
        echo json_encode(array("message" => "Nenhum cliente encontrado."));
    }
} catch(PDOException $e) {
    // Em caso de erro
    echo json_encode(array("message" => "Erro ao buscar clientes: " . $e->getMessage()));
}
?>