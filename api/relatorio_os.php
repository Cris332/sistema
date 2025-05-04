<?php
// Cabeçalhos necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir arquivos de conexão e classe
include_once '../classes/Database.php';
include_once '../classes/OrdemServico.php';

// Instanciar banco de dados
$database = new Database();
$db = $database->getConnection();

// Parâmetros de filtro
$data_inicio = isset($_GET['data_inicio']) ? $_GET['data_inicio'] : null;
$data_fim = isset($_GET['data_fim']) ? $_GET['data_fim'] : null;
$cliente = isset($_GET['cliente']) ? $_GET['cliente'] : null;
$tecnico = isset($_GET['tecnico']) ? $_GET['tecnico'] : null;

// Consulta SQL base para buscar todas as ordens de serviço com informações do cliente e colaborador
$query = "SELECT o.*, c.Nome as NomeCliente, col.Nome as NomeTecnico 
          FROM OS o 
          LEFT JOIN CLIENTE c ON o.CodigoCliente = c.CodigoCliente 
          LEFT JOIN COLABORADOR col ON o.CodigoColaborador = col.CodigoColaborador";

// Adicionar filtros se fornecidos
$where_conditions = array();
$params = array();

if ($data_inicio && $data_fim) {
    $where_conditions[] = "o.DataAbertura BETWEEN :data_inicio AND :data_fim";
    $params[':data_inicio'] = $data_inicio;
    $params[':data_fim'] = $data_fim;
} elseif ($data_inicio) {
    $where_conditions[] = "o.DataAbertura >= :data_inicio";
    $params[':data_inicio'] = $data_inicio;
} elseif ($data_fim) {
    $where_conditions[] = "o.DataAbertura <= :data_fim";
    $params[':data_fim'] = $data_fim;
}

if ($cliente) {
    $where_conditions[] = "(c.Nome LIKE :cliente OR c.CodigoCliente = :cliente_id OR c.CPF LIKE :cliente_cpf OR c.CNPJ LIKE :cliente_cnpj)";
    $params[':cliente'] = "%$cliente%";
    $params[':cliente_id'] = $cliente;
    $params[':cliente_cpf'] = "%$cliente%";
    $params[':cliente_cnpj'] = "%$cliente%";
}

if ($tecnico) {
    $where_conditions[] = "(col.Nome LIKE :tecnico OR col.CodigoColaborador = :tecnico_id)";
    $params[':tecnico'] = "%$tecnico%";
    $params[':tecnico_id'] = $tecnico;
}

// Adicionar condições WHERE à consulta
if (!empty($where_conditions)) {
    $query .= " WHERE " . implode(" AND ", $where_conditions);
}

// Ordenar por data de abertura (mais recente primeiro)
$query .= " ORDER BY o.DataAbertura DESC";

try {
    // Preparar declaração
    $stmt = $db->prepare($query);
    
    // Vincular parâmetros
    foreach ($params as $param => $value) {
        $stmt->bindValue($param, $value);
    }
    
    // Executar consulta
    $stmt->execute();
    
    // Verificar se há registros
    if($stmt->rowCount() > 0) {
        // Array de ordens de serviço
        $os_arr = array();
        $total_valor = 0;
        
        // Recuperar registros
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $os_item = array(
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
                "codigoColaborador" => $CodigoColaborador,
                "nomeTecnico" => $NomeTecnico
            );
            
            // Somar ao valor total
            if ($ValorTotal) {
                $total_valor += (float)$ValorTotal;
            }
            
            array_push($os_arr, $os_item);
        }
        
        // Adicionar informações de resumo
        $resumo = array(
            "total_registros" => count($os_arr),
            "valor_total" => $total_valor,
            "media_valor" => count($os_arr) > 0 ? $total_valor / count($os_arr) : 0
        );
        
        // Retornar dados em formato JSON
        echo json_encode(array(
            "registros" => $os_arr,
            "resumo" => $resumo
        ));
    } else {
        // Nenhuma ordem de serviço encontrada
        echo json_encode(array("message" => "Nenhuma ordem de serviço encontrada."));
    }
} catch(PDOException $e) {
    // Em caso de erro
    echo json_encode(array("message" => "Erro ao buscar ordens de serviço: " . $e->getMessage()));
}
?>