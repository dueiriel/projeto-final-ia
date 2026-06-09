import { buildPrompt, sendPrompt } from './chat.js';
import { extractPdfText } from './pdf.js';
import { transcribeAudio } from './audio.js';
import { transcribeVideo } from './video.js';

const state = {
  pdfContext: '',
  audioContext: '',
  videoContext: '',
  history: []
};

const elements = {
  chatForm: document.querySelector('#chat-form'),
  questionInput: document.querySelector('#question-input'),
  messageList: document.querySelector('#message-list'),
  chatStatus: document.querySelector('#chat-status'),
  pdfInput: document.querySelector('#pdf-input'),
  audioInput: document.querySelector('#audio-input'),
  videoInput: document.querySelector('#video-input'),
  pdfStatus: document.querySelector('#pdf-status'),
  audioStatus: document.querySelector('#audio-status'),
  videoStatus: document.querySelector('#video-status'),
  pdfContextState: document.querySelector('#pdf-context-state'),
  audioContextState: document.querySelector('#audio-context-state'),
  videoContextState: document.querySelector('#video-context-state')
};

function setChatStatus(text, mode = 'idle') {
  elements.chatStatus.textContent = text;
  elements.chatStatus.className = `status ${mode}`;
}

function setStatusLine(element, text, mode = '') {
  element.textContent = text;
  element.className = `status-line ${mode}`.trim();
}

function addMessage(role, text) {
  const message = document.createElement('article');
  message.className = `message ${role}`;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.append(paragraph);
  elements.messageList.append(message);
  elements.messageList.scrollTop = elements.messageList.scrollHeight;
}

function updateContextStates() {
  elements.pdfContextState.textContent = state.pdfContext ? 'carregado' : 'vazio';
  elements.audioContextState.textContent = state.audioContext ? 'transcrito' : 'vazio';
  elements.videoContextState.textContent = state.videoContext ? 'transcrito' : 'vazio';
}

async function handleChatSubmit(event) {
  event.preventDefault();

  const question = elements.questionInput.value.trim();
  if (!question) {
    return;
  }

  addMessage('user', question);
  state.history.push({ role: 'user', content: question });
  elements.questionInput.value = '';
  elements.chatForm.querySelector('button').disabled = true;
  setChatStatus('Enviando pergunta...', 'busy');

  try {
    const prompt = buildPrompt(question, state);
    setChatStatus('Gerando resposta...', 'busy');
    const answer = await sendPrompt(prompt);
    addMessage('assistant', answer);
    state.history.push({ role: 'assistant', content: answer });
    setChatStatus('Pronto', 'idle');
  } catch (error) {
    addMessage('error', error.message);
    setChatStatus('Erro', 'error');
  } finally {
    elements.chatForm.querySelector('button').disabled = false;
    elements.questionInput.focus();
  }
}

async function handlePdfUpload(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  setStatusLine(elements.pdfStatus, 'Lendo PDF...');

  try {
    const result = await extractPdfText(file);
    state.pdfContext = result.text;
    const suffix = result.truncated ? ' Conteúdo truncado.' : '';
    setStatusLine(
      elements.pdfStatus,
      `PDF carregado: ${result.fileName} (${result.pagesRead}/${result.pageCount} páginas).${suffix}`,
      result.truncated ? 'warn' : 'ok'
    );
    updateContextStates();
  } catch (error) {
    state.pdfContext = '';
    setStatusLine(elements.pdfStatus, `Erro ao ler PDF: ${error.message}`, 'error');
    updateContextStates();
  }
}

async function handleAudioUpload(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  setStatusLine(elements.audioStatus, 'Transcrevendo áudio...');

  try {
    const transcription = await transcribeAudio(file);
    state.audioContext = transcription;
    setStatusLine(elements.audioStatus, `Áudio transcrito: ${file.name}`, 'ok');
    updateContextStates();
  } catch (error) {
    state.audioContext = '';
    setStatusLine(elements.audioStatus, `Erro no áudio: ${error.message}`, 'error');
    updateContextStates();
  }
}

async function handleVideoUpload(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  setStatusLine(elements.videoStatus, 'Extraindo áudio do vídeo...');

  try {
    const transcription = await transcribeVideo(file);
    state.videoContext = transcription;
    setStatusLine(elements.videoStatus, `Vídeo transcrito: ${file.name}`, 'ok');
    updateContextStates();
  } catch (error) {
    state.videoContext = '';
    setStatusLine(elements.videoStatus, `Erro no vídeo: ${error.message}`, 'error');
    updateContextStates();
  }
}

function clearContext(kind) {
  if (kind === 'pdf') {
    state.pdfContext = '';
    elements.pdfInput.value = '';
    setStatusLine(elements.pdfStatus, 'Nenhum PDF carregado');
  }

  if (kind === 'audio') {
    state.audioContext = '';
    elements.audioInput.value = '';
    setStatusLine(elements.audioStatus, 'Nenhum áudio transcrito');
  }

  if (kind === 'video') {
    state.videoContext = '';
    elements.videoInput.value = '';
    setStatusLine(elements.videoStatus, 'Nenhum vídeo transcrito');
  }

  updateContextStates();
}

function bindEvents() {
  elements.chatForm.addEventListener('submit', handleChatSubmit);
  elements.pdfInput.addEventListener('change', handlePdfUpload);
  elements.audioInput.addEventListener('change', handleAudioUpload);
  elements.videoInput.addEventListener('change', handleVideoUpload);

  document.querySelectorAll('[data-clear]').forEach((button) => {
    button.addEventListener('click', () => clearContext(button.dataset.clear));
  });
}

bindEvents();
updateContextStates();
