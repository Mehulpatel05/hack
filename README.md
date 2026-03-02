# 🔥 CampaignX - AI Multi-Agent Email Marketing System

**Autonomous email campaign optimization for SuperBFSI**

## 🎯 Features

✅ **Natural Language Brief Parsing** - Understands campaign requirements in plain English  
✅ **AI Strategy Generation** - Automatic segmentation, A/B testing, timing optimization  
✅ **Dynamic Content Creation** - Multiple email variants with personalization  
✅ **Dynamic OpenAPI Integration** - NO hardcoded API calls  
✅ **Performance Analytics** - Weighted scoring (Click 70%, Open 30%)  
✅ **Autonomous Optimization Loop** - Auto-detects issues and improves campaigns  
✅ **Human-in-the-Loop** - Approval gates at critical stages  

## 🏗 Architecture

```
Frontend (React) → Backend (Node.js + Express) → AI Agents → MongoDB
                                ↓
                    6 Specialized Agents:
                    1. Brief Parser
                    2. Strategy Generator
                    3. Content Creator
                    4. API Integrator (Dynamic)
                    5. Analytics Analyzer
                    6. Optimization Engine
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (or will use in-memory mode)
- Gemini API Key (free tier) OR Groq API Key

### Backend Setup

```bash
cd backend
npm install

# Configure .env
echo "GEMINI_API_KEY=your_key_here" > .env

# Start server
npm start
```

Server runs on: http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

UI runs on: http://localhost:3000

## 📖 Usage Flow

1. **Input Brief**: "Run email campaign for launching XDeposit... optimise for open & click rate..."
2. **Review Parsed Brief**: AI extracts product, target, offer, objectives
3. **Approve Strategy**: AI generates segments, A/B variants, timing
4. **Preview Content**: AI creates multiple email variants
5. **Launch Campaign**: Dynamic API call schedules campaign
6. **View Performance**: Real-time metrics with weighted scoring
7. **Auto-Optimize**: AI detects issues and suggests improvements
8. **Approve Relaunch**: Human approves optimized variant

## 🎬 Demo Script (3 minutes)

**0:00-0:30** - Input campaign brief  
**0:30-1:00** - Show parsed brief + strategy generation  
**1:00-1:30** - Preview email content variants  
**1:30-2:00** - Launch campaign via dynamic API  
**2:00-2:30** - Display performance metrics  
**2:30-3:00** - Show optimization loop (CRITICAL!)  

## 🧠 Agent Details

### 1. Brief Parser Agent
- Extracts: product, target, offer, URL, objectives, tone
- Uses: LLM with structured output

### 2. Strategy Agent
- Generates: segments, A/B variants, send time, frequency
- Considers: BFSI best practices, target audience

### 3. Content Agent
- Creates: subject lines, preheaders, HTML body, CTAs
- Variants: emoji-rich vs professional

### 4. API Agent (Dynamic!)
- Parses: OpenAPI spec on-the-fly
- Generates: API calls without hardcoding
- Executes: Campaign scheduling, metrics fetching

### 5. Analytics Agent
- Calculates: Weighted score (Click 70% + Open 30%)
- Identifies: Low-performing segments
- Triggers: Optimization when needed

### 6. Optimization Agent
- Detects: Performance issues
- Generates: Improved content variants
- Targets: Specific segments for relaunch

## 📊 Scoring Formula

```
Score = (Click Rate × 0.7) + (Open Rate × 0.3)
```

## 🔑 Key Differentiators

1. **Dynamic OpenAPI Parser** - No hardcoded API calls
2. **Autonomous Optimization Loop** - Self-improving campaigns
3. **Human Approval Gates** - Control at critical stages
4. **Micro-segmentation** - Targets specific audience groups
5. **Full Audit Trail** - Complete logging system

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Axios
- **Backend**: Node.js, Express, Mongoose
- **AI**: Gemini Pro / Groq Mixtral
- **Database**: MongoDB
- **API**: RESTful with dynamic OpenAPI integration

## 📁 Project Structure

```
campaignx/
├── backend/
│   ├── src/
│   │   ├── agents/          # 6 AI agents
│   │   ├── orchestrator/    # Workflow coordinator
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Database schemas
│   │   └── utils/           # LLM & logging
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main UI
│   │   ├── api.js           # API client
│   │   └── App.css          # Styles
│   └── package.json
└── README.md
```

## 🎯 Winning Strategy

✅ Complete autonomous optimization loop  
✅ Dynamic API integration (no hardcoding)  
✅ Clean, intuitive UI  
✅ Full logging and audit trail  
✅ High click rate optimization focus  

## 🏆 Hackathon Submission Checklist

- [ ] 3-minute demo video recorded
- [ ] At least 1 optimization loop shown
- [ ] Dynamic API parsing demonstrated
- [ ] Performance metrics displayed
- [ ] Human approval workflow shown
- [ ] Code uploaded to GitHub
- [ ] README with setup instructions

## 📝 Notes

- Mock API responses included for demo
- Replace with real SuperBFSI API in production
- MongoDB optional (works in-memory mode)
- Gemini API has generous free tier

## 🚀 Next Steps

1. Get Gemini API key: https://makersuite.google.com/app/apikey
2. Install dependencies
3. Start backend and frontend
4. Test complete workflow
5. Record demo video
6. Submit!

---

**Built for InXiteOut Hackathon**  
**Target: ₹25,000 First Prize** 🏆
