<?php
/**
 * Classe responsável pela conexão com o banco de dados
 */
class Database {
    private $host = 'localhost';
    private $db_name = 'tech_solutions';
    private $username = 'root';
    private $password = '';
    private $conn;
    
    /**
     * Método para obter a conexão com o banco de dados
     * @return PDO objeto de conexão
     */
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            echo "Erro na conexão: " . $e->getMessage();
        }
        
        return $this->conn;
    }
    
    /**
     * Método para fechar a conexão com o banco de dados
     */
    public function closeConnection() {
        $this->conn = null;
    }
}