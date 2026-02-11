# Medical Analysis 🏥

Sistema completo de análise e gerenciamento de pacientes e exames médicos, desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Shadcn/ui.

![Medical Analysis](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Funcionalidades

### Dashboard Interativo
- 📊 **Cards de Estatísticas** - Visão geral de pacientes e exames
- 📈 **Gráficos Dinâmicos** - Top 10 exames realizados com Recharts
- 🔍 **Busca Avançada** - Pesquisa de pacientes por nome, CPF ou email
- 🎯 **Filtros Inteligentes** - Filtro por tipo de exame, status e gênero

### Gerenciamento de Pacientes
- ➕ **Cadastro Completo** - Formulário com validação de CPF, email e telefone
- 📋 **Lista Paginada** - Visualização de todos os pacientes com paginação
- ✏️ **Edição e Exclusão** - Gerenciamento completo de registros
- 🏷️ **Badges de Status** - Indicadores visuais de exames realizados

### Dados Mockados
- 👥 **50 Pacientes Fictícios** - Dados brasileiros realistas pré-carregados
- ✅ **CPFs Válidos** - Gerados algoritmicamente com dígitos verificadores
- 📍 **Endereços Reais** - 10 cidades brasileiras diferentes
- 📅 **Histórico Completo** - Exames dos últimos 6 meses

## 🚀 Tecnologias

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Shadcn/ui
- **Gráficos:** Recharts
- **Estado:** Zustand
- **Persistência:** LocalStorage
- **Validação:** Validadores customizados (CPF, email, telefone)
- **Ícones:** Lucide React

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/medical-analysis.git

# Entre no diretório
cd medical-analysis

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🏗️ Build para Produção

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
medical-analysis/
├── app/                    # Páginas e rotas
├── components/             # Componentes React
├── lib/                    # Lógica de negócio
├── types/                  # Tipos TypeScript
├── constants/              # Constantes
└── hooks/                  # Custom hooks
```

## 🎨 Design

O projeto utiliza o **Shadcn/ui** com tema **Slate**, proporcionando:
- ✅ Interface profissional e limpa
- ✅ Design responsivo (mobile-first)
- ✅ Acessibilidade (WCAG AA)
- ✅ Animações suaves

## 📊 Tipos de Exames

O sistema suporta 14 tipos de exames médicos agrupados em 3 categorias:
**Laboratoriais, Imagem e Cardiológicos**

## 🔒 Validações

O sistema implementa validações completas:
- ✅ **CPF:** Validação com dígitos verificadores
- ✅ **Email:** Regex para formato válido
- ✅ **Telefone:** 10 ou 11 dígitos (DDD + número)
- ✅ **Idade:** Range de 0 a 120 anos

## 🚀 Deploy no Vercel

### Via Dashboard
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta do GitHub
3. Selecione o repositório `medical-analysis`
4. Clique em "Deploy"

### Via CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Claude Sonnet 4.5

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
