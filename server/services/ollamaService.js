const DEFAULT_OLLAMA_HOST = 'http://localhost:11434';
const DEFAULT_MODEL = 'phi3';

function getOllamaHost() {
  return (process.env.OLLAMA_HOST || DEFAULT_OLLAMA_HOST).replace(/\/$/, '');
}

function getOllamaModel() {
  return process.env.OLLAMA_MODEL || DEFAULT_MODEL;
}

function buildOllamaPayload({ model, messages }) {
  return {
    model,
    messages,
    stream: false,
    options: {
      temperature: 0.2,
      num_predict: 384
    }
  };
}

async function chatWithOllama(messages, options = {}) {
  const host = options.host || getOllamaHost();
  const model = options.model || getOllamaModel();
  const response = await fetch(`${host}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildOllamaPayload({ model, messages }))
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Ollama respondeu com status ${response.status}: ${details}`);
  }

  const data = await response.json();
  const content = data?.message?.content || data?.response;

  if (!content) {
    throw new Error('Ollama não retornou uma resposta textual.');
  }

  return content.trim();
}

module.exports = {
  buildOllamaPayload,
  chatWithOllama,
  getOllamaHost,
  getOllamaModel
};
