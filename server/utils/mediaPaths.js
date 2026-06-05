const path = require('node:path');

function removeExtension(filePath) {
  return filePath.replace(/\.[^.]+$/, '');
}

function buildTemporaryWavPath(inputPath) {
  const extension = path.extname(inputPath).toLowerCase();

  if (extension === '.wav') {
    return `${removeExtension(inputPath)}-converted.wav`;
  }

  return `${removeExtension(inputPath)}.wav`;
}

function buildTranscriptPrefix(inputPath) {
  return `${removeExtension(inputPath)}-transcript`;
}

module.exports = {
  buildTemporaryWavPath,
  buildTranscriptPrefix
};
