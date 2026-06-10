#!/usr/bin/env bash
set -euo pipefail

echo "Configurando dependências para macOS..."

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew não encontrado."
  echo "Instale em https://brew.sh/ e rode este script novamente."
  exit 1
fi

install_if_missing() {
  local package="$1"
  local command_name="$2"

  if command -v "$command_name" >/dev/null 2>&1; then
    echo "ok: $command_name já está instalado"
  else
    echo "instalando: $package"
    brew install "$package"
  fi
}

install_if_missing node node
install_if_missing ollama ollama
install_if_missing ffmpeg ffmpeg
install_if_missing git git
install_if_missing cmake cmake

if ! xcode-select -p >/dev/null 2>&1; then
  echo "Ferramentas de linha de comando da Apple não encontradas."
  echo "Execute: xcode-select --install"
else
  echo "ok: ferramentas de linha de comando da Apple encontradas"
fi

echo
echo "Instalando dependências Node.js..."
npm install

echo
echo "Dependências principais configuradas."
echo "Próximos passos:"
echo "1. Rode: scripts/pull-model.sh"
echo "2. Prepare o whisper.cpp conforme o README."
echo "3. Rode: npm start"
