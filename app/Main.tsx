'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';

export default function AudioInput() {
  const [file, setFile] = useState<Blob | null>(null);
  const [convertedText, setConvertedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { startRecording, stopRecording, recordingBlob, isRecording } =
    useAudioRecorder();

  const sendAudio = useCallback(async () => {
    if (!file) {
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('file', file, 'audio.webm');
    data.append('model', 'whisper-1');
    data.append('language', 'en');

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: data,
    });

    const { text } = await response.json();
    setLoading(false);
    setConvertedText(text);
  }, [file]);

  useEffect(() => {
    if (recordingBlob instanceof Blob) {
      setFile(recordingBlob);
      sendAudio();
    }
  }, [recordingBlob, sendAudio]);

  return (
    <>
      <div className="p-8 flex-1 overflow-auto">
        {loading ? '...' : convertedText}
      </div>
      <div className="border-t border-zinc-300 p-8 w-full bg-zinc-50 flex justify-center">
        <button
          className="w-20 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop' : 'Record'}
        </button>
      </div>
    </>
  );
}
