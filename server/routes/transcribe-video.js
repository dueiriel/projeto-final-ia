const express = require('express');
const path = require('node:path');
const multer = require('multer');
const { randomUUID } = require('node:crypto');
const { extractAudioFromVideo } = require('../services/ffmpegService');
const { transcribeWithWhisper } = require('../services/whisperService');
const { createFileFilter } = require('../utils/fileValidation');
const { removeFiles } = require('../utils/cleanup');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024
  },
  fileFilter: createFileFilter(['.mp4'], 'Arquivo de vídeo')
});

function handleUpload(req, res, next) {
  upload.single('video')(req, res, (error) => {
    if (error) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Arquivo de vídeo muito grande. O limite é 200 MB.'
        : error.message;
      res.status(400).json({ error: message });
      return;
    }
    next();
  });
}

router.post('/', handleUpload, async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Envie um arquivo de vídeo.' });
    return;
  }

  const inputPath = req.file.path;
  const wavPath = inputPath.replace(/\.[^.]+$/, '.wav');
  const outputPrefix = inputPath.replace(/\.[^.]+$/, '-transcript');
  const transcriptPath = `${outputPrefix}.txt`;

  try {
    await extractAudioFromVideo(inputPath, wavPath);
    const transcription = await transcribeWithWhisper(wavPath, { outputPrefix });
    res.json({ transcription });
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível transcrever o vídeo.',
      details: error.message
    });
  } finally {
    await removeFiles([inputPath, wavPath, transcriptPath]);
  }
});

module.exports = router;
