# MedTranslate - Healthcare Doctor-Patient Translation Web Application

A real-time translation bridge between doctors and patients, enabling seamless multilingual communication in healthcare settings.

![MedTranslate](https://img.shields.io/badge/MedTranslate-Healthcare%20Translation-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)

## 🌟 Project Overview

MedTranslate is a full-stack web application designed to facilitate real-time communication between healthcare providers and patients who speak different languages. The application leverages AI-powered translation and speech recognition to break down language barriers in medical consultations.

### Key Features

- **Real-Time Translation**: Instant translation between doctor and patient messages
- **Dual Role Support**: Clear distinction between Doctor and Patient interfaces
- **Voice Recording**: Record and transcribe audio messages directly in the browser
- **Conversation History**: Persistent storage of all conversations with timestamps
- **Search Functionality**: Search across all conversations with highlighted results
- **AI-Powered Summaries**: Generate medical summaries highlighting symptoms, diagnoses, medications, and follow-up actions
- **Mobile-Friendly**: Responsive design that works on all devices

## ✅ Features Attempted and Completed

| Feature | Status | Notes |
|---------|--------|-------|
| Real-Time Translation | ✅ Complete | Using OpenAI GPT-4o-mini |
| Text Chat Interface | ✅ Complete | Clean UI with role distinction |
| Audio Recording | ✅ Complete | Browser-based recording with WebM format |
| Audio Transcription | ✅ Complete | Using OpenAI Whisper |
| Conversation Logging | ✅ Complete | Persisted in localStorage |
| Conversation Search | ✅ Complete | Full-text search with highlighting |
| AI-Powered Summary | ✅ Complete | Structured medical summaries |
| Mobile-Friendly UI | ✅ Complete | Responsive design |
| Multiple Languages | ✅ Complete | 12 languages supported |

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **API Routes**: Next.js API Routes
- **AI/LLM**: OpenAI API (GPT-4o-mini for translation/summarization, Whisper for transcription)

### Storage
- **Client-side**: localStorage via Zustand persist middleware
- **Audio**: Blob URLs for playback

## 🤖 AI Tools and Resources Leveraged

1. **OpenAI GPT-4o-mini**: Used for:
   - Real-time text translation with medical context awareness
   - Conversation summarization with structured medical output
   
2. **OpenAI Whisper**: Used for:
   - Speech-to-text transcription of audio recordings
   - Multi-language audio recognition

3. **AI-Assisted Development**: 
   - Code generation and architecture planning
   - Component design and best practices

## 📋 Supported Languages

- English
- Spanish (Español)
- Chinese (中文)
- Hindi (हिन्दी)
- Arabic (العربية)
- Portuguese (Português)
- French (Français)
- German (Deutsch)
- Japanese (日本語)
- Korean (한국어)
- Vietnamese (Tiếng Việt)
- Russian (Русский)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/healthcare-translator.git
cd healthcare-translator
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
healthcare-translator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── translate/      # Translation API endpoint
│   │   │   ├── transcribe/     # Audio transcription endpoint
│   │   │   └── summarize/      # Summary generation endpoint
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── ChatInterface.tsx   # Main chat component
│   │   ├── ChatInput.tsx       # Message input with audio
│   │   ├── MessageBubble.tsx   # Individual message display
│   │   ├── RoleSelector.tsx    # Doctor/Patient toggle
│   │   ├── LanguageSelector.tsx # Language dropdown
│   │   ├── ConversationList.tsx # Sidebar with history
│   │   ├── SearchPanel.tsx     # Search functionality
│   │   └── ConversationSummary.tsx # AI summary display
│   ├── hooks/
│   │   └── useAudioRecorder.ts # Audio recording hook
│   ├── store/
│   │   └── useConversationStore.ts # Zustand store
│   └── types/
│       └── index.ts            # TypeScript definitions
├── .env.example                # Environment template
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎯 Usage Guide

### Starting a Conversation

1. Select your role (Doctor or Patient) using the toggle buttons
2. Configure languages in the settings panel (gear icon)
3. Type a message or click the microphone to record audio
4. Messages are automatically translated to the other party's language

### Voice Messages

1. Click the microphone icon to start recording
2. Speak your message
3. Click "Stop" to end recording
4. Preview the audio and click "Send" to transcribe and translate

### Generating Summaries

1. Have a conversation with multiple messages
2. Click the document icon in the header
3. View the AI-generated summary with:
   - Overview of the conversation
   - Symptoms mentioned
   - Diagnoses discussed
   - Medications referenced
   - Follow-up actions recommended

### Searching Conversations

1. Click the search icon in the header
2. Type your search query
3. Results show matching messages with context
4. Click a result to jump to that conversation

## ⚠️ Known Limitations and Trade-offs

### Current Limitations

1. **Storage**: Uses localStorage instead of a database
   - Data is browser-specific and not synced across devices
   - Limited storage capacity (~5MB)
   - No user authentication

2. **Audio Storage**: Audio files are stored as Blob URLs
   - Audio is lost when the page is refreshed
   - Not persisted across sessions

3. **Real-time**: Not truly real-time (no WebSocket)
   - Uses request-response pattern
   - No live typing indicators

4. **Offline Support**: Requires internet connection
   - Translation and transcription need API access

### Trade-offs Made

1. **Simplicity over Complexity**: Chose localStorage over database setup for faster development
2. **Client-side State**: Zustand for state management instead of server-side sessions
3. **Single API Provider**: OpenAI for all AI features instead of multiple providers

### Future Improvements

- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] Implement user authentication
- [ ] Add WebSocket for real-time updates
- [ ] Store audio files in cloud storage (S3/Cloudinary)
- [ ] Add text-to-speech for translated messages
- [ ] Implement conversation export (PDF/JSON)
- [ ] Add medical terminology dictionary
- [ ] Support for more languages

## 🔒 Privacy Considerations

- All conversations are stored locally in the browser
- Audio recordings are processed through OpenAI's API
- No data is stored on external servers (except during API calls)
- Consider HIPAA compliance requirements for production use

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini and Whisper APIs
- Next.js team for the excellent framework
- Tailwind CSS for the styling system
- Lucide for the beautiful icons

---

**Note**: This project was built as a demonstration of full-stack development capabilities with AI integration. For production healthcare use, additional security, compliance, and reliability measures would be required.
