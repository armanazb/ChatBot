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
          <h3>Potential Interactions Between Olanzapine and Alcohol:</h3>
          <ol>
            <li>
              <strong>Increased CNS Depression:</strong> Both olanzapine and alcohol can depress the central nervous system (CNS). When combined, their sedative effects can be additive, leading to enhanced drowsiness, dizziness, and difficulty concentrating. In severe cases, this combination can impair motor coordination and judgment, which can be dangerous.
            </li>
            <li>
              <strong>Enhanced Side Effects:</strong> Alcohol can exacerbate the common side effects of olanzapine, such as:
              <ul>
                <li>Drowsiness</li>
                <li>Dizziness</li>
                <li>Orthostatic hypotension (a form of low blood pressure that happens when you stand up from sitting or lying down)</li>
                <li>Increased risk of seizures (particularly if you have an underlying seizure disorder)</li>
              </ul>
            </li>
          </ol>
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
