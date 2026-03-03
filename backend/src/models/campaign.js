import { db, doc, getDoc, setDoc } from '../utils/firebase.js';

const DB_TIMEOUT_MS = Number(process.env.DB_TIMEOUT_MS || 10000);

function withTimeout(promise, ms = DB_TIMEOUT_MS, label = 'Database operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms))
  ]);
}

class Campaign {
  constructor(data) {
    this._id = data._id || `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.brief = data.brief || '';
    this.parsedBrief = data.parsedBrief || null;
    this.cohort = data.cohort || null;
    this.strategy = data.strategy || null;
    this.content = data.content || null;
    this.apiCalls = data.apiCalls || [];
    this.performance = data.performance || null;
    this.optimizations = data.optimizations || [];
    this.status = data.status || 'draft';
    this.logs = data.logs || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const campaignRef = doc(db, 'campaigns', this._id);
    await withTimeout(setDoc(campaignRef, this.toJSON()), DB_TIMEOUT_MS, 'Campaign save');
    return this;
  }

  static async findById(id) {
    const campaignRef = doc(db, 'campaigns', id);
    const campaignSnap = await withTimeout(getDoc(campaignRef), DB_TIMEOUT_MS, 'Campaign fetch');
    if (!campaignSnap.exists()) {
      throw new Error('Campaign not found');
    }
    return new Campaign({ _id: id, ...campaignSnap.data() });
  }

  toJSON() {
    return {
      _id: this._id,
      brief: this.brief,
      parsedBrief: this.parsedBrief,
      cohort: this.cohort,
      strategy: this.strategy,
      content: this.content,
      apiCalls: this.apiCalls,
      performance: this.performance,
      optimizations: this.optimizations,
      status: this.status,
      logs: this.logs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Campaign;
