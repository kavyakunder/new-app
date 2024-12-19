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
  {
    sender: 'user',
    message: 'how are you doing?',
    direction: 'outgoing',
    sentTime: 'just now',
  },
];

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [getNewMessages, setNewMessages] = useState(messages);
  const recognitionRef = useRef(null);

  // useEffect(() => {
  // const checkMicrophonePermission = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //     });
  //     console.log('Microphone permission granted!');
  //     stream.getTracks().forEach((track) => track.stop());
  //   } catch (error) {
  //     console.error('Microphone permission not granted:', error);
  //     alert('Please allow microphone access in your browser settings.');
  //   }
  // };

  // checkMicrophonePermission();
  console.log("hello world!");
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      // Check browser support first
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Browser does not support getUserMedia and this');
        return;

      }

      try {
        // Log all available media devices before requesting
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(
          'Available Devices:',
          devices.map((device) => ({
            kind: device.kind,
            label: device.label,
            deviceId: device.deviceId,
          }))
        );

        // More detailed audio constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: { ideal: true },
            noiseSuppression: { ideal: true },
            autoGainControl: { ideal: true },
          },
        });

        console.log("stream is",stream);
        console.log('Microphone Stream Details:', {
          tracks: stream.getTracks().map((track) => ({
            kind: track.kind,
            label: track.label,
            enabled: track.enabled,
          })),
        });

        // Always stop tracks after checking
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error('Detailed Microphone Permission Error:', {
          name: error.name,
          message: error.message,
          code: error.code,
          constraint: error.constraint,
        });

        // Detailed error handling
        switch (error.name) {
          case 'NotAllowedError':
            alert(
              'Microphone access blocked. Check browser settings, HTTPS, and permissions.'
            );
            console.log(
              'Microphone access blocked. Check browser settings, HTTPS, and permissions'
            );
            break;
          case 'NotFoundError':
            alert('No microphone devices found.');
            console.log('No microphone');
            break;
          case 'OverconstrainedError':
            alert('Cannot satisfy audio constraints.');
            console.log('Cannot satisfy audio constraints');

            break;
          default:
            alert(`Unexpected microphone access error: ${error.name}`);
        }
      }
    };

    // Wrap in a user interaction if possible
    checkMicrophonePermission();
  }, []);
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log('Sppech recogn', SpeechRecognition);
    if (SpeechRecognition) {
      console.log('went inside if blocl');
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      console.log('recogntion');
      recognition.onstart = () => {
        console.log('ekef');
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
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
    console.log('recogn');
    if (!recognition) {
      console.log('not avaiabale');
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

  const handleTextSendMessage = () => {
    setNewMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        message: inputValue,
        direction: 'outgoing',
        sentTime: 'just now',
      },
    ]);
    setInputValue('');
  };

  // useEffect(() => {
  //   const meta = document.createElement('meta');
  //   meta.httpEquiv = 'Permissions-Policy';
  //   meta.content = 'microphone=self, camera=self';
  //   document.head.appendChild(meta);

  //   return () => {
  //     document.head.removeChild(meta);
  //   };
  // }, []);

  console.log('checking logs for recording');
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
