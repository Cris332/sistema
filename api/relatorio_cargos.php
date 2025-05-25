<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir arquivos de conexão e classe
include_once '../classes/Database.php';

// Instanciar banco de dados
$database = new Database();
$db = $database->getConnection();

// Consulta SQL para buscar todos os cargos
$query = "SELECT * FROM CARGO ORDER BY NomeCargo ASC";

try {
    // Preparar declaração
    $stmt = $db->prepare($query);
    
    // Executar consulta
    $stmt->execute();
    
    // Verificar se há registros
    if($stmt->rowCount() > 0) {
        // Array de cargos
        $cargos_arr = array();
        
        // Recuperar registros
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $cargo_item = array(
                "codigoCargo" => $CodigoCargo,
                "nomeCargo" => $NomeCargo,
                "descricao" => $Descricao
            );
            
            array_push($cargos_arr, $cargo_item);
        }
        
        // Retornar dados em formato JSON
        echo json_encode($cargos_arr);
    } else {
        // Nenhum cargo encontrado
        echo json_encode(array("message" => "Nenhum cargo encontrado."));
    }
} catch(PDOException $e) {
    // Em caso de erro
    echo json_encode(array("message" => "Erro ao buscar cargos: " . $e->getMessage()));
}
?>