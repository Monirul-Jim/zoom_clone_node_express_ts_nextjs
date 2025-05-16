'use client';
import React, { useEffect, useRef } from 'react';

export const VideoGrid = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-black">
      <video ref={localVideoRef} autoPlay muted className="rounded-2xl w-full h-auto shadow-lg" />
      {/* More remote video tags via WebRTC */}
    </div>
  );
};
