<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir arquivos de conexão e classe
include_once '../classes/Database.php';

// Instanciar banco de dados
$database = new Database();
$db = $database->getConnection();

// Consulta SQL para buscar todos os usuários
$query = "SELECT CodigoUsuario, Nome, Email, Nivel, DataCadastro FROM USUARIO ORDER BY Nome ASC";

try {
    // Preparar declaração
    $stmt = $db->prepare($query);
    
    // Executar consulta
    $stmt->execute();
    
    // Verificar se há registros
    if($stmt->rowCount() > 0) {
        // Array de usuários
        $usuarios_arr = array();
        
        // Recuperar registros
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $usuario_item = array(
                "codigoUsuario" => $CodigoUsuario,
                "nome" => $Nome,
                "email" => $Email,
                "nivel" => $Nivel,
                "dataCadastro" => $DataCadastro
            );
            
            array_push($usuarios_arr, $usuario_item);
        }
        
        // Retornar dados em formato JSON
        echo json_encode($usuarios_arr);
    } else {
        // Nenhum usuário encontrado
        echo json_encode(array("message" => "Nenhum usuário encontrado."));
    }
} catch(PDOException $e) {
    // Em caso de erro
    echo json_encode(array("message" => "Erro ao buscar usuários: " . $e->getMessage()));
}
?>