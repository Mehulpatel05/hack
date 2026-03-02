# Quick Deployment Commands

## Push to GitHub

```bash
cd campaignx

git init
git add .
git commit -m "CampaignX - AI Multi-Agent Email Marketing"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campaignx.git
git push -u origin main
```

## Render Deployment

1. Go to: https://render.com
2. New + → Blueprint
3. Connect GitHub repo
4. Add env var: GEMINI_API_KEY
5. Click Apply

## Done! 🚀

Backend: https://campaignx-backend.onrender.com
Frontend: https://campaignx-frontend.onrender.com
