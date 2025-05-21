'use client';
import { useAppSelector } from '@/redux/hooks';
import { socket } from '@/utils/socket/socket';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type Participant = {
  _id: string;
  firstName: string;
  lastName: string;
  // If you integrate WebRTC for remote video, you'd add a stream property here:
  // stream?: MediaStream | null;
};

export const VideoGrid = () => {
  const params = useParams();
  // Ensure meetingId is a string, handling potential array type from catch-all routes
  const meetingId = Array.isArray(params.meetingId) ? params.meetingId[0] : params.meetingId;
  const token = useAppSelector((state) => state.auth.token);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [userId, setUserId] = useState<string | null>(null); // to identify local user
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Effect to get the local user ID from the token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload._id);
      } catch (err) {
        console.error("VideoGrid: Failed to decode token", err);
      }
    }
  }, [token]);

  // Effect to get user media (local video/audio)
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(mediaStream => {
        stream = mediaStream;
        (window as any).localStream = stream; // Make local stream globally accessible for Controls
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(error => {
        console.error("VideoGrid: Error accessing media devices:", error);
        // Inform the user about the error (e.g., "Permission denied")
      });

    // Cleanup for local stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      if ((window as any).localStream) {
        delete (window as any).localStream;
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Effect to handle Socket.IO events for participants list
  useEffect(() => {
    if (!meetingId || !token) {
      console.warn("VideoGrid: Meeting ID or token not available for Socket.IO operations.");
      return;
    }

    // Emit 'join-meeting' when component mounts and meetingId/token are available.
    // This will trigger the server to send the initial 'participants' list.
    socket.emit('join-meeting', { meetingId, token });
    console.log(`VideoGrid: Emitting 'join-meeting' for meetingId: ${meetingId}`);

    // Listen for 'participants' event to update the list of users in the meeting.
    // This event is emitted by the server on join and leave, providing real-time updates.
    socket.on('participants', (data: Participant[]) => {
      console.log("VideoGrid: Received updated participants:", data);
      setParticipants(data);
    });

    // Listen for 'user-left' event for additional logging/feedback,
    // though the 'participants' event is the primary source for UI updates.
    socket.on('user-left', ({ userId: leftUserId, userName }) => {
        console.log(`VideoGrid: ${userName} (${leftUserId}) explicitly left the meeting.`);
        // The 'participants' event will handle the actual removal from the list.
    });

    // Cleanup Socket.IO listeners when component unmounts or dependencies change
    return () => {
      socket.off('participants');
      socket.off('user-left');
      // Do NOT disconnect the main socket here if it's used elsewhere in the app.
      // socket.disconnect(); // Only if this component is the sole manager of the socket lifecycle
    };
  }, [meetingId, token]); // Re-run if meetingId or token changes

  // Filter out the local user from the `participants` state if they are already displayed via localVideoRef
  // This ensures the local user's video is rendered separately and not duplicated by the participants map.
  const remoteParticipants = participants.filter(p => p._id !== userId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {/* Local User's Video */}
      {userId && ( // Only render local video if userId is known
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-800 text-white aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline // Important for mobile browsers
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-xs rounded px-2 py-1">
            You
          </div>
        </div>
      )}

      {/* Remote Participants' Placeholders (or actual video if WebRTC is integrated) */}
      {remoteParticipants.map((participant) => (
        <div
          key={participant._id}
          className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-800 text-white aspect-video"
        >
          {/*
            IMPORTANT: For real-time video from remote participants, you need WebRTC.
            This placeholder div would be replaced by a <video> tag whose srcObject
            is set to the remote participant's MediaStream (received via RTCPeerConnection.ontrack).
          */}
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-700 p-4 text-center">
            <svg className="w-12 h-12 mb-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            <span className="text-lg font-semibold">
              {participant.firstName} {participant.lastName}
            </span>
            <span className="text-sm text-gray-400 mt-1">Waiting for video...</span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-xs rounded px-2 py-1">
            {participant.firstName} {participant.lastName}
          </div>
        </div>
      ))}
    </div>
  );
};

// 'use client';
// import { useAppSelector } from '@/redux/hooks';
// import { socket } from '@/utils/socket/socket';
// import { useParams } from 'next/navigation';
// import React, { useEffect, useRef, useState } from 'react';

// type Participant = {
//   _id: string;
//   firstName: string;
//   lastName: string;
// };

// export const VideoGrid = () => {
//   const params = useParams();
//   const { meetingId } = params as { meetingId: string };
//   const token = useAppSelector((state) => state.auth.token);
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [userId, setUserId] = useState<string | null>(null); // to identify local user
//   const localVideoRef = useRef<HTMLVideoElement>(null);

//   // Fetch participants via socket
//   useEffect(() => {
//     if (!meetingId || !token) return;

//     socket.emit('get-participants', { meetingId, token });

//     socket.on('participants', (data: Participant[]) => {
//       setParticipants(data);
//     });
    

//     // Optional: Get user ID from token
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       setUserId(payload._id);
//     } catch (err) {
//       console.error("Failed to decode token");
//     }

//     return () => {
//       socket.off('participants');
//     };
//   }, [meetingId, token]);

//   // Get user media and attach to local video
//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
//       (window as any).localStream = stream;
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//     }).catch(error => {
//       console.error("Error accessing media devices:", error);
//     });
//   }, []);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//       {participants.map((participant) => (
//         <div
//           key={participant._id}
//           className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-800 text-white h-64"
//         >
//           {participant._id === userId ? (
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gray-700">
//               <span className="text-lg font-semibold">
//                 {participant.firstName} {participant.lastName}
//               </span>
//             </div>
//           )}
//           <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-xs rounded px-2 py-1">
//             {participant.firstName}
//             {participant._id === userId && ' (You)'}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
