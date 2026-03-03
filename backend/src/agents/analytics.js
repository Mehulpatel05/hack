import { log } from '../utils/logger.js';

export async function analyzePerformance(metrics, campaignId, campaignData = {}) {
  const openRate = metrics.open_rate || 0;
  const clickRate = metrics.click_rate || 0;
  
  // Weighted score: Click rate 70%, Open rate 30%
  const score = (clickRate * 0.7) + (openRate * 0.3);
  
  // Identify issues
  const issues = [];
  if (openRate < 20) issues.push('low_open_rate');
  if (clickRate < 2) issues.push('low_click_rate');
  
  // Segment analysis (mock for demo)
  const segmentPerformance = {
    'age_25_35': { open_rate: openRate * 0.8, click_rate: clickRate * 0.6 },
    'age_36_50': { open_rate: openRate * 1.2, click_rate: clickRate * 1.4 }
  };
  
  const lowSegments = Object.entries(segmentPerformance)
    .filter(([_, perf]) => perf.click_rate < 2)
    .map(([seg, _]) => seg);
  
  const analysis = {
    score: score.toFixed(2),
    open_rate: openRate.toFixed(2),
    click_rate: clickRate.toFixed(2),
    issues,
    low_segments: lowSegments,
    needs_optimization: issues.length > 0 || lowSegments.length > 0,
    inactive_included: campaignData.include_inactive || false
  };
  
  log(campaignId, 'Analytics', 'analyzed', analysis);
  
  return analysis;
}
