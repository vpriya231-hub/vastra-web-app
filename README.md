# V Astra Create - Web App

A complete, production-ready web application for AI-powered app generation. Built with React, Node.js, Firebase, and Tailwind CSS.

## 🎯 Features

- **AI App Generation** - Generate fully functional web apps from text prompts
- **Hybrid AI Routing** - Free tier uses Hugging Face, Paid tiers use Gemini 2.5 Flash
- **Subscription Management** - 4 tier plans with credit-based system
- **Firebase Authentication** - Google Sign-In integration
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Real-time Updates** - Instant credit deduction and app creation
- **Published Apps** - Share generated apps with unique links
- **Complete Backend** - Secure Node.js/Express API with Firebase Firestore

## 📋 Tier System

| Feature | Free | Plus | Pro | Ultra |
|---------|------|------|-----|-------|
| **Monthly Credits** | 5 | 25 | 60 | 100 |
| **Max Prompts** | 5 | 25 | 60 | 100 |
| **Max Apps** | 2 | 5 | 15 | 20 |
| **AI Provider** | Hugging Face | Gemini 2.5 Flash | Gemini 2.5 Flash | Gemini 2.5 Flash |
| **Price** | Free | $4.99/mo | $9.99/mo | $19.99/mo |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Gemini API key
- Hugging Face API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your Firebase credentials
npm run dev
```

### Access the App

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📁 Project Structure

```
v-astra-web/
├── backend/
│   ├── server.js              # Main Express server
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment template
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── store/            # Zustand state management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── config/           # Firebase config
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── package.json          # Frontend dependencies
│   └── .env.example          # Environment template
└── README.md                 # This file
```

## 🔐 Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
FIREBASE_DATABASE_URL=https://v-astra-create.firebaseio.com

HUGGINGFACE_API_KEY=hf_your_key_here
GEMINI_API_KEY=your_gemini_key_here

STRIPE_SECRET_KEY=sk_test_your_key_here
JWT_SECRET=your_jwt_secret_here

SUPPORT_EMAIL=supportvastra@gmail.com
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3001

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=v-astra-create.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=v-astra-create
VITE_FIREBASE_STORAGE_BUCKET=v-astra-create.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## 🔌 API Endpoints

### User Endpoints

- `POST /api/user/init` - Initialize user on first login
- `GET /api/user/profile` - Get user profile

### App Generation

- `POST /api/app/generate` - Generate new app
- `GET /api/app/list` - Get user's apps
- `POST /api/app/edit` - Edit existing app
- `POST /api/app/publish` - Publish app

### Billing

- `POST /api/billing/create-subscription` - Create/upgrade subscription
- `GET /api/billing/status` - Get subscription status

## 🎨 Pages

### LoginPage
- Google Sign-In integration
- Legal links
- Feature highlights

### DashboardPage
- User profile and tier info
- Credit display with progress bar
- Recent apps list
- Quick action buttons

### GeneratePage
- Prompt input with suggestions
- Real-time code preview
- Copy, download, and publish options
- Credit usage display

### SubscriptionPage
- 4 tier plans with features
- Upgrade/downgrade functionality
- FAQ section
- Popular plan highlighting

### SettingsPage
- Profile management
- Account settings
- Security options
- Support links
- Danger zone (delete account)

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router
- Firebase SDK
- Axios
- Lucide Icons

### Backend
- Node.js
- Express.js
- Firebase Admin SDK
- Axios
- JWT
- Helmet (Security)
- CORS
- Morgan (Logging)

## 📱 Mobile Responsive

The app is fully responsive and works perfectly on:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)

All pages adapt to screen size with:
- Responsive grid layouts
- Mobile-first design
- Touch-friendly buttons
- Optimized navigation

## 🔒 Security Features

- Firebase authentication
- JWT token verification
- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- Secure API endpoints

## 📊 State Management

Using Zustand for global state:
- User authentication
- Credits and tier
- Apps list
- Loading states
- Error handling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Cloud Run/Heroku)
```bash
npm install
npm start
```

## 📞 Support

- Email: supportvastra@gmail.com
- Privacy Policy: https://sites.google.com/view/v-astra-create-privacy-policy/home
- Terms & Conditions: https://sites.google.com/view/v-astra-create-terms/home

## 📝 License

MIT License - See LICENSE file for details

## 🎉 Ready to Launch!

Your V Astra Create web app is production-ready. Simply:

1. Set up Firebase project
2. Configure environment variables
3. Install dependencies
4. Run development servers
5. Deploy to production

For detailed deployment instructions, see DEPLOYMENT_GUIDE.md
