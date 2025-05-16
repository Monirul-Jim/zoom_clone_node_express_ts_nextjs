
'use client';
import { socket } from '@/utils/socket/socket';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
interface Message {
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  replyTo?: string;
}

export const Chat = ({ meetingId }: { meetingId: string }) => {
  console.log(meetingId, 'meeting id is here');
  const token = useAppSelector((state) => state.auth.token);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loadingInitialMessages, setLoadingInitialMessages] = useState(true);

  useEffect(() => {
    const handleInitialMessages = (initialMessages: Message[]) => {
      setMessages(initialMessages);
      setLoadingInitialMessages(false);
    };

    socket.on('initial-messages', handleInitialMessages);
    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Emit 'join-meeting' event when the component mounts
    socket.emit('join-meeting', { meetingId, token });

    return () => {
      socket.off('message');
      socket.off('initial-messages'); // Clean up the new listener
    };
  }, [meetingId, token]);

  const sendMessage = () => {
    socket.emit('message', { meetingId, text, replyTo, token: token });
    setText('');
    setReplyTo(null);
  };

  if (loadingInitialMessages) {
    return <div>Loading messages...</div>; // Or a spinner
  }

  return (
    <div className="bg-white p-4 border-t border-gray-300">
      <div className="h-48 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm border p-2 rounded">
            {msg.replyTo && (
              <div className="text-xs text-gray-500 mb-1">Reply to: {msg.replyTo}</div>
            )}
            <div className="font-semibold">{msg.userName}</div>
            <div>{msg.text}</div>
            <button
              onClick={() => setReplyTo(msg.text)}
              className="text-blue-500 text-xs mt-1"
            >
              Reply
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyTo ? `Replying to: ${replyTo}` : 'Type a message'}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};