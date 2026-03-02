# 🚀 Render Deployment Guide

## ✅ Files Ready

- `render.yaml` - Deployment config
- `frontend/src/api.js` - Updated for production

---

## 📋 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
cd campaignx

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "CampaignX ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/campaignx.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Render

1. **Go to:** https://render.com
2. **Sign up/Login** (use GitHub)
3. Click **"New +"** → **"Blueprint"**
4. **Connect your GitHub repo:** `campaignx`
5. Render will detect `render.yaml`
6. **Add Environment Variables:**
   - Click on `campaignx-backend`
   - Add: `GEMINI_API_KEY` = `your_actual_key`
7. Click **"Apply"**

**Wait 5-10 minutes for deployment...**

---

### Step 3: Get Your URLs

After deployment:

- **Backend:** `https://campaignx-backend.onrender.com`
- **Frontend:** `https://campaignx-frontend.onrender.com`

---

### Step 4: Update Frontend URL (if needed)

If backend URL is different, update `render.yaml`:

```yaml
envVars:
  - key: VITE_API_URL
    value: https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```

Then push again:
```bash
git add .
git commit -m "Update API URL"
git push
```

Render auto-redeploys!

---

## 🎯 Alternative: Manual Deployment

If `render.yaml` doesn't work:

### Backend:

1. New + → **Web Service**
2. Connect repo
3. **Name:** `campaignx-backend`
4. **Root Directory:** `backend`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. **Environment Variables:**
   - `GEMINI_API_KEY` = your_key
   - `PORT` = 3001

### Frontend:

1. New + → **Static Site**
2. Connect repo
3. **Name:** `campaignx-frontend`
4. **Root Directory:** `frontend`
5. **Build Command:** `npm install && npm run build`
6. **Publish Directory:** `dist`
7. **Environment Variables:**
   - `VITE_API_URL` = `https://campaignx-backend.onrender.com/api`

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Backend sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- **For demo:** Wake it up before recording!

### MongoDB:
- Use **MongoDB Atlas** (free tier)
- Get connection string from: https://cloud.mongodb.com
- Update in Render env vars

---

## 🧪 Test Deployment

After deployment:

1. Open frontend URL
2. Test complete workflow
3. Check browser console for errors
4. Verify API calls work

---

## 🐛 Troubleshooting

### Backend not starting?
- Check logs in Render dashboard
- Verify `GEMINI_API_KEY` is set
- Check `package.json` has correct scripts

### Frontend not loading?
- Check build logs
- Verify `dist` folder is created
- Check `VITE_API_URL` is correct

### CORS errors?
Add to `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'https://campaignx-frontend.onrender.com'
}));
```

---

## 🎬 For Demo Video

**Option 1:** Use deployed URLs (looks professional)
**Option 2:** Use localhost (easier, no delays)

Both are acceptable for hackathon!

---

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Blueprint deployed
- [ ] Environment variables added
- [ ] Both services running
- [ ] Frontend loads
- [ ] API calls work
- [ ] Full workflow tested

---

## 🏆 You're Ready!

**Backend:** https://campaignx-backend.onrender.com
**Frontend:** https://campaignx-frontend.onrender.com

**Share these URLs in your submission!** 🚀
