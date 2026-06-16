import os
import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters, CallbackQueryHandler
from recipe_scrapers import scrape_me
from ddgs import DDGS

from ..database import SessionLocal
from ..models.user import User
from ..schemas.shopping_list import ShoppingListCreate
from ..schemas.item import ItemCreate, ItemUpdate
from ..services.shopping_service import shopping_service
from ..models.pantry_item import PantryItem
from ..models.shopping_list import ShoppingList
from ..models.item import Item
from datetime import datetime

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# Store the application globally so we can shut it down
_telegram_app = None

def get_mock_user(db):
    """Fallback to get the mock user used by the app for the Telegram bot."""
    user = db.query(User).filter(User.email == "mock@hestia.com").first()
    return user

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send a message when the command /start is issued."""
    welcome_text = (
        "🔥 Olá! Eu sou Hestia, a Deusa do seu Lar!\n\n"
        "Estou aqui para te ajudar com suas compras e receitas. Aqui estão meus comandos:\n\n"
        "📋 *Listas de Compras*\n"
        "/listas - Ver suas listas ativas\n"
        "/nova_lista [NOME] - Criar uma nova lista\n"
        "/add [ID_DA_LISTA] [ITEM] - Adicionar item na lista\n"
        "/del [ID_DA_LISTA] [ITEM] - Remover item da lista\n\n"
        "🍳 *Receitas*\n"
        "/receita [LINK ou NOME] - Extrair de um link ou PESQUISAR uma receita!\n\n"
        "📦 *Despensa*\n"
        "/despensa - Ver resumo do estoque\n"
        "/consumir [ITEM] - Reduzir quantidade de um item\n"
        "/repor - Gerar lista de compras automática com os itens em falta\n"
    )
    await update.message.reply_text(welcome_text, parse_mode="Markdown")

async def listas_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """List the user's active shopping lists."""
    db = SessionLocal()
    try:
        user = get_mock_user(db)
        if not user:
            await update.message.reply_text("Erro: Usuário não encontrado no sistema Hestia.")
            return

        lists = await shopping_service.get_user_shopping_lists(db, user.id, skip=0, limit=10)
        
        if not lists:
            await update.message.reply_text("Você não possui listas de compras no momento.")
            return

        response = "📋 *Suas Listas de Compras:*\n\n"
        for lst in lists:
            response += f"🔹 {lst.name} (ID: {lst.id})\n"
        
        await update.message.reply_text(response, parse_mode="Markdown")
    finally:
        db.close()

async def nova_lista_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso: /nova_lista [Nome da Lista]")
        return
    name = " ".join(context.args)
    db = SessionLocal()
    try:
        user = get_mock_user(db)
        list_data = ShoppingListCreate(name=name, description="Criada via Telegram")
        new_list = await shopping_service.create_shopping_list(db, user.id, list_data)
        await update.message.reply_text(f"✅ Lista '{name}' criada com sucesso! ID: {new_list.id}")
    finally:
        db.close()

async def add_item_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) < 2:
        await update.message.reply_text("Uso: /add [ID_DA_LISTA] [NOME_DO_ITEM]")
        return
    list_id_str = context.args[0]
    if not list_id_str.isdigit():
        await update.message.reply_text("O ID da lista deve ser um número.")
        return
    list_id = int(list_id_str)
    item_name = " ".join(context.args[1:])

    db = SessionLocal()
    try:
        user = get_mock_user(db)
        item_data = ItemCreate(name=item_name, quantity=1, unit="un", sector="mercearia", shopping_list_id=list_id)
        await shopping_service.add_item_to_list(db, list_id, user.id, item_data)
        await update.message.reply_text(f"✅ Item '{item_name}' adicionado à lista {list_id}.")
    except Exception as e:
        await update.message.reply_text(f"❌ Erro ao adicionar: {str(e)}")
    finally:
        db.close()

async def del_item_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) < 2:
        await update.message.reply_text("Uso: /del [ID_DA_LISTA] [NOME_DO_ITEM_COMPLETO_OU_PARCIAL]")
        return
    list_id_str = context.args[0]
    if not list_id_str.isdigit():
        await update.message.reply_text("O ID da lista deve ser um número.")
        return
    list_id = int(list_id_str)
    item_query = " ".join(context.args[1:]).lower()

    db = SessionLocal()
    try:
        user = get_mock_user(db)
        items = await shopping_service.get_list_items(db, list_id, user.id)
        to_delete = None
        for it in items:
            if item_query in it.name.lower():
                to_delete = it
                break
        
        if not to_delete:
            await update.message.reply_text(f"Nenhum item com nome '{item_query}' encontrado na lista {list_id}.")
            return
            
        await shopping_service.delete_item(db, to_delete.id, user.id)
        await update.message.reply_text(f"✅ Item '{to_delete.name}' removido da lista {list_id}.")
    except Exception as e:
        await update.message.reply_text(f"❌ Erro ao remover: {str(e)}")
    finally:
        db.close()

async def extract_and_save_recipe(url: str, db, user, update=None, query_obj=None):
    """Helper method to extract recipe and save list"""
    try:
        scraper = scrape_me(url, wild_mode=True)
        title = scraper.title()
        ingredients_raw = scraper.ingredients()
        
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

        shopping_list_data = ShoppingListCreate(
            name=f"Receita: {title[:50]}",
            description=f"Extraída do Telegram: {url}"
        )
        
        shopping_list = await shopping_service.create_shopping_list(db, user.id, shopping_list_data)
        
        for ingredient in parsed_ingredients:
            item_data = ItemCreate(
                name=ingredient["name"],
                quantity=ingredient["quantity"],
                unit=ingredient["unit"],
                sector=ingredient["sector"],
                shopping_list_id=shopping_list.id
            )
            await shopping_service.add_item_to_list(db, shopping_list.id, user.id, item_data)

        response = (
            f"✅ *Receita Extraída com Sucesso!*\n\n"
            f"🍳 *{title}*\n"
            f"🛒 Foi criada a lista '{shopping_list.name}' com *{len(parsed_ingredients)}* ingredientes!\n\n"
            f"Abra o aplicativo Hestia para conferir."
        )
        
        if query_obj:
            await query_obj.edit_message_text(response, parse_mode="Markdown")
        elif update:
            await update.message.reply_text(response, parse_mode="Markdown")

    except Exception as e:
        msg = f"❌ Poxa, não consegui extrair dessa URL.\nErro: {str(e)}"
        if query_obj:
            await query_obj.edit_message_text(msg)
        elif update:
            await update.message.reply_text(msg)

async def despensa_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """List pantry items and deficit status."""
    db = SessionLocal()
    try:
        user = get_mock_user(db)
        items = db.query(PantryItem).filter(PantryItem.user_id == user.id).all()
        
        if not items:
            await update.message.reply_text("Sua despensa está vazia! Adicione itens pelo painel web.")
            return

        missing = 0
        response = "📦 *Resumo da Despensa:*\n\n"
        for item in items:
            status = "✅"
            if item.current_quantity < item.ideal_quantity:
                status = "⚠️ Falta"
                missing += 1
            response += f"{status} - {item.name}: {item.current_quantity}/{item.ideal_quantity} {item.unit}\n"
        
        response += f"\nTotal: {len(items)} itens ({missing} em falta)."
        if missing > 0:
            response += "\n\nUse /repor para gerar uma lista de reposição!"
            
        await update.message.reply_text(response, parse_mode="Markdown")
    finally:
        db.close()

async def consumir_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Reduce quantity of a pantry item."""
    if not context.args:
        await update.message.reply_text("Uso: /consumir [NOME_DO_ITEM]")
        return
        
    query_str = " ".join(context.args).lower()
    db = SessionLocal()
    try:
        user = get_mock_user(db)
        items = db.query(PantryItem).filter(PantryItem.user_id == user.id).all()
        
        target = None
        for it in items:
            if query_str in it.name.lower():
                target = it
                break
                
        if not target:
            await update.message.reply_text(f"Nenhum item com nome '{query_str}' encontrado na despensa.")
            return
            
        if target.current_quantity <= 0:
            await update.message.reply_text(f"O item '{target.name}' já está zerado!")
            return
            
        target.current_quantity = max(0, target.current_quantity - 1)
        db.commit()
        
        await update.message.reply_text(f"✅ Consumido 1x '{target.name}'. Restam: {target.current_quantity} {target.unit}.")
    finally:
        db.close()

async def repor_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Generate shopping list from pantry deficits."""
    db = SessionLocal()
    try:
        user = get_mock_user(db)
        deficit_items = db.query(PantryItem).filter(
            PantryItem.user_id == user.id,
            PantryItem.current_quantity < PantryItem.ideal_quantity
        ).all()
        
        if not deficit_items:
            await update.message.reply_text("Sua despensa já está abastecida! Nenhum item em falta.")
            return
            
        list_name = f"Reposição - {datetime.now().strftime('%d/%m/%Y')}"
        new_list = ShoppingList(
            name=list_name,
            description="Gerada via Telegram a partir da despensa.",
            user_id=user.id
        )
        db.add(new_list)
        db.commit()
        db.refresh(new_list)
        
        added_count = 0
        for p_item in deficit_items:
            needed = p_item.ideal_quantity - p_item.current_quantity
            if needed > 0:
                shop_item = Item(
                    name=p_item.name,
                    quantity=needed,
                    unit=p_item.unit,
                    sector=p_item.sector,
                    shopping_list_id=new_list.id
                )
                db.add(shop_item)
                added_count += 1
                
        db.commit()
        await update.message.reply_text(f"🛒 *Lista Gerada com Sucesso!*\n\nLista '{list_name}' criada com {added_count} itens faltantes da sua despensa.", parse_mode="Markdown")
    except Exception as e:
        await update.message.reply_text(f"❌ Erro ao gerar lista: {str(e)}")
    finally:
        db.close()



async def receita_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Extract a recipe from a URL or search for it."""
    if not context.args:
        await update.message.reply_text(
            "Você esqueceu de mandar o link ou nome! Use:\n"
            "/receita lasanha\n"
            "ou /receita https://..."
        )
        return

    query_str = " ".join(context.args)

    db = SessionLocal()
    try:
        user = get_mock_user(db)
        if not user:
            await update.message.reply_text("Erro: Usuário não encontrado no sistema Hestia.")
            return

        if query_str.startswith("http://") or query_str.startswith("https://"):
            await update.message.reply_text("🔍 Extraindo receita da URL... Só um momento!")
            await extract_and_save_recipe(query_str, db, user, update=update)
        else:
            await update.message.reply_text(f"🔍 Pesquisando receitas para '{query_str}'...")
            try:
                results = []
                with DDGS() as ddgs:
                    ddg_query = f"site:tudogostoso.com.br OR site:panelinha.com.br {query_str}"
                    for r in ddgs.text(ddg_query, region='wt-wt', max_results=3):
                        results.append(r)
                
                if not results:
                    await update.message.reply_text("Não encontrei nenhuma receita boa com esse nome.")
                    return
                
                keyboard = []
                for idx, r in enumerate(results):
                    # We store the URL in callback_data, but it has a 64 byte limit in Telegram.
                    # Since URLs can be long, we might just store a short action and keep state, 
                    # but for simplicity, if URL is too long we just pass the URL up to 64 chars or 
                    # send an inline keyboard with the URL itself (but we need to handle it).
                    # A better way is to save the results in context.user_data
                    context.user_data[f"recipe_{idx}"] = r['href']
                    keyboard.append([InlineKeyboardButton(r.get('title', 'Receita')[:40], callback_data=f"extract_{idx}")])

                reply_markup = InlineKeyboardMarkup(keyboard)
                await update.message.reply_text("Escolha uma receita para salvar:", reply_markup=reply_markup)

            except Exception as e:
                await update.message.reply_text(f"Erro na pesquisa: {str(e)}")

    finally:
        db.close()


async def receita_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle recipe inline button click"""
    query = update.callback_query
    await query.answer()

    data = query.data
    if data.startswith("extract_"):
        idx = data.split("_")[1]
        url = context.user_data.get(f"recipe_{idx}")
        
        if not url:
            await query.edit_message_text("Desculpe, a sessão da pesquisa expirou. Faça a pesquisa novamente.")
            return

        await query.edit_message_text("🔍 Extraindo ingredientes da receita escolhida...")
        
        db = SessionLocal()
        try:
            user = get_mock_user(db)
            await extract_and_save_recipe(url, db, user, query_obj=query)
        finally:
            db.close()


async def unknown_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle unknown commands or messages."""
    await update.message.reply_text("Desculpe, eu ainda não entendo isso. Digite /start para ver meus comandos.")


async def init_telegram_bot():
    """Initialize and start the Telegram Bot in polling mode."""
    global _telegram_app
    if not TELEGRAM_BOT_TOKEN:
        print("TELEGRAM_BOT_TOKEN não encontrado. O Bot do Telegram não será iniciado.")
        return

    _telegram_app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    _telegram_app.add_handler(CommandHandler("start", start_command))
    _telegram_app.add_handler(CommandHandler("listas", listas_command))
    _telegram_app.add_handler(CommandHandler("nova_lista", nova_lista_command))
    _telegram_app.add_handler(CommandHandler("add", add_item_command))
    _telegram_app.add_handler(CommandHandler("del", del_item_command))
    _telegram_app.add_handler(CommandHandler("receita", receita_command))
    _telegram_app.add_handler(CommandHandler("despensa", despensa_command))
    _telegram_app.add_handler(CommandHandler("consumir", consumir_command))
    _telegram_app.add_handler(CommandHandler("repor", repor_command))
    _telegram_app.add_handler(CallbackQueryHandler(receita_callback, pattern="^extract_"))
    _telegram_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, unknown_command))

    # We must initialize and start the application manually since we run in FastAPI
    await _telegram_app.initialize()
    await _telegram_app.start()
    
    # Start polling loop
    await _telegram_app.updater.start_polling()
    print("Telegram Bot Iniciado!")

async def stop_telegram_bot():
    """Stop the Telegram Bot cleanly."""
    global _telegram_app
    if _telegram_app:
        print("Parando Telegram Bot...")
        await _telegram_app.updater.stop()
        await _telegram_app.stop()
        await _telegram_app.shutdown()
        print("Telegram Bot Parado.")
