const express = require('express');
const { buildUserPrompt } = require('../utils/contextBuilder');
const { chatWithOllama } = require('../services/ollamaService');

const router = express.Router();

function buildMessages(body) {
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    return body.messages
      .filter((message) => message && typeof message.content === 'string' && message.content.trim())
      .map((message) => ({
        role: ['system', 'assistant', 'user'].includes(message.role) ? message.role : 'user',
        content: message.content.trim()
      }));
  }

  if (typeof body.question === 'string' && body.question.trim()) {
    return [
      {
        role: 'user',
        content: buildUserPrompt({
          question: body.question,
          contexts: body.contexts || {},
          contextLimit: body.contextLimit
        })
      }
    ];
  }

  if (typeof body.prompt === 'string' && body.prompt.trim()) {
    return [
      {
        role: 'user',
        content: body.prompt.trim()
      }
    ];
  }

  return [];
}

router.post('/', async (req, res) => {
  const messages = buildMessages(req.body || {});

  if (messages.length === 0) {
    res.status(400).json({ error: 'Envie uma pergunta para continuar.' });
    return;
  }

  try {
    const response = await chatWithOllama(messages);
    res.json({ response });
  } catch (error) {
    res.status(502).json({
      error: 'Não foi possível gerar resposta com o Ollama.',
      details: error.message
    });
  }
});

module.exports = router;
