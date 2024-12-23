import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import Messages from './Messages';
import styless from './chat.module.css';
import { FaMicrophone } from 'react-icons/fa';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

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
  const [getNewMessages, setNewMessages] = useState(messages);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    alert('Speech recognition is not supported in this browser.');
  }

  const handleSpeechRecognition = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setNewMessages((prev) => [
        ...prev,
        {
          sender: 'user',
          message: transcript,
          direction: 'outgoing',
          sentTime: 'just now',
        },
      ]);
      setInputValue(transcript);
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleTextSendMessage = async () => {
    setNewMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        message: inputValue,
        direction: 'outgoing',
        sentTime: new Date(Date.now()).toLocaleString(),
      },
    ]);

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

      if (inputValue.includes('order')) {
        keyword = 'order';
      } else if (inputValue.includes('customer')) {
        keyword = 'customer';
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

    setInputValue('');
  };

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
            onSend={handleTextSendMessage}
          />
        </div>
        <button
          onClick={handleSpeechRecognition}
          className={listening ? styless.recordText : styless.recordButton}
        >
          {listening ? (
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
