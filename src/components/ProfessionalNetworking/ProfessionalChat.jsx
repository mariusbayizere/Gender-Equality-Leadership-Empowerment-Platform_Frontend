
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessageSquare, Send, ArrowLeft, MoreVertical, Search, Phone, Video, Info, Paperclip, Smile, Check, CheckCheck, Clock, User, X, Loader, AlertCircle } from 'lucide-react';
import { apiService } from './apiService';

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

// Message Component - OPTIMIZED with React.memo
const MessageBubble = React.memo(({ message, isOwn, contact }) => {
  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const getMessageStatus = useCallback((message) => {
    if (!isOwn) return null;
    if (message.readAt) return <CheckCheck className="w-4 h-4 text-blue-500" />;
    if (message.status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-400" />;
    return <Check className="w-4 h-4 text-gray-400" />;
  }, [isOwn]);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <ProfileAvatar 
            avatar={contact?.avatar} 
            name={contact?.name} 
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
            <p className="text-sm">{message.content}</p>
          </div>
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwn && (
              <span className="ml-1">{getMessageStatus(message)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Conversation List Item - OPTIMIZED with React.memo
const ConversationItem = React.memo(({ conversation, isActive, onClick, currentUserId }) => {
  const otherParticipant = conversation.participant;
  const unreadCount = conversation.unreadCount || 0;
  
  const formatLastMessageTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
        isActive ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
      }`}
    >
      <ProfileAvatar 
        avatar={otherParticipant?.avatar} 
        name={otherParticipant?.name} 
        size="w-12 h-12"
        status={otherParticipant?.online_status}
      />
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {otherParticipant?.name}
          </h3>
          <span className="text-xs text-gray-500">
            {conversation.lastMessage?.timestamp && formatLastMessageTime(conversation.lastMessage.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage?.content || 'No messages yet'}
          </p>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-2">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Main Chat Component - HEAVILY OPTIMIZED
export const ProfessionalChat = ({ isOpen, onClose, initialContact = null }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef(null);
  
  // OPTIMIZED: Cache currentUserId to avoid repeated calls
  const currentUserId = useMemo(() => {
    return apiService.getCurrentUserId();
  }, [isOpen]);

  // OPTIMIZED: Debounced scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // OPTIMIZED: Use useEffect with proper dependencies
  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialContact && isOpen) {
      handleStartChat(initialContact);
    }
  }, [initialContact, isOpen]);

  useEffect(() => {
    // Debounce scroll to bottom
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getChatConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    setMessagesLoading(true);
    try {
      const data = await apiService.getMessages(conversationId);
      setMessages(data.messages || []);
      
      // OPTIMIZED: Mark messages as read without blocking UI
      apiService.markMessagesAsRead(conversationId).then(() => {
        // Update conversation unread count
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }).catch(err => {
        console.warn('Failed to mark messages as read:', err);
      });
      
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err.message);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const handleStartChat = useCallback(async (contact) => {
    try {
      const conversation = await apiService.getOrCreateConversation(contact.id);
      
      // Update conversations list
      setConversations(prev => {
        const exists = prev.find(conv => conv.id === conversation.id);
        if (exists) return prev;
        
        const newConv = {
          ...conversation,
          participant: {
            id: contact.id,
            name: contact.name || `${contact.firstName} ${contact.lastName}`,
            avatar: contact.avatar,
            online_status: contact.online_status || 'offline'
          },
          unreadCount: 0
        };
        
        return [newConv, ...prev];
      });
      
      setActiveConversation({
        ...conversation,
        participant: {
          id: contact.id,
          name: contact.name || `${contact.firstName} ${contact.lastName}`,
          avatar: contact.avatar,
          online_status: contact.online_status || 'offline'
        }
      });
      
      await loadMessages(conversation.id);
    } catch (err) {
      console.error('Error starting chat:', err);
      setError(err.message);
    }
  }, [loadMessages]);

  const handleConversationClick = useCallback(async (conversation) => {
    setActiveConversation(conversation);
    await loadMessages(conversation.id);
  }, [loadMessages]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sendingMessage) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      const sentMessage = await apiService.sendMessage(activeConversation.id, messageContent);
      
      // Add message to local state
      setMessages(prev => [...prev, sentMessage]);
      
      // Update last message in conversations
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? { ...conv, lastMessage: sentMessage, lastActivity: sentMessage.timestamp }
            : conv
        )
      );
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSendingMessage(false);
    }
  }, [newMessage, activeConversation, sendingMessage]);

  // OPTIMIZED: Memoize filtered conversations
  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter(conv => {
      const otherParticipant = conv.participant;
      return otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm]);

  const getActiveContact = useCallback(() => {
    if (!activeConversation) return null;
    return activeConversation.participant;
  }, [activeConversation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[600px] flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading conversations...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {searchTerm ? 'No conversations found' : 'No conversations yet'}
                  </p>
                </div>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center">
                  <ProfileAvatar 
                    avatar={getActiveContact()?.avatar} 
                    name={getActiveContact()?.name} 
                    size="w-10 h-10"
                    status={getActiveContact()?.online_status}
                  />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {getActiveContact()?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {getActiveContact()?.online_status === 'online' ? 'Online' : 
                       getActiveContact()?.online_status === 'away' ? 'Away' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                    <span className="text-gray-600">Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Start your conversation</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === currentUserId}
                        contact={getActiveContact()}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sendingMessage}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* No Active Conversation */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChat;




// import React, { useState, useEffect, useRef } from 'react';
// import { MessageSquare, Send, ArrowLeft, MoreVertical, Search, Phone, Video, Info, Paperclip, Smile, Check, CheckCheck, Clock, User, X, Loader, AlertCircle } from 'lucide-react';
// import { apiService } from './apiService';

// // ProfileAvatar Component
// const ProfileAvatar = ({ avatar, name, size = "w-10 h-10", status = null }) => {
//   const [imageError, setImageError] = useState(false);
  
//   const hasValidAvatar = avatar && avatar.trim() !== '' && !imageError;
  
//   if (hasValidAvatar) {
//     return (
//       <div className="relative">
//         <img
//           src={avatar}
//           alt={name}
//           className={`${size} rounded-full bg-gray-200 object-cover`}
//           onError={() => setImageError(true)}
//         />
//         {status && (
//           <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
//             status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
//           }`} />
//         )}
//       </div>
//     );
//   }
  
//   return (
//     <div className="relative">
//       <div className={`${size} rounded-full bg-blue-500 flex items-center justify-center`}>
//         <User className="w-5 h-5 text-white" />
//       </div>
//       {status && (
//         <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
//           status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
//         }`} />
//       )}
//     </div>
//   );
// };

// // Message Component - FIXED
// const MessageBubble = ({ message, isOwn, contact }) => {
//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const getMessageStatus = (message) => {
//     if (!isOwn) return null;
//     if (message.readAt) return <CheckCheck className="w-4 h-4 text-blue-500" />;
//     if (message.status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-400" />;
//     return <Check className="w-4 h-4 text-gray-400" />;
//   };

//   return (
//     <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
//       <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
//         {!isOwn && (
//           <ProfileAvatar 
//             avatar={contact?.avatar} 
//             name={contact?.name} 
//             size="w-8 h-8" 
//           />
//         )}
//         <div className={`mx-2 ${isOwn ? 'mr-0' : 'ml-2'}`}>
//           <div
//             className={`px-4 py-2 rounded-2xl ${
//               isOwn
//                 ? 'bg-blue-600 text-white rounded-br-md'
//                 : 'bg-gray-100 text-gray-900 rounded-bl-md'
//             }`}
//           >
//             <p className="text-sm">{message.content}</p>
//           </div>
//           <div className={`flex items-center mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
//             <span>{formatTime(message.timestamp)}</span>
//             {isOwn && (
//               <span className="ml-1">{getMessageStatus(message)}</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Conversation List Item - FIXED
// const ConversationItem = ({ conversation, isActive, onClick, currentUserId }) => {
//   // FIXED: Handle the backend structure correctly
//   const otherParticipant = conversation.participant; // Backend returns single participant object
//   const unreadCount = conversation.unreadCount || 0; // FIXED: changed from unread_count
  
//   const formatLastMessageTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInHours = (now - date) / (1000 * 60 * 60);
    
//     if (diffInHours < 1) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (diffInHours < 24) {
//       return `${Math.floor(diffInHours)}h`;
//     } else {
//       return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   return (
//     <div
//       onClick={onClick}
//       className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
//         isActive ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
//       }`}
//     >
//       <ProfileAvatar 
//         avatar={otherParticipant?.avatar} 
//         name={otherParticipant?.name} 
//         size="w-12 h-12"
//         status={otherParticipant?.online_status}
//       />
//       <div className="ml-3 flex-1 min-w-0">
//         <div className="flex items-center justify-between">
//           <h3 className="text-sm font-medium text-gray-900 truncate">
//             {otherParticipant?.name}
//           </h3>
//           <span className="text-xs text-gray-500">
//             {/* FIXED: Handle lastMessage structure from backend */}
//             {conversation.lastMessage?.timestamp && formatLastMessageTime(conversation.lastMessage.timestamp)}
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600 truncate">
//             {conversation.lastMessage?.content || 'No messages yet'}
//           </p>
//           {unreadCount > 0 && (
//             <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-2">
//               {unreadCount}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Chat Component
// export const ProfessionalChat = ({ isOpen, onClose, initialContact = null }) => {
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [messagesLoading, setMessagesLoading] = useState(false);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const messagesEndRef = useRef(null);
//   const currentUserId = apiService.getCurrentUserId();

//   useEffect(() => {
//     if (isOpen) {
//       loadConversations();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (initialContact && isOpen) {
//       handleStartChat(initialContact);
//     }
//   }, [initialContact, isOpen]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const loadConversations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await apiService.getChatConversations();
//       setConversations(data.conversations || []);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error loading conversations:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMessages = async (conversationId) => {
//     setMessagesLoading(true);
//     try {
//       const data = await apiService.getMessages(conversationId);
//       setMessages(data.messages || []);
      
//       // Mark messages as read
//       await apiService.markMessagesAsRead(conversationId);
      
//       // Update conversation unread count
//       setConversations(prev => 
//         prev.map(conv => 
//           conv.id === conversationId 
//             ? { ...conv, unreadCount: 0 }
//             : conv
//         )
//       );
//     } catch (err) {
//       console.error('Error loading messages:', err);
//       setError(err.message);
//     } finally {
//       setMessagesLoading(false);
//     }
//   };

//   const handleStartChat = async (contact) => {
//     try {
//       const conversation = await apiService.getOrCreateConversation(contact.id);
      
//       // Update conversations list
//       setConversations(prev => {
//         const exists = prev.find(conv => conv.id === conversation.id);
//         if (exists) return prev;
        
//         // Create a conversation object that matches the expected structure
//         const newConv = {
//           ...conversation,
//           participant: {
//             id: contact.id,
//             name: contact.name || `${contact.firstName} ${contact.lastName}`,
//             avatar: contact.avatar,
//             online_status: contact.online_status || 'offline'
//           },
//           unreadCount: 0
//         };
        
//         return [newConv, ...prev];
//       });
      
//       setActiveConversation({
//         ...conversation,
//         participant: {
//           id: contact.id,
//           name: contact.name || `${contact.firstName} ${contact.lastName}`,
//           avatar: contact.avatar,
//           online_status: contact.online_status || 'offline'
//         }
//       });
      
//       await loadMessages(conversation.id);
//     } catch (err) {
//       console.error('Error starting chat:', err);
//       setError(err.message);
//     }
//   };

//   const handleConversationClick = async (conversation) => {
//     setActiveConversation(conversation);
//     await loadMessages(conversation.id);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !activeConversation || sendingMessage) return;

//     const messageContent = newMessage.trim();
//     setNewMessage('');
//     setSendingMessage(true);

//     try {
//       const sentMessage = await apiService.sendMessage(activeConversation.id, messageContent);
      
//       // Add message to local state
//       setMessages(prev => [...prev, sentMessage]);
      
//       // Update last message in conversations
//       setConversations(prev =>
//         prev.map(conv =>
//           conv.id === activeConversation.id
//             ? { ...conv, lastMessage: sentMessage, lastActivity: sentMessage.timestamp }
//             : conv
//         )
//       );
      
//       scrollToBottom();
//     } catch (err) {
//       console.error('Error sending message:', err);
//       setError(err.message);
//       setNewMessage(messageContent); // Restore message on error
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const filteredConversations = conversations.filter(conv => {
//     if (!searchTerm) return true;
//     // FIXED: Handle the backend structure
//     const otherParticipant = conv.participant;
//     return otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   const getActiveContact = () => {
//     if (!activeConversation) return null;
//     // FIXED: Handle the backend structure
//     return activeConversation.participant;
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[600px] flex overflow-hidden">
//         {/* Conversations Sidebar */}
//         <div className="w-1/3 border-r flex flex-col">
//           {/* Header */}
//           <div className="p-4 border-b bg-gray-50">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
//               <button
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             {/* Search */}
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search conversations..."
//                 className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Conversations List */}
//           <div className="flex-1 overflow-y-auto">
//             {loading ? (
//               <div className="flex items-center justify-center py-8">
//                 <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
//                 <span className="text-gray-600">Loading conversations...</span>
//               </div>
//             ) : error ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">{error}</p>
//                 </div>
//               </div>
//             ) : filteredConversations.length === 0 ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">
//                     {searchTerm ? 'No conversations found' : 'No conversations yet'}
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               filteredConversations.map((conversation) => (
//                 <ConversationItem
//                   key={conversation.id}
//                   conversation={conversation}
//                   isActive={activeConversation?.id === conversation.id}
//                   onClick={() => handleConversationClick(conversation)}
//                   currentUserId={currentUserId}
//                 />
//               ))
//             )}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {activeConversation ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b bg-white flex items-center justify-between">
//                 <div className="flex items-center">
//                   <ProfileAvatar 
//                     avatar={getActiveContact()?.avatar} 
//                     name={getActiveContact()?.name} 
//                     size="w-10 h-10"
//                     status={getActiveContact()?.online_status}
//                   />
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-gray-900">
//                       {getActiveContact()?.name}
//                     </h3>
//                     <p className="text-xs text-gray-500">
//                       {getActiveContact()?.online_status === 'online' ? 'Online' : 'Last seen recently'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
//                     <Phone className="w-5 h-5" />
//                   </button>
//                   <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
//                     <Video className="w-5 h-5" />
//                   </button>
//                   <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
//                     <Info className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Messages Area */}
//               <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//                 {messagesLoading ? (
//                   <div className="flex items-center justify-center py-8">
//                     <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
//                     <span className="text-gray-600">Loading messages...</span>
//                   </div>
//                 ) : messages.length === 0 ? (
//                   <div className="flex items-center justify-center py-8">
//                     <div className="text-center">
//                       <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-600">No messages yet. Start the conversation!</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     {messages.map((message) => (
//                       <MessageBubble
//                         key={message.id}
//                         message={message}
//                         isOwn={message.senderId === currentUserId} // FIXED: changed from sender_id to senderId
//                         contact={getActiveContact()}
//                       />
//                     ))}
//                     <div ref={messagesEndRef} />
//                   </>
//                 )}
//               </div>

//               {/* Message Input Area */}
//               <div className="p-4 border-t bg-white">
//                 <form
//                   onSubmit={handleSendMessage}
//                   className="flex items-center space-x-2"
//                 >
//                   <input
//                     type="text"
//                     placeholder="Type your message..."
//                     className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     disabled={sendingMessage}
//                   />
//                   <button
//                     type="submit"
//                     disabled={!newMessage.trim() || sendingMessage}
//                     className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {sendingMessage ? (
//                       <Loader className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <Send className="w-5 h-5" />
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             /* No Chat Selected */
//             <div className="flex-1 flex items-center justify-center bg-gray-50">
//               <div className="text-center">
//                 <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   Welcome to Professional Chat
//                 </h3>
//                 <p className="text-gray-600">
//                   Select a conversation to start messaging with your professional connections.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

