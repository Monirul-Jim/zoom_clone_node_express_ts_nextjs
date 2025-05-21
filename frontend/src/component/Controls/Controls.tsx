// 'use client';
// import React, { useState, useEffect } from 'react'; // Import useEffect
// import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react'; // Lucide icons
// import { socket } from '@/utils/socket/socket'; // Your existing socket connection
// import { useAppSelector } from "@/redux/hooks"; // Import useAppSelector

// interface ControlsProps {
//     meetingId: string;
// }

// export const Controls = ({ meetingId }: ControlsProps) => {
//     const token = useAppSelector((state) => state.auth.token); // Get token from Redux
//     const [micOn, setMicOn] = useState(true);
//     const [cameraOn, setCameraOn] = useState(true);
//     const [streamAvailable, setStreamAvailable] = useState(false); // New state to track stream availability

//     // Effect to check stream availability and update initial state of controls
//     useEffect(() => {
//         const checkStream = () => {
//             const localStream = (window as any).localStream as MediaStream | undefined;
//             if (localStream) {
//                 setStreamAvailable(true);
//                 const audioTracks = localStream.getAudioTracks();
//                 const videoTracks = localStream.getVideoTracks();

//                 if (audioTracks.length > 0) {
//                     setMicOn(audioTracks[0].enabled);
//                 } else {
//                     setMicOn(false); // No audio track, so mic is effectively off
//                 }

//                 if (videoTracks.length > 0) {
//                     setCameraOn(videoTracks[0].enabled);
//                 } else {
//                     setCameraOn(false); // No video track, so camera is effectively off
//                 }
//             } else {
//                 setStreamAvailable(false);
//                 setMicOn(false);
//                 setCameraOn(false);
//                 console.warn("Controls: localStream is not yet available on window.");
//             }
//         };

//         // Check immediately and then set up an interval/listener if needed
//         checkStream();
//         // You might want to listen for changes to window.localStream if it's set asynchronously
//         // For simplicity, we'll rely on MeetingRoom setting it up on mount.
//         // A more robust solution might involve passing the stream down as a prop or using context.

//     }, []); // Run once on mount

//     const toggleMic = () => {
//         const localStream = (window as any).localStream as MediaStream | undefined;
//         if (!localStream) {
//             console.error("Controls: Cannot toggle mic, localStream is not available.");
//             return;
//         }

//         const audioTracks = localStream.getAudioTracks();
//         if (audioTracks.length > 0) {
//             audioTracks[0].enabled = !audioTracks[0].enabled;
//             setMicOn(audioTracks[0].enabled);
//             console.log(`Mic ${audioTracks[0].enabled ? 'on' : 'off'} (track enabled: ${audioTracks[0].enabled})`);
//         } else {
//             console.warn("Controls: No audio tracks found in local stream to toggle.");
//         }
//     };

//     const toggleCamera = () => {
//         const localStream = (window as any).localStream as MediaStream | undefined;
//         if (!localStream) {
//             console.error("Controls: Cannot toggle camera, localStream is not available.");
//             return;
//         }

//         const videoTracks = localStream.getVideoTracks();
//         if (videoTracks.length > 0) {
//             videoTracks[0].enabled = !videoTracks[0].enabled;
//             setCameraOn(videoTracks[0].enabled);
//             console.log(`Camera ${videoTracks[0].enabled ? 'on' : 'off'} (track enabled: ${videoTracks[0].enabled})`);
//         } else {
//             console.warn("Controls: No video tracks found in local stream to toggle.");
//         }
//     };

//     const leaveMeeting = () => {
//         if (!meetingId) {
//             console.error("Cannot leave meeting: meetingId is undefined.");
//             return;
//         }
//         if (!token) {
//             console.warn("No token available. Attempting to leave meeting without authentication.");
//             // You might want to prevent leaving or show a warning to the user
//         }

//         // Emit the leave-meeting event to the server, including the token
//         socket.emit("leave-meeting", { meetingId, token });
//         console.log("Attempting to leave meeting:", meetingId);

//         // Optional: Perform client-side cleanup or redirection immediately
//         if ((window as any).localStream) {
//             (window as any).localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
//             delete (window as any).localStream; // Clean up the global reference
//         }
//         // You might want to navigate away from the meeting page here
//         // router.push('/dashboard'); // Example for Next.js App Router
//     };

//     return (
//         <div className="flex justify-center gap-6 p-4 bg-gray-800 text-white rounded-b-xl shadow-lg">
//             <button
//                 onClick={toggleMic}
//                 className={`p-3 rounded-full ${micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-700 hover:bg-red-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${!streamAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
//                 disabled={!streamAvailable} // Disable if stream is not available
//             >
//                 {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
//             </button>
//             <button
//                 onClick={toggleCamera}
//                 className={`p-3 rounded-full ${cameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-700 hover:bg-red-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${!streamAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 aria-label={cameraOn ? "Turn off camera" : "Turn on camera"}
//                 disabled={!streamAvailable} // Disable if stream is not available
//             >
//                 {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
//             </button>
//             <button
//                 onClick={leaveMeeting}
//                 className="p-3 rounded-full bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
//                 aria-label="Leave meeting"
//             >
//                 <Phone className="w-6 h-6 rotate-180" /> {/* Rotate icon to indicate hanging up */}
//             </button>
//             {/* Additional controls can be added here */}
//         </div>
//     );
// };

'use client';
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Phone, Video, VideoOff } from 'lucide-react';
import { socket } from '@/utils/socket/socket'; // connect socket connection
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeParticipant } from '@/redux/feature/meetingSlice';
interface ControlsProps {
    meetingId: string;
}
export const Controls = ({ meetingId }: ControlsProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        const localStream = (window as any).localStream as MediaStream | undefined;
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            const videoTrack = localStream.getVideoTracks()[0];
            setMicOn(audioTrack ? audioTrack.enabled : false);
            setCameraOn(videoTrack ? videoTrack.enabled : false);
        }

        // Handle meeting-ended from server
        socket.on('meeting-ended', () => {
            alert('Meeting has ended.');
            router.push('/');
        });
        socket.on('user-left', ({ userId, userName }) => {
            console.log(`${userName} (${userId}) left the meeting`);
            dispatch(removeParticipant(userId));
            // Update your participant list in Redux or component state here
            // Example: dispatch(removeParticipant(userId)) or setParticipants((prev) => prev.filter(p => p.id !== userId));
        });

        return () => {
            socket.off('meeting-ended');
            socket.off('user-left');
        };
    }, [dispatch]);

    const toggleMic = () => {
        const localStream = (window as any).localStream as MediaStream | undefined;
        if (!localStream) return;
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    };


    const toggleCamera = () => {
        const localStream = (window as any).localStream as MediaStream | undefined;
        if (!localStream) return;
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setCameraOn(videoTrack.enabled);
        }
    };

    const leaveMeeting = () => {
        if (!token) return;
        socket.emit('leave-meeting', { meetingId, token });
        router.push('/');
    };

    return (
        <div className="flex gap-4 p-4 bg-gray-800 text-white rounded">
            <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6 text-red-500" />}
            </button>
            <button onClick={toggleCamera} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6 text-red-500" />}
            </button>
            <button
                onClick={leaveMeeting}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                aria-label="Leave meeting"
            >
                <Phone className="w-6 h-6 rotate-180" /> {/* Rotate icon to indicate hanging up */}
            </button>
        </div>
    );
};
