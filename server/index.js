const express = require('express');
const path = require('node:path');
const chatRoute = require('./routes/chat');
const transcribeAudioRoute = require('./routes/transcribe-audio');
const transcribeVideoRoute = require('./routes/transcribe-video');

const app = express();
const publicDir = path.join(__dirname, '..', 'public');
const pdfjsDir = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(publicDir));
app.use('/vendor/pdfjs', express.static(pdfjsDir));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'local-ai-assistant' });
});

app.use('/api/chat', chatRoute);
app.use('/api/transcribe/audio', transcribeAudioRoute);
app.use('/api/transcribe/video', transcribeVideoRoute);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Local AI Assistant em http://localhost:${port}`);
  });
}

module.exports = app;
