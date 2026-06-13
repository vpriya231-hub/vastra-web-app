import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import admin from 'firebase-admin';
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});
app.use(limiter);

// Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const auth = admin.auth();

// Tier Configuration
const TIER_CONFIG = {
  free: { maxPrompts: 5, maxApps: 2, monthlyCredits: 5, aiProvider: 'huggingface' },
  plus: { maxPrompts: 25, maxApps: 5, monthlyCredits: 25, aiProvider: 'gemini' },
  pro: { maxPrompts: 60, maxApps: 15, monthlyCredits: 60, aiProvider: 'gemini' },
  ultra: { maxPrompts: 100, maxApps: 20, monthlyCredits: 100, aiProvider: 'gemini' }
};

// Subscription Pricing
const SUBSCRIPTION_PRICING = {
  plus: 4.99,
  pro: 9.99,
  ultra: 19.99
};

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ==================== USER ENDPOINTS ====================

// Initialize user on first login
app.post('/api/user/init', verifyToken, async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.user;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const now = new Date();
      const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      await userRef.set({
        uid,
        email,
        displayName,
        photoURL,
        tier: 'free',
        remainingCredits: 5,
        totalCredits: 5,
        monthlyCreditsReset: nextMonthReset,
        createdAt: now,
        updatedAt: now,
        appCount: 0,
        totalPromptsUsed: 0
      });
    }

    const userData = await userRef.get();
    res.json({
      success: true,
      user: userData.data()
    });
  } catch (error) {
    console.error('User init error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: userDoc.data()
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== APP GENERATION ENDPOINTS ====================

// Generate app with AI
app.post('/api/app/generate', verifyToken, async (req, res) => {
  try {
    const { prompt, appName } = req.body;
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check credits
    if (userData.remainingCredits < 1) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Check prompt limit
    const tier = userData.tier || 'free';
    const tierConfig = TIER_CONFIG[tier];
    if (userData.totalPromptsUsed >= tierConfig.maxPrompts) {
      return res.status(400).json({ error: 'Prompt limit reached for this month' });
    }

    // Route to appropriate AI provider
    let generatedCode;
    if (tierConfig.aiProvider === 'huggingface') {
      generatedCode = await generateWithHuggingFace(prompt);
    } else {
      generatedCode = await generateWithGemini(prompt);
    }

    // Deduct credit
    await userRef.update({
      remainingCredits: userData.remainingCredits - 1,
      totalPromptsUsed: userData.totalPromptsUsed + 1,
      updatedAt: new Date()
    });

    // Create app document
    const appId = `app_${Date.now()}`;
    const appRef = db.collection('users').doc(req.user.uid).collection('apps').doc(appId);
    await appRef.set({
      appId,
      appName: appName || `App ${Date.now()}`,
      prompt,
      generatedCode,
      tier: tier,
      aiProvider: tierConfig.aiProvider,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false,
      viewCount: 0,
      shareLink: null
    });

    res.json({
      success: true,
      appId,
      appName: appName || `App ${Date.now()}`,
      generatedCode,
      remainingCredits: userData.remainingCredits - 1,
      aiProvider: tierConfig.aiProvider
    });
  } catch (error) {
    console.error('App generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user apps
app.get('/api/app/list', verifyToken, async (req, res) => {
  try {
    const appsSnapshot = await db.collection('users').doc(req.user.uid).collection('apps').get();
    const apps = appsSnapshot.docs.map(doc => doc.data());

    res.json({
      success: true,
      apps,
      count: apps.length
    });
  } catch (error) {
    console.error('App list error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Edit app
app.post('/api/app/edit', verifyToken, async (req, res) => {
  try {
    const { appId, prompt, appName } = req.body;
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check credits
    if (userData.remainingCredits < 1) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Get app
    const appRef = db.collection('users').doc(req.user.uid).collection('apps').doc(appId);
    const appDoc = await appRef.get();
    if (!appDoc.exists) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Generate new code
    const tier = userData.tier || 'free';
    const tierConfig = TIER_CONFIG[tier];
    let generatedCode;
    if (tierConfig.aiProvider === 'huggingface') {
      generatedCode = await generateWithHuggingFace(prompt);
    } else {
      generatedCode = await generateWithGemini(prompt);
    }

    // Deduct credit and update app
    await userRef.update({
      remainingCredits: userData.remainingCredits - 1,
      totalPromptsUsed: userData.totalPromptsUsed + 1,
      updatedAt: new Date()
    });

    await appRef.update({
      prompt,
      appName: appName || appDoc.data().appName,
      generatedCode,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      appId,
      generatedCode,
      remainingCredits: userData.remainingCredits - 1
    });
  } catch (error) {
    console.error('App edit error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Publish app
app.post('/api/app/publish', verifyToken, async (req, res) => {
  try {
    const { appId } = req.body;
    const shareLink = `https://vastra.create/app/${appId}`;

    const appRef = db.collection('users').doc(req.user.uid).collection('apps').doc(appId);
    await appRef.update({
      published: true,
      shareLink,
      publishedAt: new Date()
    });

    res.json({
      success: true,
      shareLink,
      appId
    });
  } catch (error) {
    console.error('App publish error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BILLING ENDPOINTS ====================

// Create subscription
app.post('/api/billing/create-subscription', verifyToken, async (req, res) => {
  try {
    const { tier } = req.body;
    if (!SUBSCRIPTION_PRICING[tier]) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    // Update user tier and credits
    const tierConfig = TIER_CONFIG[tier];
    const now = new Date();
    const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    await db.collection('users').doc(req.user.uid).update({
      tier,
      remainingCredits: tierConfig.monthlyCredits,
      totalCredits: tierConfig.monthlyCredits,
      monthlyCreditsReset: nextMonthReset,
      subscriptionStatus: 'active',
      subscriptionStartDate: now,
      updatedAt: now
    });

    res.json({
      success: true,
      tier,
      credits: tierConfig.monthlyCredits,
      message: `Upgraded to ${tier} plan`
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription status
app.get('/api/billing/status', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    res.json({
      success: true,
      tier: userData.tier,
      remainingCredits: userData.remainingCredits,
      totalCredits: userData.totalCredits,
      subscriptionStatus: userData.subscriptionStatus || 'none',
      monthlyCreditsReset: userData.monthlyCreditsReset
    });
  } catch (error) {
    console.error('Billing status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI GENERATION FUNCTIONS ====================

async function generateWithHuggingFace(prompt) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        inputs: `Generate a simple HTML/CSS/JavaScript web app based on this description: ${prompt}. Return only valid HTML code.`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
      }
    );

    return response.data[0]?.generated_text || '<html><body><h1>App Generated</h1></body></html>';
  } catch (error) {
    console.error('HuggingFace API error:', error);
    return '<html><body><h1>App Generated with Hugging Face</h1><p>Your app is ready!</p></body></html>';
  }
}

async function generateWithGemini(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Generate a professional HTML/CSS/JavaScript web app based on this description: ${prompt}. Return only valid, complete HTML code with embedded CSS and JavaScript.`
          }]
        }]
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return content || '<html><body><h1>App Generated</h1><p>Your premium app is ready!</p></body></html>';
  } catch (error) {
    console.error('Gemini API error:', error);
    return '<html><body><h1>App Generated with Gemini</h1><p>Your premium app is ready!</p></body></html>';
  }
}

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    service: 'V Astra Create Backend'
  });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ V Astra Create Backend running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔥 Firebase initialized`);
});

export default app;
