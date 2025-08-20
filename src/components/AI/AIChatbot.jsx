import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Bot, User, AlertCircle, Loader2, RotateCcw, X, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState('openai');
  const [networkStatus, setNetworkStatus] = useState('online');
  const [retryCount, setRetryCount] = useState(0);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const maxRetries = 3;

  // Error types mapping
  const errorTypes = {
    NETWORK_ERROR: 'network',
    RATE_LIMIT: 'rate_limit',
    SERVER_OVERLOAD: 'server_overload',
    QUOTA_EXCEEDED: 'quota_exceeded',
    UNAUTHORIZED: 'unauthorized',
    SERVICE_UNAVAILABLE: 'service_unavailable',
    TIMEOUT: 'timeout',
    UNKNOWN: 'unknown'
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chatbot when opened
  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeChatbot();
    }
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Parse error response and determine error type
  const parseError = (error, response = null) => {
    if (networkStatus === 'offline') {
      return {
        type: errorTypes.NETWORK_ERROR,
        message: "You're currently offline. Please check your internet connection and try again.",
        canRetry: true,
        retryDelay: 2000
      };
    }

    // Handle fetch errors (network issues)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        type: errorTypes.NETWORK_ERROR,
        message: "Unable to connect to the server. Please check your connection and try again.",
        canRetry: true,
        retryDelay: 3000
      };
    }

    // Handle timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return {
        type: errorTypes.TIMEOUT,
        message: "The request took too long to process. The server might be busy. Please try again.",
        canRetry: true,
        retryDelay: 5000
      };
    }

    if (response) {
      const status = response.status;
      
      // Rate limiting (429)
      if (status === 429) {
        const retryAfter = response.headers?.get('Retry-After');
        const resetTime = response.headers?.get('X-RateLimit-Reset');
        
        return {
          type: errorTypes.RATE_LIMIT,
          message: "You've reached your message limit. Please wait a moment before sending another message.",
          canRetry: true,
          retryDelay: retryAfter ? parseInt(retryAfter) * 1000 : 60000,
          resetTime: resetTime
        };
      }

      // Quota exceeded (402 or specific error codes)
      if (status === 402 || status === 403) {
        return {
          type: errorTypes.QUOTA_EXCEEDED,
          message: "Your usage limit has been exceeded. Please upgrade your plan or try again later.",
          canRetry: false
        };
      }

      // Unauthorized (401)
      if (status === 401) {
        return {
          type: errorTypes.UNAUTHORIZED,
          message: "Authentication failed. Please refresh the page and try again.",
          canRetry: false
        };
      }

      // Server errors (5xx)
      if (status >= 500) {
        if (status === 503) {
          return {
            type: errorTypes.SERVICE_UNAVAILABLE,
            message: "The AI service is temporarily unavailable due to high demand. Please try again in a few moments.",
            canRetry: true,
            retryDelay: 10000
          };
        }
        
        return {
          type: errorTypes.SERVER_OVERLOAD,
          message: "Our servers are experiencing high load. Please wait a moment and try again.",
          canRetry: true,
          retryDelay: 8000
        };
      }
    }

    // Default unknown error
    return {
      type: errorTypes.UNKNOWN,
      message: error.message || "An unexpected error occurred. Please try again.",
      canRetry: true,
      retryDelay: 3000
    };
  };

  // Enhanced error display component
  const ErrorDisplay = ({ errorInfo, onRetry, onDismiss }) => {
    const getErrorIcon = () => {
      switch (errorInfo.type) {
        case errorTypes.NETWORK_ERROR:
          return <WifiOff className="text-red-500" size={20} />;
        case errorTypes.RATE_LIMIT:
          return <AlertTriangle className="text-orange-500" size={20} />;
        case errorTypes.SERVER_OVERLOAD:
        case errorTypes.SERVICE_UNAVAILABLE:
          return <AlertCircle className="text-yellow-500" size={20} />;
        default:
          return <AlertCircle className="text-red-500" size={20} />;
      }
    };

    const getErrorColor = () => {
      switch (errorInfo.type) {
        case errorTypes.RATE_LIMIT:
          return 'border-orange-400 bg-orange-50';
        case errorTypes.SERVER_OVERLOAD:
        case errorTypes.SERVICE_UNAVAILABLE:
          return 'border-yellow-400 bg-yellow-50';
        case errorTypes.QUOTA_EXCEEDED:
          return 'border-purple-400 bg-purple-50';
        default:
          return 'border-red-400 bg-red-50';
      }
    };

    return (
      <div className={`border-l-4 p-4 m-4 rounded ${getErrorColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {getErrorIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-2">{errorInfo.message}</p>
            
            {errorInfo.resetTime && (
              <p className="text-xs text-gray-500 mb-2">
                Limit resets at {new Date(parseInt(errorInfo.resetTime) * 1000).toLocaleTimeString()}
              </p>
            )}
            
            <div className="flex space-x-2">
              {errorInfo.canRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </button>
              )}
              <button
                onClick={onDismiss}
                className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced fetch with timeout and retry logic
  const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  // Initialize chatbot with enhanced error handling
  const initializeChatbot = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setRetryCount(0);

      const URL = 'http://localhost:3000';
      
      // Check health first with timeout
      const healthResponse = await fetchWithTimeout(`${URL}/api/v1/aichatbot/ai/health`, {}, 10000);
      
      if (!healthResponse.ok) {
        throw new Error('Health check failed');
      }
      
      const healthData = await healthResponse.json();
      
      if (healthData.status === 'healthy') {
        setIsConnected(true);
        
        // Create new conversation with timeout
        const conversationResponse = await fetchWithTimeout(`${URL}/api/v1/aichatbot/ai/conversation/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }, 15000);
        
        if (!conversationResponse.ok) {
          const errorInfo = parseError(new Error('Failed to create conversation'), conversationResponse);
          setError(errorInfo);
          return;
        }
        
        const conversationData = await conversationResponse.json();
        setConversationId(conversationData.conversationId);
        
        // Add welcome message
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          content: "Muraho! Welcome to GELEP's AI Assistant. I'm here to help you with questions about gender equality and leadership empowerment in Rwanda. How can I assist you today?",
          timestamp: new Date(),
          provider: 'system'
        }]);
      } else {
        throw new Error('AI service is not available');
      }
    } catch (error) {
      console.error('Failed to initialize chatbot:', error);
      const errorInfo = parseError(error);
      setError(errorInfo);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry mechanism with exponential backoff
  const retryOperation = async (operation, currentRetry = 0) => {
    try {
      return await operation();
    } catch (error) {
      if (currentRetry < maxRetries) {
        const delay = Math.pow(2, currentRetry) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryOperation(operation, currentRetry + 1);
      }
      throw error;
    }
  };

  // Enhanced send message with comprehensive error handling
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !conversationId) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    const originalMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    const sendOperation = async () => {
      const URL = 'http://localhost:3000';
      const response = await fetchWithTimeout(`${URL}/api/v1/aichatbot/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: originalMessage,
          conversationId: conversationId,
          provider: provider
        }),
      }, 60000); // 60 second timeout for AI responses

      // Extract rate limit info from headers
      if (response.headers.get('X-RateLimit-Remaining')) {
        setRateLimitInfo({
          remaining: parseInt(response.headers.get('X-RateLimit-Remaining')),
          reset: response.headers.get('X-RateLimit-Reset')
        });
      }

      if (!response.ok) {
        const errorInfo = parseError(new Error('Failed to get AI response'), response);
        throw { ...new Error(errorInfo.message), errorInfo };
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'AI response was not successful');
      }

      return data;
    };

    try {
      setRetryCount(0);
      const data = await retryOperation(sendOperation);

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        provider: data.provider,
        usage: data.usage
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorInfo = error.errorInfo || parseError(error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `I apologize, but I encountered an issue: ${errorInfo.message}${errorInfo.canRetry ? ' You can try sending your message again.' : ''}`,
        timestamp: new Date(),
        isError: true,
        errorInfo: errorInfo
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(errorInfo);
      
      // Auto-retry for certain error types after delay
      if (errorInfo.canRetry && errorInfo.type === errorTypes.NETWORK_ERROR && retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setInputMessage(originalMessage);
        }, errorInfo.retryDelay || 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle retry from error display
  const handleRetry = () => {
    if (error && error.canRetry) {
      setError(null);
      if (conversationId) {
        // Retry last message
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        if (lastUserMessage) {
          setInputMessage(lastUserMessage.content);
        }
      } else {
        // Retry initialization
        initializeChatbot();
      }
    }
  };

  // Handle input key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Restart conversation
  const restartConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    setIsLoading(false);
    setRetryCount(0);
    setRateLimitInfo(null);
    initializeChatbot();
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">GELEP AI Assistant</h3>
              <p className="text-sm text-green-100">
                {networkStatus === 'offline' ? (
                  <span className="flex items-center">
                    <WifiOff size={12} className="mr-2" />
                    Offline
                  </span>
                ) : isConnected ? (
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                    Connected • Rwanda Context
                  </span>
                ) : (
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-red-300 rounded-full mr-2"></div>
                    Disconnected
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={restartConversation}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
              title="Restart Conversation"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
              title="Close Chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">AI Provider:</span>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="openai"
                  checked={provider === 'openai'}
                  onChange={(e) => setProvider(e.target.value)}
                  className="mr-1"
                  disabled={isLoading}
                />
                OpenAI
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="gemini"
                  checked={provider === 'gemini'}
                  onChange={(e) => setProvider(e.target.value)}
                  className="mr-1"
                  disabled={isLoading}
                />
                Gemini
              </label>
            </div>
            
            {rateLimitInfo && (
              <span className="text-xs text-gray-500">
                {rateLimitInfo.remaining} messages remaining
              </span>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorDisplay 
            errorInfo={error}
            onRetry={handleRetry}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 animate-spin text-blue-500" size={32} />
                <p className="text-gray-500">Initializing GELEP AI Assistant...</p>
                {retryCount > 0 && (
                  <p className="text-sm text-gray-400 mt-2">Attempt {retryCount + 1}/{maxRetries + 1}</p>
                )}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.isError
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User size={16} />
                  ) : message.isError ? (
                    <AlertCircle size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-lg p-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.isError
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {/* Message Footer */}
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.provider && message.provider !== 'system' && (
                      <span className="capitalize">{message.provider}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator for AI response */}
          {isLoading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin text-green-500" size={16} />
                    <span className="text-gray-500 text-sm">
                      {networkStatus === 'offline' ? 'Waiting for connection...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  networkStatus === 'offline' 
                    ? "Waiting for internet connection..."
                    : "Ask me about gender equality in Rwanda..."
                }
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                rows="2"
                disabled={isLoading || !conversationId || networkStatus === 'offline'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Enter to send • Shift + Enter for new line • Max 4000 characters
              </p>
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || !conversationId || networkStatus === 'offline'}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
              title={networkStatus === 'offline' ? 'No internet connection' : 'Send Message'}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : networkStatus === 'offline' ? (
                <WifiOff size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          {/* Status bar */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>
                {conversationId ? `Conversation: ${conversationId.substring(5, 15)}...` : 'No conversation'}
              </span>
              {networkStatus === 'offline' && (
                <span className="flex items-center text-red-500">
                  <WifiOff size={12} className="mr-1" />
                  Offline
                </span>
              )}
            </div>
            <span className={inputMessage.length > 3800 ? 'text-orange-500' : ''}>
              {inputMessage.length}/4000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat Button Component to toggle the chatbot
export const ChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
      title="Open GELEP AI Assistant"
    >
      <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-white">AI</span>
      </div>
    </button>
  );
};

// Main export with chat state management
const AIChatbotContainer = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <ChatButton onClick={() => setIsChatOpen(true)} />
      <AIChatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default AIChatbotContainer;






























// import React, { useState, useEffect, useRef } from 'react';
// import { Send, MessageCircle, Bot, User, AlertCircle, Loader2, RotateCcw, X } from 'lucide-react';

// const AIChatbot = ({ isOpen, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversationId, setConversationId] = useState(null);
//   const [error, setError] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [provider, setProvider] = useState('openai');
  
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Auto-scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Initialize chatbot when opened
//   useEffect(() => {
//     if (isOpen && !conversationId) {
//       initializeChatbot();
//     }
//   }, [isOpen]);

//   // Focus input when chat opens
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   }, [isOpen]);

//   // Initialize chatbot
//   const initializeChatbot = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // Check health first
//       const URL = 'http://localhost:3000'; 
//       const healthResponse = await fetch(`${URL}/api/v1/aichatbot/ai/health`);
//       const healthData = await healthResponse.json();
      
//       if (healthData.status === 'healthy') {
//         setIsConnected(true);
        
//         // Create new conversation
//         const conversationResponse = await fetch(`${URL}/api/v1/aichatbot/ai/conversation/new`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (!conversationResponse.ok) {
//           throw new Error('Failed to create conversation');
//         }
        
//         const conversationData = await conversationResponse.json();
//         setConversationId(conversationData.conversationId);
        
//         // Add welcome message
//         setMessages([{
//           id: Date.now(),
//           role: 'assistant',
//           content: "Muraho! Welcome to GELEP's AI Assistant. I'm here to help you with questions about gender equality and leadership empowerment in Rwanda. How can I assist you today?",
//           timestamp: new Date(),
//           provider: 'system'
//         }]);
//       } else {
//         throw new Error('AI service is not available');
//       }
//     } catch (error) {
//       console.error('Failed to initialize chatbot:', error);
//       setError(`Failed to connect to AI service: ${error.message}`);
//       setIsConnected(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Send message to AI
//   const sendMessage = async () => {
//     if (!inputMessage.trim() || isLoading || !conversationId) return;

//     const userMessage = {
//       id: Date.now(),
//       role: 'user',
//       content: inputMessage.trim(),
//       timestamp: new Date()
//     };

//     // Add user message to chat
//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);
//     setError(null);

//     try {
//       const URL = 'http://localhost:3000'; 
//       const response = await fetch(`${URL}/api/v1/aichatbot/ai/chat`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: userMessage.content,
//           conversationId: conversationId,
//           provider: provider
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to get AI response');
//       }

//       if (data.success) {
//         const aiMessage = {
//           id: Date.now() + 1,
//           role: 'assistant',
//           content: data.response,
//           timestamp: new Date(),
//           provider: data.provider,
//           usage: data.usage
//         };

//         setMessages(prev => [...prev, aiMessage]);
//       } else {
//         throw new Error(data.error || 'AI response was not successful');
//       }

//     } catch (error) {
//       console.error('Error sending message:', error);
      
//       // Add error message to chat
//       const errorMessage = {
//         id: Date.now() + 1,
//         role: 'assistant',
//         content: `I apologize, but I encountered an error: ${error.message}. Please try again or restart the conversation.`,
//         timestamp: new Date(),
//         isError: true
//       };
      
//       setMessages(prev => [...prev, errorMessage]);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle input key press
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Restart conversation
//   const restartConversation = () => {
//     setMessages([]);
//     setConversationId(null);
//     setError(null);
//     setIsLoading(false);
//     initializeChatbot();
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="bg-white bg-opacity-20 p-2 rounded-full">
//               <Bot size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">GELEP AI Assistant</h3>
//               <p className="text-sm text-green-100">
//                 {isConnected ? (
//                   <span className="flex items-center">
//                     <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
//                     Connected • Rwanda Context
//                   </span>
//                 ) : (
//                   <span className="flex items-center">
//                     <div className="w-2 h-2 bg-red-300 rounded-full mr-2"></div>
//                     Disconnected
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={restartConversation}
//               className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
//               title="Restart Conversation"
//             >
//               <RotateCcw size={18} />
//             </button>
//             <button
//               onClick={onClose}
//               className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
//               title="Close Chat"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Provider Selection */}
//         <div className="bg-gray-50 px-4 py-2 border-b">
//           <div className="flex items-center space-x-4 text-sm">
//             <span className="text-gray-600">AI Provider:</span>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="openai"
//                 checked={provider === 'openai'}
//                 onChange={(e) => setProvider(e.target.value)}
//                 className="mr-1"
//               />
//               OpenAI
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="gemini"
//                 checked={provider === 'gemini'}
//                 onChange={(e) => setProvider(e.target.value)}
//                 className="mr-1"
//               />
//               Gemini
//             </label>
//           </div>
//         </div>

//         {/* Error Banner */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-3 m-4 rounded">
//             <div className="flex items-center">
//               <AlertCircle className="text-red-400 mr-2" size={16} />
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//           {messages.length === 0 && isLoading && (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <Loader2 className="mx-auto mb-4 animate-spin text-blue-500" size={32} />
//                 <p className="text-gray-500">Initializing GELEP AI Assistant...</p>
//               </div>
//             </div>
//           )}

//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`flex items-start space-x-2 max-w-[80%] ${
//                   message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//                 }`}
//               >
//                 {/* Avatar */}
//                 <div
//                   className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                     message.role === 'user'
//                       ? 'bg-blue-500 text-white'
//                       : message.isError
//                       ? 'bg-red-500 text-white'
//                       : 'bg-green-500 text-white'
//                   }`}
//                 >
//                   {message.role === 'user' ? (
//                     <User size={16} />
//                   ) : message.isError ? (
//                     <AlertCircle size={16} />
//                   ) : (
//                     <Bot size={16} />
//                   )}
//                 </div>

//                 {/* Message Bubble */}
//                 <div
//                   className={`rounded-lg p-3 shadow-sm ${
//                     message.role === 'user'
//                       ? 'bg-blue-500 text-white'
//                       : message.isError
//                       ? 'bg-red-50 border border-red-200 text-red-800'
//                       : 'bg-white border border-gray-200 text-gray-800'
//                   }`}
//                 >
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                     {message.content}
//                   </p>
                  
//                   {/* Message Footer */}
//                   <div className={`flex items-center justify-between mt-2 text-xs ${
//                     message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
//                   }`}>
//                     <span>{formatTime(message.timestamp)}</span>
//                     {message.provider && message.provider !== 'system' && (
//                       <span className="capitalize">{message.provider}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Loading indicator for AI response */}
//           {isLoading && messages.length > 0 && (
//             <div className="flex justify-start">
//               <div className="flex items-start space-x-2 max-w-[80%]">
//                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
//                   <Bot size={16} />
//                 </div>
//                 <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
//                   <div className="flex items-center space-x-2">
//                     <Loader2 className="animate-spin text-green-500" size={16} />
//                     <span className="text-gray-500 text-sm">Thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="border-t bg-white p-4">
//           <div className="flex items-end space-x-2">
//             <div className="flex-1">
//               <textarea
//                 ref={inputRef}
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Ask me about gender equality in Rwanda..."
//                 className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows="2"
//                 disabled={isLoading || !conversationId}
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Press Enter to send • Shift + Enter for new line • Max 4000 characters
//               </p>
//             </div>
//             <button
//               onClick={sendMessage}
//               disabled={!inputMessage.trim() || isLoading || !conversationId}
//               className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
//               title="Send Message"
//             >
//               {isLoading ? (
//                 <Loader2 className="animate-spin" size={20} />
//               ) : (
//                 <Send size={20} />
//               )}
//             </button>
//           </div>

//           {/* Character count */}
//           <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
//             <span>
//               {conversationId ? `Conversation: ${conversationId.substring(5, 15)}...` : 'No conversation'}
//             </span>
//             <span className={inputMessage.length > 3800 ? 'text-orange-500' : ''}>
//               {inputMessage.length}/4000
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Chat Button Component to toggle the chatbot
// export const ChatButton = ({ onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
//       title="Open GELEP AI Assistant"
//     >
//       <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
//       <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
//         <span className="text-xs font-bold text-white">AI</span>
//       </div>
//     </button>
//   );
// };

// // Main export with chat state management
// const AIChatbotContainer = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   return (
//     <>
//       <ChatButton onClick={() => setIsChatOpen(true)} />
//       <AIChatbot 
//         isOpen={isChatOpen} 
//         onClose={() => setIsChatOpen(false)} 
//       />
//     </>
//   );
// };

// export default AIChatbotContainer;