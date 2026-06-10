# Local AI Assistant

Assistente de IA local em quatro fases incrementais: chat com Phi-3/Ollama, chat com PDF via PDF.js, chat com áudio via Whisper e chat com vídeo usando FFmpeg + Whisper.

O projeto foi pensado para macOS, usa interface web simples em HTML/CSS/JavaScript puro e backend local em Node.js com Express.

## Objetivo

Entregar um assistente acadêmico funcional, local, sem API paga e pronto para publicar no GitHub. O usuário pode conversar normalmente ou carregar PDF, áudio e vídeo para usar como contexto nas respostas.

## Fases implementadas

| Fase | Recurso | Status |
| --- | --- | --- |
| 1 | Chat local com Phi-3 usando Ollama | Implementada |
| 2 | Upload de PDF e extração de texto com PDF.js | Implementada |
| 3 | Upload de áudio e transcrição com whisper.cpp | Implementada |
| 4 | Upload de vídeo, extração de áudio com FFmpeg e transcrição | Implementada |

## Tecnologias utilizadas

- Frontend: HTML, CSS e JavaScript puro
- Backend: Node.js, Express e Multer
- LLM local: Ollama com modelo `phi3`
- PDF: PDF.js pelo pacote `pdfjs-dist`
- Áudio: `whisper.cpp`
- Vídeo: FFmpeg
- Testes: `node --test` e Supertest

## Requisitos para macOS

- Homebrew
- Node.js 18 ou superior
- npm
- Git
- Ollama
- FFmpeg
- CMake e ferramentas de linha de comando da Apple para compilar o `whisper.cpp`

Valide os requisitos principais com:

```bash
bash scripts/check-requirements.sh
```

## Instalação passo a passo

```bash
git clone https://github.com/SEU_USUARIO/local-ai-assistant.git
cd local-ai-assistant
bash scripts/setup-macos.sh
```

Se já tiver Node.js e as dependências instaladas:

```bash
npm install
```

## Como instalar e iniciar o Ollama

Opção com Homebrew:

```bash
brew install ollama
ollama serve
```

Outra opção é instalar pelo site oficial: `https://ollama.com`.

Em outro terminal, teste:

```bash
ollama list
```

## Como baixar o modelo Phi-3

```bash
bash scripts/pull-model.sh
```

Ou diretamente:

```bash
ollama pull phi3
```

## Como instalar FFmpeg

```bash
brew install ffmpeg
ffmpeg -version
```

## Como configurar Whisper

Este projeto usa `whisper.cpp` por ser leve e adequado para rodar localmente no macOS.

```bash
cd ~
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
cmake -B build
cmake --build build -j
bash models/download-ggml-model.sh base
```

Configure as variáveis antes de iniciar o servidor:

```bash
export WHISPER_BIN="$HOME/whisper.cpp/build/bin/whisper-cli"
export WHISPER_MODEL="$HOME/whisper.cpp/models/ggml-base.bin"
```

Se você seguiu exatamente os comandos acima, o backend também tenta detectar automaticamente esses caminhos em `~/whisper.cpp`.

Se sua versão do `whisper.cpp` gerar outro binário, ajuste `WHISPER_BIN` para o caminho correto.

## Como rodar o projeto

Inicie o Ollama:

```bash
ollama serve
```

Em outro terminal:

```bash
cd local-ai-assistant
npm start
```

Abra:

```text
http://localhost:3000
```

Durante desenvolvimento:

```bash
npm run dev
```

## Como testar cada fase

### Fase 1

1. Rode `ollama serve`.
2. Rode `ollama pull phi3`.
3. Inicie o app com `npm start`.
4. Pergunte: `O que é IA local?`

### Fase 2

1. Abra a interface.
2. Carregue `examples/sample.pdf`.
3. Pergunte: `Qual é o assunto do PDF?`

### Fase 3

1. Configure `WHISPER_BIN` e `WHISPER_MODEL`.
2. Carregue um áudio curto `.mp3`, `.m4a`, `.wav` ou `.mp4`.
3. Pergunte: `Resuma o áudio.`

### Fase 4

1. Configure FFmpeg e Whisper.
2. Carregue um vídeo `.mp4` curto.
3. Pergunte: `Quais informações aparecem no vídeo?`

## Estrutura do repositório

```text
local-ai-assistant/
├── README.md
├── .gitignore
├── package.json
├── package-lock.json
├── server/
│   ├── index.js
│   ├── routes/
│   │   ├── chat.js
│   │   ├── transcribe-audio.js
│   │   └── transcribe-video.js
│   ├── services/
│   │   ├── ollamaService.js
│   │   ├── whisperService.js
│   │   └── ffmpegService.js
│   ├── utils/
│   └── uploads/
│       └── .gitkeep
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── chat.js
│   │   ├── pdf.js
│   │   ├── audio.js
│   │   └── video.js
│   └── vendor/
│       └── pdfjs/
├── scripts/
│   ├── setup-macos.sh
│   ├── pull-model.sh
│   └── check-requirements.sh
├── docs/
│   ├── fase-1-chat-local.md
│   ├── fase-2-pdf.md
│   ├── fase-3-audio.md
│   └── fase-4-video.md
├── examples/
│   ├── sample.pdf
│   ├── sample-audio-placeholder.txt
│   └── sample-video-placeholder.txt
└── test/
    ├── contextBuilder.test.js
    ├── mediaPaths.test.js
    ├── routes.test.js
    └── services.test.js
```

## Comportamento de contexto

O frontend mantém três contextos em memória:

- `pdfContext`
- `audioContext`
- `videoContext`

Quando o usuário faz uma pergunta, o prompt inclui apenas os contextos disponíveis:

```text
Você é um assistente local. Responda em português, de forma clara e objetiva.

Contexto de PDF:
[texto do PDF se existir]

Contexto de áudio:
[transcrição do áudio se existir]

Contexto de vídeo:
[transcrição do vídeo se existir]

Pergunta do usuário:
[pergunta]
```

Cada contexto é truncado para evitar prompts grandes demais.

## Testes automatizados

```bash
npm test
```

Os testes cobrem:

- Montagem e truncamento de contexto.
- Geração de caminhos temporários para mídia.
- Argumentos usados em FFmpeg e Whisper.
- Contratos básicos dos endpoints locais.

## Troubleshooting

### `Não foi possível gerar resposta com o Ollama`

Verifique se o Ollama está rodando:

```bash
ollama serve
```

Depois confirme se o modelo existe:

```bash
ollama list
ollama pull phi3
```

### `ffmpeg não encontrado`

Instale com:

```bash
brew install ffmpeg
```

### `whisper-cli não encontrado`

Configure:

```bash
export WHISPER_BIN="$HOME/whisper.cpp/build/bin/whisper-cli"
```

### `modelo Whisper não encontrado`

Baixe pelo `whisper.cpp` e configure:

```bash
export WHISPER_MODEL="$HOME/whisper.cpp/models/ggml-base.bin"
```

### PDF muito grande

A aplicação lê até 8 páginas e limita o texto para manter o prompt viável. Use PDFs menores ou divida o conteúdo.

### Upload falhou

Verifique os formatos aceitos:

- PDF: `.pdf`
- Áudio: `.mp3`, `.mp4`, `.m4a`, `.wav`
- Vídeo: `.mp4`

## Checklist de entrega

- [x] Fase 1: Chat local funcionando com Phi-3/Ollama.
- [x] Fase 2: Upload de PDF e perguntas sobre o conteúdo.
- [x] Fase 3: Upload/transcrição de áudio e perguntas sobre o conteúdo.
- [x] Fase 4: Upload de vídeo, extração de áudio, transcrição e perguntas sobre o conteúdo.
- [x] README completo.
- [x] Scripts para macOS.
- [x] `.gitignore` com uploads, modelos e binários ignorados.
- [x] Repositório pronto para GitHub.
- [x] Projeto testado no macOS com Ollama, FFmpeg e Whisper instalados.

## Roteiro sugerido para vídeo demonstrativo de 3 minutos

1. Mostrar a estrutura do repositório e explicar as quatro fases.
2. Rodar `scripts/check-requirements.sh`.
3. Mostrar `ollama list` com o modelo `phi3`.
4. Iniciar `npm start` e abrir `http://localhost:3000`.
5. Fazer uma pergunta simples no chat.
6. Carregar um PDF e perguntar sobre o conteúdo.
7. Carregar um áudio curto e mostrar a transcrição.
8. Carregar um vídeo curto e mostrar a transcrição.
9. Encerrar mostrando o README e o checklist.

## Comandos Git para subir no GitHub

```bash
git init
git add .
git commit -m "feat: implement local ai assistant"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/local-ai-assistant.git
git push -u origin main
```

Com GitHub CLI:

```bash
gh repo create SEU_USUARIO/local-ai-assistant --public --source=. --remote=origin --push
```
