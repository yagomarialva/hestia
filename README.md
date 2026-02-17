# 🚀 **Hestia - Shopping List Manager com IA**

Sistema completo de gerenciamento de listas de compras com inteligência artificial para geração de ingredientes de receitas.

## 🏗️ **Arquitetura**

- **Backend**: FastAPI + PostgreSQL + Ollama (IA local)
- **Frontend**: React + TypeScript + CSS3
- **IA**: Modelo Llama 3.2 local para geração de ingredientes
- **Banco**: PostgreSQL com SQLAlchemy ORM

## 📁 **Estrutura do Projeto**

```
Hestia/
├── Hestia-backend/          # API FastAPI
│   ├── app/                 # Código da aplicação
│   ├── docker-compose.yml   # Configuração Docker
│   └── requirements.txt     # Dependências Python
├── Hestia-frontend/         # Frontend React
│   ├── src/                 # Código fonte
│   ├── components/          # Componentes React
│   └── package.json         # Dependências Node.js
└── package.json             # Scripts de desenvolvimento
```

## 🚀 **Como Executar**

### **Pré-requisitos**

- **Docker** e **Docker Compose** instalados
- **Node.js** 18+ e **npm** 8+
- **Python** 3.11+ (para desenvolvimento local)

### **1. Instalação Inicial**

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/hestia.git
cd hestia

# Instalar dependências
npm run install:all
```

### **2. Configuração do Backend**

```bash
# Copiar arquivo de exemplo
cd Hestia-backend
cp env.example .env

# Editar variáveis de ambiente
nano .env
```

**Configurar no arquivo `.env`:**
```bash
DATABASE_URL=postgresql://hestia_user:hestia_password@db:5432/hestia_db
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OLLAMA_URL=http://ollama:11434
```

### **3. Configuração do Frontend**

```bash
# O frontend está configurado para usar o proxy do Vite em desenvolvimento
# e o nginx em produção, não sendo necessária configuração adicional
```

### **4. Executar o Sistema**

#### **Opção A: Desenvolvimento (Recomendado para desenvolvimento)**

```bash
# Na raiz do projeto
npm run dev
```

**Isso irá:**
- ✅ Iniciar o backend (FastAPI + PostgreSQL + Ollama) na porta 8000
- ✅ Iniciar o frontend (Next.js) na porta 3000
- ✅ Baixar automaticamente o modelo de IA (primeira execução)

#### **Opção B: Apenas Backend**

```bash
npm run dev:backend
```

#### **Opção C: Apenas Frontend**

```bash
npm run dev:frontend
```

### **5. Acessar o Sistema**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs
- **Banco de Dados**: localhost:5433

## 🎯 **Funcionalidades Principais**

### **🔐 Autenticação**
- Login/Registro de usuários
- JWT tokens seguros
- Perfil de usuário

### **📝 Listas de Compras**
- Criar, editar, excluir listas
- Adicionar/remover itens
- Marcar itens como comprados
- Organização por setores do supermercado

### **🤖 IA Integrada**
- Geração automática de ingredientes para receitas
- Classificação automática de produtos por setor
- Listas de compras baseadas em temas

### **🏪 Setores do Supermercado**
- Hortifruti 🥬
- Mercearia 🛒
- Limpeza 🧽
- Congelados ❄️
- Padaria 🥖
- Bebidas 🥤
- Higiene 🧴

## 🛠️ **Comandos Úteis**

### **Desenvolvimento**
```bash
# Iniciar tudo
npm run dev

# Apenas backend
npm run dev:backend

# Apenas frontend
npm run dev:frontend

# Rebuild backend
npm run dev:backend:build
```

### **Produção**
```bash
# Build completo
npm run build

# Iniciar produção
npm run start

# Parar serviços
npm run stop
```

### **Manutenção**
```bash
# Ver logs
npm run logs

# Limpar tudo
npm run clean

# Testes
npm run test

# Linting
npm run lint
```

## 🔧 **Troubleshooting**

### **Problema: Porta 8000 já em uso**
```bash
# Verificar o que está usando a porta
lsof -i :8000

# Parar o processo ou usar porta alternativa
# Editar docker-compose.yml e mudar "8000:8000" para "8001:8000"
```

### **Problema: Modelo de IA não baixa**
```bash
# Verificar logs do Ollama
docker-compose logs ollama

# Forçar download do modelo
docker-compose exec ollama ollama pull llama3.2:1b
```

### **Problema: Frontend não conecta com backend**
```bash
# Verificar se o backend está rodando
curl http://localhost:8000/health

# Verificar CORS no backend
# Verificar variáveis de ambiente no frontend
```

### **Problema: Banco de dados não conecta**
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Recriar containers
docker-compose down -v
docker-compose up --build
```

## 📱 **Estrutura das URLs**

### **Frontend (React)**
- `/` - Dashboard principal
- `/login` - Página de login
- `/register` - Página de registro
- `/dashboard` - Dashboard principal
- `/list/[id]` - Lista específica

### **Backend (FastAPI)**
- `/api/v1/auth/*` - Endpoints de autenticação
- `/api/v1/users/*` - Gerenciamento de usuários
- `/api/v1/shopping-lists/*` - CRUD de listas de compras
- `/api/v1/items/*` - CRUD de itens
- `/api/v1/ai/*` - Serviços de IA

## 🚀 **Deploy**

### **Desenvolvimento Local**
```bash
npm run dev
```

### **Produção com Docker**
```bash
npm run build
npm run start
```

### **Deploy com Docker**
```bash
# Build e execução
docker-compose up --build

# Apenas frontend
docker-compose up frontend
```

### **Deploy no Oracle Cloud (Backend)**
```bash
cd Hestia-backend
# Seguir instruções do README do backend
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 **Suporte**

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/hestia/issues)
- **Documentação**: [Wiki](https://github.com/seu-usuario/hestia/wiki)
- **Email**: yago.marialva@gmail.com

---

