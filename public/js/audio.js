export async function transcribeAudio(file) {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await fetch('/api/transcribe/audio', {
    method: 'POST',
    body: formData
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Não foi possível transcrever o áudio.');
  }

  return payload.transcription || '';
}
