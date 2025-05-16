'use client';
import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

export const Controls = ({ meetingId }: { meetingId: string }) => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const toggleMic = () => {
    const tracks = (window as any).localStream?.getAudioTracks();
    if (tracks?.length) {
      tracks[0].enabled = !tracks[0].enabled;
      setMicOn(tracks[0].enabled);
    }
  };

  const toggleCamera = () => {
    const tracks = (window as any).localStream?.getVideoTracks();
    if (tracks?.length) {
      tracks[0].enabled = !tracks[0].enabled;
      setCameraOn(tracks[0].enabled);
    }
  };

  return (
    <div className="flex justify-center gap-6 p-4 bg-gray-800 text-white rounded-t-xl">
      <button onClick={toggleMic}>
        {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6 text-red-500" />}
      </button>
      <button onClick={toggleCamera}>
        {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6 text-red-500" />}
      </button>
    </div>
  );
};
