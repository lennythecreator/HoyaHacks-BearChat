// chat.js

// Get references to chat messages container and chat input
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

// Function to add a message to the chat
function addMessage(role, content) {
    const messageElement = document.createElement('div');
    if (role === 'user') {
        messageElement.classList.add('flex', 'items-end', 'justify-end', 'space-x-2');
        messageElement.innerHTML = `
            <div class="bg-gray-100 py-2 px-4 rounded-lg">
                <p class="text-sm text-gray-800">${content}</p>
            </div>
            <img src="user_avatar.png" alt="User Avatar" class="w-8 h-8 rounded-full">
        `;
    } else if (role === 'assistant') {
        messageElement.classList.add('flex', 'items-start', 'space-x-2');
        messageElement.innerHTML = `
            <img src="bot_avatar.png" alt="Bot Avatar" class="w-8 h-8 rounded-full">
            <div class="bg-blue-100 py-2 px-4 rounded-lg">
                <p class="text-sm text-gray-800">${content}</p>
            </div>
        `;
    }
    chatMessages.appendChild(messageElement);
}

// Function to handle user input and fetch response from Azure OpenAI API
async function handleUserInput() {
    const userInput = chatInput.value.trim();
    if (userInput !== '') {
        // Add user message to chat
        addMessage('user', userInput);

        try {
            // Send user input to Azure OpenAI API and fetch response
            const response = await fetch('https://bearchat01.openai.azure.com/openai/deployments/BearChat/chat/completions?api-version=2023-07-01-preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'YOUR_AZURE_OPENAI_API_KEY' // Replace with your Azure OpenAI API key
                },
                body: JSON.stringify({
                    "messages": [
                        {
                            "role": "user",
                            "content": userInput
                        }
                    ],
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "frequency_penalty": 0,
                    "presence_penalty": 0,
                    "max_tokens": 50,
                    "stop": null
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response from Azure OpenAI API');
            }

            const data = await response.json();

            // Add assistant's response to chat
            addMessage('assistant', data.choices[0].content.trim());

        } catch (error) {
            console.error('Error:', error);
            // Add error message to chat
            addMessage('assistant', 'Sorry, an error occurred while processing your request.');
        }

        // Clear input field
        chatInput.value = '';
    }
}

// Event listener for user input
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});
