'use client';
import { useState } from 'react';

export default function AudioInput() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [convertedText, setConvertedText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const sendAudio = async () => {
    setLoading(true);
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    const { text } = await response.json();
    setLoading(false);
    setConvertedText(text);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const data = new FormData();
      data.append('file', file);
      data.append('model', 'whisper-1');
      data.append('language', 'en');
      setFormData(data);

      // check if the size is less than 25MB
      if (file.size > 25 * 1024 * 1024) {
        alert('Please upload an audio file less than 25MB');
        return;
      }
    }
  };

  return (
    <>
      <input type="file" accept="audio/*" onChange={handleFile} />
      <button onClick={sendAudio}>Send Audio</button>
      <div>{loading ? '...' : convertedText}</div>
    </>
  );
}
