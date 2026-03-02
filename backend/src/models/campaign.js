import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  brief: String,
  parsedBrief: Object,
  strategy: Object,
  content: Object,
  apiCalls: [Object],
  performance: Object,
  optimizations: [Object],
  status: {
    type: String,
    enum: ['draft', 'strategy_pending', 'content_pending', 'approved', 'running', 'completed', 'optimizing'],
    default: 'draft'
  },
  logs: [Object],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Campaign', campaignSchema);
