# Fase 2 — Chat com PDF usando PDF.js

## Entrega

Esta fase adiciona upload de PDF no navegador. O texto é extraído com PDF.js e guardado em memória no frontend como `pdfContext`.

## Arquivos principais

- `public/js/pdf.js`
- `public/js/app.js`
- `public/vendor/pdfjs/README.md`
- `server/index.js`

## Fluxo

1. O usuário seleciona um arquivo `.pdf`.
2. O navegador lê o arquivo com PDF.js.
3. O texto das primeiras páginas é extraído.
4. O conteúdo é limitado para evitar prompts grandes.
5. A próxima pergunta inclui o contexto do PDF.

## Limites

- Leitura padrão: até 8 páginas.
- Contexto padrão: até 12.000 caracteres.
- A interface avisa quando o conteúdo é truncado.

## Como testar

Use `examples/sample.pdf` ou outro PDF pequeno. Depois pergunte:

```text
Qual é o tema principal do PDF?
```
