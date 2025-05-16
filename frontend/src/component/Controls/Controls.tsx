// 'use client';
// import { useState } from 'react';
// import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

// export const Controls = ({ meetingId }: { meetingId: string }) => {
//   const [micOn, setMicOn] = useState(true);
//   const [cameraOn, setCameraOn] = useState(true);

//   const toggleMic = () => {
//     const tracks = (window as any).localStream?.getAudioTracks();
//     if (tracks?.length) {
//       tracks[0].enabled = !tracks[0].enabled;
//       setMicOn(tracks[0].enabled);
//     }
//   };

//   const toggleCamera = () => {
//     const tracks = (window as any).localStream?.getVideoTracks();
//     if (tracks?.length) {
//       tracks[0].enabled = !tracks[0].enabled;
//       setCameraOn(tracks[0].enabled);
//     }
//   };

//   return (
//     <div className="flex justify-center gap-6 p-4 bg-gray-800 text-white rounded-t-xl">
//       <button onClick={toggleMic}>
//         {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6 text-red-500" />}
//       </button>
//       <button onClick={toggleCamera}>
//         {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6 text-red-500" />}
//       </button>
//     </div>
//   );
// };
'use client';
import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react'; // Added leave icon
import { socket } from '@/utils/socket/socket';

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

    const leaveMeeting = () => {
        // Implement your leave meeting logic here (e.g., redirect, socket emit)
        socket.emit("leave-meeting", { meetingId });
        console.log("Leaving meeting:", meetingId);
    };

    return (
        <div className="flex justify-center gap-6 p-4 bg-gray-800 text-white rounded-t-xl shadow-md">
            <button onClick={toggleMic} className="p-3 rounded-full hover:bg-gray-700">
                {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6 text-red-500" />}
            </button>
            <button onClick={toggleCamera} className="p-3 rounded-full hover:bg-gray-700">
                {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6 text-red-500" />}
            </button>
            <button onClick={leaveMeeting} className="p-3 rounded-full bg-red-500 hover:bg-red-600">
                <Phone className="w-6 h-6" />
            </button>
            {/* You can add more controls here like screen share, etc. */}
        </div>
    );
};
