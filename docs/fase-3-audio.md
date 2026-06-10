# Fase 3 — Chat com áudio usando Whisper

## Entrega

Esta fase adiciona upload de áudio. O backend recebe o arquivo, converte para WAV mono 16 kHz com FFmpeg e transcreve com `whisper.cpp`.

## Arquivos principais

- `public/js/audio.js`
- `server/routes/transcribe-audio.js`
- `server/services/ffmpegService.js`
- `server/services/whisperService.js`
- `server/uploads/.gitkeep`

## Fluxo

1. O usuário envia `.mp3`, `.mp4`, `.m4a` ou `.wav`.
2. O backend salva o arquivo em `server/uploads`.
3. O FFmpeg converte o arquivo para WAV.
4. O `whisper.cpp` gera um `.txt`.
5. O backend retorna a transcrição.
6. O frontend guarda a transcrição como `audioContext`.

## Variáveis úteis

Se o `whisper.cpp` estiver em `~/whisper.cpp`, o backend tenta detectar automaticamente o binário e o modelo. Em instalações diferentes, configure:

```bash
export WHISPER_BIN="$HOME/whisper.cpp/build/bin/whisper-cli"
export WHISPER_MODEL="$HOME/whisper.cpp/models/ggml-base.bin"
```

## Como testar

Com Ollama, FFmpeg e Whisper configurados, envie um áudio curto e pergunte:

```text
Resuma o que foi falado no áudio.
```
