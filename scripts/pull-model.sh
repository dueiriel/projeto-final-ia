#!/usr/bin/env bash
set -euo pipefail

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama não encontrado. Instale com Homebrew ou pelo app oficial antes de continuar."
  exit 1
fi

echo "Baixando modelo phi3..."
ollama pull phi3
echo "Modelo phi3 pronto."
