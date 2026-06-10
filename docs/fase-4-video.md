# Fase 4 — Chat com vídeo usando FFmpeg + Whisper

## Entrega

Esta fase adiciona upload de vídeo `.mp4`. O backend extrai o áudio do vídeo com FFmpeg e reutiliza o mesmo serviço Whisper da Fase 3 para gerar a transcrição.

## Arquivos principais

- `public/js/video.js`
- `server/routes/transcribe-video.js`
- `server/services/ffmpegService.js`
- `server/services/whisperService.js`

## Fluxo

1. O usuário envia um `.mp4`.
2. O backend salva o arquivo temporariamente.
3. O FFmpeg extrai áudio WAV mono 16 kHz.
4. O Whisper transcreve o áudio extraído.
5. O frontend guarda o texto como `videoContext`.
6. A próxima pergunta inclui o contexto do vídeo.

## Como testar

Envie um vídeo curto em `.mp4` com fala clara e pergunte:

```text
Quais pontos principais foram mencionados no vídeo?
```
