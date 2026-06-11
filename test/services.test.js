const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  buildFfmpegAudioArgs,
  buildFfmpegVideoArgs
} = require('../server/services/ffmpegService');

const {
  buildOllamaPayload
} = require('../server/services/ollamaService');

const {
  buildWhisperArgs,
  getWhisperBinary,
  getWhisperModelPath
} = require('../server/services/whisperService');

test('buildFfmpegAudioArgs converts any audio input to mono 16 kHz wav', () => {
  assert.deepEqual(
    buildFfmpegAudioArgs('/tmp/input.mp3', '/tmp/output.wav'),
    ['-y', '-i', '/tmp/input.mp3', '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', '/tmp/output.wav']
  );
});

test('buildFfmpegVideoArgs extracts mono 16 kHz wav from video', () => {
  assert.deepEqual(
    buildFfmpegVideoArgs('/tmp/video.mp4', '/tmp/video-audio.wav'),
    ['-y', '-i', '/tmp/video.mp4', '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', '/tmp/video-audio.wav']
  );
});

test('buildOllamaPayload keeps local chat deterministic and bounded', () => {
  assert.deepEqual(
    buildOllamaPayload({
      model: 'phi3',
      messages: [{ role: 'user', content: 'Olá' }]
    }),
    {
      model: 'phi3',
      messages: [{ role: 'user', content: 'Olá' }],
      stream: false,
      options: {
        temperature: 0.2,
        num_predict: 384
      }
    }
  );
});

test('buildWhisperArgs targets whisper.cpp text output in Portuguese by default', () => {
  assert.deepEqual(
    buildWhisperArgs({
      inputFile: '/tmp/audio.wav',
      modelPath: '/models/ggml-base.bin',
      outputPrefix: '/tmp/audio-transcript'
    }),
    ['-m', '/models/ggml-base.bin', '-f', '/tmp/audio.wav', '-l', 'pt', '-otxt', '-of', '/tmp/audio-transcript']
  );
});

test('getWhisperBinary auto-detects the README whisper.cpp path under HOME', () => {
  const originalEnv = { ...process.env };
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-ai-home-'));
  const binaryPath = path.join(homeDir, 'whisper.cpp', 'build', 'bin', 'whisper-cli');
  fs.mkdirSync(path.dirname(binaryPath), { recursive: true });
  fs.writeFileSync(binaryPath, '');

  delete process.env.WHISPER_BIN;
  delete process.env.WHISPER_CPP_DIR;
  process.env.HOME = homeDir;

  try {
    assert.equal(getWhisperBinary(), binaryPath);
  } finally {
    process.env = originalEnv;
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
});

test('getWhisperModelPath auto-detects the README model path under HOME', () => {
  const originalEnv = { ...process.env };
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-ai-home-'));
  const modelPath = path.join(homeDir, 'whisper.cpp', 'models', 'ggml-base.bin');
  fs.mkdirSync(path.dirname(modelPath), { recursive: true });
  fs.writeFileSync(modelPath, '');

  delete process.env.WHISPER_MODEL;
  process.env.HOME = homeDir;

  try {
    assert.equal(getWhisperModelPath(), modelPath);
  } finally {
    process.env = originalEnv;
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
});

test('getWhisperBinary falls back to whisper-cli when HOME path is missing', () => {
  const originalEnv = { ...process.env };
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-ai-home-'));
  delete process.env.WHISPER_BIN;
  delete process.env.WHISPER_CPP_DIR;
  process.env.HOME = homeDir;

  try {
    assert.equal(getWhisperBinary(), 'whisper-cli');
  } finally {
    process.env = originalEnv;
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
});

test('getWhisperModelPath falls back to project model path when HOME model is missing', () => {
  const originalEnv = { ...process.env };
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-ai-home-'));
  delete process.env.WHISPER_MODEL;
  process.env.HOME = homeDir;

  try {
    assert.equal(getWhisperModelPath(), path.join(process.cwd(), 'models', 'ggml-base.bin'));
  } finally {
    process.env = originalEnv;
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
});
