export async function transcribeVideo(file) {
  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch('/api/transcribe/video', {
    method: 'POST',
    body: formData
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Não foi possível transcrever o vídeo.');
  }

  return payload.transcription || '';
}
