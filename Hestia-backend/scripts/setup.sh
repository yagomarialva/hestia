#!/bin/bash

echo "🚀 Configurando o projeto Hestia..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Edite-o com suas configurações se necessário."
else
    echo "✅ Arquivo .env já existe."
fi

# Construir e executar os serviços
echo "🐳 Construindo e executando os serviços Docker..."
docker-compose up --build -d

# Aguardar os serviços iniciarem
echo "⏳ Aguardando os serviços iniciarem..."
sleep 30

# Verificar se os serviços estão rodando
echo "🔍 Verificando status dos serviços..."
docker-compose ps

# Executar migrations
echo "🗄️ Executando migrations do banco de dados..."
docker-compose exec -T api alembic upgrade head

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📱 A aplicação está disponível em:"
echo "   - API: http://localhost:8000"
echo "   - Documentação: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo ""
echo "🐳 Para gerenciar os serviços:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Parar: docker-compose down"
echo "   - Reiniciar: docker-compose restart"
echo ""
echo "🤖 Para usar a funcionalidade de IA, certifique-se de que o Ollama está rodando:"
echo "   - Ollama: http://localhost:11434"
echo "   - Baixe o modelo: ollama pull llama3" 