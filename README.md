# UI Chatbot Simplificado 💬✨

Esta é a interface web (frontend) do projeto **Chatbot Simplificado Multiusuário**, desenvolvida em **React** + **Vite** + **TypeScript** e estilizada com **Tailwind CSS**. A aplicação oferece uma interface fluida, moderna e responsiva para que diferentes usuários possam interagir com um chatbot baseado em Large Language Models (LLM), mantendo o histórico de suas respectivas sessões de conversa.

O frontend se comunica com a API backend para gerenciar sessões, enviar mensagens, receber respostas e exibir o fluxo da conversa em tempo real.

---

## 🚀 Funcionalidades

- **Interface Moderna e Responsiva**: Design premium com suporte a temas (Claro/Escuro) e micro-transições suaves.
- **Sessões Independentes**: Criação, persistência e troca de sessões de chat.
- **Histórico de Conversa**: Carregamento automático do histórico de mensagens da sessão ativa.
- **Feedback Visual**: Indicadores de digitação e estados de carregamento (*loading screens*).
- **Tratamento de Erros**: Feedback amigável em caso de falhas de comunicação com a API backend.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite** (Build Tool e Servidor de Desenvolvimento super rápido)
- **TypeScript**
- **Tailwind CSS v4** (Estilização moderna)
- **Lucide React** (Pacote de ícones)

---

## 📋 Pré-requisitos

Para rodar este projeto localmente, você precisará ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior recomendada)
- Um gerenciador de pacotes: **npm** ou **pnpm**

---

## ⚙️ Configuração do Ambiente

1. Clone o repositório em sua máquina:
   ```bash
   git clone https://github.com/JhonnatasRibeiroDev/ui-chatbot-simplificado.git
   cd ui-chatbot-simplificado
   ```

2. Crie o arquivo `.env` na raiz do projeto com base no modelo `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Abra o arquivo `.env` e configure o endereço do seu backend (e outras variáveis necessárias):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

> [!IMPORTANT]
> Certifique-se de que a API backend está rodando e acessível no endereço configurado na variável `VITE_API_URL`.

---

## 🏃 Como Executar o Projeto

Você pode rodar o projeto utilizando **npm** ou **pnpm**. Escolha o seu gerenciador de pacotes preferido e siga as instruções abaixo:

### Com NPM

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar o servidor de desenvolvimento
npm run dev

# 3. Gerar a build de produção (opcional)
npm run build

# 4. Pré-visualizar a build de produção localmente (opcional)
npm run preview
```

### Com PNPM

```bash
# 1. Instalar as dependências
pnpm install

# 2. Rodar o servidor de desenvolvimento
pnpm run dev

# 3. Gerar a build de produção (opcional)
pnpm run build

# 4. Pré-visualizar a build de produção localmente (opcional)
pnpm run preview
```

Após iniciar o servidor de desenvolvimento, a aplicação estará disponível por padrão no endereço: [http://localhost:5173](http://localhost:5173) (ou na porta indicada no seu terminal).

---

## 🔌 Integração com o Backend

Este frontend depende da API backend do projeto para funcionar corretamente. Certifique-se de que o backend esteja ativo antes de testar a interface.

- **Repositório da API**: [llm-rag-group](https://github.com/JhonnatasRibeiroDev/llm-rag-group)
