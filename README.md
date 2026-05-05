# Vote For Nation (Prompt War 2.0) - Election Assistant

An AI-powered election assistant designed to help Indian citizens navigate the voting process with ease.

## 🗳️ Problem Statement
Many voters in India face challenges due to:
- Complexity of the election process.
- Lack of clarity on registration deadlines and polling station locations.
- Language barriers in accessing official information.
- Uncertainty about how to use Electronic Voting Machines (EVMs).

## 🚀 Solution
**Vote For Nation** provides a comprehensive solution:
- **Multilingual Support**: Real-time translation into 22+ Indian languages.
- **AI Assistant**: A context-aware chatbot that answers election-related queries.
- **Practice Simulation**: A mock voting module to familiarize voters with the EVM and VVPAT process.
- **Reminders & Timeline**: Proactive notifications for registration deadlines and election day.
- **Accessibility First**: High-contrast modes and large text support for better readability.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Cloud Run (GCP)                   │
│  ┌──────────────┐     ┌──────────────────────────┐  │
│  │   Frontend    │     │        Backend           │  │
│  │  React + Vite │────▶│  Express.js + Helmet     │  │
│  │    (SPA)      │     │  ┌────────────────────┐  │  │
│  └──────────────┘     │  │   Google Gemini AI  │  │  │
│                        │  ├────────────────────┤  │  │
│                        │  │ Cloud Speech-to-Text│  │  │
│                        │  ├────────────────────┤  │  │
│                        │  │ Cloud Text-to-Speech│  │  │
│                        │  ├────────────────────┤  │  │
│                        │  │  Firebase Firestore │  │  │
│                        │  ├────────────────────┤  │  │
│                        │  │   Firebase FCM      │  │  │
│                        │  └────────────────────┘  │  │
│                        └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Features
- **Smart Chatbot**: Voice and text interaction for instant help using Google Gemini AI.
- **Polling Finder**: Locate your nearest polling booth via integrated Google Maps.
- **Interactive Timeline**: Track your voter journey from registration to results.
- **Resources Library**: Quick access to official guides and tutorial videos.
- **Practice Simulation**: A full mock voting experience (7-step process).
- **Push Notifications**: FCM-powered reminders for election deadlines.

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite 5 | SPA with lazy-loaded routes |
| Backend | Node.js + Express 5 | REST API server |
| AI | Google Gemini (gemma-3-12b-it) | Chatbot & translation |
| Speech | Google Cloud Speech & TTS | Voice I/O with 14+ Indian language support |
| Database | Firebase Firestore | Reminders, progress, FCM tokens |
| Notifications | Firebase Cloud Messaging | Push notifications |
| Maps | Google Maps JavaScript API | Polling booth finder |
| Security | Helmet, Rate Limiting, CSP | Production-grade security headers |
| Testing | Vitest (frontend) + Mocha/Chai (backend) | Unit & integration tests |
| Deployment | Google Cloud Run | Containerized deployment via Dockerfile |

## 📦 Project Structure

```
Prompt_war2.0/
├── backend/
│   ├── config/           # Firebase configuration
│   ├── middleware/        # Authentication middleware
│   ├── routes/            # API route handlers
│   │   ├── chat.js        # AI chatbot (Gemini)
│   │   ├── config.js      # Client configuration
│   │   ├── progress.js    # User progress tracking
│   │   ├── reminders.js   # Reminder CRUD + FCM
│   │   ├── speech.js      # STT/TTS services
│   │   └── translate.js   # Multi-language translation
│   ├── services/          # Background services
│   │   └── notificationScheduler.js
│   ├── tests/             # Backend test suites
│   ├── translations/      # Cached translations
│   └── index.js           # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── test/          # Frontend test suites
│   │   ├── locales/       # i18n locale files
│   │   ├── App.jsx        # Main application component
│   │   ├── Chatbot.jsx    # AI assistant interface
│   │   ├── PollingMap.jsx  # Google Maps integration
│   │   ├── PracticeSimulation.jsx  # Mock voting module
│   │   ├── ProcessList.jsx # Election process steps
│   │   ├── RemindersPanel.jsx # Notification management
│   │   ├── Resources.jsx  # Learning resources
│   │   ├── Settings.jsx   # User preferences
│   │   └── Timeline.jsx   # Election timeline
│   ├── eslint.config.js   # Frontend ESLint configuration
│   └── vitest.config.js   # Frontend test configuration
├── Dockerfile             # Container build configuration
├── package.json           # Root orchestration scripts
└── README.md
```

## 🔌 API Documentation

### Health Check
- `GET /api/health` — Returns `{ status: "ok" }`

### Chat (AI Assistant)
- `POST /api/chat` — Send a query to the election assistant
  - Body: `{ message: string, mode?: "beginner"|"intermediate"|"expert", language?: string }`
  - Response: `{ reply: string }`

### Translation
- `POST /api/translate` — Translate UI text strings
  - Body: `{ texts: { key: value }, targetLanguage: string }`
  - Response: `{ translated: { key: translatedValue } }`

### Speech
- `POST /api/speech/transcribe` — Transcribe audio to text (multipart upload)
- `POST /api/speech/tts` — Convert text to speech
  - Body: `{ text: string, language?: string }`
  - Response: `{ audioContent: base64, contentType: string }`

### Reminders
- `GET /api/reminders` — List all reminders
- `POST /api/reminders` — Create a reminder
- `DELETE /api/reminders/:id` — Delete a reminder
- `PATCH /api/reminders/:id` — Toggle reminder enabled status
- `POST /api/reminders/token` — Register FCM device token

### User Progress
- `GET /api/progress` — Get user progress (requires auth)
- `POST /api/progress/update` — Update step completion (requires auth)

### Configuration
- `GET /api/config/maps` — Get Google Maps API key

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Yes |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (production) | Production |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Google Cloud credentials JSON (production) | Production |
| `PORT` | Server port (default: 8080) | No |
| `NODE_ENV` | Environment (`production`/`test`) | No |

## 🧪 Testing

### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```

### Backend Tests (Mocha + Chai)
```bash
cd backend
npm test
```

### Linting
```bash
cd frontend
npm run lint
```

### Test Coverage
- **Frontend**: 8 test suites covering App, Chatbot, Settings, ProcessList, RemindersPanel, Accessibility, LanguageContext, IntegrationFlow
- **Backend**: 4 test suites covering API integration, route unit tests, middleware, and services

## 🚀 Deployment

### Local Development
```bash
# Start both frontend and backend
./start-servers.bat

# Or manually:
cd backend && node index.js
cd frontend && npm run dev
```

### Production (Cloud Run)
The project is configured for continuous deployment via GitHub. Pushing to `main` automatically triggers a Cloud Build that:
1. Builds the React frontend (`npm run build`)
2. Installs backend dependencies
3. Deploys the container to Cloud Run

```bash
# Manual deployment trigger
gcloud run deploy election-assistant \
  --source . \
  --project prompt-war-2 \
  --region asia-south2
```

## 🧪 Technical Excellence
- **Frontend**: React + Vite with Vitest for robust unit testing.
- **Backend**: Node.js + Express with AI integration (Google Gemini).
- **Security**: Hardened headers (Helmet, CSP, HSTS) and rate-limiting for production stability.
- **Accessibility**: 97.5%+ accessibility score following ARIA best practices.
- **Code Quality**: ESLint configured for both frontend and backend, JSDoc documentation across all modules.
- **Performance**: Lazy-loaded routes, file-based translation caching, efficient API design.

## 📄 License
ISC