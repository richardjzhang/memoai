'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';

export default function AudioInput() {
  const [audioTrack, setAudioTrack] = useState<number>(1);
  const [convertedText, setConvertedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { startRecording, stopRecording, recordingBlob, isRecording } =
    useAudioRecorder();

  const sendAudio = useCallback(
    async (recordingBlob: Blob | null) => {
      if (!recordingBlob) {
        return;
      }

      setLoading(true);
      const data = new FormData();
      data.append('file', recordingBlob, `audio-${audioTrack}.webm`);
      data.append('model', 'whisper-1');
      data.append('language', 'en');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: data,
      });

      const { text } = await response.json();
      setLoading(false);
      setConvertedText(text);
      setAudioTrack((track) => track + 1);
    },
    [audioTrack],
  );

  useEffect(() => {
    if (recordingBlob) {
      sendAudio(recordingBlob);
    }
  }, [recordingBlob]);

  return (
    <>
      <div className="p-8 flex-1 overflow-auto">
        {loading ? '...' : convertedText}
      </div>
      <div className="border-t border-zinc-300 p-8 w-full bg-zinc-50 flex justify-center space-x-4">
        <button
          className="w-20 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop' : 'Record'}
        </button>
        <button
          className="w-20 py-2 rounded bg-violet-500 text-white font-medium hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!convertedText}
          onClick={() => navigator.clipboard.writeText(convertedText)}
        >
          Copy
        </button>
      </div>
    </>
  );
}
