const { runCommand } = require('../utils/runCommand');

function buildFfmpegAudioArgs(inputFile, outputFile) {
  return ['-y', '-i', inputFile, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', outputFile];
}

function buildFfmpegVideoArgs(inputFile, outputFile) {
  return buildFfmpegAudioArgs(inputFile, outputFile);
}

async function convertAudioToWav(inputFile, outputFile) {
  await runCommand('ffmpeg', buildFfmpegAudioArgs(inputFile, outputFile));
  return outputFile;
}

async function extractAudioFromVideo(inputFile, outputFile) {
  await runCommand('ffmpeg', buildFfmpegVideoArgs(inputFile, outputFile));
  return outputFile;
}

module.exports = {
  buildFfmpegAudioArgs,
  buildFfmpegVideoArgs,
  convertAudioToWav,
  extractAudioFromVideo
};
