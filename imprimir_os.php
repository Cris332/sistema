<?php
// Incluir arquivos de conexão e modelo
include_once 'classes/Database.php';
include_once 'classes/OrdemServico.php';
include_once 'classes/Cliente.php';

// Verificar se o ID foi fornecido
if (!isset($_GET['id']) || empty($_GET['id'])) {
    die('ID da ordem de serviço não fornecido.');
}

// Instanciar banco de dados e objetos
$database = new Database();
$db = $database->getConnection();

$ordem = new OrdemServico($db);
$cliente = new Cliente($db);

// Obter ID da ordem de serviço
$id = $_GET['id'];

// Ler os detalhes da ordem de serviço
if (!$ordem->readOne($id)) {
    die('Ordem de serviço não encontrada.');
}

// Ler os detalhes do cliente
$cliente->readOne($ordem->codigoCliente);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Impressão de OS - <?php echo $ordem->numeroOS; ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="js/config.js"></script>
    <style>
        :root {
            --background-color: #f0f0f0;
            --text-color: #333;
            --primary-color: #6699cc;
            --secondary-color: #3366cc;
            --content-bg: #3366cc;
            --form-bg: #e6e6e6;
            --option-bg: #f9f9f9;
            --border-color: #ddd;
            --font-size-base: 16px;
            --font-size-large: 18px;
            --contrast-text: #000;
            --contrast-bg: #fff;
            --success-color: #5cb85c;
            --warning-color: #f0ad4e;
        }
        
        .dark-theme {
            --background-color: #222;
            --text-color: #f0f0f0;
            --primary-color: #4477aa;
            --secondary-color: #2244aa;
            --content-bg: #1a1a2e;
            --form-bg: #333;
            --option-bg: #444;
            --border-color: #555;
            --contrast-text: #fff;
            --contrast-bg: #000;
        }
        
        .high-contrast {
            --background-color: #000;
            --text-color: #fff;
            --primary-color: #fff;
            --secondary-color: #fff;
            --content-bg: #000;
            --form-bg: #000;
            --option-bg: #000;
            --border-color: #fff;
            --contrast-text: #fff;
            --contrast-bg: #000;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--background-color);
            color: var(--text-color);
            font-size: var(--font-size-base);
            transition: background-color 0.3s, color 0.3s, font-size 0.3s;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
        }
        
        .os-info {
            margin-bottom: 20px;
        }
        
        .os-info table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .os-info table, .os-info th, .os-info td {
            border: 1px solid #000;
        }
        
        .os-info th, .os-info td {
            padding: 8px;
            text-align: left;
        }
        
        .os-info th {
            background-color: #f2f2f2;
        }
        
        .cliente-info, .servico-info {
            margin-bottom: 20px;
        }
        
        .footer {
            margin-top: 50px;
            text-align: center;
        }
        
        .assinatura {
            margin-top: 70px;
            border-top: 1px solid #000;
            width: 200px;
            display: inline-block;
            text-align: center;
        }
        
        @media print {
            .no-print {
                display: none;
            }
            
            body {
                padding: 0;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Tech Solutions</h1>
        <p>Sistema de Controle de Serviços</p>
    </div>
    
    <div class="os-info">
        <h2>Ordem de Serviço: <?php echo $ordem->numeroOS; ?></h2>
        <table>
            <tr>
                <th>Código OS</th>
                <th>Data de Abertura</th>
                <th>Status</th>
            </tr>
            <tr>
                <td><?php echo $ordem->codigoOS; ?></td>
                <td><?php echo date('d/m/Y', strtotime($ordem->dataAbertura)); ?></td>
                <td><?php echo ucfirst(str_replace('_', ' ', $ordem->status)); ?></td>
            </tr>
        </table>
    </div>
    
    <div class="cliente-info">
        <h3>Dados do Cliente</h3>
        <p><strong>Nome:</strong> <?php echo $cliente->nome; ?></p>
        <p><strong>Telefone:</strong> <?php echo $cliente->telefone; ?></p>
        <p><strong>Email:</strong> <?php echo $cliente->email; ?></p>
        <p><strong>Endereço:</strong> <?php echo $cliente->endereco; ?></p>
        <p><strong>CPF/CNPJ:</strong> <?php echo $cliente->cpf ?: $cliente->cnpj; ?></p>
    </div>
    
    <div class="servico-info">
        <h3>Dados do Serviço</h3>
        <p><strong>Equipamento:</strong> <?php echo $ordem->equipamento; ?></p>
        <p><strong>Defeito Relatado:</strong> <?php echo $ordem->defeito; ?></p>
        <p><strong>Serviço Realizado:</strong> <?php echo $ordem->servico ?: 'Não informado'; ?></p>
        <p><strong>Valor Total:</strong> R$ <?php echo number_format($ordem->valorTotal, 2, ',', '.'); ?></p>
    </div>
    
    <div class="footer">
        <div class="assinatura">
            <p>Assinatura do Cliente</p>
        </div>
        
        <div class="assinatura" style="margin-left: 100px;">
            <p>Assinatura do Técnico</p>
        </div>
    </div>
    
    <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="padding: 8px 15px; margin-right: 10px; background-color: #6699cc; color: white; border: none; border-radius: 3px; cursor: pointer;"><i class="fas fa-print" style="margin-right: 5px;"></i> Imprimir</button>
        <button onclick="window.close()" style="padding: 8px 15px; background-color: #ddd; color: #333; border: none; border-radius: 3px; cursor: pointer;"><i class="fas fa-times" style="margin-right: 5px;"></i> Fechar</button>
    </div>
    
    <script>
        window.onload = function() {
            // Aplicar configurações de impressão
            const configuracoesSalvas = localStorage.getItem('sistema_configuracoes');
            
            if (configuracoesSalvas) {
                const config = JSON.parse(configuracoesSalvas);
                
                // Aplicar configurações de impressão
                if (config.impressao) {
                    // Mostrar/ocultar logo
                    const logoElement = document.querySelector('.cabecalho-logo');
                    if (logoElement) {
                        logoElement.style.display = config.impressao.logo ? 'block' : 'none';
                    }
                    
                    // Mostrar/ocultar data
                    const dataElement = document.querySelector('.data-impressao');
                    if (dataElement) {
                        dataElement.style.display = config.impressao.data ? 'block' : 'none';
                    }
                    
                    // Mostrar/ocultar cabeçalho e rodapé
                    const cabecalhoElement = document.querySelector('.cabecalho');
                    const rodapeElement = document.querySelector('.rodape');
                    
                    if (cabecalhoElement) {
                        cabecalhoElement.style.display = config.impressao.cabecalho ? 'block' : 'none';
                    }
                    
                    if (rodapeElement) {
                        rodapeElement.style.display = config.impressao.cabecalho ? 'block' : 'none';
                    }
                }
                
                // Aplicar tamanho de fonte para impressão
                if (config.aparencia && config.aparencia.tamanhoFonte) {
                    document.body.style.fontSize = `${config.aparencia.tamanhoFonte}pt`;
                }
            }
            
            // Iniciar impressão após aplicar configurações
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>