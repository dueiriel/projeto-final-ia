# Fase 1 — Chat local com Phi-3/Ollama

## Entrega

Esta fase cria o chat web básico. O usuário digita uma pergunta, o frontend envia a mensagem para o backend Express e o backend chama o Ollama local usando o modelo `phi3`.

## Arquivos principais

- `public/index.html`
- `public/js/app.js`
- `public/js/chat.js`
- `server/routes/chat.js`
- `server/services/ollamaService.js`

## Fluxo

1. O usuário escreve a pergunta na interface.
2. O frontend monta o prompt em português.
3. O frontend chama `POST /api/chat`.
4. O backend envia a conversa para `http://localhost:11434/api/chat`.
5. A resposta do Phi-3 aparece no histórico.

## Como testar

```bash
ollama serve
ollama pull phi3
npm start
```

Abra `http://localhost:3000` e envie uma pergunta simples, como:

```text
Explique em uma frase o que é inteligência artificial local.
```
