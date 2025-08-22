import httpx
import json
from typing import Optional, List, Dict
from ..models.item import SupermarketSector
from ..config import settings


class OllamaService:
    def __init__(self):
        self.base_url = settings.ollama_url
        self.model = "llama3.2:1b"  # Using ultra-light model (1.3GB)
    
    async def _make_request(self, prompt: str) -> Optional[str]:
        """Make request to Ollama API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False
                    },
                    timeout=60.0  # Reduced timeout for ultra-light model
                )
                response.raise_for_status()
                result = response.json()
                return result.get("response", "").strip()
        except Exception as e:
            print(f"Error calling Ollama: {e}")
            print(f"Full error details: {type(e).__name__}: {str(e)}")
            return None
    
    async def classify_product(self, product_name: str) -> Optional[SupermarketSector]:
        """Classify product into supermarket sector using AI"""
        prompt = f"""Classifique o produto '{product_name}' no setor do supermercado.
        
        Setores disponíveis:
        - hortifruti
        - mercearia
        - limpeza
        - congelados
        - padaria
        - bebidas
        - higiene
        
        Responda apenas com o nome do setor, sem pontuação ou texto adicional."""
        
        response = await self._make_request(prompt)
        if not response:
            return None
        
        # Clean response and map to enum
        sector_name = response.lower().strip()
        sector_mapping = {
            # Setores padrão
            "hortifruti": SupermarketSector.HORTIFRUTI,
            "mercearia": SupermarketSector.MERCEARIA,
            "limpeza": SupermarketSector.LIMPEZA,
            "congelados": SupermarketSector.CONGELADOS,
            "padaria": SupermarketSector.PADARIA,
            "bebidas": SupermarketSector.BEBIDAS,
            "higiene": SupermarketSector.HIGIENE,
            # Variações comuns
            "produtos frescos": SupermarketSector.HORTIFRUTI,
            "frutas e verduras": SupermarketSector.HORTIFRUTI,
            "legumes": SupermarketSector.HORTIFRUTI,
            "alimentos secos": SupermarketSector.MERCEARIA,
            "grãos": SupermarketSector.MERCEARIA,
            "cereais": SupermarketSector.MERCEARIA,
            "laticínios": SupermarketSector.MERCEARIA,
            "carnes": SupermarketSector.MERCEARIA,
            "pães": SupermarketSector.PADARIA,
            "doces": SupermarketSector.PADARIA,
            "sucos": SupermarketSector.BEBIDAS,
            "refrigerantes": SupermarketSector.BEBIDAS,
            "cervejas": SupermarketSector.BEBIDAS,
            "produtos de limpeza": SupermarketSector.LIMPEZA,
            "higiene pessoal": SupermarketSector.HIGIENE,
            "congelados": SupermarketSector.CONGELADOS,
            "sorvetes": SupermarketSector.CONGELADOS
        }
        
        return sector_mapping.get(sector_name)
    
    async def generate_shopping_list(self, theme: str, people_count: int = 1) -> Optional[List[Dict]]:
        """Generate shopping list based on theme using AI"""
        prompt = f"""Lista de compras para {theme} ({people_count} pessoas).

Use APENAS estes setores:
- hortifruti
- mercearia  
- limpeza
- congelados
- padaria
- bebidas
- higiene

Formato: setor: produto1 qty unit, produto2 qty unit
Exemplo:
hortifruti: tomate 0.5 kg, alface 1 un, cebola 0.3 kg
mercearia: arroz 1 kg, feijão 0.5 kg, óleo 1 un
padaria: pão 4 un, queijo 0.2 kg
bebidas: refrigerante 2 un, cerveja 4 un

Responda no mesmo formato com pelo menos 8-12 itens."""
        
        response = await self._make_request(prompt)
        if not response:
            # Fallback to predefined lists when AI fails
            return self._get_fallback_list(theme, people_count)
        
        try:
            # Try to parse JSON response first
            data = json.loads(response)
            return data.get("items", [])
        except json.JSONDecodeError:
            # Fallback: parse simple text format
            parsed_items = self._parse_text_response(response)
            if parsed_items:
                return parsed_items
            # Final fallback
            return self._get_fallback_list(theme, people_count)
    
    def _get_fallback_list(self, theme: str, people_count: int) -> List[Dict]:
        """Get predefined shopping list when AI fails"""
        base_lists = {
            "churrasco": [
                {"name": "carne bovina", "quantity": people_count * 0.3, "unit": "kg", "sector": "mercearia"},
                {"name": "pão de alho", "quantity": people_count * 2, "unit": "un", "sector": "padaria"},
                {"name": "cebola", "quantity": people_count * 1, "unit": "kg", "sector": "hortifruti"},
                {"name": "tomate", "quantity": people_count * 0.5, "unit": "kg", "sector": "hortifruti"},
                {"name": "alface", "quantity": 1, "unit": "un", "sector": "hortifruti"},
                {"name": "arroz", "quantity": people_count * 0.2, "unit": "kg", "sector": "mercearia"},
                {"name": "feijão", "quantity": people_count * 0.1, "unit": "kg", "sector": "mercearia"},
                {"name": "cerveja", "quantity": people_count * 2, "unit": "un", "sector": "bebidas"},
                {"name": "refrigerante", "quantity": people_count * 1, "unit": "un", "sector": "bebidas"},
            ],
            "jantar": [
                {"name": "arroz", "quantity": people_count * 0.15, "unit": "kg", "sector": "mercearia"},
                {"name": "feijão", "quantity": people_count * 0.1, "unit": "kg", "sector": "mercearia"},
                {"name": "carne", "quantity": people_count * 0.2, "unit": "kg", "sector": "mercearia"},
                {"name": "pão", "quantity": people_count * 1, "unit": "un", "sector": "padaria"},
                {"name": "alface", "quantity": 1, "unit": "un", "sector": "hortifruti"},
                {"name": "tomate", "quantity": people_count * 0.3, "unit": "kg", "sector": "hortifruti"},
            ],
            "café da manhã": [
                {"name": "pão", "quantity": people_count * 2, "unit": "un", "sector": "padaria"},
                {"name": "leite", "quantity": people_count * 0.5, "unit": "L", "sector": "mercearia"},
                {"name": "café", "quantity": people_count * 0.05, "unit": "kg", "sector": "mercearia"},
                {"name": "manteiga", "quantity": 1, "unit": "un", "sector": "mercearia"},
                {"name": "queijo", "quantity": people_count * 0.1, "unit": "kg", "sector": "padaria"},
                {"name": "ovos", "quantity": people_count * 2, "unit": "un", "sector": "mercearia"},
                {"name": "banana", "quantity": people_count * 1, "unit": "un", "sector": "hortifruti"},
                {"name": "laranja", "quantity": people_count * 1, "unit": "un", "sector": "hortifruti"},
                {"name": "aveia", "quantity": people_count * 0.1, "unit": "kg", "sector": "mercearia"},
                {"name": "mel", "quantity": 1, "unit": "un", "sector": "mercearia"},
            ]
        }
        
        # Return theme-specific list or default dinner list
        return base_lists.get(theme.lower(), base_lists["jantar"])
    
    async def generate_recipe_ingredients(self, recipe_name: str, people_count: int = 1, difficulty: str = "normal") -> Optional[List[Dict]]:
        """Generate ingredients list for a specific recipe using AI"""
        prompt = f"""Lista de ingredientes para {recipe_name} ({people_count} pessoas).

Dificuldade: {difficulty}

Use APENAS estes setores:
- hortifruti
- mercearia  
- limpeza
- congelados
- padaria
- bebidas
- higiene

Formato: setor: ingrediente1 qty unit, ingrediente2 qty unit
Exemplo:
hortifruti: tomate 0.5 kg, cebola 0.3 kg, alho 0.1 kg
mercearia: massa de lasanha 0.5 kg, queijo ralado 0.2 kg, molho de tomate 1 un
padaria: queijo mussarela 0.3 kg

Responda no mesmo formato com todos os ingredientes necessários para {recipe_name}.
Quantidades devem ser proporcionais ao número de pessoas ({people_count})."""

        response = await self._make_request(prompt)
        if not response:
            # Fallback to predefined recipe ingredients
            return self._get_fallback_recipe_ingredients(recipe_name, people_count, difficulty)
        
        try:
            # Try to parse JSON response first
            data = json.loads(response)
            return data.get("ingredients", [])
        except json.JSONDecodeError:
            # Fallback: parse simple text format
            parsed_items = self._parse_text_response(response)
            if parsed_items:
                return parsed_items
            # Final fallback
            return self._get_fallback_recipe_ingredients(recipe_name, people_count, difficulty)
    
    def _get_fallback_recipe_ingredients(self, recipe_name: str, people_count: int, difficulty: str) -> List[Dict]:
        """Get predefined recipe ingredients when AI fails"""
        recipe_ingredients = {
            "lasanha": [
                {"name": "massa de lasanha", "quantity": people_count * 0.3, "unit": "kg", "sector": "mercearia"},
                {"name": "carne moída", "quantity": people_count * 0.2, "unit": "kg", "sector": "mercearia"},
                {"name": "molho de tomate", "quantity": people_count * 0.5, "unit": "L", "sector": "mercearia"},
                {"name": "cebola", "quantity": people_count * 0.2, "unit": "kg", "sector": "hortifruti"},
                {"name": "alho", "quantity": people_count * 0.05, "unit": "kg", "sector": "hortifruti"},
                {"name": "queijo mussarela", "quantity": people_count * 0.2, "unit": "kg", "sector": "padaria"},
                {"name": "queijo parmesão", "quantity": people_count * 0.1, "unit": "kg", "sector": "padaria"},
                {"name": "azeite", "quantity": people_count * 0.05, "unit": "L", "sector": "mercearia"},
                {"name": "sal", "quantity": 1, "unit": "un", "sector": "mercearia"},
                {"name": "pimenta", "quantity": 1, "unit": "un", "sector": "mercearia"},
            ],
            "feijoada": [
                {"name": "feijão preto", "quantity": people_count * 0.2, "unit": "kg", "sector": "mercearia"},
                {"name": "carne de porco", "quantity": people_count * 0.3, "unit": "kg", "sector": "mercearia"},
                {"name": "linguiça", "quantity": people_count * 0.2, "unit": "kg", "sector": "mercearia"},
                {"name": "cebola", "quantity": people_count * 0.3, "unit": "kg", "sector": "hortifruti"},
                {"name": "alho", "quantity": people_count * 0.1, "unit": "kg", "sector": "hortifruti"},
                {"name": "laranja", "quantity": people_count * 1, "unit": "un", "sector": "hortifruti"},
                {"name": "couve", "quantity": people_count * 0.2, "unit": "kg", "sector": "hortifruti"},
                {"name": "arroz", "quantity": people_count * 0.15, "unit": "kg", "sector": "mercearia"},
                {"name": "farofa", "quantity": people_count * 0.1, "unit": "kg", "sector": "mercearia"},
            ],
            "strogonoff": [
                {"name": "frango", "quantity": people_count * 0.25, "unit": "kg", "sector": "mercearia"},
                {"name": "creme de leite", "quantity": people_count * 0.2, "unit": "L", "sector": "mercearia"},
                {"name": "champignon", "quantity": people_count * 0.1, "unit": "kg", "sector": "hortifruti"},
                {"name": "cebola", "quantity": people_count * 0.2, "unit": "kg", "sector": "hortifruti"},
                {"name": "alho", "quantity": people_count * 0.05, "unit": "kg", "sector": "hortifruti"},
                {"name": "ketchup", "quantity": people_count * 0.1, "unit": "L", "sector": "mercearia"},
                {"name": "mostarda", "quantity": people_count * 0.05, "unit": "L", "sector": "mercearia"},
                {"name": "arroz", "quantity": people_count * 0.15, "unit": "kg", "sector": "mercearia"},
                {"name": "batata palha", "quantity": people_count * 0.1, "unit": "kg", "sector": "mercearia"},
            ],
            "risoto": [
                {"name": "arroz arbóreo", "quantity": people_count * 0.15, "unit": "kg", "sector": "mercearia"},
                {"name": "queijo parmesão", "quantity": people_count * 0.1, "unit": "kg", "sector": "padaria"},
                {"name": "manteiga", "quantity": people_count * 0.05, "unit": "kg", "sector": "mercearia"},
                {"name": "cebola", "quantity": people_count * 0.2, "unit": "kg", "sector": "hortifruti"},
                {"name": "alho", "quantity": people_count * 0.05, "unit": "kg", "sector": "hortifruti"},
                {"name": "caldo de legumes", "quantity": people_count * 0.5, "unit": "L", "sector": "mercearia"},
                {"name": "vinho branco", "quantity": people_count * 0.1, "unit": "L", "sector": "bebidas"},
                {"name": "azeite", "quantity": people_count * 0.05, "unit": "L", "sector": "mercearia"},
            ],
            "pizza": [
                {"name": "farinha de trigo", "quantity": people_count * 0.3, "unit": "kg", "sector": "mercearia"},
                {"name": "fermento biológico", "quantity": people_count * 0.02, "unit": "kg", "sector": "mercearia"},
                {"name": "azeite", "quantity": people_count * 0.05, "unit": "L", "sector": "mercearia"},
                {"name": "molho de tomate", "quantity": people_count * 0.3, "unit": "L", "sector": "mercearia"},
                {"name": "queijo mussarela", "quantity": people_count * 0.3, "unit": "kg", "sector": "padaria"},
                {"name": "tomate", "quantity": people_count * 0.2, "unit": "kg", "sector": "hortifruti"},
                {"name": "manjericão", "quantity": people_count * 0.05, "unit": "kg", "sector": "hortifruti"},
                {"name": "azeitonas", "quantity": people_count * 0.1, "unit": "kg", "sector": "mercearia"},
            ]
        }
        
        # Return recipe-specific ingredients or default
        return recipe_ingredients.get(recipe_name.lower(), [
            {"name": "ingredientes para " + recipe_name, "quantity": 1, "unit": "receita", "sector": "mercearia"}
        ])
    
    def _parse_text_response(self, text: str) -> List[Dict]:
        """Parse text response when JSON parsing fails"""
        items = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if ':' in line:
                # Format: "setor: produto1 qty unit, produto2 qty unit"
                sector_part, products_part = line.split(':', 1)
                sector = sector_part.strip().lower()
                # Normalize sector names
                if sector == "horifruti":
                    sector = "hortifruti"
                # Remove extra hyphens and spaces
                sector = sector.replace("- ", "").replace("-", "").strip()
                
                # Parse products
                products = [p.strip() for p in products_part.split(',')]
                for product in products:
                    if product:
                        # Simple parsing: "produto qty unit"
                        parts = product.split()
                        if len(parts) >= 1:
                            name = parts[0]
                            quantity = 1.0
                            unit = "un"
                            
                            if len(parts) >= 2:
                                try:
                                    quantity = float(parts[1])
                                except ValueError:
                                    pass
                            
                            if len(parts) >= 3:
                                unit = parts[2]
                            
                            # Validate and normalize data before adding
                            valid_sectors = ["hortifruti", "mercearia", "limpeza", "congelados", "padaria", "bebidas", "higiene"]
                            if name and sector and sector in valid_sectors:
                                # Normalize units
                                normalized_unit = self._normalize_unit(unit)
                                
                                items.append({
                                    "name": name,
                                    "quantity": quantity,
                                    "unit": normalized_unit,
                                    "sector": sector
                                })
        
        return items
    
    def _normalize_unit(self, unit: str) -> str:
        """Normalize units to standard values"""
        unit = unit.lower().strip()
        
        # Common unit mappings
        unit_mapping = {
            # Weight units
            "kg": "kg", "kilos": "kg", "quilos": "kg", "g": "g", "gramas": "g",
            # Volume units
            "l": "L", "litros": "L", "ml": "ml", "mililitros": "ml",
            # Count units
            "un": "un", "unidade": "un", "unidades": "un", "pcs": "un", "peças": "un",
            # Common cooking units
            "colher": "colher", "colheres": "colher", "xícara": "xícara", "xícaras": "xícara",
            "copo": "copo", "copos": "copo", "pitada": "pitada", "pitadas": "pitada",
            # Fallback for unusual units
            "dente": "un", "dentes": "un", "dica": "un", "dicas": "un", "gosto": "pitada",
            "em": "un", "lasanha": "kg", "tomate": "L", "trigo": "kg", "50ml": "ml"
        }
        
        return unit_mapping.get(unit, "un")  # Default to "un" if not found


# Global instance
ollama_service = OllamaService() 