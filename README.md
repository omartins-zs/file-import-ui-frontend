<div align="center">
  
# 🚀 File Import Dashboard UI 📂

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" />
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />

<p align="center">
  <strong>Interface moderna, dinâmica e de alta performance para gestão e monitoramento de importações massivas de dados.</strong>
</p>

<cite>"Uma experiência de usuário premium, focada em clareza, velocidade e feedback em tempo real para fluxos de dados complexos."</cite>

<h4 align="center"> ✅ Projeto Concluído 🚀 </h4>

</div>

---

## 📝 Descrição

O **File Import Dashboard** é o frontend de uma solução completa de importação de arquivos CSV/XLSX. Construído com as tecnologias mais recentes do ecossistema React, ele oferece uma interface limpa e intuitiva (estilo SaaS) que permite aos usuários gerenciar uploads, visualizar prévias de dados e monitorar a saúde da infraestrutura de backend em tempo real.

---

## 🏗️ Arquitetura do Projeto

- **Tipo:** 🧩 Microserviços / Frontend Decoupled
- **Modelo:** Aplicação Single Page (SPA) de alto desempenho com Server Components do Next.js 15, comunicando-se de forma assíncrona com o serviço de backend via Axios e TanStack Query para gerenciamento de estado e cache.

---

## 🔥 Pré-requisitos

Para rodar o projeto localmente, você precisará de:

- **Node.js 22.x+**
- **NPM ou Yarn**
- **Backend rodando** (Consulte o repositório `file-import-service-backend`)

---

## 🚀 Tecnologias Utilizadas

- **Framework:** Next.js 15.1 (App Router)
- **Biblioteca Base:** React 19 (Experimental Features)
- **Estilização:** Tailwind CSS v4 (Sintaxe moderna `@theme`)
- **Gerenciamento de Estado & Cache:** TanStack Query v5 (React Query)
- **Animações:** Framer Motion 12
- **Ícones:** Lucide React
- **Upload:** React Dropzone
- **HTTP Client:** Axios
- **Padrões:** Components Library Pattern, Custom Hooks, Responsive Design

---

## 🔨 Funcionalidades

- **✓ Dashboard Real-time:** Acompanhamento do progresso de processamento das importações de forma dinâmica.
- **✓ Monitoramento de Saúde (Health Check):** Badge global que indica se o backend está Online/Offline com popover de diagnóstico.
- **✓ Pré-visualização de Arquivos:** Preview instantâneo dos primeiros dados do CSV/XLSX antes de iniciar o upload final.
- **✓ Configurações Avançadas:** Painel para ajuste de timeouts, limites de processamento e diagnóstico de conexão (Local vs Docker Environment).
- **✓ Feedback de Erro Profissional:** Tratamento de erros de rede silencioso, mantendo a interface estável para o usuário.
- **✓ UI/UX Premium:** Design focado em Dark Mode/Glassmorphism com micro-animações.

---

## 🎯 Sobre o Projeto

## 🎯 Sobre o Projeto

Sistema desenvolvido demonstrando as capacidades modernas do Next.js 15 e Tailwind v4. O foco foi criar uma interface resiliente que sobrevive a quedas de backend sem comprometer a navegabilidade do usuário, utilizando padrões de design de mercado e arquitetura escalável.

---

## 📸 Preview do Projeto

🚧 Preview não disponível no projeto.

---

## 📊 Documentação da UI

### 📁 Estrutura de Pastas Principais
- `src/app/dashboard`: Centro de controle de importações recentes e métricas.
- `src/app/configuracoes`: Painel de parâmetros da infraestrutura e conexões.
- `src/components/imports`: Módulo completo de upload, preview e validação.
- `src/components/ServiceStatus`: Componente sentinela de monitoramento da saúde da API.
- `src/hooks`: Lógica encapsulada para upload, preview e estado do servidor.

---

## 💻 Comandos

Siga os passos abaixo para preparar o ambiente:

### Instalação:
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### Execução:
```bash
# Iniciar servidor de desenvolvimento (HMR)
npm run dev

# Gerar build de produção
npm run build

# Iniciar aplicação em modo produção
npm run start
```

> ⚠️ Estes são comandos básicos. Verifique no projeto arquivos como:
> README.md ou COMO_EXECUTAR.md para instruções completas de configuração do backend.

---

## 🧱 Estrutura do Projeto

```text
src/
├── app/              # Rotas e Layouts (Dashboard, Configuracoes, Historico)
├── components/       # Componentes de UI Modulares (Modal, Status, Table)
├── hooks/            # Hooks customizados (useQuery, useStatus, useUpload)
├── lib/              # Configurações de API (Axios instance, services)
└── styles/           # Configuração de Temas e Tailwind v4
```

---

## 📝 Melhorias Futuras

- [ ] Implementar Modo Escuro (Dark Theme) completo.
- [ ] Adicionar sistema de filtros avançados por coluna.
- [ ] Implementar exportação de logs detalhados em PDF.
- [ ] Adicionar suporte a múltiplos idiomas (i18n).

---

<div align="center">

Feito com ❤️ por Gabriel Martins 🚀

</div>
