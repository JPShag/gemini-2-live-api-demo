export const getWebsocketUrl = () => {
    const apiKey = localStorage.getItem('apiKey');
    return `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
};

export const getDeepgramApiKey = () => {
    return localStorage.getItem('deepgramApiKey') || '';
};

// Audio Configurations
export const MODEL_SAMPLE_RATE = parseInt(localStorage.getItem('sampleRate')) || 27000;

const thresholds = {
    0: "BLOCK_NONE",
    1: "BLOCK_ONLY_HIGH",
    2: "BLOCK_MEDIUM_AND_ABOVE",
    3: "BLOCK_LOW_AND_ABOVE"
}

export const getConfig = () => ({
    model: 'models/gemini-2.0-flash-exp',
    generationConfig: {
        temperature: (() => {
            const temp = parseFloat(localStorage.getItem('temperature'));
            return isNaN(temp) ? 1.8 : temp;
        })(),
        top_p: (() => {
            const topP = parseFloat(localStorage.getItem('top_p'));
            return isNaN(topP) ? 0.95 : topP;
        })(),
        top_k: (() => {
            const topK = parseInt(localStorage.getItem('top_k'));
            return isNaN(topK) ? 65 : topK;
        })(),
        responseModalities: "audio",
        speechConfig: {
            voiceConfig: { 
                prebuiltVoiceConfig: { 
                    voiceName: localStorage.getItem('voiceName') || 'Aoede'
                }
            }
        }
    },
    systemInstruction: {
        parts: [{
            text: localStorage.getItem('systemInstructions') || "You are a helpful assistant"
        }]
    },
    tools: {
        functionDeclarations: [],
    },
    safetySettings: [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": (() => {
                const threshold = localStorage.getItem('harassmentThreshold');
                return thresholds[threshold] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
            })()
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": (() => {
                const threshold = localStorage.getItem('dangerousContentThreshold');
                return thresholds[threshold] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
            })()
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": (() => {
                const threshold = localStorage.getItem('sexuallyExplicitThreshold');
                return thresholds[threshold] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
            })()
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": (() => {
                const threshold = localStorage.getItem('hateSpeechThreshold');
                return thresholds[threshold] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
            })()
        },
        {
            "category": "HARM_CATEGORY_CIVIC_INTEGRITY",
            "threshold": (() => {
                const threshold = localStorage.getItem('civicIntegrityThreshold');
                return thresholds[threshold] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
            })()
        }
    ]
});