
// 'use client';
// import { Chat } from '@/component/ChatBox/ChatBox';
// import { Controls } from '@/component/Controls/Controls';
// import { VideoGrid } from '@/component/VideoRoom/VideoRoom';
// import { useAppSelector } from '@/redux/hooks';
// import { socket } from '@/utils/socket/socket';
// import { useEffect, useRef, useState } from 'react';


// interface Props {
//   params: { meetingId: string };
// }

// export default function MeetingPage({ params }: Props) {
//   const { meetingId } = params;
  
// const token = useAppSelector((state) => state.auth.token);
//   useEffect(() => {
//     socket.emit("join-meeting", { meetingId, token:token});
//     return () => { 
//       socket.emit("leave-meeting", { meetingId });
//     };
//   }, [meetingId]);

//   return (
//     <div className="h-screen grid grid-rows-[auto_1fr_auto]">
//       <VideoGrid />
//       <Chat meetingId={meetingId} />
//       <Controls meetingId={meetingId} />
//     </div>
//   );
// }



'use client';
import { Chat } from '@/component/ChatBox/ChatBox';
import { Controls } from '@/component/Controls/Controls';
import { VideoGrid } from '@/component/VideoRoom/VideoRoom';
import { useAppSelector } from '@/redux/hooks';
import { socket } from '@/utils/socket/socket';
import { useEffect } from 'react';
import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react'; // Example icon for toggling chat

interface Props {
    params: { meetingId: string };
}

export default function MeetingPage({ params }: Props) {
    const { meetingId } = params;
    const token = useAppSelector((state) => state.auth.token);
    const [isChatOpen, setIsChatOpen] = useState(true); // State to control chat visibility

    useEffect(() => {
        socket.emit("join-meeting", { meetingId, token: token });
        return () => {
            socket.emit("leave-meeting", { meetingId });
        };
    }, [meetingId, token]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            <div className="flex-grow relative">
                <VideoGrid  />
                <button
                    onClick={toggleChat}
                    className="absolute top-4 right-4 bg-gray-700 p-2 rounded-md shadow-md z-10 hover:bg-gray-600"
                >
                    <ArrowLeftRight className="w-5 h-5" />
                </button>
                {isChatOpen && (
                    <div className="absolute top-0 right-0 h-full w-96 bg-gray-800 border-l border-gray-700 shadow-md z-10">
                        <h2 className="p-4 border-b border-gray-700 font-semibold">Chat</h2>
                        <Chat meetingId={meetingId} />
                    </div>
                )}
            </div>
            <Controls meetingId={meetingId} />
        </div>
    );
}
