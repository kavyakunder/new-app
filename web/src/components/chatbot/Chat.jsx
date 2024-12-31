import React, { useState, useRef, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import Messages from './Messages';
import styless from './chat.module.css';
import { FaMicrophone } from 'react-icons/fa';

const messages = [
  {
    sender: 'system',
    message: `Hello! How can I help you today?`,
    direction: 'incoming',
    sentTime: 'just now',
  },
];

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [getNewMessages, setNewMessages] = useState(messages);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleTextSendMessage(transcript);
        setInputValue(transcript);
        setTimeout(() => {
          setInputValue('');
        }, 2000);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSpeechRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    console.log('check here');
    if (isRecording) {
      console.log('first if');
      recognition.stop();
    } else {
      console.log('second');
      recognition.start();
    }
  };

  const handleTextSendMessage = async (inputValue) => {
    setNewMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        message: inputValue,
        direction: 'outgoing',
        sentTime: new Date(Date.now()).toLocaleString(),
      },
    ]);
    setInputValue('');

    setNewMessages((prev) => [
      ...prev,
      {
        sender: 'system',
        message: '...',
        direction: 'incoming',
        sentTime: new Date(Date.now()).toLocaleString(),
      },
    ]);

    try {
      let keyword = 'products';

      if (inputValue.includes('orders')) {
        keyword = 'order';
      } else if (inputValue.includes('customer')) {
        keyword = 'customers';
      } else {
        keyword = 'products';
      }
      const response = await fetch(
        'https://766iuautdb.execute-api.ap-southeast-2.amazonaws.com/dev//ai',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `${keyword}:${inputValue}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data2 = await response.json();

      setNewMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages.pop();
        updatedMessages.push({
          sender: 'system',
          message: data2.data,
          direction: 'incoming',
          sentTime: new Date(Date.now()).toLocaleString(),
        });
        return updatedMessages;
      });
    } catch (err) {
      console.log('Err', err);

      setTimeout(() => {
        setNewMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages.pop();
          updatedMessages.push({
            sender: 'system',
            message:
              'Sorry, your request couldn’t be processed. Please check your input and try again.',
            direction: 'incoming',
            sentTime: new Date(Date.now()).toLocaleString(),
          });
          return updatedMessages;
        });
      }, 2000);
    }
  };
  console.log('chat');
  return (
    <div className={styless.container}>
      <Messages messages={getNewMessages} loading={false} />
      <div className={styless.inputContainer}>
        <div className={styless.messageInput}>
          <MessageInput
            autoFocus
            placeholder="Type your messages…"
            attachButton={false}
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            onSend={() => handleTextSendMessage(inputValue)}
          />
        </div>
        <button
          onClick={handleSpeechRecognition}
          className={isRecording ? styless.recordText : styless.recordButton}
        >
          {isRecording ? (
            <span className={styless.stopRecording}>Recording...</span>
          ) : (
            <FaMicrophone size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;

// https://main.dngxzijetkhut.amplifyapp.com
