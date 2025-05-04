<?php
require_once 'Database.php';

/**
 * Classe responsável pelas operações CRUD de Ordens de Serviço
 */
class OrdemServico {
    // Conexão com o banco de dados e nome da tabela
    private $conn;
    private $table_name = "OS";
    
    // Propriedades da ordem de serviço
    public $codigoOS;
    public $numeroOS;
    public $dataAbertura;
    public $equipamento;
    public $defeito;
    public $servico;
    public $valorTotal;
    public $status;
    public $codigoCliente;
    public $codigoColaborador;
    public $nomeCliente; // Para armazenar o nome do cliente após consulta
    
    /**
     * Construtor com conexão ao banco de dados
     * @param PDO $db conexão com o banco de dados
     */
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Método para criar uma nova ordem de serviço
     * @return boolean resultado da operação
     */
    public function create() {
        try {
            // Query para inserir registro
            $query = "INSERT INTO " . $this->table_name . "
                    (NumeroOS, DataAbertura, Equipamento, Defeito, Servico, ValorTotal, Status, CodigoCliente, CodigoColaborador)
                    VALUES
                    (:numeroOS, :dataAbertura, :equipamento, :defeito, :servico, :valorTotal, :status, :codigoCliente, :codigoColaborador)";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Sanitizar dados
            $this->numeroOS = htmlspecialchars(strip_tags($this->numeroOS));
            $this->dataAbertura = htmlspecialchars(strip_tags($this->dataAbertura));
            $this->equipamento = htmlspecialchars(strip_tags($this->equipamento));
            $this->defeito = htmlspecialchars(strip_tags($this->defeito));
            $this->servico = htmlspecialchars(strip_tags($this->servico));
            $this->status = htmlspecialchars(strip_tags($this->status));
            
            // Vincular valores
            $stmt->bindParam(":numeroOS", $this->numeroOS);
            $stmt->bindParam(":dataAbertura", $this->dataAbertura);
            $stmt->bindParam(":equipamento", $this->equipamento);
            $stmt->bindParam(":defeito", $this->defeito);
            $stmt->bindParam(":servico", $this->servico);
            $stmt->bindParam(":valorTotal", $this->valorTotal);
            $stmt->bindParam(":status", $this->status);
            $stmt->bindParam(":codigoCliente", $this->codigoCliente);
            $stmt->bindParam(":codigoColaborador", $this->codigoColaborador);
            
            // Executar query
            if($stmt->execute()) {
                $this->codigoOS = $this->conn->lastInsertId();
                return true;
            }
            
            return false;
        } catch(PDOException $e) {
            echo "Erro ao criar OS: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para ler uma ordem de serviço específica
     * @param int $id ID da ordem de serviço
     * @return boolean resultado da operação
     */
    public function readOne($id) {
        try {
            // Query para ler um registro
            $query = "SELECT o.*, c.Nome as NomeCliente
                    FROM " . $this->table_name . " o
                    LEFT JOIN CLIENTE c ON o.CodigoCliente = c.CodigoCliente
                    WHERE o.CodigoOS = :id";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Vincular ID
            $stmt->bindParam(":id", $id);
            
            // Executar query
            $stmt->execute();
            
            // Obter registro
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                // Preencher propriedades
                $this->codigoOS = $row['CodigoOS'];
                $this->numeroOS = $row['NumeroOS'];
                $this->dataAbertura = $row['DataAbertura'];
                $this->equipamento = $row['Equipamento'];
                $this->defeito = $row['Defeito'];
                $this->servico = $row['Servico'];
                $this->valorTotal = $row['ValorTotal'];
                $this->status = $row['Status'];
                $this->codigoCliente = $row['CodigoCliente'];
                $this->codigoColaborador = $row['CodigoColaborador'];
                $this->nomeCliente = $row['NomeCliente'];
                
                return true;
            }
            
            return false;
        } catch(PDOException $e) {
            echo "Erro ao ler OS: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para buscar ordem de serviço por número ou CPF do cliente
     * @param string $termo termo de busca (número OS ou CPF)
     * @return array resultado da busca
     */
    public function search($termo) {
        try {
            // Query para buscar registros
            $query = "SELECT o.*, c.Nome as NomeCliente
                    FROM " . $this->table_name . " o
                    LEFT JOIN CLIENTE c ON o.CodigoCliente = c.CodigoCliente
                    WHERE o.NumeroOS LIKE :termo
                    OR c.CPF LIKE :termo
                    OR o.Status LIKE :termo";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Vincular termo de busca
            $termo = "%{$termo}%";
            $stmt->bindParam(":termo", $termo);
            
            // Executar query
            $stmt->execute();
            
            return $stmt;
        } catch(PDOException $e) {
            echo "Erro ao buscar OS: " . $e->getMessage();
            return null;
        }
    }
    
    /**
     * Método para busca avançada de ordens de serviço com múltiplos critérios
     * @param array $params parâmetros de busca (número_os, cliente, data_abertura, equipamento)
     * @return array resultado da busca
     */
    public function searchAdvanced($params) {
        try {
            // Iniciar a query base
            $query = "SELECT o.*, c.Nome as NomeCliente
                    FROM " . $this->table_name . " o
                    LEFT JOIN CLIENTE c ON o.CodigoCliente = c.CodigoCliente
                    WHERE 1=1";
            
            // Array para armazenar os parâmetros de busca
            $bindParams = array();
            
            // Adicionar condições com base nos parâmetros fornecidos
            if (isset($params['termo'])) {
                $query .= " AND (o.NumeroOS LIKE :termo OR c.CPF LIKE :termo OR c.Nome LIKE :termo)";
                $bindParams[':termo'] = '%' . $params['termo'] . '%';
            }
            
            if (isset($params['numero_os'])) {
                $query .= " AND o.NumeroOS LIKE :numero_os";
                $bindParams[':numero_os'] = '%' . $params['numero_os'] . '%';
            }
            
            if (isset($params['cliente'])) {
                $query .= " AND (c.Nome LIKE :cliente OR c.CodigoCliente = :cliente_id OR c.CPF LIKE :cliente_cpf)";
                $bindParams[':cliente'] = '%' . $params['cliente'] . '%';
                $bindParams[':cliente_id'] = $params['cliente'];
                $bindParams[':cliente_cpf'] = '%' . $params['cliente'] . '%';
            }
            
            if (isset($params['data_abertura'])) {
                $query .= " AND DATE(o.DataAbertura) = :data_abertura";
                $bindParams[':data_abertura'] = $params['data_abertura'];
            }
            
            if (isset($params['equipamento'])) {
                $query .= " AND o.Equipamento LIKE :equipamento";
                $bindParams[':equipamento'] = '%' . $params['equipamento'] . '%';
            }
            
            // Ordenar por data de abertura (mais recentes primeiro)
            $query .= " ORDER BY o.DataAbertura DESC";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Vincular parâmetros
            foreach ($bindParams as $param => $value) {
                $stmt->bindValue($param, $value);
            }
            
            // Executar query
            $stmt->execute();
            
            return $stmt;
        } catch(PDOException $e) {
            echo "Erro ao realizar busca avançada: " . $e->getMessage();
            return null;
        }
    }
    
    /**
     * Método para atualizar uma ordem de serviço
     * @return boolean resultado da operação
     */
    public function update() {
        try {
            // Query para atualizar registro
            $query = "UPDATE " . $this->table_name . "
                    SET
                        NumeroOS = :numeroOS,
                        DataAbertura = :dataAbertura,
                        Equipamento = :equipamento,
                        Defeito = :defeito,
                        Servico = :servico,
                        ValorTotal = :valorTotal,
                        Status = :status,
                        CodigoCliente = :codigoCliente,
                        CodigoColaborador = :codigoColaborador
                    WHERE
                        CodigoOS = :codigoOS";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Sanitizar dados
            $this->numeroOS = htmlspecialchars(strip_tags($this->numeroOS));
            $this->dataAbertura = htmlspecialchars(strip_tags($this->dataAbertura));
            $this->equipamento = htmlspecialchars(strip_tags($this->equipamento));
            $this->defeito = htmlspecialchars(strip_tags($this->defeito));
            $this->servico = htmlspecialchars(strip_tags($this->servico));
            $this->status = htmlspecialchars(strip_tags($this->status));
            
            // Vincular valores
            $stmt->bindParam(":numeroOS", $this->numeroOS);
            $stmt->bindParam(":dataAbertura", $this->dataAbertura);
            $stmt->bindParam(":equipamento", $this->equipamento);
            $stmt->bindParam(":defeito", $this->defeito);
            $stmt->bindParam(":servico", $this->servico);
            $stmt->bindParam(":valorTotal", $this->valorTotal);
            $stmt->bindParam(":status", $this->status);
            $stmt->bindParam(":codigoCliente", $this->codigoCliente);
            $stmt->bindParam(":codigoColaborador", $this->codigoColaborador);
            $stmt->bindParam(":codigoOS", $this->codigoOS);
            
            // Executar query
            if($stmt->execute()) {
                return true;
            }
            
            return false;
        } catch(PDOException $e) {
            echo "Erro ao atualizar OS: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para excluir uma ordem de serviço
     * @param int $id ID da ordem de serviço
     * @return boolean resultado da operação
     */
    public function delete($id) {
        try {
            // Query para excluir registro
            $query = "DELETE FROM " . $this->table_name . " WHERE CodigoOS = :id";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Vincular ID
            $stmt->bindParam(":id", $id);
            
            // Executar query
            if($stmt->execute()) {
                return true;
            }
            
            return false;
        } catch(PDOException $e) {
            echo "Erro ao excluir OS: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para listar todas as ordens de serviço
     * @return PDOStatement resultado da consulta
     */
    public function readAll() {
        try {
            // Query para ler todos os registros
            $query = "SELECT o.*, c.Nome as NomeCliente
                    FROM " . $this->table_name . " o
                    LEFT JOIN CLIENTE c ON o.CodigoCliente = c.CodigoCliente
                    ORDER BY o.DataAbertura DESC";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Executar query
            $stmt->execute();
            
            return $stmt;
        } catch(PDOException $e) {
            echo "Erro ao listar OS: " . $e->getMessage();
            return null;
        }
    }
}