const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildTemporaryWavPath,
  buildTranscriptPrefix
} = require('../server/utils/mediaPaths');

test('buildTemporaryWavPath replaces non-wav extensions with wav', () => {
  assert.equal(
    buildTemporaryWavPath('/tmp/upload/audio.m4a'),
    '/tmp/upload/audio.wav'
  );
});

test('buildTemporaryWavPath avoids in-place conversion for wav uploads', () => {
  assert.equal(
    buildTemporaryWavPath('/tmp/upload/audio.wav'),
    '/tmp/upload/audio-converted.wav'
  );
});

test('buildTranscriptPrefix creates a stable transcript prefix next to the upload', () => {
  assert.equal(
    buildTranscriptPrefix('/tmp/upload/audio.wav'),
    '/tmp/upload/audio-transcript'
  );
});
