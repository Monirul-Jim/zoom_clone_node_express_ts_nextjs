
'use client';
import { socket } from '@/utils/socket/socket';
import { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/hooks';
interface Message {
    userId: string;
    userName: string;
    text: string;
    timestamp: Date;
    replyTo?: string;
}

export const Chat = ({ meetingId }: { meetingId: string }) => {
    const token = useAppSelector((state) => state.auth.token);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [loadingInitialMessages, setLoadingInitialMessages] = useState(true);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleInitialMessages = (initialMessages: Message[]) => {
            setMessages(initialMessages);
            setLoadingInitialMessages(false);
            // Scroll to the bottom after initial load
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        socket.on('initial-messages', handleInitialMessages);
        socket.on('message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
            // Scroll to the bottom on new message
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        });

        // Emit 'join-meeting' event when the component mounts
        socket.emit('join-meeting', { meetingId, token });

        return () => {
            socket.off('message');
            socket.off('initial-messages'); // Clean up the new listener
        };
    }, [meetingId, token]);

    const sendMessage = () => {
        if (text.trim()) {
            socket.emit('message', { meetingId, text, replyTo, token: token });
            setText('');
            setReplyTo(null);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    if (loadingInitialMessages) {
        return <div className="p-4 text-gray-400">Loading messages...</div>;
    }

    return (
        <div className="flex flex-col h-full justify-between p-4">
            <div ref={chatContainerRef} className="overflow-y-auto space-y-2 mb-2 flex-grow">
                {messages?.map((msg, idx) => (
                    <div key={idx} className="text-sm rounded-md p-2 bg-gray-700 bg-opacity-75">
                        {msg.replyTo && (
                            <div className="text-xs  mb-1 italic">Replying to: {msg.replyTo}</div>
                        )}
                        <div className="font-semibold text-green-400">{msg.userName}</div>
                        <div>{msg.text}</div>
                        <button
                            onClick={() => setReplyTo(msg.text)}
                            className="text-blue-400 text-xs mt-1 hover:underline"
                        >
                            Reply
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:border-blue-500"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={replyTo ? `Replying to: ${replyTo}` : 'Type a message'}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};