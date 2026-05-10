const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Store the conversation history
let conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to UI
  appendMessage('user', userMessage);
  input.value = '';

  // Add user message to conversation state
  conversation.push({ role: 'user', text: userMessage });

  // Add "Thinking..." message to UI and get its reference
  const thinkingMsgNode = appendMessage('model', 'Ustadz sedang berfikir...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server.');
    }

    const data = await response.json();
    const botMessage = data.result;

    if (!botMessage) {
      throw new Error('Sorry, no response received.');
    }

    // Update the "Thinking..." message with actual response
    thinkingMsgNode.textContent = botMessage;

    // Add bot message to conversation state
    conversation.push({ role: 'model', text: botMessage });
  } catch (error) {
    console.error('Chat error:', error);
    // Display error message in the chat box
    thinkingMsgNode.textContent = error.message || 'Sorry, no response received.';
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
