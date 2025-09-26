import { useEffect, useState, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

import { API_BASE_URL } from './config';
export default function ChatRoom({ rideId }) {
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef();
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection per component instance
    socketRef.current = io(API_BASE_URL);

    socketRef.current.emit('join_room', rideId);
     
    // Fetch past messages
    fetch(`${API_BASE_URL}/api/messages/${rideId}`)
    .then(res => res.json())
    .then(data => setMessages(data))
    .catch(err => console.error('Failed to load messages:', err));
    
    // Listen for incoming messages
    const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);
    socketRef.current.on('receive_message', handleReceive);

    // Clean up on unmount
    return () => {
      socketRef.current.off('receive_message', handleReceive);
      socketRef.current.disconnect();
    };
  }, [rideId]);

  const sendMessage = () => {
    if (!input.trim() || !auth?.user?.name) return;
    const msg = {
      rideId,
      message: input,
      sender: auth.user.name,
      timestamp: new Date().toISOString(),
    };
    socketRef.current.emit('send_message', msg);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-gray-50 rounded-lg shadow-inner p-4" style={{ height: 350, display: 'flex', flexDirection: 'column' }}>
      <h3 className="text-lg font-semibold mb-2 text-primary-700">💬 Ride Chat</h3>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8, background: '#fff', borderRadius: 8, padding: 8 }}>
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-8">No messages yet. Start the conversation!</div>
        )}
        {messages.map((msg, idx) => {
          const time = new Date(msg.timestamp).toLocaleString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
          });
          return (
            <div key={idx} className="mb-2">
              <span className="font-semibold text-primary-600">{msg.sender}</span>
              <span className="ml-2">{msg.message}</span>
              <span className="text-xs text-gray-400 ml-2">[{time}]</span>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          disabled={!auth?.user?.name}
          className="flex-1 input input-bordered"
        />
        <button
          onClick={sendMessage}
          disabled={!auth?.user?.name}
          className="btn-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
}
