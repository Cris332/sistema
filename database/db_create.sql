-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS tech_solutions;
USE tech_solutions;

-- Tabela USUARIO
CREATE TABLE IF NOT EXISTS USUARIO (
    CodigoUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    Nivel ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    DataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela CARGO
CREATE TABLE IF NOT EXISTS CARGO (
    CodigoCargo INT AUTO_INCREMENT PRIMARY KEY,
    NomeCargo VARCHAR(50) NOT NULL,
    Descricao VARCHAR(255)
);

-- Tabela COLABORADOR
CREATE TABLE IF NOT EXISTS COLABORADOR (
    CodigoColaborador INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Telefone VARCHAR(15),
    Email VARCHAR(100),
    DataContratacao DATE NOT NULL,
    CodigoCargo INT,
    CodigoUsuario INT,
    FOREIGN KEY (CodigoCargo) REFERENCES CARGO(CodigoCargo),
    FOREIGN KEY (CodigoUsuario) REFERENCES USUARIO(CodigoUsuario)
);

-- Tabela CLIENTE
CREATE TABLE IF NOT EXISTS CLIENTE (
    CodigoCliente INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    CPF VARCHAR(14) UNIQUE,
    CNPJ VARCHAR(18) UNIQUE,
    Telefone VARCHAR(15) NOT NULL,
    Email VARCHAR(100),
    Endereco VARCHAR(255),
    DataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela OS (Ordem de Serviço)
CREATE TABLE IF NOT EXISTS OS (
    CodigoOS INT AUTO_INCREMENT PRIMARY KEY,
    NumeroOS VARCHAR(20) NOT NULL UNIQUE,
    DataAbertura DATE NOT NULL,
    Equipamento VARCHAR(100) NOT NULL,
    Defeito TEXT NOT NULL,
    Servico TEXT,
    ValorTotal DECIMAL(10,2),
    Status ENUM('aberta', 'em_andamento', 'concluida', 'cancelada') DEFAULT 'aberta',
    CodigoCliente INT NOT NULL,
    CodigoColaborador INT,
    FOREIGN KEY (CodigoCliente) REFERENCES CLIENTE(CodigoCliente),
    FOREIGN KEY (CodigoColaborador) REFERENCES COLABORADOR(CodigoColaborador)
);

-- Inserção de dados de exemplo
-- Inserindo cargos
INSERT INTO CARGO (NomeCargo, Descricao) VALUES
('Técnico de Informática', 'Responsável pelo reparo e manutenção de equipamentos'),
('Atendente', 'Responsável pelo atendimento ao cliente'),
('Gerente', 'Responsável pela gestão da equipe');

-- Inserindo usuários
INSERT INTO USUARIO (Nome, Email, Senha, Nivel) VALUES
('Admin', 'admin@techsolutions.com', '$2y$10$abcdefghijklmnopqrstuv', 'admin'),
('João Silva', 'joao@techsolutions.com', '$2y$10$abcdefghijklmnopqrstuv', 'usuario'),
('Maria Oliveira', 'maria@techsolutions.com', '$2y$10$abcdefghijklmnopqrstuv', 'usuario');

-- Inserindo colaboradores
INSERT INTO COLABORADOR (Nome, CPF, Telefone, Email, DataContratacao, CodigoCargo, CodigoUsuario) VALUES
('João Silva', '123.456.789-00', '(11) 98765-4321', 'joao@techsolutions.com', '2022-01-15', 1, 2),
('Maria Oliveira', '987.654.321-00', '(11) 91234-5678', 'maria@techsolutions.com', '2022-02-20', 2, 3),
('Carlos Santos', '456.789.123-00', '(11) 94567-8912', 'carlos@techsolutions.com', '2022-03-10', 1, NULL);

-- Inserindo clientes
INSERT INTO CLIENTE (Nome, CPF, CNPJ, Telefone, Email, Endereco) VALUES
('Pedro Alves', '111.222.333-44', NULL, '(11) 97777-8888', 'pedro@email.com', 'Rua A, 123'),
('Empresa XYZ', NULL, '12.345.678/0001-90', '(11) 3333-4444', 'contato@xyz.com', 'Av. B, 456'),
('Ana Costa', '555.666.777-88', NULL, '(11) 95555-6666', 'ana@email.com', 'Rua C, 789');

-- Inserindo ordens de serviço
INSERT INTO OS (NumeroOS, DataAbertura, Equipamento, Defeito, Servico, ValorTotal, Status, CodigoCliente, CodigoColaborador) VALUES
('OS001', '2023-05-10', 'Notebook Dell', 'Não liga', 'Troca da fonte de alimentação', 150.00, 'concluida', 1, 1),
('OS002', '2023-05-15', 'Impressora HP', 'Papel enroscando', 'Limpeza do mecanismo', 80.00, 'em_andamento', 2, 1),
('OS003', '2023-05-20', 'Desktop Lenovo', 'Tela azul', 'Formatação e reinstalação do sistema', 200.00, 'aberta', 3, 2);