#!/bin/bash

echo "🚀 Deploy Hestia para Oracle Cloud"
echo "=================================="

# Configurações
FRONTEND_PORT=3000
BACKEND_PORT=8000
DB_PORT=5433
OLLAMA_PORT=11434

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover imagens antigas
echo "🧹 Removendo imagens antigas..."
docker system prune -f

# Build das imagens
echo "🔨 Fazendo build das imagens..."
docker-compose build --no-cache

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose up -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 30

# Verificar status
echo "📊 Verificando status dos serviços..."
docker-compose ps

# Verificar logs
echo "📋 Logs dos serviços:"
echo "=== Frontend ==="
docker-compose logs --tail=10 frontend

echo "=== Backend ==="
docker-compose logs --tail=10 backend

echo "=== Database ==="
docker-compose logs --tail=5 db

echo "=== Ollama ==="
docker-compose logs --tail=5 ollama

# Testar endpoints
echo "🧪 Testando endpoints..."

# Frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend: http://localhost:3000"
else
    echo "❌ Frontend não está respondendo"
fi

# Backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend: http://localhost:8000"
else
    echo "❌ Backend não está respondendo"
fi

# API
if curl -s http://localhost:8000/api/v1 > /dev/null; then
    echo "✅ API: http://localhost:8000/api/v1"
else
    echo "❌ API não está respondendo"
fi

# Nginx
if curl -s http://localhost/health > /dev/null; then
    echo "✅ Nginx: http://localhost"
else
    echo "❌ Nginx não está respondendo"
fi

echo ""
echo "🎉 Deploy concluído!"
echo ""
echo "📱 URLs de acesso:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo "  Nginx: http://localhost"
echo ""
echo "🔧 Comandos úteis:"
echo "  Ver logs: docker-compose logs -f"
echo "  Parar: docker-compose down"
echo "  Reiniciar: docker-compose restart"
echo "  Status: docker-compose ps" 