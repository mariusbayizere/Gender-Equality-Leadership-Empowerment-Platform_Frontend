// import React, { useState, useEffect, useRef } from 'react';
// import { Send, XCircle } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:3000/api/v1/mentorship';

// const getAuthHeaders = () => ({
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${localStorage.getItem('token')}`,
// });

// const ProfessionalChat = ({ mentorshipId, currentUser, partnerName, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Fetch messages
//   const fetchMessages = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/messages/${mentorshipId}`, {
//         headers: getAuthHeaders(),
//       });
//       const data = await response.json();
//       setMessages(data.messages || []);
//     } catch (error) {}
//   };

//   // Poll for new messages every 3 seconds
//   useEffect(() => {
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 3000);
//     return () => clearInterval(interval);
//   }, [mentorshipId]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Send message
//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_BASE_URL}/send-message`, {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           mentorship_id: mentorshipId,
//           message_content: newMessage,
//           message_type: 'text',
//         }),
//       });
//       setNewMessage('');
//       fetchMessages();
//     } catch (error) {} finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-md h-[32rem] flex flex-col shadow-lg">
//         <div className="p-4 border-b flex items-center justify-between">
//           <h3 className="text-lg font-semibold">
//             Chat with {partnerName}
//           </h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <XCircle className="w-6 h-6" />
//           </button>
//         </div>
//         <div className="flex-1 p-4 overflow-y-auto space-y-3">
//           {messages.map(msg => (
//             <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-xs px-4 py-2 rounded-lg ${
//                 msg.sender_id === currentUser.id
//                   ? 'bg-purple-600 text-white'
//                   : 'bg-gray-200 text-gray-900'
//               }`}>
//                 <div className="text-sm">{msg.message_content}</div>
//                 <div className="text-xs mt-1 opacity-70">
//                   {new Date(msg.createdAt).toLocaleTimeString()}
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         <div className="p-4 border-t flex space-x-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={e => setNewMessage(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
//             placeholder="Type your message..."
//             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             disabled={loading}
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim() || loading}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
//           >
//             <Send className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfessionalChat;


import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Send, XCircle, Check, CheckCheck, User, Bell, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api/v1/mentorship';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ProfileAvatar Component
const ProfileAvatar = React.memo(({ avatar, name, size = "w-10 h-10", status = null }) => {
  const [imageError, setImageError] = useState(false);
  
  const hasValidAvatar = avatar && avatar.trim() !== '' && !imageError;
  
  if (hasValidAvatar) {
    return (
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className={`${size} rounded-full bg-gray-200 object-cover`}
          onError={() => setImageError(true)}
        />
        {status && (
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
            status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
          }`} />
        )}
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className={`${size} rounded-full bg-blue-500 flex items-center justify-center`}>
        <User className="w-5 h-5 text-white" />
      </div>
      {status && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
          status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
});

// Message Component with status indicators
const MessageBubble = React.memo(({ message, isOwn, partnerName, partnerAvatar }) => {
  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const getMessageStatus = useCallback((message) => {
    if (!isOwn) return null;
    if (message.read_at) return <CheckCheck className="w-4 h-4 text-blue-500" />;
    if (message.status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-400" />;
    if (message.status === 'sent') return <Check className="w-4 h-4 text-gray-400" />;
    return null;
  }, [isOwn]);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <ProfileAvatar 
            avatar={partnerAvatar} 
            name={partnerName} 
            size="w-8 h-8" 
          />
        )}
        <div className={`mx-2 ${isOwn ? 'mr-0' : 'ml-2'}`}>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }`}
          >
            <p className="text-sm">{message.message_content}</p>
          </div>
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <span className="ml-1">{getMessageStatus(message)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Notification Component with Tailwind animation
const NotificationToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-slide-in">
      <div className="flex items-center">
        <Bell className="w-5 h-5 text-blue-500 mr-2" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">New message</p>
          <p className="text-xs text-gray-600 truncate">{message.message_content}</p>
        </div>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ProfessionalChat = ({ mentorshipId, currentUser, partnerName, partnerAvatar, partnerStatus = 'offline', onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  // Track window focus for notifications
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Fetch messages with optimistic updates
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${mentorshipId}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      const newMessages = data.messages || [];
      
      // Check for new messages for notifications
      if (newMessages.length > 0 && lastMessageId) {
        const latestMessage = newMessages[newMessages.length - 1];
        if (latestMessage.id !== lastMessageId && 
            latestMessage.sender_id !== currentUser.id && 
            !isWindowFocused) {
          setNotification(latestMessage);
        }
        setLastMessageId(latestMessage.id);
      } else if (newMessages.length > 0 && !lastMessageId) {
        setLastMessageId(newMessages[newMessages.length - 1].id);
      }
      
      setMessages(newMessages);
      
      // Mark messages as read automatically
      await markMessagesAsRead();
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [mentorshipId, lastMessageId, currentUser.id, isWindowFocused]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/mark-read/${mentorshipId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [mentorshipId]);

  // Real-time polling with shorter interval
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); // Reduced to 1 second for better real-time feel
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message with immediate UI update
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || sendingMessage) return;
    
    const messageContent = newMessage.trim();
    const tempMessage = {
      id: `temp-${Date.now()}`,
      message_content: messageContent,
      sender_id: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await fetch(`${API_BASE_URL}/send-message`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          mentorship_id: mentorshipId,
          message_content: messageContent,
          message_type: 'text',
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        
        // Replace temp message with actual message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...sentMessage.messageData, status: 'sent' }
              : msg
          )
        );
        
        // Refresh messages to get the latest state
        setTimeout(() => fetchMessages(), 500);
      } else {
        throw new Error('Failed to send message');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error and restore input
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageContent);
    } finally {
      setSendingMessage(false);
    }
  }, [newMessage, sendingMessage, currentUser.id, mentorshipId, fetchMessages]);

  // Handle enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Close notification
  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <NotificationToast 
          message={notification} 
          onClose={closeNotification} 
        />
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div 
          ref={chatWindowRef}
          className="bg-white rounded-lg w-full max-w-md h-[32rem] flex flex-col shadow-xl"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-blue-50">
            <div className="flex items-center">
              <ProfileAvatar 
                avatar={partnerAvatar} 
                name={partnerName} 
                size="w-10 h-10"
                status={partnerStatus}
              />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {partnerName}
                </h3>
                <p className="text-xs text-gray-600">
                  {partnerStatus === 'online' ? (
                    <span className="text-green-600 font-medium">● Online</span>
                  ) : partnerStatus === 'away' ? (
                    <span className="text-yellow-600 font-medium">● Away</span>
                  ) : (
                    <span className="text-gray-500">● Offline</span>
                  )}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-1 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Start your conversation</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.sender_id === currentUser.id}
                    partnerName={partnerName}
                    partnerAvatar={partnerAvatar}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={sendingMessage}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sendingMessage ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalChat;