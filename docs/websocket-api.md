# WebSocket API Reference

## Overview
The Live API is a stateful WebSocket API that allows clients to interact with the Gemini server. It supports sending and receiving text, audio, and video messages in real time.

### WebSocket Endpoint
```
wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent
```

## Session Configuration
The initial message sets the session configuration. Example:
```json
{
  "model": "models/gemini-2.0-flash-exp",
  "generationConfig": {
    "candidateCount": 1,
    "maxOutputTokens": 100,
    "temperature": 0.7,
    "topP": 0.9,
    "topK": 40
  },
  "systemInstruction": "You are a helpful assistant.",
  "tools": []
}
```

## Supported Client Messages
- **BidiGenerateContentSetup**: Sent as the first message to configure the session.
- **BidiGenerateContentClientContent**: Incremental updates to the conversation.
- **BidiGenerateContentRealtimeInput**: Real-time input (audio, video, or text).
- **BidiGenerateContentToolResponse**: Response to a tool call from the server.

## Supported Server Messages
- **setupComplete**: Acknowledges session setup.
- **serverContent**: Content generated by the model.
- **toolCall**: Requests the client to execute a function.
- **toolCallCancellation**: Cancels a previously issued tool call.
- **goAway**: Indicates the server will disconnect soon.

## Example Usage
```javascript
const ws = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent');

ws.onopen = () => {
    ws.send(JSON.stringify({
        model: "models/gemini-2.0-flash-exp",
        generationConfig: {
            candidateCount: 1,
            maxOutputTokens: 100
        },
        systemInstruction: "You are a helpful assistant."
    }));
};

ws.onmessage = (event) => {
    console.log('Message from server:', event.data);
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('WebSocket connection closed.');
};
```