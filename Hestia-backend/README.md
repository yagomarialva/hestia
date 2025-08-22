# Hestia - Gerenciamento de Listas de Compras com IA

Hestia é uma aplicação completa para gerenciamento de listas de compras que utiliza inteligência artificial local (Ollama) para classificação automática de produtos e geração inteligente de listas.

## 🚀 Funcionalidades

- **Cadastro e Login de Usuário**: Sistema completo de autenticação com JWT
- **Gerenciamento de Listas**: Criar, editar e gerenciar listas de compras
- **Classificação Automática com IA**: Usa Ollama para classificar produtos em setores do supermercado
- **Sugestões Inteligentes**: Baseadas no histórico de compras do usuário
- **Geração de Listas**: Cria listas automaticamente baseadas em temas (ex: "churrasco para 10 pessoas")
- **Perfil de Usuário**: Estatísticas e histórico de compras

## 🏗️ Arquitetura

- **Backend**: FastAPI (Python 3.11+)
- **Banco de Dados**: PostgreSQL
- **ORM**: SQLAlchemy + Alembic
- **Autenticação**: JWT com bcrypt
- **IA Local**: Ollama (modelo llama3)
- **Containerização**: Docker + Docker Compose

## 📁 Estrutura do Projeto

```
app/
 ├── main.py              # Aplicação principal FastAPI
 ├── config.py            # Configurações e variáveis de ambiente
 ├── database.py          # Configuração do banco de dados
 ├── models/              # Modelos SQLAlchemy
 ├── schemas/             # Schemas Pydantic
 ├── routers/             # Endpoints da API
 ├── services/            # Lógica de negócio
alembic/                  # Migrations do banco
Dockerfile               # Container da aplicação
docker-compose.yml       # Orquestração dos serviços
requirements.txt         # Dependências Python
```

## 🛠️ Pré-requisitos

- Docker e Docker Compose
- Python 3.11+ (para desenvolvimento local)
- Ollama instalado localmente (opcional para desenvolvimento)

## 🚀 Como Executar

### 1. Clone o repositório
```bash
git clone <repository-url>
cd hestia
```

### 2. Configure as variáveis de ambiente
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Execute com Docker Compose
```bash
docker-compose up --build
```

A aplicação estará disponível em:
- **API**: http://localhost:8000
- **Documentação**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **PostgreSQL**: localhost:5432
- **Ollama**: http://localhost:11434

### 4. Inicialize o banco de dados
```bash
# Em outro terminal
docker-compose exec api alembic upgrade head
```

## 🔧 Desenvolvimento Local

### 1. Crie um ambiente virtual
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 2. Instale as dependências
```bash
pip install -r requirements.txt
```

### 3. Configure o banco de dados
```bash
# Certifique-se de que o PostgreSQL está rodando
# Atualize o DATABASE_URL no arquivo .env
```

### 4. Execute as migrations
```bash
alembic upgrade head
```

### 5. Execute a aplicação
```bash
uvicorn app.main:app --reload
```

## 📚 Endpoints da API

### Autenticação
- `POST /api/v1/auth/register` - Cadastro de usuário
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Dados do usuário logado

### Usuários
- `GET /api/v1/users/profile` - Perfil com estatísticas
- `PUT /api/v1/users/profile` - Atualizar perfil

### Listas de Compras
- `POST /api/v1/shopping-lists/` - Criar lista
- `GET /api/v1/shopping-lists/` - Listar todas
- `GET /api/v1/shopping-lists/{id}` - Obter lista específica
- `PUT /api/v1/shopping-lists/{id}` - Atualizar lista
- `DELETE /api/v1/shopping-lists/{id}` - Deletar lista
- `POST /api/v1/shopping-lists/{id}/items` - Adicionar item

### Itens
- `PUT /api/v1/items/{id}` - Atualizar item
- `DELETE /api/v1/items/{id}` - Deletar item
- `PATCH /api/v1/items/{id}/toggle` - Marcar como comprado

### IA
- `POST /api/v1/ai/classify-product` - Classificar produto
- `POST /api/v1/ai/generate-list` - Gerar lista por tema
- `POST /api/v1/ai/suggestions` - Sugestões baseadas no histórico

## 🤖 Integração com Ollama

A aplicação se integra com Ollama para:

1. **Classificação de Produtos**: Classifica automaticamente produtos em setores do supermercado
2. **Geração de Listas**: Cria listas inteligentes baseadas em temas

### Configuração do Ollama

1. Instale o Ollama: https://ollama.ai/
2. Baixe o modelo llama3:
```bash
ollama pull llama3
```

3. O serviço Ollama estará disponível em `http://localhost:11434`

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação JWT com expiração configurável
- Validação de dados com Pydantic
- CORS configurado para desenvolvimento

## 📊 Banco de Dados

### Tabelas Principais

- **users**: Usuários da aplicação
- **shopping_lists**: Listas de compras
- **items**: Itens das listas com setores

### Migrations

```bash
# Criar nova migration
alembic revision --autogenerate -m "Descrição da mudança"

# Aplicar migrations
alembic upgrade head

# Reverter migration
alembic downgrade -1
```

## 🐳 Docker

### Serviços

- **api**: Aplicação FastAPI (porta 8000)
- **db**: PostgreSQL (porta 5432)
- **ollama**: Serviço de IA (porta 11434)

### Comandos Úteis

```bash
# Construir e executar
docker-compose up --build

# Executar em background
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f api

# Executar comando no container
docker-compose exec api bash
```

## 🧪 Testes

Para executar testes (quando implementados):

```bash
# Com Docker
docker-compose exec api pytest

# Localmente
pytest
```

## 📝 Variáveis de Ambiente

```bash
# Banco de dados
DATABASE_URL=postgresql://user:password@host:port/db

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Ollama
OLLAMA_URL=http://localhost:11434

# App
DEBUG=True
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação da API em `/docs`
- Verifique os logs da aplicação

## 🔮 Roadmap

- [ ] Interface web responsiva
- [ ] Notificações push
- [ ] Compartilhamento de listas
- [ ] Integração com APIs de supermercados
- [ ] Relatórios e analytics
- [ ] Backup automático
- [ ] Múltiplos idiomas 