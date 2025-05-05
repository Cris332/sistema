# Documentação do Sistema de Controle de Serviços

## 1. Introdução

### Nome do Projeto
Sistema de Controle de Serviços - Tech Solutions

### Objetivo do Software
O Sistema de Controle de Serviços foi desenvolvido para gerenciar de forma eficiente as ordens de serviço (OS) da empresa Tech Solutions, uma empresa de assistência técnica em computadores em crescimento. O sistema substitui o controle manual feito em planilhas, que se tornou insustentável com o aumento do volume de serviços.

### Descrição Geral
O sistema é uma aplicação web completa que permite o cadastro, edição, consulta e exclusão de ordens de serviço, além de gerenciar clientes, colaboradores e entregas. Ele oferece uma interface amigável e responsiva, com recursos de acessibilidade e personalização, garantindo a organização, rastreabilidade e eficiência no fluxo de trabalho da empresa.

### Público-alvo
- Técnicos de informática da Tech Solutions
- Atendentes responsáveis pelo cadastro de clientes e ordens de serviço
- Gerentes que precisam acompanhar o andamento dos serviços
- Administradores do sistema

## 2. Requisitos

### Requisitos Funcionais

1. **Gestão de Ordens de Serviço**
   - Cadastrar novas ordens de serviço
   - Editar ordens de serviço existentes
   - Excluir ordens de serviço
   - Pesquisar ordens de serviço por diversos critérios
   - Imprimir ordens de serviço
   - Acompanhar status das ordens de serviço (aberta, em andamento, concluída, cancelada)

2. **Gestão de Clientes**
   - Cadastrar novos clientes (pessoa física ou jurídica)
   - Editar dados de clientes
   - Pesquisar clientes
   - Vincular clientes às ordens de serviço

3. **Gestão de Colaboradores**
   - Cadastrar técnicos e outros colaboradores
   - Atribuir ordens de serviço a técnicos específicos

4. **Relatórios**
   - Gerar relatórios de ordens de serviço
   - Gerar relatórios de clientes
   - Gerar relatórios de colaboradores
   - Visualizar estatísticas e gráficos

5. **Gestão de Entregas**
   - Simular entregas de equipamentos com mapa interativo
   - Acompanhar status das entregas
   - Registrar histórico de entregas

6. **Configurações do Sistema**
   - Personalizar aparência (tema escuro, tamanho de fonte, alto contraste)
   - Configurar opções de acessibilidade
   - Configurar opções de impressão
   - Configurar notificações
   - Gerenciar backups

### Requisitos Não Funcionais

1. **Usabilidade**
   - Interface intuitiva e responsiva
   - Suporte a diferentes tamanhos de tela
   - Recursos de acessibilidade (navegação por teclado, otimização para leitores de tela)
   - Temas personalizáveis (claro, escuro, alto contraste)

2. **Desempenho**
   - Tempo de resposta rápido para operações comuns
   - Carregamento eficiente de páginas
   - Otimização para conexões de internet variadas

3. **Segurança**
   - Autenticação de usuários
   - Níveis de acesso diferenciados (admin, usuário)
   - Proteção contra injeção SQL
   - Sanitização de dados de entrada

4. **Confiabilidade**
   - Sistema de backup automático
   - Validação de dados para evitar inconsistências
   - Tratamento adequado de erros

### Requisitos de Hardware e Software

1. **Servidor**
   - Servidor web com suporte a PHP 7.0 ou superior
   - MySQL 5.7 ou superior
   - Mínimo de 2GB de RAM
   - 10GB de espaço em disco

2. **Cliente**
   - Navegador web moderno (Chrome, Firefox, Edge, Safari)
   - Conexão com internet
   - Resolução de tela mínima de 1024x768

3. **Ambiente de Desenvolvimento**
   - XAMPP, WAMP, LAMP ou similar
   - Editor de código (VS Code, Sublime Text, etc.)
   - Git para controle de versão

## 3. Diagrama de Casos de Uso

### Visão Geral do Sistema

O diagrama de casos de uso abaixo representa as principais funcionalidades do Sistema de Controle de Serviços e como os diferentes atores interagem com essas funcionalidades. Este diagrama é fundamental para compreender o escopo funcional do sistema e as responsabilidades de cada tipo de usuário.

```
+---------------------+
|                     |
|  Sistema de Controle |
|     de Serviços     |
|                     |
+---------------------+
         |
         |
+--------+---------+
|                  |
|   Casos de Uso   |
|                  |
+------------------+
         |
         |
         v
+------------------+
|                  |
|  +------------+  |
|  | Gerenciar  |  |     +-------------+
|  |    OS      |<-------->  Técnico   |
|  +------------+  |     +-------------+
|                  |
|  +------------+  |     +-------------+
|  | Gerenciar  |<-------->  Atendente |
|  | Clientes   |  |     +-------------+
|  +------------+  |
|                  |
|  +------------+  |     +-------------+
|  | Gerenciar  |<-------->  Gerente   |
|  | Relatórios |  |     +-------------+
|  +------------+  |
|                  |
|  +------------+  |
|  | Gerenciar  |<-------->+-------------+
|  | Entregas   |  |       | Entregador  |
|  +------------+  |       +-------------+
|                  |
|  +------------+  |     +-------------+
|  | Configurar |<-------->  Admin     |
|  | Sistema    |  |     +-------------+
|  +------------+  |
|                  |
|  +------------+  |     +-------------+
|  | Gerenciar  |<-------->  Admin     |
|  | Usuários   |  |     +-------------+
|  +------------+  |
|                  |
+------------------+
```

### Relacionamentos e Dependências entre Casos de Uso

O diagrama abaixo ilustra as relações de dependência e inclusão entre os principais casos de uso do sistema:

```
+-------------------+     <<include>>     +-------------------+
| Gerenciar OS      |-------------------->| Autenticar Usuário|
+-------------------+                     +-------------------+
         ^
         | <<include>>                    +-------------------+
         |                                | Notificar         |
+-------------------+     <<extend>>      | Conclusão de OS   |
| Atribuir Técnico  |-------------------->+-------------------+
+-------------------+                     
         ^
         | <<include>>                    +-------------------+
         |                                | Registrar         |
+-------------------+     <<extend>>      | Histórico         |
| Atualizar Status  |-------------------->+-------------------+
+-------------------+                     

+-------------------+     <<include>>     +-------------------+
| Gerenciar Clientes|-------------------->| Validar Dados     |
+-------------------+                     +-------------------+
         ^
         | <<include>>                    
         |                                
+-------------------+                     +-------------------+
| Pesquisar Cliente |     <<extend>>      | Exportar Dados    |
+-------------------+-------------------->+-------------------+

+-------------------+     <<include>>     +-------------------+
| Gerenciar Entregas|-------------------->| Verificar Status  |
+-------------------+                     | da OS             |
         ^                                +-------------------+
         | <<include>>                    
         |                                
+-------------------+     <<extend>>      +-------------------+
| Planejar Rota     |-------------------->| Calcular Tempo    |
+-------------------+                     | Estimado          |
                                          +-------------------+
```

### Matriz de Rastreabilidade

A tabela abaixo apresenta a matriz de rastreabilidade entre os casos de uso e os requisitos funcionais do sistema:

| Caso de Uso          | RF1 | RF2 | RF3 | RF4 | RF5 | RF6 |
|----------------------|-----|-----|-----|-----|-----|-----|
| Gerenciar OS         |  X  |     |     |     |     |     |
| Gerenciar Clientes   |     |  X  |     |     |     |     |
| Gerenciar Relatórios |     |     |     |  X  |     |     |
| Gerenciar Entregas   |     |     |     |     |  X  |     |
| Configurar Sistema   |     |     |     |     |     |  X  |
| Gerenciar Usuários   |     |     |  X  |     |     |     |

Legenda:
- RF1: Gestão de Ordens de Serviço
- RF2: Gestão de Clientes
- RF3: Gestão de Colaboradores
- RF4: Relatórios
- RF5: Gestão de Entregas
- RF6: Configurações do Sistema

### Descrição dos Atores

1. **Técnico**
   - **Descrição:** Profissional responsável pela execução dos serviços técnicos de manutenção e reparo de equipamentos.
   - **Responsabilidades:**
     - Acessa informações sobre as ordens de serviço atribuídas a ele
     - Atualiza o status e adiciona informações técnicas às OS
     - Registra diagnósticos, peças utilizadas e serviços realizados
     - Documenta procedimentos técnicos para futura referência
     - Comunica-se com clientes para esclarecimentos técnicos quando necessário
   - **Nível de Acesso:** Restrito às OS atribuídas e ferramentas técnicas
   - **Interações Principais:** Módulo de OS, Histórico Técnico, Inventário de Peças

2. **Atendente**
   - **Descrição:** Responsável pelo primeiro contato com o cliente e pelo registro inicial das solicitações de serviço.
   - **Responsabilidades:**
     - Cadastra novos clientes e mantém dados atualizados
     - Registra novas ordens de serviço com informações detalhadas
     - Agenda serviços conforme disponibilidade dos técnicos
     - Mantém contato com os clientes para atualizações de status
     - Processa pagamentos e emite recibos
     - Gerencia a fila de atendimento e prioriza casos urgentes
   - **Nível de Acesso:** Módulos de atendimento, clientes e financeiro básico
   - **Interações Principais:** Módulo de Clientes, Cadastro de OS, Agenda, Faturamento

3. **Gerente**
   - **Descrição:** Supervisiona as operações diárias e gerencia a equipe técnica e de atendimento.
   - **Responsabilidades:**
     - Supervisiona o trabalho dos técnicos e atendentes
     - Acessa e gera relatórios gerenciais e estatísticos
     - Analisa indicadores de desempenho e produtividade
     - Toma decisões estratégicas baseadas nas informações do sistema
     - Gerencia recursos humanos e materiais
     - Estabelece metas e acompanha resultados
     - Resolve escalações e situações excepcionais
   - **Nível de Acesso:** Amplo acesso a todos os módulos operacionais e gerenciais
   - **Interações Principais:** Módulo de Relatórios, Dashboards, Gestão de Equipe

4. **Entregador**
   - **Descrição:** Responsável pelo transporte e entrega dos equipamentos reparados aos clientes.
   - **Responsabilidades:**
     - Planeja rotas de entrega otimizadas
     - Transporta equipamentos com segurança
     - Coleta assinatura de confirmação de entrega
     - Registra ocorrências durante o processo de entrega
     - Comunica-se com clientes para agendar horários de entrega
     - Realiza coletas de equipamentos quando necessário
   - **Nível de Acesso:** Módulo de entregas e informações básicas de OS
   - **Interações Principais:** Módulo de Entregas, Mapa Interativo, Histórico de Entregas

5. **Administrador**
   - **Descrição:** Responsável pela configuração, manutenção e segurança do sistema como um todo.
   - **Responsabilidades:**
     - Possui acesso completo a todas as funcionalidades do sistema
     - Configura parâmetros globais e personalizações
     - Gerencia usuários, perfis e permissões de acesso
     - Realiza backups e restaurações de dados
     - Monitora o desempenho e segurança do sistema
     - Implementa atualizações e novas funcionalidades
     - Define políticas de uso e segurança da informação
   - **Nível de Acesso:** Irrestrito a todos os módulos e configurações
   - **Interações Principais:** Módulo de Configuração, Gerenciamento de Usuários, Logs do Sistema

6. **Cliente** (Ator Externo)
   - **Descrição:** Pessoa física ou jurídica que solicita serviços de manutenção ou reparo.
   - **Responsabilidades:**
     - Solicita serviços através de canais de atendimento
     - Fornece informações sobre equipamentos e problemas
     - Acompanha o status de suas ordens de serviço
     - Aprova orçamentos e serviços adicionais
     - Recebe equipamentos reparados
     - Fornece feedback sobre os serviços prestados
   - **Nível de Acesso:** Portal do cliente (quando implementado)
   - **Interações Principais:** Portal do Cliente, Notificações, Avaliações

### Descrição Detalhada dos Casos de Uso

#### 1. Gerenciar Ordens de Serviço

**Atores Principais:** Técnico, Atendente
**Atores Secundários:** Gerente, Administrador, Cliente

**Descrição:** Este caso de uso permite o gerenciamento completo do ciclo de vida das ordens de serviço, desde sua criação até a conclusão, incluindo todas as etapas intermediárias de processamento, diagnóstico, execução e entrega.

**Pré-condições:**
- Usuário autenticado no sistema
- Usuário com permissões adequadas para a operação desejada
- Cadastro de clientes atualizado e disponível
- Cadastro de técnicos e suas especialidades atualizado
- Tabela de preços e serviços configurada

**Fluxo Principal:**
1. O atendente cadastra uma nova ordem de serviço
2. O sistema gera um número único para a OS (formato: OS-AAAAMMDD-XXXX)
3. O atendente vincula a OS a um cliente existente ou cadastra um novo cliente
4. O atendente registra informações detalhadas sobre o equipamento:
   - Tipo (notebook, desktop, impressora, etc.)
   - Marca e modelo
   - Número de série
   - Estado de conservação
   - Acessórios entregues junto com o equipamento
5. O atendente registra o defeito relatado pelo cliente e observações iniciais
6. O sistema calcula uma data prevista para conclusão baseada na carga atual
7. O atendente informa o cliente sobre o prazo estimado e gera um comprovante de recebimento
8. O sistema salva a OS com status "Aberta" e envia notificação para a equipe técnica
9. Um gerente ou coordenador técnico designa a OS para um técnico específico baseado em:
   - Especialidade requerida
   - Carga atual de trabalho
   - Prioridade do serviço
10. O técnico recebe notificação e acessa os detalhes da OS
11. O técnico atualiza o status da OS para "Em Diagnóstico"
12. O técnico realiza o diagnóstico e registra suas conclusões técnicas
13. Se necessário, o técnico gera um orçamento para aprovação do cliente
14. Após aprovação do orçamento, o técnico atualiza o status para "Em Andamento"
15. O técnico executa o serviço e registra todas as ações realizadas:
    - Procedimentos técnicos executados
    - Peças substituídas (com códigos e valores)
    - Testes realizados
    - Observações técnicas
16. O técnico atualiza o status da OS para "Concluída"
17. O sistema notifica o atendente sobre a conclusão
18. O atendente contata o cliente para informar sobre a conclusão do serviço
19. O sistema registra a data e hora de todas as mudanças de status

**Fluxos Alternativos:**

**A. Cancelamento de OS:**
1. A qualquer momento, o atendente ou gerente pode cancelar uma OS
2. O sistema solicita o motivo do cancelamento
3. O sistema registra o cancelamento com o motivo e data/hora
4. O sistema notifica as partes envolvidas

**B. Edição de OS:**
1. Informações da OS podem ser editadas enquanto não estiver concluída
2. O sistema registra o histórico de alterações com data/hora e usuário
3. Alterações em campos críticos (valor, cliente, equipamento) requerem autorização de nível superior

**C. Impressão de OS:**
1. A OS pode ser impressa para documentação física
2. O sistema gera um PDF com todas as informações relevantes
3. O usuário pode selecionar quais seções incluir na impressão

**D. Orçamento Recusado:**
1. Cliente recusa o orçamento proposto
2. Técnico registra a recusa e o motivo
3. Sistema atualiza status para "Aguardando Retirada sem Conserto"
4. Atendente notifica cliente para retirada do equipamento

**E. Necessidade de Peças:**
1. Técnico identifica necessidade de peças não disponíveis em estoque
2. Técnico registra as peças necessárias e atualiza status para "Aguardando Peças"
3. Sistema gera solicitação para setor de compras
4. Após chegada das peças, sistema notifica técnico
5. Técnico retoma o serviço e atualiza status

**F. Serviço com Garantia:**
1. Atendente identifica que o equipamento está em garantia de serviço anterior
2. Sistema aplica regras de garantia (sem custo, prioridade de atendimento)
3. OS é marcada como "Garantia" e segue fluxo especial

**Pós-condições:**
- OS registrada no sistema com status apropriado
- Histórico completo de alterações da OS mantido para auditoria
- Registro detalhado de serviços executados e peças utilizadas
- Documentação técnica atualizada
- Faturamento gerado quando aplicável
- Estatísticas de atendimento atualizadas

**Regras de Negócio Associadas:**
- RN01: Toda OS deve ter um número único gerado sequencialmente
- RN02: OSs não podem ser excluídas, apenas canceladas
- RN03: Mudanças de status devem seguir o fluxo pré-definido
- RN04: Toda alteração em OS deve ser registrada com data, hora e usuário
- RN05: OSs concluídas há mais de 90 dias são arquivadas automaticamente

**Diagrama de Sequência - Fluxo Principal:**

```
+----------+    +----------+    +----------+    +----------+    +----------+
| Cliente  |    | Atendente|    | Sistema  |    | Gerente  |    | Técnico  |
+----------+    +----------+    +----------+    +----------+    +----------+
     |                |              |               |              |
     | Solicita       |              |               |              |
     | serviço        |              |               |              |
     |--------------->|              |               |              |
     |                |              |               |              |
     |                | Cadastra OS  |               |              |
     |                |------------->|               |              |
     |                |              |               |              |
     |                |              | Gera número   |              |
     |                |              | único         |              |
     |                |              |---------------|              |
     |                |              |               |              |
     |                | Vincula      |               |              |
     |                | cliente      |               |              |
     |                |------------->|               |              |
     |                |              |               |              |
     |                | Registra     |               |              |
     |                | equipamento  |               |              |
     |                |------------->|               |              |
     |                |              |               |              |
     |                | Salva OS     |               |              |
     |                |------------->|               |              |
     |                |              |               |              |
     |                |              | Notifica      |              |
     |                |              | equipe        |              |
     |                |              |-------------->|              |
     |                |              |               |              |
     |                |              |               | Designa      |
     |                |              |               | técnico      |
     |                |              |               |------------->|
     |                |              |               |              |
     |                |              |               |              | Atualiza
     |                |              |               |              | status
     |                |              |               |              |-------->
     |                |              |               |              |
     |                |              |               |              | Realiza
     |                |              |               |              | diagnóstico
     |                |              |               |              |-------->
     |                |              |               |              |
     |                |              |               |              | Executa
     |                |              |               |              | serviço
     |                |              |               |              |-------->
     |                |              |               |              |
     |                |              |               |              | Conclui
     |                |              |               |              | OS
     |                |              |               |              |-------->
     |                |              |               |              |
     |                |              | Notifica      |              |
     |                |              | conclusão     |              |
     |                |              |-------------->|              |
     |                |              |               |              |
     |                | Contata      |               |              |
     |                | cliente      |               |              |
     |                |------------->|               |              |
     |                |              |               |              |
     | Retira         |              |               |              |
     | equipamento    |              |               |              |
     |<---------------|              |               |              |
     |                |              |               |              |
```

**Cenários de Uso Específicos:**

**Cenário 1: Reparo de Notebook com Problema de Tela**

Maria, cliente da Tech Solutions, traz seu notebook que está apresentando falhas na tela. O atendente João registra uma nova OS, vinculando ao cadastro de Maria. Ele descreve o problema como "Tela apresentando linhas horizontais e falhas de imagem". O sistema gera o número OS-20230615-0042 e calcula uma previsão de 3 dias úteis para conclusão.

O gerente técnico Paulo designa a OS para o técnico especialista em notebooks, Carlos. Carlos realiza o diagnóstico e identifica que o cabo flat da tela está danificado. Ele atualiza a OS com o diagnóstico e gera um orçamento de R$ 180,00 para a substituição da peça.

Após aprovação do orçamento por Maria (via telefone), Carlos atualiza o status para "Em Andamento", solicita a peça ao estoque, realiza a substituição e testes. Ao concluir, ele registra detalhadamente o procedimento realizado e atualiza o status para "Concluída".

João recebe a notificação, contata Maria informando que o notebook está pronto. Maria retira o equipamento na loja, testa o funcionamento e assina o termo de entrega. O sistema registra a conclusão do atendimento e gera uma pesquisa de satisfação automática que será enviada por email após 2 dias.

**Cenário 2: Manutenção Preventiva em Servidor Empresarial**

A empresa ABC Ltda., cliente corporativo, solicita manutenção preventiva em seu servidor principal. O atendente Pedro registra a OS como serviço agendado, com prioridade alta devido à criticidade do equipamento. O técnico especialista em servidores, Marcos, é designado para realizar o serviço no local do cliente.

Marcos comparece à empresa na data agendada, realiza backup dos dados críticos, limpeza física do equipamento, atualização de firmware, verificação de logs de erro e testes de performance. Ele registra todas as ações no sistema através do aplicativo móvel, anexando fotos do antes e depois da intervenção.

Ao finalizar, Marcos obtém a assinatura digital do responsável de TI da empresa no tablet, confirmando a conclusão satisfatória do serviço. O sistema atualiza automaticamente o status da OS para "Concluída" e programa a próxima manutenção preventiva para 6 meses depois, conforme contrato de manutenção.

#### 2. Gerenciar Clientes

**Atores Principais:** Atendente
**Atores Secundários:** Gerente, Administrador

**Descrição:** Este caso de uso permite o cadastro e manutenção das informações dos clientes no sistema.

**Pré-condições:**
- Usuário autenticado no sistema
- Usuário com permissões adequadas

**Fluxo Principal:**
1. O atendente seleciona a opção de cadastro de cliente
2. O atendente preenche os dados do cliente (nome, CPF/CNPJ, contato, endereço)
3. O sistema valida os dados inseridos
4. O sistema registra o novo cliente

**Fluxos Alternativos:**
- Edição de cliente: Dados do cliente podem ser atualizados
- Pesquisa de cliente: Busca por clientes existentes
- Vinculação a OS: Cliente é vinculado a uma nova ordem de serviço

**Pós-condições:**
- Cliente registrado no sistema
- Cliente disponível para vinculação a ordens de serviço

#### 3. Gerenciar Relatórios

**Atores Principais:** Gerente
**Atores Secundários:** Administrador

**Descrição:** Este caso de uso permite a geração e visualização de relatórios gerenciais e estatísticos sobre o funcionamento do sistema.

**Pré-condições:**
- Usuário autenticado no sistema
- Usuário com permissões de gerência

**Fluxo Principal:**
1. O gerente acessa o módulo de relatórios
2. O gerente seleciona o tipo de relatório desejado
3. O gerente define os filtros e parâmetros do relatório
4. O sistema processa os dados e gera o relatório
5. O sistema exibe o relatório com gráficos e tabelas

**Fluxos Alternativos:**
- Exportação: O relatório pode ser exportado em diferentes formatos
- Impressão: O relatório pode ser impresso
- Agendamento: Relatórios podem ser agendados para geração periódica

**Pós-condições:**
- Relatório gerado e disponível para análise
- Dados estatísticos apresentados de forma visual

#### 4. Gerenciar Entregas

**Atores Principais:** Entregador
**Atores Secundários:** Atendente, Gerente, Cliente, Técnico

**Descrição:** Este caso de uso permite o gerenciamento completo do processo de entregas de equipamentos aos clientes após a conclusão dos serviços, incluindo planejamento de rotas, rastreamento em tempo real, confirmação de entrega e gestão de ocorrências durante o processo logístico.

**Pré-condições:**
- Usuário autenticado no sistema com permissões para o módulo de entregas
- OS com status "Concluída" e aprovada para entrega
- Equipamento verificado, embalado e pronto para entrega
- Pagamento processado ou autorizado (quando aplicável)
- Veículo de entrega disponível e em condições adequadas
- Dados de contato e endereço do cliente atualizados

**Fluxo Principal:**
1. O técnico finaliza o serviço e marca a OS como "Concluída"
2. O sistema notifica o atendente sobre a conclusão do serviço
3. O atendente verifica se todos os requisitos para entrega estão atendidos:
   - Serviço totalmente concluído e testado
   - Pagamento processado ou forma de pagamento definida
   - Documentação necessária preparada (nota fiscal, termo de garantia)
   - Embalagem adequada para transporte
4. O atendente registra que o equipamento está pronto para entrega e seleciona a modalidade:
   - Retirada pelo cliente
   - Entrega padrão
   - Entrega expressa
   - Entrega agendada
5. O sistema atualiza o status da OS para "Aguardando Entrega"
6. O entregador acessa o módulo de entregas no início do expediente
7. O sistema exibe a lista de entregas pendentes, organizadas por:
   - Prioridade
   - Localização geográfica
   - Janela de horário para entrega
8. O sistema sugere automaticamente um roteiro otimizado para as entregas do dia
9. O entregador pode ajustar o roteiro conforme necessidade
10. O entregador seleciona as entregas que realizará no próximo ciclo
11. O sistema gera um manifesto de entrega com todos os detalhes necessários
12. O entregador confirma a retirada dos equipamentos do estoque
13. O sistema atualiza o status das OS para "Em Rota de Entrega"
14. O sistema exibe o mapa interativo com a rota sugerida e informações de cada parada
15. O entregador inicia o percurso, seguindo a navegação em tempo real
16. Ao chegar no destino, o entregador registra o início do atendimento
17. O entregador realiza a entrega ao cliente, coletando:
    - Assinatura digital de recebimento
    - Forma de pagamento (se aplicável)
    - Foto do equipamento entregue (opcional)
    - Avaliação de satisfação inicial
18. O entregador confirma a entrega no sistema através do aplicativo móvel
19. O sistema atualiza o status da OS para "Entregue" e registra data/hora exata
20. O sistema envia automaticamente uma confirmação de entrega por email ao cliente
21. O entregador prossegue para o próximo destino até completar o roteiro

**Fluxos Alternativos:**

**A. Entrega não

#### 5. Configurar Sistema

**Atores Principais:** Administrador

**Descrição:** Este caso de uso permite a configuração de parâmetros e personalização do sistema.

**Pré-condições:**
- Usuário autenticado como administrador

**Fluxo Principal:**
1. O administrador acessa o módulo de configurações
2. O administrador seleciona a categoria de configuração desejada
3. O administrador ajusta os parâmetros conforme necessário
4. O sistema valida as configurações
5. O sistema aplica as novas configurações

**Fluxos Alternativos:**
- Restauração de padrões: Configurações são restauradas para valores padrão
- Backup de configurações: Configurações atuais são salvas
- Importação de configurações: Configurações salvas são importadas

**Pós-condições:**
- Sistema configurado conforme especificações do administrador
- Configurações aplicadas para todos os usuários

#### 6. Gerenciar Usuários

**Atores Principais:** Administrador
**Atores Secundários:** Gerente (acesso limitado)

**Descrição:** Este caso de uso permite o gerenciamento completo de usuários do sistema, incluindo criação, edição, desativação e exclusão de contas, bem como a definição granular de permissões e papéis, controle de acesso baseado em funções, e monitoramento de atividades dos usuários para garantir a segurança e integridade do sistema.

**Pré-condições:**
- Usuário autenticado como administrador
- Acesso ao módulo de gerenciamento de usuários
- Estrutura organizacional e funções definidas
- Políticas de segurança e acesso estabelecidas
- Matriz de responsabilidades documentada

**Fluxo Principal:**
1. O administrador acessa o módulo de gerenciamento de usuários
2. O sistema exibe a lista de usuários cadastrados com informações resumidas:
   - Nome completo
   - Nome de usuário
   - Email
   - Cargo/Função
   - Status (Ativo, Inativo, Bloqueado)
   - Data do último acesso
3. O administrador seleciona a opção de cadastrar novo usuário
4. O sistema exibe o formulário de cadastro
5. O administrador preenche os dados do usuário:
   - Nome completo
   - Nome de usuário (login)
   - Email corporativo
   - Telefone de contato
   - Departamento/Setor
   - Cargo/Função
   - Foto (opcional)
6. O administrador define uma senha inicial ou opta por enviar link de definição de senha
7. O administrador seleciona o perfil de acesso base (Técnico, Atendente, Gerente, etc.)
8. O administrador personaliza permissões específicas, se necessário:
   - Módulos acessíveis
   - Operações permitidas (visualizar, criar, editar, excluir)
   - Restrições de horário de acesso (opcional)
   - Restrições de IP (opcional)
9. O administrador define a data de expiração da conta (opcional)
10. O sistema valida os dados inseridos
11. O sistema cria o novo usuário e gera um registro no log de auditoria
12. O sistema envia email de boas-vindas com instruções de acesso

**Fluxos Alternativos:**

**A. Edição de Usuário:**
1. O administrador localiza o usuário na lista ou através da busca
2. O administrador seleciona a opção de editar usuário
3. O sistema exibe o formulário preenchido com os dados atuais
4. O administrador atualiza os dados necessários
5. O administrador confirma as alterações
6. O sistema valida os dados e atualiza o cadastro
7. O sistema registra as alterações no log de auditoria
8. O sistema notifica o usuário sobre as alterações relevantes

**B. Desativação de Usuário:**
1. O administrador localiza o usuário na lista
2. O administrador seleciona a opção de desativar usuário
3. O sistema solicita o motivo da desativação
4. O administrador informa o motivo e confirma a ação
5. O sistema altera o status do usuário para "Inativo"
6. O sistema encerra todas as sessões ativas do usuário
7. O sistema registra a ação no log de auditoria
8. O sistema notifica o usuário sobre a desativação

**C. Exclusão de Usuário:**
1. O administrador localiza o usuário na lista
2. O administrador seleciona a opção de excluir usuário
3. O sistema exibe um alerta sobre as implicações da exclusão
4. O sistema solicita confirmação com autenticação adicional
5. O administrador confirma a exclusão
6. O sistema oferece opções para tratamento dos dados associados:
   - Transferir para outro usuário
   - Arquivar
   - Excluir completamente
7. O sistema processa a exclusão conforme a opção selecionada
8. O sistema registra a ação no log de auditoria

**D. Redefinição de Senha:**
1. O administrador localiza o usuário na lista
2. O administrador seleciona a opção de redefinir senha
3. O sistema oferece duas opções:
   - Definir nova senha manualmente
   - Enviar link de redefinição para o email do usuário
4. O administrador seleciona a opção desejada e confirma
5. O sistema processa a redefinição e notifica o usuário
6. O sistema registra a ação no log de auditoria

**E. Gestão de Perfis de Acesso:**
1. O administrador acessa a seção de Perfis de Acesso
2. O sistema exibe os perfis existentes
3. O administrador pode criar, editar ou excluir perfis
4. Para cada perfil, o administrador define as permissões associadas
5. O sistema atualiza automaticamente todos os usuários vinculados ao perfil

**Pós-condições:**
- Usuário registrado no sistema com as permissões adequadas
- Usuário pode acessar o sistema conforme seu nível de acesso
- Log de auditoria atualizado com as operações realizadas
- Notificações enviadas aos usuários afetados
- Integridade referencial mantida para dados associados aos usuários
- Políticas de segurança aplicadas conforme configuração

**Regras de Negócio Associadas:**
- RN01: Todo usuário deve estar associado a pelo menos um perfil de acesso
- RN02: Senhas devem seguir a política de segurança (mínimo 8 caracteres, combinação de letras, números e símbolos)
- RN03: Usuários inativos por mais de 90 dias são automaticamente desativados
- RN04: Administradores não podem excluir suas próprias contas
- RN05: Tentativas consecutivas de login malsucedidas resultam em bloqueio temporário

**Diagrama de Sequência - Fluxo Principal:**

```
+-------------+          +-------------+          +-------------+
|             |          |             |          |             |
| Administrador|          |   Sistema   |          |   Usuário   |
|             |          |             |          |             |
+-------------+          +-------------+          +-------------+
      |                         |                        |
      | Acessa módulo           |                        |
      | de usuários             |                        |
      |------------------------>|                        |
      |                         |                        |
      |                         | Exibe lista            |
      |                         | de usuários           |
      |<------------------------|                        |
      |                         |                        |
      | Seleciona cadastrar     |                        |
      | novo usuário            |                        |
      |------------------------>|                        |
      |                         |                        |
      |                         | Exibe formulário       |
      |                         | de cadastro           |
      |<------------------------|                        |
      |                         |                        |
      | Preenche dados e        |                        |
      | define permissões       |                        |
      |------------------------>|                        |
      |                         |                        |
      |                         | Valida dados           |
      |                         |----------------------->|
      |                         |                        |
      |                         | Cria usuário           |
      |                         |----------------------->|
      |                         |                        |
      |                         | Registra no log        |
      |                         | de auditoria          |
      |                         |----------------------->|
      |                         |                        |
      |                         | Envia email            |
      |                         | de boas-vindas         |
      |                         |----------------------->|
      |                         |                        |
```

**Cenários de Uso Específicos:**

**Cenário 1: Onboarding de Novo Técnico**

A Tech Solutions contratou um novo técnico especialista em redes, Carlos Silva. O administrador Marcos precisa criar um acesso ao sistema para que Carlos possa começar a atender chamados.

Marcos acessa o módulo de gerenciamento de usuários e seleciona "Cadastrar Novo Usuário". Ele preenche os dados de Carlos, incluindo seu email corporativo recém-criado. Marcos seleciona o perfil base "Técnico" e adiciona permissões específicas para o módulo de diagnóstico de redes, uma ferramenta especializada que nem todos os técnicos podem acessar.

Marcos opta por enviar um link de definição de senha para o email de Carlos e define que a senha deverá ser alterada no primeiro acesso. O sistema cria o usuário, registra a ação no log e envia o email para Carlos. Quando Carlos acessa o sistema pela primeira vez, ele é guiado por um tutorial rápido sobre as funcionalidades disponíveis para seu perfil.

**Cenário 2: Transição de Cargo e Ajuste de Permissões**

A atendente Ana foi promovida para o cargo de supervisora de atendimento. O administrador Luiz precisa ajustar suas permissões no sistema para refletir suas novas responsabilidades.

Luiz localiza o usuário de Ana na lista e seleciona a opção de editar. Ele atualiza o cargo para "Supervisora de Atendimento" e altera o perfil base de "Atendente" para "Gerente Júnior". Luiz adiciona permissões específicas para aprovação de descontos até 15% e visualização de relatórios de desempenho da equipe.

O sistema atualiza o cadastro de Ana

## 4. Instalação

### Pré-requisitos

- PHP 7.0 ou superior
- MySQL 5.7 ou superior
- Servidor web (Apache, Nginx)
- Extensões PHP: PDO, PDO_MySQL, JSON

### Passo a passo para instalar o software

1. **Configuração do ambiente**
   - Instale o XAMPP, WAMP ou ambiente similar que inclua PHP, MySQL e Apache
   - Inicie os serviços Apache e MySQL

2. **Configuração do banco de dados**
   - Acesse o phpMyAdmin (geralmente em http://localhost/phpmyadmin)
   - Crie um novo banco de dados chamado `tech_solutions`
   - Importe o arquivo `database/db_create.sql` para criar as tabelas e dados iniciais

3. **Instalação dos arquivos do sistema**
   - Clone ou baixe os arquivos do sistema para o diretório `htdocs` do seu servidor web
   - Estrutura recomendada: `c:\xampp\htdocs\test\`

4. **Configuração de conexão com o banco de dados**
   - Verifique e ajuste as configurações de conexão no arquivo `classes/Database.php`
   - Por padrão, o sistema está configurado para:
     - Host: localhost
     - Banco de dados: tech_solutions
     - Usuário: root
     - Senha: (em branco)

5. **Acesso ao sistema**
   - Abra o navegador e acesse http://localhost/test/
   - A página inicial do sistema será exibida

### Configuração inicial

1. **Configurações do sistema**
   - Acesse a página de Opções para personalizar o sistema
   - Configure as opções de aparência, acessibilidade, impressão e notificações

2. **Cadastros iniciais**
   - Cadastre os colaboradores da empresa
   - Cadastre os clientes iniciais
   - Configure os cargos disponíveis

## 5. Arquitetura do Sistema

### Explicação geral da estrutura do software

O Sistema de Controle de Serviços segue uma arquitetura cliente-servidor com separação em camadas:

1. **Camada de Apresentação (Frontend)**
   - Páginas HTML com CSS para estilização
   - JavaScript para interatividade e validações no lado do cliente
   - Comunicação com o backend via requisições AJAX

2. **Camada de Aplicação (Backend)**
   - API RESTful em PHP para processamento de requisições
   - Classes de modelo para representação dos dados
   - Controladores para lógica de negócio

3. **Camada de Dados**
   - Banco de dados MySQL para armazenamento persistente
   - Classes PHP para acesso ao banco de dados

### Desenhos de arquitetura

#### Diagrama de Componentes
```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  Interface Web   |<--->|  API PHP (REST)  |<--->|  Banco de Dados  |
|  (HTML/CSS/JS)   |     |  (Controladores) |     |     (MySQL)      |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

#### Fluxo de Dados
```
+-------------+     +-------------+     +-------------+     +-------------+
|             |     |             |     |             |     |             |
|   Cliente   |---->|  Requisição |---->|  Processamento |---->|  Resposta   |
|  (Browser)  |     |   (AJAX)    |     |    (PHP)    |     |   (JSON)    |
|             |     |             |     |             |     |             |
+-------------+     +-------------+     +-------------+     +-------------+
```

### Explicação de cada módulo

1. **Módulo de Ordens de Serviço**
   - Arquivo principal: `index.html`
   - JavaScript: `js/app.js`
   - API: `api/os_*.php`
   - Classe: `classes/OrdemServico.php`
   - Funcionalidades: CRUD de ordens de serviço, pesquisa, impressão

2. **Módulo de Relatórios**
   - Arquivo principal: `relatorio.html`
   - JavaScript: `js/relatorio.js`, `js/charts.js`
   - API: `api/relatorio_*.php`
   - Funcionalidades: geração de relatórios, gráficos estatísticos

3. **Módulo de Entregas**
   - Arquivo principal: `entregas.html`
   - JavaScript: `js/entregas.js`
   - Funcionalidades: simulação de entregas, mapa interativo

4. **Módulo de Ajuda**
   - Arquivo principal: `ajuda.html`
   - Funcionalidades: documentação de uso, tutoriais, FAQ

5. **Módulo de Configurações**
   - Arquivo principal: `opcoes.html`
   - JavaScript: `js/config.js`
   - Funcionalidades: personalização do sistema, acessibilidade, backup

6. **Módulo de Navegação**
   - JavaScript: `js/navegacao.js`
   - Funcionalidades: menu de navegação global, consistência entre páginas

## 6. Manual do Usuário

### Como utilizar o sistema

#### Acesso ao Sistema
1. Abra o navegador e acesse o endereço do sistema
2. A página inicial exibirá o formulário de Ordem de Serviço

#### Criação de uma Nova Ordem de Serviço
1. Na página inicial, clique no botão "Nova OS"
2. Preencha os campos obrigatórios:
   - Número da OS (gerado automaticamente)
   - Data (preenchida com a data atual)
   - Equipamento
   - Defeito
   - Cliente (selecione um cliente existente ou cadastre um novo)
3. Preencha os campos opcionais:
   - Serviço a ser realizado
   - Técnico responsável
   - Valor total
4. Clique em "Salvar" para registrar a OS

#### Pesquisa de Ordens de Serviço
1. Na página inicial, clique no botão "Pesquisar"
2. Digite o termo de busca (número da OS, nome do cliente, etc.)
3. Clique em "Buscar" para exibir os resultados
4. Nos resultados, você pode:
   - Editar uma OS (clique no ícone de edição)
   - Excluir uma OS (clique no ícone de exclusão)
   - Imprimir uma OS (clique no ícone de impressão)

#### Geração de Relatórios
1. Acesse a página "Relatórios" pelo menu de navegação
2. Selecione o tipo de relatório desejado:
   - Ordens de Serviço
   - Clientes
   - Colaboradores
   - Usuários
   - Cargos
3. Defina os filtros desejados (período, status, etc.)
4. Clique em "Gerar Relatório"
5. Visualize os dados e gráficos estatísticos
6. Se necessário, exporte ou imprima o relatório

#### Gerenciamento de Entregas
1. Acesse a página "Entregas" pelo menu de navegação
2. No mapa interativo, clique para selecionar um destino
3. Preencha os detalhes da entrega:
   - Número da OS
   - Cliente
   - Equipamento
   - Observações
4. Clique em "Iniciar Entrega" para simular o processo
5. Acompanhe o progresso da entrega no mapa
6. Visualize o histórico de entregas na tabela abaixo do mapa

#### Configurações do Sistema
1. Acesse a página "Opções" pelo menu de navegação
2. Personalize as configurações de:
   - Aparência (tema escuro, tamanho de fonte, alto contraste)
   - Acessibilidade (otimização para leitores de tela, navegação por teclado)
   - Impressão (logotipo, data/hora, cabeçalho/rodapé)
   - Notificações (alertas para novas OS, OS concluídas, etc.)
   - Backup (automático, na nuvem, horário)
3. Clique em "Salvar Configurações" para aplicar as mudanças

### Interface com o usuário

#### Página Inicial (Ordem de Serviço)
- **Cabeçalho**: Título do sistema e menu de navegação
- **Formulário de OS**: Campos para cadastro e edição de ordens de serviço
- **Botões de Ação**: Nova OS, Salvar, Pesquisar, Excluir, Imprimir
- **Área de Pesquisa**: Campo de busca e tabela de resultados

#### Página de Relatórios
- **Seletores de Relatório**: Botões para escolher o tipo de relatório
- **Filtros**: Campos para refinar os dados exibidos
- **Gráficos**: Visualizações estatísticas dos dados
- **Tabela de Dados**: Resultados detalhados do relatório

#### Página de Entregas
- **Mapa Interativo**: Visualização geográfica com marcadores
- **Formulário de Entrega**: Campos para registrar uma nova entrega
- **Controles de Simulação**: Botões para iniciar e acompanhar entregas
- **Histórico de Entregas**: Tabela com registros de entregas anteriores

#### Página de Ajuda
- **Índice**: Lista de tópicos de ajuda
- **Conteúdo**: Explicações detalhadas e tutoriais
- **FAQ**: Perguntas frequentes e respostas
- **Contato**: Informações para suporte técnico

#### Página de Opções
- **Seções de Configuração**: Aparência, Acessibilidade, Impressão, Notificações, Backup
- **Controles**: Checkboxes, sliders, campos de texto para personalização
- **Botões de Ação**: Salvar Configurações, Restaurar Padrões, Realizar Backup

### Casos de uso comuns

#### Caso 1: Registrar um novo cliente e criar uma OS
1. Acesse a página inicial
2. Clique em "Nova OS"
3. No campo Cliente, clique em "Cadastrar Novo"
4. Preencha os dados do cliente e salve
5. Complete os demais campos da OS
6. Clique em "Salvar"

#### Caso 2: Pesquisar e editar uma OS existente
1. Na página inicial, clique em "Pesquisar"
2. Digite o número da OS ou nome do cliente
3. Nos resultados, clique no ícone de edição da OS desejada
4. Modifique os campos necessários
5. Clique em "Salvar" para atualizar

#### Caso 3: Gerar um relatório mensal de serviços
1. Acesse a página "Relatórios"
2. Selecione "Ordens de Serviço"
3. Defina o período para o mês desejado
4. Clique em "Gerar Relatório"
5. Analise os gráficos e dados apresentados
6. Clique em "Imprimir" para obter uma cópia física

## 7. Manual do Desenvolvedor

### Organização do código-fonte

```
/
├── api/                  # Endpoints da API REST
│   ├── cliente_read_one.php
│   ├── os_create.php
│   ├── os_delete.php
│   ├── os_read_one.php
│   ├── os_search.php
│   ├── os_update.php
│   ├── relatorio_cargos.php
│   ├── relatorio_clientes.php
│   ├── relatorio_colaboradores.php
│   ├── relatorio_os.php
│   └── relatorio_usuarios.php
├── classes/              # Classes PHP do modelo
│   ├── Cliente.php
│   ├── Database.php
│   └── OrdemServico.php
├── css/                  # Arquivos CSS (se separados)
├── database/             # Scripts SQL
│   └── db_create.sql
├── js/                   # Scripts JavaScript
│   ├── app.js            # Lógica principal da aplicação
│   ├── charts.js         # Geração de gráficos
│   ├── config.js         # Configurações do sistema
│   ├── entregas.js       # Funcionalidades de entregas
│   ├── navegacao.js      # Menu de navegação global
│   └── relatorio.js      # Funcionalidades de relatórios
├── relatorios/           # Arquivos de relatório gerados
├── ajuda.html            # Página de ajuda
├── entregas.html         # Página de entregas
├── imprimir_os.php       # Template para impressão de OS
├── index.html            # Página principal (OS)
├── opcoes.html           # Página de configurações
└── relatorio.html        # Página de relatórios
```

### Tecnologias utilizadas

#### Frontend
- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização e responsividade
- **JavaScript**: Interatividade e validações
- **Bibliotecas**:
  - Font Awesome 6.4.0: Ícones
  - Leaflet: Mapas interativos (página de entregas)

#### Backend
- **PHP**: Lógica de servidor e API
- **MySQL**: Banco de dados relacional

#### Padrões e Técnicas
- **REST API**: Comunicação entre frontend e backend
- **PDO**: Acesso seguro ao banco de dados
- **JSON**: Formato de troca de dados
- **Variáveis CSS**: Temas e personalização

### Explicação das principais classes, funções e arquivos

#### Classes PHP

**Database.php**
- Responsável pela conexão com o banco de dados
- Métodos: `getConnection()`, `closeConnection()`

**OrdemServico.php**
- Modelo para ordens de serviço
- Propriedades: codigoOS, numeroOS, dataAbertura, equipamento, etc.
- Métodos: `create()`, `readOne()`, `update()`, `delete()`, `search()`

**Cliente.php**
- Modelo para clientes
- Propriedades: codigoCliente, nome, cpf, cnpj, telefone, etc.
- Métodos: `create()`, `readOne()`, `update()`, `delete()`, `search()`

#### Arquivos JavaScript

**app.js**
- Funções para gerenciamento de ordens de serviço
- Manipulação do formulário de OS
- Requisições AJAX para a API

**config.js**
- Gerenciamento de configurações do sistema
- Funções para salvar, carregar e aplicar configurações
- Personalização de temas e acessibilidade

**entregas.js**
- Inicialização e controle do mapa interativo
- Simulação de entregas
- Registro de histórico de entregas

**navegacao.js**
- Configuração do menu de navegação global
- Marcação da página atual

**relatorio.js**
- Geração e exibição de relatórios
- Filtros e processamento de dados

**charts.js**
- Criação de gráficos estatísticos
- Visualização de dados de relatórios

#### API Endpoints

**os_create.php**
- Método: POST
- Função: Criar nova ordem de serviço
- Parâmetros: numeroOS, dataAbertura, equipamento, defeito, etc.

**os_read_one.php**
- Método: GET
- Função: Obter detalhes de uma OS específica
- Parâmetros: id

**os_update.php**
- Método: PUT
- Função: Atualizar uma OS existente
- Parâmetros: codigoOS, numeroOS, dataAbertura, etc.

**os_delete.php**
- Método: DELETE
- Função: Excluir uma OS
- Parâmetros: id

**os_search.php**
- Método: GET
- Função: Pesquisar ordens de serviço
- Parâmetros: termo, filtros

### Padrões de codificação

#### PHP
- Classes com primeira letra maiúscula (PascalCase)
- Métodos e variáveis em camelCase
- Indentação com 4 espaços
- Comentários PHPDoc para documentação

#### JavaScript
- Funções e variáveis em camelCase
- Constantes em UPPER_CASE
- Indentação com 4 espaços
- Comentários JSDoc para documentação

#### HTML/CSS
- IDs em camelCase
- Classes em kebab-case
- Uso de variáveis CSS para temas
- Estrutura semântica HTML5

### Como contribuir com o projeto

1. **Configuração do ambiente de desenvolvimento**
   - Clone o repositório
   - Configure o servidor local (XAMPP, WAMP, etc.)
   - Importe o banco de dados

2. **Fluxo de trabalho**
   - Crie uma branch para sua feature/correção
   - Implemente as mudanças seguindo os padrões de codificação
   - Teste localmente
   - Envie um pull request com descrição detalhada

3. **Diretrizes de contribuição**
   - Mantenha a compatibilidade com navegadores modernos
   - Siga os padrões de codificação existentes
   - Documente novas funcionalidades
   - Adicione testes quando possível

## 8. Banco de Dados

### Modelo ER

```
+-------------+       +-------------+       +-------------+
|    USUARIO  |       | COLABORADOR |       |    CARGO    |
+-------------+       +-------------+       +-------------+
| CodigoUsuario|<----->|CodigoColaborador|   | CodigoCargo |
| Nome        |       | Nome        |<----->| NomeCargo   |
| Email       |       | CPF         |       | Descricao   |
| Senha       |       | Telefone    |       +-------------+
| Nivel       |       | Email       |
| DataCadastro|       | DataContratacao|
+-------------+       | CodigoCargo |
                      | CodigoUsuario|
                      +-------------+
                            |
                            |
                            v
+-------------+       +-------------+
|   CLIENTE   |       |     OS      |
+-------------+       +-------------+
| CodigoCliente|<----->| CodigoOS    |
| Nome        |       | NumeroOS    |
| CPF         |       | DataAbertura|
| CNPJ        |       | Equipamento|
| Telefone    |       | Defeito     |
| Email       |       | Servico     |
| Endereco    |       | ValorTotal  |
| DataCadastro|       | Status      |
+-------------+       | CodigoCliente|
                      | CodigoColaborador|
                      +-------------+
```

### Explicação das tabelas e seus relacionamentos

#### USUARIO
- Armazena informações dos usuários do sistema
- Campos principais: CodigoUsuario (PK), Nome, Email, Senha, Nivel
- Relacionamento: Um usuário pode estar associado a um colaborador (1:1)

#### CARGO
- Armazena os cargos disponíveis na empresa
- Campos principais: CodigoCargo (PK), NomeCargo, Descricao
- Relacionamento: Um cargo pode ser atribuído a vários colaboradores (1:N)

#### COLABORADOR
- Armazena informações dos funcionários da empresa
- Campos principais: CodigoColaborador (PK), Nome, CPF, Telefone, Email
- Relacionamentos:
  - Um colaborador possui um cargo (N:1)
  - Um colaborador pode estar associado a um usuário (1:1)
  - Um colaborador pode ser responsável por várias ordens de serviço (1:N)

#### CLIENTE
- Armazena informações dos clientes
- Campos principais: CodigoCliente (PK), Nome, CPF/CNPJ, Telefone, Email
- Relacionamento: Um cliente pode ter várias ordens de serviço (1:N)

#### OS (Ordem de Serviço)
- Armazena informações das ordens de serviço
- Campos principais: CodigoOS (PK), NumeroOS, DataAbertura, Equipamento, Defeito
- Relacionamentos:
  - Uma OS pertence a um cliente (N:1)
  - Uma OS pode ser atribuída a um colaborador (N:1)

### Scripts de criação e inserção de dados

O arquivo `database/db_create.sql` contém todos os scripts necessários para criar o banco de dados, tabelas e inserir dados iniciais. Principais seções:

1. **Criação do banco de dados**
   ```sql
   CREATE DATABASE IF NOT EXISTS tech_solutions;
   USE tech_solutions;
   ```

2. **Criação das tabelas**
   ```sql
   CREATE TABLE IF NOT EXISTS USUARIO (
       CodigoUsuario INT AUTO_INCREMENT PRIMARY KEY,
       Nome VARCHAR(100) NOT NULL,
       Email VARCHAR(100) NOT NULL UNIQUE,
       Senha VARCHAR(255) NOT NULL,
       Nivel ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
       DataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Inserção de dados iniciais**
   ```sql
   INSERT INTO CARGO (NomeCargo, Descricao) VALUES
   ('Técnico de Informática', 'Responsável pelo reparo e manutenção de equipamentos'),
   ('Atendente', 'Responsável pelo atendimento ao cliente'),
   ('Gerente', 'Responsável pela gestão da equipe');
   ```

## 8. Testes

### Estratégias de teste usadas

1. **Testes Unitários**
   - Verificação de funções individuais
   - Validação de métodos das classes PHP
   - Testes de funções JavaScript isoladas

2. **Testes de Integração**
   - Verificação da comunicação entre frontend e backend
   - Testes de API com diferentes parâmetros
   - Validação do fluxo de dados entre componentes

3. **Testes de Interface**
   - Validação da responsividade em diferentes dispositivos
   - Testes de acessibilidade
   - Verificação de compatibilidade entre navegadores

4. **Testes de Aceitação**
   - Validação de casos de uso completos
   - Testes com usuários reais
   - Verificação de requisitos funcionais

### Casos de teste

#### Teste 1: Criação de Ordem de Serviço
- **Entrada**: Dados completos de uma OS (equipamento, defeito, cliente)
- **Saída Esperada**: OS criada com sucesso, código de retorno 201
- **Resultado**: Sucesso, OS registrada no banco de dados

#### Teste 2: Pesquisa de OS por Cliente
- **Entrada**: Nome parcial de um cliente
- **Saída Esperada**: Lista de OS associadas ao cliente
- **Resultado**: Sucesso, exibição correta dos resultados

#### Teste 3: Edição de OS Existente
- **Entrada**: Código de OS válido, novos dados
- **Saída Esperada**: OS atualizada com sucesso
- **Resultado**: Sucesso, dados atualizados no banco

#### Teste 4: Exclusão de OS
- **Entrada**: Código de OS válido
- **Saída Esperada**: OS excluída com sucesso
- **Resultado**: Sucesso, registro removido do banco

### Ferramentas de teste

1. **Testes Manuais**
   - Testes exploratórios realizados pela equipe de desenvolvimento
   - Testes de aceitação com usuários finais
   - Validação de fluxos de trabalho completos

2. **Ferramentas de Inspeção de Código**
   - PHP_CodeSniffer para verificação de padrões de codificação
   - ESLint para análise estática de JavaScript
   - SonarQube para análise de qualidade geral

3. **Ferramentas de Teste de Interface**
   - Lighthouse para testes de desempenho e acessibilidade
   - Ferramentas de desenvolvimento do navegador (Chrome DevTools, Firefox Developer Tools)
   - Validadores de HTML e CSS (W3C)

4. **Ferramentas de Teste de API**
   - Postman para testes manuais de endpoints
   - PHPUnit para testes automatizados de backend

## 9. Problemas Conhecidos e Limitações

### Bugs atuais

1. **Pesquisa avançada**
   - A pesquisa por data pode apresentar resultados incorretos quando o formato da data é diferente do padrão brasileiro
   - Solução temporária: Utilizar o formato DD/MM/AAAA para pesquisas por data

2. **Impressão de OS**
   - Em alguns navegadores, o layout de impressão pode ficar desalinhado
   - Solução temporária: Utilizar o Chrome para impressão de documentos

3. **Simulador de entregas**
   - O mapa pode não carregar corretamente em conexões lentas
   - Solução temporária: Aguardar o carregamento completo da página antes de interagir com o mapa

### O que ainda não foi implementado

1. **Autenticação e controle de acesso**
   - Sistema de login e autenticação de usuários
   - Controle de permissões baseado em níveis de acesso
   - Recuperação de senha

2. **Módulo financeiro**
   - Controle de pagamentos
   - Geração de recibos e notas fiscais
   - Relatórios financeiros

3. **Integração com serviços externos**
   - Envio automático de e-mails e SMS para clientes
   - Integração com sistemas de pagamento online
   - Sincronização com calendário para agendamento

### Limitações do sistema

1. **Desempenho**
   - O sistema pode apresentar lentidão com um grande volume de ordens de serviço (acima de 10.000)
   - Relatórios complexos podem demorar para serem gerados

2. **Compatibilidade**
   - Otimizado para navegadores modernos (Chrome, Firefox, Edge)
   - Funcionalidade limitada em navegadores antigos (IE11 e anteriores)

3. **Escalabilidade**
   - Projetado para pequenas e médias empresas
   - Pode requerer ajustes para uso em empresas de grande porte

4. **Offline**
   - Não possui modo offline, requer conexão com internet
   - Não há sincronização automática de dados em caso de perda de conexão

## 10. Licença e Créditos

### Tipo de licença

**Licença Proprietária - Tech Solutions**

Este software é propriedade exclusiva da Tech Solutions e está protegido por leis de direitos autorais. O uso, cópia, modificação ou distribuição deste software sem autorização expressa por escrito da Tech Solutions é estritamente proibido.

### Autores do projeto

- **Equipe de Desenvolvimento da Tech Solutions**
  - Departamento de Tecnologia da Informação
  - Contato: desenvolvimento@techsolutions.com

### Agradecimentos

- À equipe de técnicos da Tech Solutions por fornecer requisitos e feedback durante o desenvolvimento
- Aos clientes beta-testers que ajudaram a identificar melhorias e correções
- Às comunidades de desenvolvimento open-source cujas ferramentas e bibliotecas foram utilizadas neste projeto

## 11. Anexos

### Diagramas adicionais

#### Diagrama de Casos de Uso
```
+-------------------------------------------------------------+
|                      Sistema de Controle de Serviços         |
+-------------------------------------------------------------+
|                                                             |
|    +----------+                                             |
|    |          |                                             |
|    | Atendente|----> Cadastrar Cliente                      |
|    |          |----> Cadastrar OS                           |
|    +----------+----> Pesquisar OS                           |
|                                                             |
|    +----------+                                             |
|    |          |----> Atualizar Status OS                    |
|    | Técnico  |----> Registrar Serviço                      |
|    |          |----> Gerenciar Entregas                     |
|    +----------+                                             |
|                                                             |
|    +----------+                                             |
|    |          |----> Gerar Relatórios                       |
|    | Gerente  |----> Configurar Sistema                     |
|    |          |----> Gerenciar Colaboradores                |
|    +----------+                                             |
|                                                             |
+-------------------------------------------------------------+
```

#### Diagrama de Fluxo de Trabalho
```
+----------+     +-----------+     +------------+     +------------+
|          |     |           |     |            |     |            |
| Cadastro |---->| Atribuição|---->| Execução   |---->| Conclusão  |
| da OS    |     | ao Técnico|     | do Serviço |     | da OS      |
|          |     |           |     |            |     |            |
+----------+     +-----------+     +------------+     +------------+
                                                            |
                                                            v
                                                     +------------+
                                                     |            |
                                                     | Entrega    |
                                                     | (opcional) |
                                                     |            |
                                                     +------------+
```

### Glossário de termos

- **OS**: Ordem de Serviço, documento que registra um serviço a ser realizado
- **Cliente**: Pessoa física ou jurídica que solicita um serviço
- **Colaborador**: Funcionário da Tech Solutions (técnico, atendente, gerente)
- **Técnico**: Profissional responsável pela execução do serviço
- **Equipamento**: Dispositivo ou hardware que será reparado ou recebe manutenção
- **Defeito**: Problema relatado pelo cliente
- **Serviço**: Descrição do trabalho realizado para solucionar o defeito
- **Status**: Estado atual da OS (aberta, em andamento, concluída, cancelada)
- **Entrega**: Processo de devolução do equipamento ao cliente após o serviço

### Links úteis

- **Documentação oficial do PHP**: [https://www.php.net/docs.php](https://www.php.net/docs.php)
- **Documentação do MySQL**: [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
- **Tutoriais de JavaScript**: [https://developer.mozilla.org/pt-BR/docs/Web/JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- **Biblioteca Leaflet para mapas**: [https://leafletjs.com/](https://leafletjs.com/)
- **Font Awesome (ícones)**: [https://fontawesome.com/](https://fontawesome.com/)
- **W3C Validator**: [https://validator.w3.org/](https://validator.w3.org/)
- **Diretrizes de Acessibilidade WCAG**: [https://www.w3.org/WAI/standards-guidelines/wcag/](https://www.w3.org/WAI/standards-guidelines/wcag/)