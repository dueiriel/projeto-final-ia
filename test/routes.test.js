const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

test('POST /api/chat requires a prompt or messages', async () => {
  process.env.SKIP_OLLAMA_ON_TEST = '1';
  const app = require('../server/index');

  const response = await request(app)
    .post('/api/chat')
    .send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Envie uma pergunta para continuar.');
});

test('POST /api/transcribe/audio requires an uploaded file', async () => {
  const app = require('../server/index');

  const response = await request(app)
    .post('/api/transcribe/audio');

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Envie um arquivo de áudio.');
});

test('POST /api/transcribe/video requires an uploaded file', async () => {
  const app = require('../server/index');

  const response = await request(app)
    .post('/api/transcribe/video');

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Envie um arquivo de vídeo.');
});
