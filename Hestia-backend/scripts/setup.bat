@echo off
echo 🚀 Configurando o projeto Hestia...

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está instalado. Por favor, instale o Docker primeiro.
    pause
    exit /b 1
)

REM Verificar se Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.
    pause
    exit /b 1
)

REM Criar arquivo .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    copy env.example .env
    echo ✅ Arquivo .env criado. Edite-o com suas configurações se necessário.
) else (
    echo ✅ Arquivo .env já existe.
)

REM Construir e executar os serviços
echo 🐳 Construindo e executando os serviços Docker...
docker-compose up --build -d

REM Aguardar os serviços iniciarem
echo ⏳ Aguardando os serviços iniciarem...
timeout /t 30 /nobreak >nul

REM Verificar se os serviços estão rodando
echo 🔍 Verificando status dos serviços...
docker-compose ps

REM Executar migrations
echo 🗄️ Executando migrations do banco de dados...
docker-compose exec -T api alembic upgrade head

echo.
echo 🎉 Setup concluído!
echo.
echo 📱 A aplicação está disponível em:
echo    - API: http://localhost:8000
echo    - Documentação: http://localhost:8000/docs
echo    - ReDoc: http://localhost:8000/redoc
echo.
echo 🐳 Para gerenciar os serviços:
echo    - Ver logs: docker-compose logs -f
echo    - Parar: docker-compose down
echo    - Reiniciar: docker-compose restart
echo.
echo 🤖 Para usar a funcionalidade de IA, certifique-se de que o Ollama está rodando:
echo    - Ollama: http://localhost:11434
echo    - Baixe o modelo: ollama pull llama3

pause 