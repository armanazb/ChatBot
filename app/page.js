'use client';

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `
        <div class="message-content">
          <p>Thank you for providing the medications.</p>
          <h3>Potential Interactions:</h3>
          <h4>Medication 1</h4>
          <ul>
            <li><strong>Class:</strong> [Class of Medication 1]</li>
            <li><strong>Uses:</strong> [Common uses for Medication 1]</li>
            <li><strong>Mechanism of Action:</strong> [How Medication 1 works]</li>
            <li><strong>Side Effects:</strong>
              <ul>
                <li>[Side Effect 1]</li>
                <li>[Side Effect 2]</li>
                <li>[Side Effect 3]</li>
              </ul>
            </li>
          </ul>
          <h4>Medication 2</h4>
          <ul>
            <li><strong>Class:</strong> [Class of Medication 2]</li>
            <li><strong>Uses:</strong> [Common uses for Medication 2]</li>
            <li><strong>Mechanism of Action:</strong> [How Medication 2 works]</li>
            <li><strong>Side Effects:</strong>
              <ul>
                <li>[Side Effect 1]</li>
                <li>[Side Effect 2]</li>
                <li>[Side Effect 3]</li>
              </ul>
            </li>
          </ul>
        </div>
      `,
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const newMessage = result.message;

      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: newMessage },
        ];
      });
    } catch (error) {
      console.error('Error:', error.message);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later. Error: " + error.message },
      ]);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
                className="message-content"
                dangerouslySetInnerHTML={{ __html: message.content }}
              >
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            inputProps={{ style: { color: 'white' } }} // text color 
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6495ED', // default border color
                },
                '&:hover fieldset': {
                  borderColor: '#4A7ABD', // hover border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6495ED', // focused border color
                },
              },
            }}
          />
          <Button
          variant="contained" 
          onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
