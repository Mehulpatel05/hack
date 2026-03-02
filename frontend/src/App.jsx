import { useState } from 'react';
import { api } from './api';
import './App.css';

function getErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Backend slow or unreachable.';
  }
  return error?.response?.data?.error || error?.message || 'Unknown error';
}

function App() {
  const [brief, setBrief] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input');

  const handleCreateCampaign = async () => {
    setLoading(true);
    try {
      const res = await api.createCampaign(brief);
      setCampaign(res.data);
      setStep('strategy');
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStrategy = async () => {
    setLoading(true);
    try {
      const res = await api.generateStrategy(campaign._id);
      setCampaign(res.data);
      setStep('content');
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    try {
      const res = await api.generateContent(campaign._id);
      setCampaign(res.data);
      setStep('launched');
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const res = await api.launchCampaign(campaign._id);
      setCampaign(res.data);
      setTimeout(() => fetchPerformance(), 2000);
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const res = await api.getPerformance(campaign._id);
      setCampaign(res.data);
      setStep('performance');
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await api.optimize(campaign._id);
      setCampaign(res.data);
      setStep('optimization');
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOptimization = async (index) => {
    setLoading(true);
    try {
      const res = await api.approveOptimization(campaign._id, index);
      setCampaign(res.data);
      alert('Optimization approved and relaunched.');
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>CampaignX</h1>
        <p>AI Multi-Agent Email Marketing System</p>
      </header>

      {step === 'input' && (
        <div className="card">
          <h2>Campaign Brief</h2>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Run email campaign for launching XDeposit... optimise for open & click rate..."
            rows={6}
          />
          <button onClick={handleCreateCampaign} disabled={loading || !brief}>
            {loading ? 'Processing...' : 'Generate Strategy ->'}
          </button>
        </div>
      )}

      {step === 'strategy' && campaign?.parsedBrief && (
        <div className="card">
          <h2>Parsed Brief</h2>
          <div className="info-grid">
            <div><strong>Product:</strong> {campaign.parsedBrief.product}</div>
            <div><strong>Target:</strong> {campaign.parsedBrief.target}</div>
            <div><strong>Offer:</strong> {campaign.parsedBrief.offer}</div>
            <div><strong>Objectives:</strong> {campaign.parsedBrief.objectives?.join(', ')}</div>
          </div>

          <h3>Customer Cohort (Fresh from API)</h3>
          <div className="info-grid">
            <div><strong>Total Customers:</strong> {campaign.cohort?.length || 0}</div>
            <div><strong>Segments:</strong> {[...new Set(campaign.cohort?.map((c) => c.segment))].join(', ')}</div>
          </div>
          <p className="note">Fresh cohort fetched - no old data used</p>

          <button onClick={handleGenerateStrategy} disabled={loading}>
            {loading ? 'Generating Strategy...' : 'Approve & Generate Strategy'}
          </button>
        </div>
      )}

      {step === 'content' && campaign?.strategy && (
        <div className="card">
          <h2>Campaign Strategy</h2>
          <div className="info-grid">
            <div><strong>Segments:</strong> {campaign.strategy.segments?.join(', ')}</div>
            <div><strong>Variants:</strong> {campaign.strategy.variants}</div>
            <div><strong>Send Time:</strong> {campaign.strategy.send_time}</div>
            <div><strong>A/B Test:</strong> {campaign.strategy.ab_test ? 'Yes' : 'No'}</div>
          </div>
          <p><em>{campaign.strategy.reasoning}</em></p>
          <button onClick={handleGenerateContent} disabled={loading}>
            {loading ? 'Generating Content...' : 'Approve & Generate Content'}
          </button>
        </div>
      )}

      {step === 'launched' && campaign?.content && (
        <div className="card">
          <h2>Email Content Preview</h2>
          {Object.entries(campaign.content).map(([key, variant]) => (
            <div key={key} className="variant">
              <h3>{key.toUpperCase()}</h3>
              <p><strong>Subject:</strong> {variant.subject}</p>
              <p><strong>Preheader:</strong> {variant.preheader}</p>
              <p><strong>CTA:</strong> {variant.cta_text}</p>
              <details>
                <summary>View Body</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{variant.body}</pre>
              </details>
            </div>
          ))}
          <button onClick={handleLaunch} disabled={loading}>
            {loading ? 'Launching...' : 'Approve & Launch Campaign'}
          </button>
        </div>
      )}

      {step === 'performance' && campaign?.performance && (
        <div className="card">
          <h2>Campaign Performance</h2>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{campaign.performance.open_rate}%</div>
              <div className="metric-label">Open Rate (30% weight)</div>
            </div>
            <div className="metric">
              <div className="metric-value">{campaign.performance.click_rate}%</div>
              <div className="metric-label">Click Rate (70% weight)</div>
            </div>
            <div className="metric highlight">
              <div className="metric-value">{campaign.performance.score}</div>
              <div className="metric-label">Overall Score</div>
            </div>
          </div>
          {campaign.performance.needs_optimization && (
            <>
              <div className="issues">
                <h3>Issues Detected:</h3>
                <ul>
                  {campaign.performance.issues?.map((issue, i) => (
                    <li key={i}>{issue.replace('_', ' ')}</li>
                  ))}
                  {campaign.performance.low_segments?.length > 0 && (
                    <li>Low performance in: {campaign.performance.low_segments.join(', ')}</li>
                  )}
                </ul>
              </div>
              <button onClick={handleOptimize} disabled={loading}>
                {loading ? 'Generating Optimization...' : 'Auto-Optimize Campaign'}
              </button>
            </>
          )}
        </div>
      )}

      {step === 'optimization' && campaign?.optimizations?.length > 0 && (
        <div className="card">
          <h2>Optimization Suggestions</h2>
          {campaign.optimizations.map((opt, index) => (
            <div key={index} className="optimization">
              <h3>Iteration {opt.iteration}</h3>
              <div className="info-grid">
                <div><strong>Target Segment:</strong> {opt.target_segment}</div>
                <div><strong>New Subject:</strong> {opt.new_subject}</div>
                <div><strong>New CTA:</strong> {opt.new_cta}</div>
                <div><strong>Send Time:</strong> {opt.send_time}</div>
              </div>
              <p><strong>Reasoning:</strong> {opt.reasoning}</p>
              <p><strong>Expected Improvement:</strong> {opt.expected_improvement}</p>
              {opt.status === 'pending_approval' && (
                <button onClick={() => handleApproveOptimization(index)} disabled={loading}>
                  {loading ? 'Relaunching...' : 'Approve & Relaunch'}
                </button>
              )}
              {opt.status === 'approved' && <p className="success">Approved & Relaunched</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
