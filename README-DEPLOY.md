# 🚀 **Deploy Hestia - Oracle Cloud**

Guia completo para fazer deploy do sistema Hestia (Frontend + Backend + IA) no Oracle Cloud.

## 🏗️ **Arquitetura do Sistema**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Nginx     │    │  Frontend   │    │   Backend   │
│  (Port 80)  │◄──►│ (Next.js)   │◄──►│ (FastAPI)   │
└─────────────┘    │ (Port 3000) │    │ (Port 8000) │
                   └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │ PostgreSQL  │
                                       │ (Port 5433) │
                                       └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │   Ollama    │
                                       │ (Port 11434)│
                                       │   (IA)      │
                                       └─────────────┘
```

## 🚀 **Deploy Rápido**

### **1. Pré-requisitos**
- Docker e Docker Compose instalados
- VPS Oracle Cloud com pelo menos 4GB RAM
- Acesso SSH ao servidor

### **2. Deploy Automático**
```bash
# Clonar o projeto
git clone <seu-repo>
cd Hestia

# Executar deploy automático
./deploy-oracle.sh
```

### **3. Deploy Manual**
```bash
# Build e iniciar todos os serviços
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 📱 **Acessos do Sistema**

| Serviço | URL | Descrição |
|----------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface do usuário |
| **Backend** | http://localhost:8000 | API FastAPI |
| **API Docs** | http://localhost:8000/docs | Documentação Swagger |
| **Nginx** | http://localhost | Proxy reverso |
| **Database** | localhost:5433 | PostgreSQL |
| **IA** | localhost:11434 | Ollama |

## 🔧 **Configurações**

### **Variáveis de Ambiente**

#### **Frontend (.env.production)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NODE_ENV=production
```

#### **Backend (.env)**
```bash
DATABASE_URL=postgresql://hestia_user:hestia_password@db:5432/hestia_db
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OLLAMA_URL=http://ollama:11434
```

## 🐳 **Docker Services**

### **Frontend (Next.js)**
- **Porta**: 3000
- **Build**: Multi-stage para otimização
- **Output**: Standalone para produção

### **Backend (FastAPI)**
- **Porta**: 8000
- **Dependências**: PostgreSQL, Ollama
- **Hot Reload**: Ativo em desenvolvimento

### **Database (PostgreSQL)**
- **Porta**: 5433
- **Persistência**: Volume Docker
- **Backup**: Automático

### **IA (Ollama)**
- **Porta**: 11434
- **Modelo**: llama3.2:1b
- **Persistência**: Volume Docker

### **Nginx (Reverse Proxy)**
- **Porta**: 80, 443
- **Rate Limiting**: Configurado
- **Load Balancing**: Frontend + Backend

## 📊 **Monitoramento**

### **Verificar Status**
```bash
# Status dos containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx
```

### **Métricas do Sistema**
```bash
# Uso de recursos
docker stats

# Espaço em disco
docker system df

# Limpeza automática
docker system prune -f
```

## 🔒 **Segurança**

### **Firewall**
```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### **HTTPS (Opcional)**
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com
```

## 🚨 **Troubleshooting**

### **Problema: Frontend não carrega**
```bash
# Verificar logs
docker-compose logs frontend

# Verificar se está rodando
docker-compose ps frontend

# Rebuild
docker-compose up -d --build frontend
```

### **Problema: Backend não responde**
```bash
# Verificar logs
docker-compose logs backend

# Verificar dependências
docker-compose ps db ollama

# Testar API
curl http://localhost:8000/health
```

### **Problema: IA não funciona**
```bash
# Verificar Ollama
docker-compose logs ollama

# Verificar modelo
docker-compose exec ollama ollama list

# Baixar modelo
docker-compose exec ollama ollama pull llama3.2:1b
```

### **Problema: Banco não conecta**
```bash
# Verificar PostgreSQL
docker-compose logs db

# Verificar variáveis
docker-compose exec backend env | grep DATABASE

# Recriar banco
docker-compose down -v
docker-compose up -d
```

## 📈 **Escalabilidade**

### **Horizontal Scaling**
```bash
# Escalar frontend
docker-compose up -d --scale frontend=3

# Escalar backend
docker-compose up -d --scale backend=2
```

### **Load Balancer**
```bash
# Configurar Nginx para múltiplas instâncias
upstream frontend {
    server frontend:3000;
    server frontend:3001;
    server frontend:3002;
}
```

## 🔄 **Atualizações**

### **Deploy de Nova Versão**
```bash
# Parar serviços
docker-compose down

# Pull das mudanças
git pull origin main

# Rebuild e iniciar
docker-compose up -d --build
```

### **Rollback**
```bash
# Voltar para versão anterior
git checkout <commit-hash>

# Rebuild
docker-compose up -d --build
```

## 💾 **Backup e Restore**

### **Backup do Banco**
```bash
# Backup
docker-compose exec db pg_dump -U hestia_user hestia_db > backup.sql

# Restore
docker-compose exec -T db psql -U hestia_user hestia_db < backup.sql
```

### **Backup dos Volumes**
```bash
# Backup
docker run --rm -v hestia_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore
docker run --rm -v hestia_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## 🎯 **Comandos Úteis**

```bash
# Iniciar tudo
docker-compose up -d

# Parar tudo
docker-compose down

# Reiniciar serviço
docker-compose restart frontend

# Ver logs
docker-compose logs -f

# Executar comando
docker-compose exec backend python manage.py shell

# Backup rápido
docker-compose exec db pg_dump -U hestia_user hestia_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🆘 **Suporte**

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/hestia/issues)
- **Documentação**: [Wiki](https://github.com/seu-usuario/hestia/wiki)
- **Email**: seu-email@exemplo.com

---

**🎉 Agora você tem um sistema completo rodando no Oracle Cloud com Docker!** 