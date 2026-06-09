import { truncateText } from './chat.js';
import * as pdfjsLib from '/vendor/pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.mjs';

export async function extractPdfText(file, options = {}) {
  const maxPages = options.maxPages || 8;
  const maxChars = options.maxChars || 12000;
  const buffer = await file.arrayBuffer();
  const document = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pagesToRead = Math.min(document.numPages, maxPages);
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pagesToRead; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(' ');
    pageTexts.push(text);
  }

  const combinedText = pageTexts.join('\n\n');
  const truncatedText = truncateText(combinedText, maxChars);
  const truncatedByPages = document.numPages > pagesToRead;
  const truncatedByChars = combinedText.trim().length > maxChars;

  return {
    text: truncatedText,
    fileName: file.name,
    pageCount: document.numPages,
    pagesRead: pagesToRead,
    truncated: truncatedByPages || truncatedByChars
  };
}
