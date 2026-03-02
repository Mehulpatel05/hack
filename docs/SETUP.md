# 🚀 Quick Setup Guide

## Step 1: Get API Key

### Option A: Gemini (Recommended - Free)
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Option B: Groq (Alternative - Free)
1. Go to: https://console.groq.com
2. Sign up and get API key
3. Copy the key

## Step 2: Backend Setup

```bash
# Navigate to backend
cd campaignx/backend

# Install dependencies
npm install

# Create .env file
echo GEMINI_API_KEY=your_actual_key_here > .env
echo PORT=3001 >> .env
echo MONGODB_URI=mongodb://localhost:27017/campaignx >> .env

# Start server
npm start
```

You should see:
```
🔥 Server running on http://localhost:3001
✅ MongoDB connected (or ⚠️ using in-memory mode)
```

## Step 3: Frontend Setup

Open NEW terminal:

```bash
# Navigate to frontend
cd campaignx/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:3000
```

## Step 4: Test the System

1. Open browser: http://localhost:3000
2. Paste example brief:
   ```
   Run email campaign for launching XDeposit fixed deposit product. 
   Target new customers aged 25-50. Offer 5% interest rate. 
   Include link to superbfsi.com/xdeposit. 
   Optimize for open rate and click rate.
   ```
3. Click through the workflow
4. Watch the optimization loop!

## Troubleshooting

### Backend won't start
- Check if port 3001 is free: `netstat -ano | findstr :3001`
- Verify .env file exists and has API key
- Check Node.js version: `node --version` (need 18+)

### Frontend won't start
- Check if port 3000 is free
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### MongoDB connection error
- It's OK! System works in in-memory mode
- Or install MongoDB: https://www.mongodb.com/try/download/community

### LLM API errors
- Verify API key is correct
- Check API quota/limits
- Try alternative provider (Gemini ↔ Groq)

## Testing Without MongoDB

The system works without MongoDB! It will show:
```
⚠️ MongoDB not available, using in-memory mode
```

Data won't persist between restarts, but perfect for demo!

## Next Steps

1. ✅ System running
2. 📝 Test complete workflow
3. 🎬 Record demo video
4. 📤 Submit to hackathon

---

**Need help?** Check README.md for detailed documentation.
