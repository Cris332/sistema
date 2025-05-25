<?php
require_once 'Database.php';

/**
 * Classe responsável pelas operações CRUD de Clientes
 */
class Cliente {
    // Conexão com o banco de dados e nome da tabela
    private $conn;
    private $table_name = "CLIENTE";
    
    // Propriedades do cliente
    public $codigoCliente;
    public $nome;
    public $cpf;
    public $cnpj;
    public $telefone;
    public $email;
    public $endereco;
    public $dataCadastro;
    
    /**
     * Construtor com conexão ao banco de dados
     * @param PDO $db conexão com o banco de dados
     */
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Método para criar um novo cliente
     * @return boolean resultado da operação
     */
    public function create() {
        try {
            // Query para inserir registro
            $query = "INSERT INTO " . $this->table_name . "
                    (Nome, CPF, CNPJ, Telefone, Email, Endereco)
                    VALUES
                    (:nome, :cpf, :cnpj, :telefone, :email, :endereco)";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Sanitizar dados
            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->cpf = htmlspecialchars(strip_tags($this->cpf));
            $this->cnpj = htmlspecialchars(strip_tags($this->cnpj));
            $this->telefone = htmlspecialchars(strip_tags($this->telefone));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->endereco = htmlspecialchars(strip_tags($this->endereco));
            
            // Vincular valores
            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":cpf", $this->cpf);
            $stmt->bindParam(":cnpj", $this->cnpj);
            $stmt->bindParam(":telefone", $this->telefone);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":endereco", $this->endereco);
            
            // Executar query
            if($stmt->execute()) {
                $this->codigoCliente = $this->conn->lastInsertId();
                return true;
            }
            
            return false;
        } catch(PDOException $e) {
            echo "Erro ao criar cliente: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para ler um cliente específico
     * @param int $id ID do cliente
     * @return boolean resultado da operação
     */
    public function readOne($id) {
        try {
            // Query para ler um registro
            $query = "SELECT * FROM " . $this->table_name . " WHERE CodigoCliente = :id";
            
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
                $this->codigoCliente = $row['CodigoCliente'];
                $this->nome = $row['Nome'];
                $this->cpf = $row['CPF'];
                $this->cnpj = $row['CNPJ'];
                $this->telefone = $row['Telefone'];
                $this->email = $row['Email'];
                $this->endereco = $row['Endereco'];
                $this->dataCadastro = $row['DataCadastro'];
                
                return true;
            }
            
            return false;
        } catch(PDOException $e) {
            echo "Erro ao ler cliente: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para buscar cliente por nome ou CPF/CNPJ
     * @param string $termo termo de busca (nome, CPF ou CNPJ)
     * @return PDOStatement resultado da busca
     */
    public function search($termo) {
        try {
            // Query para buscar registros
            $query = "SELECT * FROM " . $this->table_name . "
                    WHERE Nome LIKE :termo
                    OR CPF LIKE :termo
                    OR CNPJ LIKE :termo";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Vincular termo de busca
            $termo = "%{$termo}%";
            $stmt->bindParam(":termo", $termo);
            
            // Executar query
            $stmt->execute();
            
            return $stmt;
        } catch(PDOException $e) {
            echo "Erro ao buscar cliente: " . $e->getMessage();
            return null;
        }
    }
    
    /**
     * Método para atualizar um cliente
     * @return boolean resultado da operação
     */
    public function update() {
        try {
            // Query para atualizar registro
            $query = "UPDATE " . $this->table_name . "
                    SET
                        Nome = :nome,
                        CPF = :cpf,
                        CNPJ = :cnpj,
                        Telefone = :telefone,
                        Email = :email,
                        Endereco = :endereco
                    WHERE
                        CodigoCliente = :codigoCliente";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Sanitizar dados
            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->cpf = htmlspecialchars(strip_tags($this->cpf));
            $this->cnpj = htmlspecialchars(strip_tags($this->cnpj));
            $this->telefone = htmlspecialchars(strip_tags($this->telefone));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->endereco = htmlspecialchars(strip_tags($this->endereco));
            
            // Vincular valores
            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":cpf", $this->cpf);
            $stmt->bindParam(":cnpj", $this->cnpj);
            $stmt->bindParam(":telefone", $this->telefone);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":endereco", $this->endereco);
            $stmt->bindParam(":codigoCliente", $this->codigoCliente);
            
            // Executar query
            if($stmt->execute()) {
                return true;
            }
            
            return false;
        } catch(PDOException $e) {
            echo "Erro ao atualizar cliente: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para excluir um cliente
     * @param int $id ID do cliente
     * @return boolean resultado da operação
     */
    public function delete($id) {
        try {
            // Query para excluir registro
            $query = "DELETE FROM " . $this->table_name . " WHERE CodigoCliente = :id";
            
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
            echo "Erro ao excluir cliente: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Método para listar todos os clientes
     * @return PDOStatement resultado da consulta
     */
    public function readAll() {
        try {
            // Query para ler todos os registros
            $query = "SELECT * FROM " . $this->table_name . " ORDER BY Nome ASC";
            
            // Preparar query
            $stmt = $this->conn->prepare($query);
            
            // Executar query
            $stmt->execute();
            
            return $stmt;
        } catch(PDOException $e) {
            echo "Erro ao listar clientes: " . $e->getMessage();
            return null;
        }
    }
}