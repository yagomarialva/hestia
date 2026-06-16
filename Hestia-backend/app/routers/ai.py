from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.ai import (
    ProductClassificationRequest, ProductClassificationResponse,
    ListGenerationRequest, ListGenerationResponse,
    RecipeIngredientsRequest, RecipeIngredientsResponse,
    SuggestionRequest, SuggestionResponse
)
from ..schemas.item import ItemCreate
from ..schemas.shopping_list import ShoppingListCreate
from ..services.auth import get_current_user
from ..services.ai_service import ollama_service
from ..services.shopping_service import shopping_service
from ..models.user import User

router = APIRouter(prefix="/ai", tags=["🤖 Inteligência Artificial"])


@router.post("/classify-product", response_model=ProductClassificationResponse)
async def classify_product(
    request: ProductClassificationRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ## Classificar Produto com IA
    
    Usa inteligência artificial local (Ollama) para classificar automaticamente produtos em setores do supermercado.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Dados necessários:**
    - **product_name**: Nome do produto a ser classificado
    
    **Exemplo de uso:**
    ```json
    {
        "product_name": "Banana"
    }
    ```
    
    **Setores possíveis:**
    - `hortifruti` - Frutas, verduras, legumes
    - `mercearia` - Arroz, feijão, massas, enlatados
    - `limpeza` - Detergentes, sabões, papel higiênico
    - `congelados` - Sorvetes, pizzas, vegetais congelados
    - `padaria` - Pães, bolos, doces
    - `bebidas` - Refrigerantes, sucos, água
    - `higiene` - Shampoo, sabonete, creme dental
    
    **Resposta:**
    - `200`: Produto classificado com sucesso
    - `401`: Token inválido ou expirado
    - `500`: Erro na classificação pela IA
    
    **Exemplo de resposta:**
    ```json
    {
        "product_name": "Banana",
        "sector": "hortifruti"
    }
    ```
    
    **Como usar:**
    - Envie o nome do produto
    - A IA retornará o setor correto
    - Use essa informação ao adicionar itens às listas
    """
    sector = await ollama_service.classify_product(request.product_name)
    if not sector:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to classify product"
        )
    
    return ProductClassificationResponse(
        product_name=request.product_name,
        sector=sector
    )


@router.post("/generate-list", response_model=ListGenerationResponse)
async def generate_shopping_list(
    request: ListGenerationRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ## Gerar Lista de Compras com IA
    
    Usa inteligência artificial para criar listas de compras completas baseadas em temas específicos.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Dados necessários:**
    - **theme**: Tema da lista (ex: "churrasco", "festa infantil", "jantar romântico")
    - **people_count**: Número de pessoas (opcional, padrão: 1)
    
    **Exemplos de temas:**
    - "Churrasco para 10 pessoas"
    - "Festa de aniversário infantil"
    - "Jantar romântico para 2"
    - "Compras da semana para família de 4"
    - "Receita de bolo de chocolate"
    
    **Exemplo de uso:**
    ```json
    {
        "theme": "Churrasco para 6 pessoas",
        "people_count": 6
    }
    ```
    
    **Resposta:**
    - `200`: Lista gerada com sucesso pela IA
    - `401`: Token inválido ou expirado
    - `500`: Erro na geração pela IA
    
    **Exemplo de resposta:**
    ```json
    {
        "theme": "Churrasco para 6 pessoas",
        "items": [
            {
                "name": "Carne bovina",
                "quantity": 2.0,
                "unit": "kg",
                "sector": "mercearia"
            }
        ],
        "total_items": 15
    }
    ```
    
    **Recursos:**
    - Lista organizada por setores do supermercado
    - Quantidades calculadas baseadas no número de pessoas
    - Produtos relevantes para o tema escolhido
    """
    items = await ollama_service.generate_shopping_list(request.theme, request.people_count)
    if not items:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate shopping list"
        )
    
    # Create shopping list with generated items automatically
    try:
        # Create the shopping list
        shopping_list_data = ShoppingListCreate(
            name=f"Lista IA: {request.theme}",
            description=f"Lista gerada automaticamente pela IA para {request.theme} ({request.people_count} pessoas)"
        )
        
        # Create the shopping list
        shopping_list = await shopping_service.create_shopping_list(db, user.id, shopping_list_data)
        
        # Add all generated items to the list
        for item in items:
            item_data = ItemCreate(
                name=item["name"],
                quantity=item["quantity"],
                unit=item["unit"],
                sector=item["sector"],
                shopping_list_id=shopping_list.id
            )
            await shopping_service.add_item_to_list(db, shopping_list.id, user.id, item_data)
        
        return ListGenerationResponse(
            theme=request.theme,
            items=items,
            total_items=len(items),
            shopping_list_id=shopping_list.id,
            message=f"Lista criada e salva automaticamente com ID: {shopping_list.id}"
        )
    
    except Exception as e:
            # If saving fails, still return the generated items
            return ListGenerationResponse(
                theme=request.theme,
                items=items,
                total_items=len(items),
                message=f"Lista gerada pela IA, mas não foi possível salvar automaticamente: {str(e)}"
            )


@router.post("/save-ai-list", response_model=dict)
async def save_ai_generated_list(
    request: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ## Salvar Lista Gerada pela IA
    
    Salva automaticamente uma lista gerada pela IA no banco de dados.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Dados necessários:**
    ```json
    {
        "theme": "churrasco",
        "people_count": 4,
        "items": [
            {
                "name": "carne bovina",
                "quantity": 1.2,
                "unit": "kg",
                "sector": "mercearia"
            }
        ]
    }
    ```
    
    **Resposta:**
    - `200`: Lista salva com sucesso
    - `401`: Token inválido ou expirado
    - `500`: Erro ao salvar a lista
    """
    try:
        # Create the shopping list
        shopping_list_data = ShoppingListCreate(
            name=f"Lista IA: {request['theme']}",
            description=f"Lista gerada automaticamente pela IA para {request['theme']} ({request['people_count']} pessoas)"
        )
        
        # Create the shopping list
        shopping_list = await shopping_service.create_shopping_list(db, user.id, shopping_list_data)
        
        # Add all generated items to the list
        for item in request['items']:
            item_data = ItemCreate(
                name=item["name"],
                quantity=item["quantity"],
                unit=item["unit"],
                sector=item["sector"],
                shopping_list_id=shopping_list.id
            )
            await shopping_service.add_item_to_list(db, shopping_list.id, user.id, item_data)
        
        return {
            "message": "Lista da IA salva com sucesso!",
            "shopping_list_id": shopping_list.id,
            "list_name": shopping_list.name,
            "total_items": len(request['items']),
            "view_list_url": f"/api/v1/shopping-lists/{shopping_list.id}"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao salvar lista: {str(e)}"
        )


@router.post("/recipe-ingredients", response_model=RecipeIngredientsResponse)
async def generate_recipe_ingredients(
    request: RecipeIngredientsRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ## Gerar Ingredientes para Receita
    
    Usa inteligência artificial para gerar lista de ingredientes para uma receita específica.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Dados necessários:**
    - **recipe_name**: Nome da receita (ex: "lasanha", "feijoada", "pizza")
    - **people_count**: Número de pessoas (opcional, padrão: 1)
    - **difficulty**: Dificuldade da receita (opcional: "fácil", "normal", "difícil", padrão: "normal")
    
    **Exemplos de receitas:**
    - "lasanha"
    - "feijoada"
    - "strogonoff"
    - "risoto"
    - "pizza"
    - "bolo de chocolate"
    - "paella"
    
    **Exemplo de uso:**
    ```json
    {
        "recipe_name": "lasanha",
        "people_count": 4,
        "difficulty": "normal"
    }
    ```
    
    **Resposta:**
    - `200`: Ingredientes gerados com sucesso
    - `401`: Token inválido ou expirado
    - `500`: Erro na geração pela IA
    
    **Exemplo de resposta:**
    ```json
    {
        "recipe_name": "lasanha",
        "ingredients": [
            {
                "name": "massa de lasanha",
                "quantity": 1.2,
                "unit": "kg",
                "sector": "mercearia"
            }
        ],
        "total_ingredients": 10,
        "difficulty": "normal"
    }
    ```
    
    **Recursos:**
    - Lista completa de ingredientes organizados por setores
    - Quantidades calculadas baseadas no número de pessoas
    - Dificuldade da receita considerada
    - Ingredientes organizados por setores do supermercado
    """
    ingredients = await ollama_service.generate_recipe_ingredients(
        request.recipe_name, 
        request.people_count, 
        request.difficulty
    )
    
    if not ingredients:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate recipe ingredients"
        )
    
    # Create shopping list with generated ingredients automatically
    try:
        # Create the shopping list
        shopping_list_data = ShoppingListCreate(
            name=f"Ingredientes: {request.recipe_name}",
            description=f"Lista de ingredientes para {request.recipe_name} ({request.people_count} pessoas) - Dificuldade: {request.difficulty}"
        )
        
        # Create the shopping list
        shopping_list = await shopping_service.create_shopping_list(db, user.id, shopping_list_data)
        
        # Add all generated ingredients to the list
        for ingredient in ingredients:
            item_data = ItemCreate(
                name=ingredient["name"],
                quantity=ingredient["quantity"],
                unit=ingredient["unit"],
                sector=ingredient["sector"],
                shopping_list_id=shopping_list.id
            )
            await shopping_service.add_item_to_list(db, shopping_list.id, user.id, item_data)
        
        return RecipeIngredientsResponse(
            recipe_name=request.recipe_name,
            ingredients=ingredients,
            total_ingredients=len(ingredients),
            difficulty=request.difficulty,
            shopping_list_id=shopping_list.id,
            message=f"Lista de ingredientes criada e salva automaticamente com ID: {shopping_list.id}"
        )
        
    except Exception as e:
        # If saving fails, still return the generated ingredients
        return RecipeIngredientsResponse(
            recipe_name=request.recipe_name,
            ingredients=ingredients,
            total_ingredients=len(ingredients),
            difficulty=request.difficulty,
            message=f"Lista de ingredientes gerada pela IA, mas não foi possível salvar automaticamente: {str(e)}"
        )


@router.post("/suggestions", response_model=SuggestionResponse)
async def get_item_suggestions(
    request: SuggestionRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get item suggestions based on user's shopping history"""
    # Verify user is requesting their own suggestions
    if request.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only get suggestions for own account"
        )
    
    suggested_items = shopping_service.get_suggestions_from_history(db, user.id, request.limit)
    
    return SuggestionResponse(
        suggested_items=suggested_items,
        based_on_history=True
    ) 
from pydantic import BaseModel
class ExtractUrlRequest(BaseModel):
    url: str

from ddgs import DDGS
from recipe_scrapers import scrape_me

@router.get("/recipes/search")
async def search_recipes(q: str):
    """
    Search for recipes using DuckDuckGo
    """
    try:
        results = []
        with DDGS() as ddgs:
            ddg_query = f"site:tudogostoso.com.br/receita OR site:panelinha.com.br/receita {q}"
            for r in ddgs.text(ddg_query, region='wt-wt', max_results=5):
                results.append({
                    "title": r.get('title', ''),
                    "snippet": r.get('body', ''),
                    "url": r.get('href', '')
                })
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recipes/extract-url")
async def extract_recipe_from_url(
    request: ExtractUrlRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Extract recipe from URL and return parsed data (does not save automatically)
    """
    try:
        scraper = scrape_me(request.url)
        title = scraper.title()
        ingredients_raw = scraper.ingredients()
        image_url = scraper.image()
        cooking_time = scraper.total_time()
        if cooking_time:
            cooking_time = f"{cooking_time} min"
        else:
            cooking_time = "Desconhecido"
            
        instructions = ""
        try:
            instructions = scraper.instructions()
        except:
            pass
            
        parsed_ingredients = []
        for ing in ingredients_raw:
            qty = 1.0
            unit = "un"
            name = ing
            parts = ing.split(' ', 1)
            if parts[0].replace('.','',1).isdigit():
                try:
                    qty = float(parts[0])
                    name = parts[1] if len(parts) > 1 else ing
                except:
                    pass
            
            parsed_ingredients.append({
                "name": name.strip()[:100],
                "quantity": qty,
                "unit": unit,
                "sector": "mercearia"
            })

        return {
            "title": title,
            "image_url": image_url,
            "cooking_time": cooking_time,
            "ingredients": parsed_ingredients,
            "instructions": instructions,
            "source_url": request.url
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract recipe: {str(e)}")

