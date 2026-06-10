#!/usr/bin/env bash
set -euo pipefail

missing=0

check_command() {
  local command_name="$1"

  if command -v "$command_name" >/dev/null 2>&1; then
    echo "ok: $command_name encontrado em $(command -v "$command_name")"
  else
    echo "erro: $command_name não encontrado"
    missing=1
  fi
}

echo "Validando requisitos principais..."
check_command node
check_command npm
check_command ollama
check_command ffmpeg
check_command git

echo
echo "Validando Whisper local..."
if [ -n "${WHISPER_BIN:-}" ] && [ -x "$WHISPER_BIN" ]; then
  echo "ok: WHISPER_BIN=$WHISPER_BIN"
elif [ -x "$HOME/whisper.cpp/build/bin/whisper-cli" ]; then
  echo "ok: whisper-cli encontrado em $HOME/whisper.cpp/build/bin/whisper-cli"
elif command -v whisper-cli >/dev/null 2>&1; then
  echo "ok: whisper-cli encontrado em $(command -v whisper-cli)"
else
  echo "aviso: whisper-cli não encontrado. Configure WHISPER_BIN após compilar o whisper.cpp."
fi

if [ -n "${WHISPER_MODEL:-}" ] && [ -f "$WHISPER_MODEL" ]; then
  echo "ok: WHISPER_MODEL=$WHISPER_MODEL"
elif [ -f "$HOME/whisper.cpp/models/ggml-base.bin" ]; then
  echo "ok: modelo Whisper encontrado em $HOME/whisper.cpp/models/ggml-base.bin"
elif [ -f "models/ggml-base.bin" ]; then
  echo "ok: modelo Whisper encontrado em models/ggml-base.bin"
else
  echo "aviso: modelo Whisper não encontrado. Baixe um modelo ggml pelo whisper.cpp."
fi

if [ "$missing" -ne 0 ]; then
  echo
  echo "Instale os requisitos faltantes antes de rodar todas as fases."
  exit 1
fi

echo
echo "Requisitos principais encontrados."
