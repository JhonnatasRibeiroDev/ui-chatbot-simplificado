# UI Chatbot Simplificado

Interface web do projeto **Chatbot Simplificado Multiusuário**, desenvolvida para permitir que diferentes usuários conversem com um chatbot baseado em LLM, cada um com sua própria sessão de conversa.

A aplicação se comunica com a API backend para criar sessões, enviar mensagens, receber respostas do chatbot e exibir o histórico da conversa na tela.

---

## Objetivo

O objetivo deste frontend é fornecer uma interface simples, funcional e intuitiva para interação com o chatbot.

A UI é responsável por:

- Criar ou recuperar uma sessão de usuário;
- Enviar mensagens para a API;
- Exibir mensagens do usuário e respostas do chatbot;
- Mostrar estado de carregamento enquanto a resposta é processada;
- Tratar erros de comunicação com o backend;
- Permitir iniciar uma nova conversa;
- Exibir o histórico da sessão atual.

---

## Repositório da API

Este frontend depende da API backend do projeto.

```txt
https://github.com/JhonnatasRibeiroDev/llm-rag-group
