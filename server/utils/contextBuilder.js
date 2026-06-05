const DEFAULT_CONTEXT_LIMIT = 12000;

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function truncateText(text, maxChars = DEFAULT_CONTEXT_LIMIT) {
  const normalized = normalizeText(text);
  const safeLimit = Number.isFinite(maxChars) && maxChars > 0 ? maxChars : DEFAULT_CONTEXT_LIMIT;

  if (normalized.length <= safeLimit) {
    return normalized;
  }

  const omitted = normalized.length - safeLimit;
  return `${normalized.slice(0, safeLimit)}\n\n[Conteúdo truncado: ${omitted} caracteres omitidos]`;
}

function buildUserPrompt({ question, contexts = {}, contextLimit = DEFAULT_CONTEXT_LIMIT }) {
  const cleanQuestion = normalizeText(question);
  const sections = [
    'Você é um assistente local. Responda em português, de forma clara e objetiva.'
  ];

  const contextMap = [
    ['pdfContext', 'Contexto de PDF'],
    ['audioContext', 'Contexto de áudio'],
    ['videoContext', 'Contexto de vídeo']
  ];

  for (const [key, label] of contextMap) {
    const value = normalizeText(contexts[key]);
    if (value) {
      sections.push(`${label}:\n${truncateText(value, contextLimit)}`);
    }
  }

  sections.push(`Pergunta do usuário:\n${cleanQuestion}`);

  return sections.join('\n\n');
}

module.exports = {
  DEFAULT_CONTEXT_LIMIT,
  buildUserPrompt,
  truncateText
};
