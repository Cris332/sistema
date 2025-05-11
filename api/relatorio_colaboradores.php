<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir arquivos de conexão e classe
include_once '../classes/Database.php';

// Instanciar banco de dados
$database = new Database();
$db = $database->getConnection();

// Consulta SQL para buscar todos os colaboradores com informações do cargo
$query = "SELECT c.*, cg.NomeCargo 
          FROM COLABORADOR c 
          LEFT JOIN CARGO cg ON c.CodigoCargo = cg.CodigoCargo 
          ORDER BY c.Nome ASC";

try {
    // Preparar declaração
    $stmt = $db->prepare($query);
    
    // Executar consulta
    $stmt->execute();
    
    // Verificar se há registros
    if($stmt->rowCount() > 0) {
        // Array de colaboradores
        $colaboradores_arr = array();
        
        // Recuperar registros
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $colaborador_item = array(
                "codigoColaborador" => $CodigoColaborador,
                "nome" => $Nome,
                "cpf" => $CPF,
                "telefone" => $Telefone,
                "email" => $Email,
                "dataContratacao" => $DataContratacao,
                "codigoCargo" => $CodigoCargo,
                "nomeCargo" => $NomeCargo,
                "codigoUsuario" => $CodigoUsuario
            );
            
            array_push($colaboradores_arr, $colaborador_item);
        }
        
        // Retornar dados em formato JSON
        echo json_encode($colaboradores_arr);
    } else {
        // Nenhum colaborador encontrado
        echo json_encode(array("message" => "Nenhum colaborador encontrado."));
    }
} catch(PDOException $e) {
    // Em caso de erro
    echo json_encode(array("message" => "Erro ao buscar colaboradores: " . $e->getMessage()));
}
?>