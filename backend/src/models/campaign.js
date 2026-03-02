import { db, collection, doc, getDoc, setDoc, updateDoc } from '../utils/firebase.js';

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
    await setDoc(campaignRef, this.toJSON());
    return this;
  }

  static async findById(id) {
    const campaignRef = doc(db, 'campaigns', id);
    const campaignSnap = await getDoc(campaignRef);
    if (!campaignSnap.exists()) {
      throw new Error('Campaign not found');
    }
    return new Campaign({ _id: id, ...campaignSnap.data() });
  }

  toJSON() {
    return {
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
