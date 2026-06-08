const express = require('express');
const path = require('node:path');
const multer = require('multer');
const { randomUUID } = require('node:crypto');
const { convertAudioToWav } = require('../services/ffmpegService');
const { transcribeWithWhisper } = require('../services/whisperService');
const { createFileFilter } = require('../utils/fileValidation');
const { removeFiles } = require('../utils/cleanup');
const { buildTemporaryWavPath, buildTranscriptPrefix } = require('../utils/mediaPaths');

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
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: createFileFilter(['.mp3', '.mp4', '.m4a', '.wav'], 'Arquivo de áudio')
});

function handleUpload(req, res, next) {
  upload.single('audio')(req, res, (error) => {
    if (error) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Arquivo de áudio muito grande. O limite é 50 MB.'
        : error.message;
      res.status(400).json({ error: message });
      return;
    }
    next();
  });
}

router.post('/', handleUpload, async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Envie um arquivo de áudio.' });
    return;
  }

  const inputPath = req.file.path;
  const wavPath = buildTemporaryWavPath(inputPath);
  const outputPrefix = buildTranscriptPrefix(inputPath);
  const transcriptPath = `${outputPrefix}.txt`;

  try {
    await convertAudioToWav(inputPath, wavPath);
    const transcription = await transcribeWithWhisper(wavPath, { outputPrefix });
    res.json({ transcription });
  } catch (error) {
    res.status(500).json({
      error: 'Não foi possível transcrever o áudio.',
      details: error.message
    });
  } finally {
    await removeFiles([inputPath, wavPath, transcriptPath]);
  }
});

module.exports = router;
