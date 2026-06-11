const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildUserPrompt,
  truncateText
} = require('../server/utils/contextBuilder');

test('truncateText keeps short text unchanged', () => {
  assert.equal(truncateText('texto curto', 50), 'texto curto');
});

test('truncateText limits long text and reports omitted characters', () => {
  const result = truncateText('abcdef', 3);

  assert.equal(result, 'abc\n\n[Conteúdo truncado: 3 caracteres omitidos]');
});

test('buildUserPrompt includes only available contexts and the user question', () => {
  const prompt = buildUserPrompt({
    question: 'Qual é o assunto principal?',
    contexts: {
      pdfContext: 'Texto extraído do PDF.',
      audioContext: '',
      videoContext: 'Transcrição do vídeo.'
    },
    contextLimit: 200
  });

  assert.match(prompt, /^Você é um assistente local\./);
  assert.match(prompt, /Contexto de PDF:\nTexto extraído do PDF\./);
  assert.doesNotMatch(prompt, /Contexto de áudio:/);
  assert.match(prompt, /Contexto de vídeo:\nTranscrição do vídeo\./);
  assert.match(prompt, /Pergunta do usuário:\nQual é o assunto principal\?/);
});
