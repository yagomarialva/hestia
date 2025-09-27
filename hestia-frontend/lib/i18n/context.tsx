"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "pt"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("hestia-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("hestia-language", lang)
  }

  // Translation function
  const t = (key: string): string => {
    const translations = language === "pt" ? ptTranslations : enTranslations
    return translations[key] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

// English translations
const enTranslations: Record<string, string> = {
  // App name and tagline
  "app.name": "Hestia",
  "app.tagline": "Smart Shopping Lists",

  // Authentication
  "auth.welcome_back": "Welcome back",
  "auth.sign_in_description": "Sign in to your account to continue",
  "auth.create_account": "Create account",
  "auth.join_description": "Join Hestia to start managing your shopping lists",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.full_name": "Full Name",
  "auth.confirm_password": "Confirm Password",
  "auth.enter_email": "Enter your email",
  "auth.enter_password": "Enter your password",
  "auth.enter_full_name": "Enter your full name",
  "auth.create_password": "Create a password",
  "auth.confirm_your_password": "Confirm your password",
  "auth.signing_in": "Signing in...",
  "auth.sign_in": "Sign in",
  "auth.creating_account": "Creating account...",
  "auth.create_account_button": "Create account",
  "auth.no_account": "Don't have an account?",
  "auth.sign_up": "Sign up",
  "auth.have_account": "Already have an account?",

  // Navigation
  "nav.dashboard": "Dashboard",
  "nav.shopping_lists": "Shopping Lists",
  "nav.recipe_generator": "Recipe Generator",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  "nav.sign_out": "Sign out",

  // Dashboard
  "dashboard.title": "Dashboard",
  "dashboard.welcome": "Welcome back!",
  "dashboard.overview": "Here's what's happening with your shopping lists today.",
  "dashboard.search_placeholder": "Search lists, items, recipes...",

  // Quick Actions
  "quick_actions.new_list": "New List",
  "quick_actions.new_list_desc": "Create a new shopping list",
  "quick_actions.create_list": "Create List",
  "quick_actions.ai_recipe": "AI Recipe",
  "quick_actions.ai_recipe_desc": "Generate ingredients from recipes",
  "quick_actions.generate": "Generate",
  "quick_actions.quick_shop": "Quick Shop",
  "quick_actions.quick_shop_desc": "Add items to your active list",
  "quick_actions.add_items": "Add Items",

  // Shopping Lists
  "lists.title": "Shopping Lists",
  "lists.description": "Manage your shopping lists and track your progress",
  "lists.your_lists": "Your Shopping Lists",
  "lists.manage_track": "Manage and track your shopping lists",
  "lists.search_placeholder": "Search lists...",
  "lists.all": "All",
  "lists.active": "Active",
  "lists.completed": "Completed",
  "lists.new_list": "New List",
  "lists.no_lists_found": "No lists found",
  "lists.try_adjusting": "Try adjusting your search terms.",
  "lists.create_first": "Create your first shopping list to get started.",
  "lists.view_all": "View All Lists",
  "lists.items": "items",
  "lists.status.active": "active",
  "lists.status.completed": "completed",

  // Recipe Generator
  "recipes.title": "AI Recipe Generator",
  "recipes.description": "Extract ingredients from recipes and add them directly to your shopping lists",
  "recipes.input_title": "Recipe Input",
  "recipes.input_description": "Paste your recipe text below and let AI extract the ingredients for you.",
  "recipes.placeholder":
    "Paste your recipe here... Include the title, ingredients list, and instructions for best results.",
  "recipes.characters": "characters",
  "recipes.clear_all": "Clear All",
  "recipes.extract_ingredients": "Extract Ingredients",
  "recipes.processing": "Processing...",
  "recipes.try_sample": "Try a Sample Recipe",
  "recipes.sample_description": "Click on any sample recipe to see how the AI extraction works.",
  "recipes.servings": "servings",

  // Profile
  "profile.title": "Profile",
  "profile.description": "Manage your account settings and preferences",
  "profile.tabs.profile": "Profile",
  "profile.tabs.preferences": "Preferences",
  "profile.tabs.account": "Account",
  "profile.tabs.security": "Security",

  // Recent Activity
  "activity.title": "Recent Activity",
  "activity.description": "Your latest shopping list updates",
  "activity.completed": "completed",
  "activity.added": "added",
  "activity.removed": "removed",
  "activity.from": "from",

  // Time
  "time.minutes_ago": "minutes ago",
  "time.hour_ago": "1 hour ago",
  "time.hours_ago": "hours ago",
  "time.day_ago": "1 day ago",
  "time.days_ago": "days ago",
  "time.just_now": "Just now",

  // Common
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.close": "Close",
  "common.loading": "Loading...",
  "common.search": "Search",
}

// Portuguese translations
const ptTranslations: Record<string, string> = {
  // App name and tagline
  "app.name": "Hestia",
  "app.tagline": "Listas de Compras Inteligentes",

  // Authentication
  "auth.welcome_back": "Bem-vindo de volta",
  "auth.sign_in_description": "Entre na sua conta para continuar",
  "auth.create_account": "Criar conta",
  "auth.join_description": "Junte-se ao Hestia para começar a gerenciar suas listas de compras",
  "auth.email": "E-mail",
  "auth.password": "Senha",
  "auth.full_name": "Nome Completo",
  "auth.confirm_password": "Confirmar Senha",
  "auth.enter_email": "Digite seu e-mail",
  "auth.enter_password": "Digite sua senha",
  "auth.enter_full_name": "Digite seu nome completo",
  "auth.create_password": "Crie uma senha",
  "auth.confirm_your_password": "Confirme sua senha",
  "auth.signing_in": "Entrando...",
  "auth.sign_in": "Entrar",
  "auth.creating_account": "Criando conta...",
  "auth.create_account_button": "Criar conta",
  "auth.no_account": "Não tem uma conta?",
  "auth.sign_up": "Cadastre-se",
  "auth.have_account": "Já tem uma conta?",

  // Navigation
  "nav.dashboard": "Painel",
  "nav.shopping_lists": "Listas de Compras",
  "nav.recipe_generator": "Gerador de Receitas",
  "nav.profile": "Perfil",
  "nav.settings": "Configurações",
  "nav.sign_out": "Sair",

  // Dashboard
  "dashboard.title": "Painel",
  "dashboard.welcome": "Bem-vindo de volta!",
  "dashboard.overview": "Aqui está o que está acontecendo com suas listas de compras hoje.",
  "dashboard.search_placeholder": "Buscar listas, itens, receitas...",

  // Quick Actions
  "quick_actions.new_list": "Nova Lista",
  "quick_actions.new_list_desc": "Criar uma nova lista de compras",
  "quick_actions.create_list": "Criar Lista",
  "quick_actions.ai_recipe": "Receita IA",
  "quick_actions.ai_recipe_desc": "Gerar ingredientes a partir de receitas",
  "quick_actions.generate": "Gerar",
  "quick_actions.quick_shop": "Compra Rápida",
  "quick_actions.quick_shop_desc": "Adicionar itens à sua lista ativa",
  "quick_actions.add_items": "Adicionar Itens",

  // Shopping Lists
  "lists.title": "Listas de Compras",
  "lists.description": "Gerencie suas listas de compras e acompanhe seu progresso",
  "lists.your_lists": "Suas Listas de Compras",
  "lists.manage_track": "Gerencie e acompanhe suas listas de compras",
  "lists.search_placeholder": "Buscar listas...",
  "lists.all": "Todas",
  "lists.active": "Ativas",
  "lists.completed": "Concluídas",
  "lists.new_list": "Nova Lista",
  "lists.no_lists_found": "Nenhuma lista encontrada",
  "lists.try_adjusting": "Tente ajustar seus termos de busca.",
  "lists.create_first": "Crie sua primeira lista de compras para começar.",
  "lists.view_all": "Ver Todas as Listas",
  "lists.items": "itens",
  "lists.status.active": "ativa",
  "lists.status.completed": "concluída",

  // Recipe Generator
  "recipes.title": "Gerador de Receitas IA",
  "recipes.description": "Extraia ingredientes de receitas e adicione-os diretamente às suas listas de compras",
  "recipes.input_title": "Entrada de Receita",
  "recipes.input_description": "Cole o texto da sua receita abaixo e deixe a IA extrair os ingredientes para você.",
  "recipes.placeholder":
    "Cole sua receita aqui... Inclua o título, lista de ingredientes e instruções para melhores resultados.",
  "recipes.characters": "caracteres",
  "recipes.clear_all": "Limpar Tudo",
  "recipes.extract_ingredients": "Extrair Ingredientes",
  "recipes.processing": "Processando...",
  "recipes.try_sample": "Experimente uma Receita de Exemplo",
  "recipes.sample_description": "Clique em qualquer receita de exemplo para ver como funciona a extração de IA.",
  "recipes.servings": "porções",

  // Profile
  "profile.title": "Perfil",
  "profile.description": "Gerencie as configurações da sua conta e preferências",
  "profile.tabs.profile": "Perfil",
  "profile.tabs.preferences": "Preferências",
  "profile.tabs.account": "Conta",
  "profile.tabs.security": "Segurança",

  // Recent Activity
  "activity.title": "Atividade Recente",
  "activity.description": "Suas últimas atualizações de listas de compras",
  "activity.completed": "concluiu",
  "activity.added": "adicionou",
  "activity.removed": "removeu",
  "activity.from": "de",

  // Time
  "time.minutes_ago": "minutos atrás",
  "time.hour_ago": "1 hora atrás",
  "time.hours_ago": "horas atrás",
  "time.day_ago": "1 dia atrás",
  "time.days_ago": "dias atrás",
  "time.just_now": "Agora mesmo",

  // Common
  "common.save": "Salvar",
  "common.cancel": "Cancelar",
  "common.delete": "Excluir",
  "common.edit": "Editar",
  "common.close": "Fechar",
  "common.loading": "Carregando...",
  "common.search": "Buscar",
}
