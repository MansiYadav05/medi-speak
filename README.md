

# Medi-Speak: Compassionate Medical Translation

Medi-Speak is an AI-powered platform designed to bridge the gap between complex clinical documentation and patient understanding. Using Google's Gemini models, it translates dense medical jargon into clear, 6th-grade level English while maintaining strict privacy standards through automated anonymization.

## ✨ Key Features

- **Multimodal Analysis:** Process text-based reports or upload medical images and PDFs for instant interpretation.
- **Privacy-First Scrubbing:** Integrated "SCRUBBED" engine that removes Personally Identifiable Information (PII) before analysis begins.
- **Interactive Q&A:** Grounded chat interface allowing patients to ask follow-up questions about their specific results.
- **Structured Insights:** Provides plain English summaries, key findings explanation, a custom medical dictionary, and prioritized next steps.
- **Secure History:** Persistent storage for interpretations using Firebase Authentication and encrypted Firestore rules.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **AI Intelligence:** Google Gemini API (`gemini-3-flash-preview`).
- **Backend Services:** Firebase (Authentication & Cloud Firestore).
- **Containerization:** Docker & Nginx.

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd medi-speak
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set Environment Variables:**
    Create a `.env.local` file in the root directory and add your Gemini API Key:
    ```env
    GEMINI_API=your_actual_api_key_here
    ```
4.  **Launch the development server:**
    ```bash
    npm run dev
    ```

## 🐳 Cloud Deployment

### Deploying to Vercel (Recommended)

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  **Import to Vercel:** Log in to [Vercel](https://vercel.com) and click "Add New" > "Project".
3.  **Environment Variables:** During the "Configure Project" step, expand the "Environment Variables" section.
4.  **Add Key:** Add `GEMINI_API` as the name and your actual Gemini API Key as the value.
5.  **Deploy:** Click "Deploy". Vercel will automatically detect Vite and set up the build commands.

### Alternative: Vercel CLI
If you prefer the command line:
```bash
npm i -g vercel
vercel env add GEMINI_API
vercel --prod
```
