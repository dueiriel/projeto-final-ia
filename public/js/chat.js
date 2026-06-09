const DEFAULT_CONTEXT_LIMIT = 12000;

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function truncateText(text, maxChars = DEFAULT_CONTEXT_LIMIT) {
  const normalized = cleanText(text);
  const safeLimit = Number.isFinite(maxChars) && maxChars > 0 ? maxChars : DEFAULT_CONTEXT_LIMIT;

  if (normalized.length <= safeLimit) {
    return normalized;
  }

  const omitted = normalized.length - safeLimit;
  return `${normalized.slice(0, safeLimit)}\n\n[Conteúdo truncado: ${omitted} caracteres omitidos]`;
}

export function buildPrompt(question, contexts, contextLimit = DEFAULT_CONTEXT_LIMIT) {
  const sections = [
    'Você é um assistente local. Responda em português, de forma clara e objetiva.'
  ];

  const availableContexts = [
    ['pdfContext', 'Contexto de PDF'],
    ['audioContext', 'Contexto de áudio'],
    ['videoContext', 'Contexto de vídeo']
  ];

  for (const [key, label] of availableContexts) {
    const value = cleanText(contexts[key]);
    if (value) {
      sections.push(`${label}:\n${truncateText(value, contextLimit)}`);
    }
  }

  sections.push(`Pergunta do usuário:\n${cleanText(question)}`);
  return sections.join('\n\n');
}

export async function sendPrompt(prompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Não foi possível gerar resposta.');
  }

  return payload.response;
}
