# Passo a Passo para Execução do Frontend

Este guia explica como subir a interface administrativa de importação.

## 1. Pré-requisitos
- Node.js v20 ou superior
- Gerenciador de pacotes `npm`
- Backend rodando em `http://localhost:3001`

## 2. Configuração do Ambiente
Copie o arquivo de exemplo para o seu próprio `.env`:
```bash
cp .env.example .env
```
Certifique-se de que `NEXT_PUBLIC_API_URL` está apontando para o seu backend.

## 3. Instalação e Execução
Instale as dependências e inicie o servidor de desenvolvimento:
```bash
npm install
npm run dev
```
Acesse a interface em `http://localhost:3000`.

## 4. Funcionalidades disponíveis
- **Dashboard**: Visão geral de métricas.
- **Nova Importação**: Botão para upload de arquivos (Drag & Drop).
- **Pré-visualização**: Visualização dos headers e dados antes de confirmar.
- **Detalhes da Importação**: Clique em "Ver Detalhes" para ver logs em tempo real e erros por linha.

## 5. Problemas comuns
- **Erro de CORS**: Certifique-se que o backend está configurado para permitir `http://localhost:3000`.
- **Backend Offline**: Se o dashboard mostrar "Erro ao carregar", verifique se o serviço de backend está rodando.
