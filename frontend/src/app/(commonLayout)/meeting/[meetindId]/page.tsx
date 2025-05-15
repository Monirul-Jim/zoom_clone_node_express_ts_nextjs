
import React from 'react';

interface MeetingPageProps {
  params: { meetingId: string };
}

export default function MeetingPage({ params }: MeetingPageProps) {
  const { meetingId } = params;
console.log(params)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Meeting Room</h1>
      <p className="mt-2 text-lg">Meeting ID: {meetingId}</p>
    </div>
  );
}
