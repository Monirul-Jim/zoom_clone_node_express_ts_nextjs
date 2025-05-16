// 'use client';
// import { useAppSelector } from '@/redux/hooks';
// import React from 'react';
// import { useParams } from 'next/navigation';
// interface MeetingPageProps {
//   params: { meetindId: string };
// }

// export default function MeetingPage({ params }: MeetingPageProps) {
//    const user = useAppSelector((state) => state.auth.user);
//   // const { meetindId } = params;
// const { meetingId } = useParams();
// console.log(meetingId)

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">Meeting Room</h1>
//       <p className="mt-2 text-lg">Meeting ID: {meetingId}</p>
//     </div>
//   );
// }

'use client';
import { Chat } from '@/component/ChatBox/ChatBox';
import { Controls } from '@/component/Controls/Controls';
import { VideoGrid } from '@/component/VideoRoom/VideoRoom';
import { useAppSelector } from '@/redux/hooks';
import { socket } from '@/utils/socket/socket';
import { useEffect, useRef, useState } from 'react';


interface Props {
  params: { meetingId: string };
}

export default function MeetingPage({ params }: Props) {
  const { meetingId } = params;
  
const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    socket.emit("join-meeting", { meetingId, token:token});
    return () => { 
      socket.emit("leave-meeting", { meetingId });
    };
  }, [meetingId]);

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <VideoGrid />
      <Chat meetingId={meetingId} />
      <Controls meetingId={meetingId} />
    </div>
  );
}



