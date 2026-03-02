# 🏗 CampaignX Architecture

## System Overview

CampaignX is an AI-powered multi-agent system that autonomously manages email marketing campaigns with human-in-the-loop approval gates.

## Core Components

### 1. Frontend (React + Vite)
- **Purpose**: User interface for campaign management
- **Tech**: React 18, Vite, Axios
- **Features**:
  - Campaign brief input
  - Strategy preview & approval
  - Email content preview
  - Performance dashboard
  - Optimization loop viewer

### 2. Backend (Node.js + Express)
- **Purpose**: API server and agent orchestration
- **Tech**: Express, Mongoose, Axios
- **Features**:
  - RESTful API endpoints
  - Agent coordination
  - Database management
  - Logging system

### 3. AI Agents (6 Specialized Agents)

#### Agent 1: Brief Parser
- **Input**: Natural language campaign brief
- **Process**: LLM extraction of structured data
- **Output**: JSON with product, target, offer, objectives
- **Tech**: Gemini Pro / Groq Mixtral

#### Agent 2: Strategy Generator
- **Input**: Parsed brief
- **Process**: Campaign strategy formulation
- **Output**: Segments, variants, timing, A/B test plan
- **Logic**: BFSI best practices + audience analysis

#### Agent 3: Content Creator
- **Input**: Brief + Strategy
- **Process**: Email copywriting with variants
- **Output**: Multiple email versions (subject, body, CTA)
- **Variants**: Emoji-rich vs Professional

#### Agent 4: API Integrator (Dynamic)
- **Input**: OpenAPI specification + action
- **Process**: Dynamic endpoint parsing and call generation
- **Output**: API responses (campaign ID, metrics)
- **Key Feature**: NO HARDCODED ENDPOINTS

#### Agent 5: Analytics Analyzer
- **Input**: Campaign metrics
- **Process**: Weighted scoring + issue detection
- **Output**: Performance report with recommendations
- **Formula**: Score = (Click × 0.7) + (Open × 0.3)

#### Agent 6: Optimization Engine
- **Input**: Performance analysis + original content
- **Process**: Issue detection + improvement generation
- **Output**: Optimized campaign variant
- **Features**: Micro-segmentation, timing adjustment

### 4. Orchestrator
- **Purpose**: Coordinates agent workflow
- **Functions**:
  - createCampaign()
  - approveAndGenerateStrategy()
  - approveAndGenerateContent()
  - launchCampaign()
  - fetchPerformance()
  - optimizeCampaign()
  - approveOptimization()

### 5. Database (MongoDB)
- **Schema**: Campaign model
- **Fields**:
  - brief (string)
  - parsedBrief (object)
  - strategy (object)
  - content (object)
  - apiCalls (array)
  - performance (object)
  - optimizations (array)
  - status (enum)
  - logs (array)

## Data Flow

```
User Input (Brief)
    ↓
Brief Parser Agent → Parsed Brief
    ↓
Strategy Agent → Campaign Strategy
    ↓
Content Agent → Email Variants
    ↓
Human Approval
    ↓
API Agent → Campaign Scheduled
    ↓
Wait for Campaign Execution
    ↓
API Agent → Fetch Metrics
    ↓
Analytics Agent → Performance Analysis
    ↓
Optimization Agent → Improvement Suggestions
    ↓
Human Approval
    ↓
API Agent → Relaunch Optimized Campaign
    ↓
Loop continues until optimal performance
```

## Key Design Decisions

### 1. Multi-Agent Architecture
- **Why**: Separation of concerns, modularity
- **Benefit**: Each agent is specialized and testable

### 2. Human-in-the-Loop
- **Why**: Critical decisions need human oversight
- **Approval Gates**:
  - After brief parsing
  - After strategy generation
  - After content creation
  - After optimization generation

### 3. Dynamic API Integration
- **Why**: No hardcoding, adaptable to API changes
- **How**: LLM parses OpenAPI spec and generates calls

### 4. Weighted Scoring
- **Why**: Click rate is more valuable than open rate
- **Formula**: 70% click + 30% open
- **Justification**: Clicks indicate real engagement

### 5. Autonomous Optimization
- **Why**: Continuous improvement without manual intervention
- **Process**: Detect → Analyze → Generate → Approve → Relaunch

## API Endpoints

```
POST   /api/campaigns                          # Create campaign
GET    /api/campaigns/:id                      # Get campaign
POST   /api/campaigns/:id/strategy             # Generate strategy
POST   /api/campaigns/:id/content              # Generate content
POST   /api/campaigns/:id/launch               # Launch campaign
GET    /api/campaigns/:id/performance          # Get metrics
POST   /api/campaigns/:id/optimize             # Generate optimization
POST   /api/campaigns/:id/optimize/:idx/approve # Approve optimization
```

## Security Considerations

1. **API Keys**: Stored in .env, never committed
2. **Input Validation**: All user inputs sanitized
3. **Rate Limiting**: Prevent API abuse (TODO)
4. **Authentication**: Add JWT for production (TODO)

## Scalability

### Current (MVP)
- Single server
- MongoDB single instance
- Synchronous agent execution

### Future (Production)
- Load balancer
- MongoDB replica set
- Agent queue with workers
- Redis caching
- Microservices architecture

## Performance Optimization

1. **LLM Caching**: Cache similar prompts
2. **Parallel Agents**: Run independent agents concurrently
3. **Database Indexing**: Index on campaign status, timestamps
4. **Frontend**: React.memo, lazy loading

## Testing Strategy

1. **Unit Tests**: Each agent independently
2. **Integration Tests**: Agent orchestration
3. **E2E Tests**: Complete workflow
4. **Load Tests**: API performance under load

## Monitoring & Logging

- **Logger Utility**: Timestamps all agent actions
- **Console Logs**: Development debugging
- **Database Logs**: Audit trail in campaign.logs
- **Future**: ELK stack, CloudWatch

## Deployment

### Development
- Local Node.js servers
- Local MongoDB

### Production (Recommended)
- **Backend**: AWS EC2 / ECS
- **Frontend**: Vercel / Netlify
- **Database**: MongoDB Atlas
- **Monitoring**: CloudWatch / Datadog

## Cost Estimation

### Development (Free Tier)
- Gemini API: Free up to 60 requests/min
- MongoDB: Free tier 512MB
- Hosting: Local

### Production (Monthly)
- LLM API: ~$50-100 (depends on usage)
- MongoDB Atlas: $57 (M10 cluster)
- AWS EC2: $30-50 (t3.medium)
- Total: ~$150-200/month

## Winning Features for Hackathon

1. ✅ **Dynamic OpenAPI Parser** - No hardcoding
2. ✅ **Autonomous Optimization Loop** - Self-improving
3. ✅ **Multi-Agent Architecture** - Modular and scalable
4. ✅ **Human Approval Gates** - Controlled automation
5. ✅ **Weighted Scoring** - Business-aligned metrics
6. ✅ **Full Audit Trail** - Complete logging
7. ✅ **Clean UI** - Intuitive user experience

## Future Enhancements

1. **Multi-channel**: SMS, WhatsApp, Push notifications
2. **Advanced Segmentation**: ML-based clustering
3. **Predictive Analytics**: Forecast campaign performance
4. **A/B Testing**: Statistical significance testing
5. **Template Library**: Pre-built campaign templates
6. **Collaboration**: Multi-user support
7. **Reporting**: PDF export, dashboards

---

**Built for InXiteOut Hackathon**
**Target: First Prize 🏆**
