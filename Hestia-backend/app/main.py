from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
from .database import engine, get_db, Base
from .routers import auth_router, users_router, shopping_lists_router, items_router, ai_router
from .config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Hestia API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,
        "defaultModelExpandDepth": 3,
        "defaultModelRendering": "example",
        "displayRequestDuration": True,
        "docExpansion": "list",
        "filter": True,
        "maxDisplayedTags": 10,
        "showExtensions": True,
        "showCommonExtensions": True,
        "syntaxHighlight.theme": "monokai",
        "tryItOutEnabled": True,
        "validatorUrl": None,
    },
    contact={
        "name": "Hestia API Support",
        "url": "https://github.com/your-repo/hestia",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development
        "http://localhost:3001",  # Alternative Next.js port
        "https://seu-app.vercel.app",  # Vercel production
        "https://*.vercel.app",  # All Vercel subdomains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(shopping_lists_router, prefix="/api/v1")
app.include_router(items_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1")


# Custom Swagger UI endpoint
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Custom Swagger UI with enhanced configuration"""
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="Hestia API - Swagger UI",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
        swagger_ui_parameters={
            "defaultModelsExpandDepth": -1,
            "defaultModelExpandDepth": 3,
            "defaultModelRendering": "example",
            "displayRequestDuration": True,
            "docExpansion": "list",
            "filter": True,
            "maxDisplayedTags": 10,
            "showExtensions": True,
            "showCommonExtensions": True,
            "syntaxHighlight.theme": "monokai",
            "tryItOutEnabled": True,
            "validatorUrl": None,
            "dom_id": "#swagger-ui",
            "layout": "BaseLayout",
            "deepLinking": True,
            "persistAuthorization": True,
        }
    )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bem-vindo à API Hestia - Gerenciamento de Listas de Compras",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "hestia-api"}


@app.get("/api/v1/")
async def api_info():
    """API information"""
    return {
        "name": "Hestia API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/v1/auth",
            "users": "/api/v1/users",
            "shopping_lists": "/api/v1/shopping-lists",
            "items": "/api/v1/items",
            "ai": "/api/v1/ai"
        },
        "swagger_ui": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json"
    }


@app.get("/test-swagger")
async def test_swagger():
    """Test endpoint for Swagger UI"""
    return {
        "message": "Swagger UI Test Endpoint",
        "status": "working",
        "timestamp": "2025-01-15T21:00:00Z"
    } 