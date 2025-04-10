// Main script for initializing GeminiAgent with chat and tool integrations.
// This file sets up communication, registers tools, and defines event handlers
// to manage chat interactions based on agent events.

import { GeminiAgent } from './main/agent.js';
import { getConfig, getWebsocketUrl, getDeepgramApiKey, MODEL_SAMPLE_RATE } from './config/config.js';

import { GoogleSearchTool } from './tools/google-search.js';
import { ToolManager } from './tools/tool-manager.js';
import { ChatManager } from './chat/chat-manager.js';

import { setupEventListeners } from './dom/events.js';
import SettingsManager from './settings/settings-manager.js';

// Retrieve configuration and API credentials.
const url = getWebsocketUrl();
const config = getConfig();
const deepgramApiKey = getDeepgramApiKey();

// Initialize tool and chat managers.
const toolManager = new ToolManager();

const settingsManager = new SettingsManager();

// Register tools with error handling.
try {
    toolManager.registerTool('googleSearch', new GoogleSearchTool());
    console.log('Tool googleSearch registered successfully');
} catch (error) {
    console.error('Failed to register tool googleSearch:', error);
}

const chatManager = new ChatManager();

// Create a GeminiAgent instance with necessary configuration.
const geminiAgent = new GeminiAgent({
    url,
    config,
    deepgramApiKey,
    modelSampleRate: MODEL_SAMPLE_RATE,
    toolManager,
    settingsManager
});

// Utility function to finalize the current streaming message. Consider making this async if needed in the future
const finalizeMessage = () => {
    chatManager.finalizeStreamingMessage();
};

// Event handler for live transcription updates.
geminiAgent.on('transcription', (transcript) => {
    // Update the chat interface with the live transcript.
    chatManager.updateStreamingMessage(transcript);
});

// Event handler for when text is sent.
geminiAgent.on('text_sent', (text) => {
    finalizeMessage();
    chatManager.addUserMessage(text);
});

// Event handler for interruptions in streaming.
geminiAgent.on('interrupted', () => {
    finalizeMessage();
    // If there is no previous user message type, treat it as an audio message.
    if (!chatManager.lastUserMessageType) {
        chatManager.addUserAudioMessage();
    }
});

// Event handler for turn completions.
geminiAgent.on('turn_complete', finalizeMessage);

// Connect the GeminiAgent to begin communication.
geminiAgent.connect()
    .catch(error => {
        console.error("Failed to connect to GeminiAgent:", error);
        chatManager.addAgentMessage("Failed to connect. Please check the console for details.");
    });

// Setup additional DOM event listeners for user interaction.
setupEventListeners(geminiAgent, settingsManager);