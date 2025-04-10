# Live API Overview

## Introduction
The Live API enables low-latency bidirectional voice and video interactions with Gemini. It supports natural, human-like voice conversations and allows users to interrupt the model's responses using voice commands. The model processes text, audio, and video input and provides text and audio output.

## Features
- Real-time text, audio, and video interactions.
- Voice activity detection (VAD) for handling interruptions.
- System instructions to steer model behavior.
- Function calling for external tool integration.
- Session resumption and context window compression.

## Usage Examples

### Send and Receive Text
```python
import asyncio
from google import genai

client = genai.Client(api_key="GEMINI_API_KEY", http_options={'api_version': 'v1alpha'})
model = "gemini-2.0-flash-live-001"

config = {"response_modalities": ["TEXT"]}

async def main():
    async with client.aio.live.connect(model=model, config=config) as session:
        while True:
            message = input("User> ")
            if message.lower() == "exit":
                break
            await session.send(input=message, end_of_turn=True)

            async for response in session.receive():
                if response.text is not None:
                    print(response.text, end="")

if __name__ == "__main__":
    asyncio.run(main())
```

### Receive Audio
```python
import asyncio
import wave
from google import genai

client = genai.Client(api_key="GEMINI_API_KEY", http_options={'api_version': 'v1alpha'})
model = "gemini-2.0-flash-live-001"

config = {"response_modalities": ["AUDIO"]}

async def main():
    async with client.aio.live.connect(model=model, config=config) as session:
        wf = wave.open("audio.wav", "wb")
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)

        message = "Hello? Gemini are you there?"
        await session.send(input=message, end_of_turn=True)

        async for idx, response in enumerate(session.receive()):
            if response.data is not None:
                wf.writeframes(response.data)

        wf.close()

if __name__ == "__main__":
    asyncio.run(main())
```

## Limitations
- **Authentication**: Server-to-server authentication only; not recommended for direct client use.
- **Session Duration**: Limited to 15 minutes for audio or 2 minutes for audio and video.
- **Context Window**: Limited to 32k tokens.
- **Third-party Integrations**: Explore options like Daily and Livekit for web and mobile app deployments.