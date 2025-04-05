import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import './Chatbot.css'; // Add this line to import the CSS file


const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isApiAvailable, setIsApiAvailable] = useState(true);
    const messagesEndRef = useRef(null);

    // Check API availability on component mount
    useEffect(() => {
        const checkApiStatus = async () => {
          try {
            const response = await axios.get(
              'http://localhost:5000/api/validate-key',
              { withCredentials: true } // Important for CORS
            );
            setIsApiAvailable(response.data.valid);
          } catch (error) {
            console.error('API Check Failed:', error);
            setIsApiAvailable(false);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: 'Warning: Unable to connect to AI service. Please check the server.'
            }]);
          }
        };
        checkApiStatus();
      }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !isApiAvailable) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                messages: newMessages
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 15000 // Increased timeout for generative AI
            });
            
            setMessages(prev => [...prev, response.data.message]);
        } catch (error) {
            console.error('Chat Error:', error);
            
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            if (error.response) {
                errorMessage = error.response.data?.error || 
                             error.response.data?.details || 
                             errorMessage;
            } else if (error.message.includes('timeout')) {
                errorMessage = 'The request timed out. Please try again.';
            }
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: errorMessage
            }]);
            
            // If it's an authorization error, mark API as unavailable
            if (error.response?.status === 401) {
                setIsApiAvailable(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Gemini AI Assistant</h2>
                {!isApiAvailable && (
                    <div className="api-warning">
                        Service currently unavailable
                    </div>
                )}
            </div>
            
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-icon">
                            {msg.role === 'user' ? <FiUser /> : <FiMessageSquare />}
                        </div>
                        <div className="message-content">
                            {msg.content.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                    <div className="message assistant">
                        <div className="message-icon">
                            <FiMessageSquare />
                        </div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isApiAvailable ? "Type your message..." : "Service unavailable"}
                    disabled={isLoading || !isApiAvailable}
                    autoFocus
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !isApiAvailable || !input.trim()}
                    aria-label="Send message"
                >
                    <FiSend />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;