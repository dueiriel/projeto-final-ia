const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const { runCommand } = require('../utils/runCommand');

function getWhisperBinary() {
  if (process.env.WHISPER_BIN) {
    return process.env.WHISPER_BIN;
  }

  if (process.env.WHISPER_CPP_DIR) {
    return path.join(process.env.WHISPER_CPP_DIR, 'build', 'bin', 'whisper-cli');
  }

  if (process.env.HOME) {
    const homeBinary = path.join(process.env.HOME, 'whisper.cpp', 'build', 'bin', 'whisper-cli');
    if (fsSync.existsSync(homeBinary)) {
      return homeBinary;
    }
  }

  return 'whisper-cli';
}

function getWhisperModelPath() {
  if (process.env.WHISPER_MODEL) {
    return process.env.WHISPER_MODEL;
  }

  if (process.env.HOME) {
    const homeModel = path.join(process.env.HOME, 'whisper.cpp', 'models', 'ggml-base.bin');
    if (fsSync.existsSync(homeModel)) {
      return homeModel;
    }
  }

  return path.join(process.cwd(), 'models', 'ggml-base.bin');
}

function buildWhisperArgs({ inputFile, modelPath, outputPrefix, language = 'pt' }) {
  return ['-m', modelPath, '-f', inputFile, '-l', language, '-otxt', '-of', outputPrefix];
}

async function transcribeWithWhisper(inputFile, options = {}) {
  const outputPrefix = options.outputPrefix || inputFile.replace(/\.[^.]+$/, '-transcript');
  const transcriptPath = `${outputPrefix}.txt`;
  const modelPath = options.modelPath || getWhisperModelPath();
  const binary = options.binary || getWhisperBinary();
  const language = options.language || process.env.WHISPER_LANGUAGE || 'pt';

  await runCommand(binary, buildWhisperArgs({ inputFile, modelPath, outputPrefix, language }));

  const transcription = await fs.readFile(transcriptPath, 'utf8');
  return transcription.trim();
}

module.exports = {
  buildWhisperArgs,
  getWhisperBinary,
  getWhisperModelPath,
  transcribeWithWhisper
};
