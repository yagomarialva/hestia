import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Star, 
  ShoppingCart, 
  Brain, 
  Users, 
  Zap,
  ArrowRight,
  Play,
  ChevronDown
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">Hestia</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
              Benefícios
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Como Funciona
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Depoimentos
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Preços
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Users className="w-4 h-4 mr-2" />
                  1200+ usuários ativos
                </Badge>
                <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
                  Listas de Compras
                  <span className="text-primary block">Inteligentes</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Transforme suas receitas em listas de compras organizadas com IA. 
                  Economize tempo e nunca mais esqueça um ingrediente.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/auth/register">
                    Começar Grátis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <Link href="#how-it-works">
                    <Play className="w-5 h-5 mr-2" />
                    Ver Demonstração
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 border-2 border-dashed border-primary/30">
                <div className="bg-card rounded-xl p-6 shadow-lg">
                  <h3 className="font-heading text-xl font-semibold mb-4">Receita: Bolo de Chocolate</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">2 xícaras de farinha de trigo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">1 xícara de açúcar</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">3 ovos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">1/2 xícara de cacau em pó</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      ✨ Lista gerada automaticamente pela IA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground mb-8">Confiado por funcionários em</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix", "Spotify", "Uber"].map((company) => (
              <div key={company} className="text-2xl font-bold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Benefícios
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Foque em como ajudamos você, não apenas nas funcionalidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>IA Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nossa IA analisa receitas e cria listas de compras organizadas automaticamente, 
                  agrupando itens por categoria do supermercado.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Economia de Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reduza o tempo gasto planejando compras em até 80%. 
                  Foque no que importa: cozinhar e aproveitar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Nunca Esqueça Nada</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Listas organizadas e verificáveis garantem que você nunca mais 
                  esqueça um ingrediente essencial.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Compartilhamento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compartilhe listas com familiares e amigos. 
                  Planeje refeições em grupo de forma colaborativa.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Organização Perfeita</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Listas organizadas por seções do supermercado, 
                  facilitando sua jornada de compras.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Receitas Favoritas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Salve suas receitas favoritas e gere listas instantaneamente. 
                  Sua biblioteca pessoal de culinária.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Como Funciona?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece a usar em 3 passos simples
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4">Cole a Receita</h3>
              <p className="text-muted-foreground">
                Cole o link ou texto da receita que você quer preparar. 
                Nossa IA analisa todos os ingredientes automaticamente.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4">IA Organiza</h3>
              <p className="text-muted-foreground">
                Nossa inteligência artificial organiza os ingredientes por categoria 
                e calcula as quantidades necessárias.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4">Compre e Cozinhe</h3>
              <p className="text-muted-foreground">
                Use sua lista organizada no supermercado e aproveite 
                o tempo economizado para cozinhar deliciosamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Preços - Por que comprar/Como ajuda
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ajude os usuários a escolher mostrando as diferenças nos planos. Não esconda nada.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">R$ 19<span className="text-lg text-muted-foreground">/mês</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Até 10 receitas por mês</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Listas básicas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Suporte por email</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/auth/register">Começar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">R$ 39<span className="text-lg text-muted-foreground">/mês</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Receitas ilimitadas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Listas organizadas por seção</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Compartilhamento de listas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Receitas favoritas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/auth/register">Começar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced</CardTitle>
                <div className="text-3xl font-bold">R$ 79<span className="text-lg text-muted-foreground">/mês</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Tudo do Pro</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Integração com apps de supermercado</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Análise de custos</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">API personalizada</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Suporte 24/7</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/auth/register">Começar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Amado por pessoas no mundo todo
            </h2>
            <p className="text-xl text-muted-foreground">
              Colocado ao lado do preço para ajudar com conversões
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Maria Silva",
                role: "Chef de Cozinha",
                content: "Revolucionou minha forma de planejar refeições. Economizo horas toda semana!",
                rating: 5
              },
              {
                name: "João Santos",
                role: "Pai de Família",
                content: "Finalmente posso planejar as compras da família sem esquecer nada. Perfeito!",
                rating: 5
              },
              {
                name: "Ana Costa",
                role: "Nutricionista",
                content: "A IA entende perfeitamente as receitas e organiza tudo de forma inteligente.",
                rating: 5
              },
              {
                name: "Carlos Lima",
                role: "Estudante",
                content: "Como estudante, preciso economizar tempo e dinheiro. Esta ferramenta é essencial!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Aborde algumas questões principais para ajudar as pessoas a tomar a decisão final
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "Posso cancelar minha assinatura a qualquer momento?",
                answer: "Sim! Você pode cancelar sua assinatura a qualquer momento através da sua conta. Não há taxas de cancelamento e você continuará tendo acesso até o final do período pago."
              },
              {
                question: "Há garantia de reembolso?",
                answer: "Oferecemos garantia de 30 dias. Se você não ficar satisfeito com o serviço, reembolsaremos 100% do valor pago."
              },
              {
                question: "A IA funciona com receitas em português?",
                answer: "Sim! Nossa IA foi treinada especificamente para receitas em português e entende ingredientes, medidas e técnicas culinárias brasileiras."
              },
              {
                question: "Posso compartilhar minhas listas com familiares?",
                answer: "Sim! No plano Pro e Advanced, você pode compartilhar listas com familiares e amigos, facilitando o planejamento de refeições em grupo."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Pronto para revolucionar suas compras?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a mais de 1200 usuários que já economizam tempo e dinheiro com listas inteligentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/register">
                Começar Grátis Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="#pricing">
                Ver Planos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-xl">Hestia</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Listas de compras inteligentes com IA para economizar tempo e organizar sua vida.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Menu</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefícios</Link></li>
                <li><Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Preços</Link></li>
                <li><Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Depoimentos</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Receba dicas e novidades sobre organização de compras.
              </p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                />
                <Button size="sm">Inscrever</Button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Hestia. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
