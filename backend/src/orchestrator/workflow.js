import { parseBrief } from '../agents/briefParser.js';
import { fetchCustomerCohort, selectFromCohort, checkFullCoverage } from '../agents/cohort.js';
import { generateStrategy } from '../agents/strategy.js';
import { generateContent } from '../agents/content.js';
import { dynamicAPICall } from '../agents/api.js';
import { analyzePerformance } from '../agents/analytics.js';
import { generateOptimization, applyOptimization } from '../agents/optimization.js';
import Campaign from '../models/campaign.js';

export async function createCampaign(brief) {
  const campaign = new Campaign({ brief, status: 'draft' });
  await campaign.save();
  
  // Step 1: Parse brief
  const parsedBrief = await parseBrief(brief, campaign._id);
  
  // Step 2: Fetch FRESH customer cohort from API
  const cohort = await fetchCustomerCohort(campaign._id);
  
  campaign.parsedBrief = parsedBrief;
  campaign.cohort = cohort;
  campaign.status = 'strategy_pending';
  await campaign.save();
  
  return campaign;
}

export async function approveAndGenerateStrategy(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  
  // Generate strategy using REAL cohort
  const strategy = await generateStrategy(campaign.parsedBrief, campaign.cohort, campaignId);
  campaign.strategy = strategy;
  campaign.status = 'content_pending';
  await campaign.save();
  
  return campaign;
}

export async function approveAndGenerateContent(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  
  const content = await generateContent(campaign.parsedBrief, campaign.strategy, campaign.cohort, campaignId);
  campaign.content = content;
  campaign.status = 'approved';
  await campaign.save();
  
  return campaign;
}

export async function launchCampaign(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  
  // Select customer IDs from REAL cohort with inactive filtering
  const includeInactive = campaign.parsedBrief.include_inactive || false;
  const customerIds = selectFromCohort(campaign.cohort, campaign.strategy.segments, includeInactive);
  
  // Use DYNAMIC API call (LLM reads OpenAPI spec)
  const apiResult = await dynamicAPICall('schedule_campaign', {
    campaign_name: campaign.parsedBrief.product,
    customer_ids: customerIds,
    email_subject: campaign.content.variant_a.subject,
    email_body: campaign.content.variant_a.body,
    schedule_time: campaign.strategy.send_time
  }, campaignId);
  
  campaign.apiCalls = campaign.apiCalls || [];
  campaign.apiCalls.push({ ...apiResult, sent_to: customerIds, include_inactive: includeInactive });
  campaign.status = 'running';
  await campaign.save();
  
  return campaign;
}

export async function fetchPerformance(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  
  // Fetch metrics using DYNAMIC API
  const metrics = await dynamicAPICall('get_metrics', {
    campaign_id: campaign.apiCalls[campaign.apiCalls.length - 1]?.campaign_id
  }, campaignId);
  
  const analysis = await analyzePerformance(metrics, campaignId, {
    include_inactive: campaign.parsedBrief.include_inactive
  });
  campaign.performance = analysis;
  await campaign.save();
  
  return campaign;
}

export async function optimizeCampaign(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  
  const optimization = await generateOptimization(
    campaign.performance,
    campaign.parsedBrief,
    campaign.content.variant_a,
    campaign.cohort,
    campaignId
  );
  
  if (!optimization) {
    return { message: 'No optimization needed' };
  }
  
  campaign.optimizations = campaign.optimizations || [];
  campaign.optimizations.push(optimization);
  campaign.status = 'optimizing';
  await campaign.save();
  
  return campaign;
}

export async function approveOptimization(campaignId, optimizationIndex) {
  const campaign = await Campaign.findById(campaignId);
  const optimization = campaign.optimizations[optimizationIndex];
  
  const optimizedContent = await applyOptimization(optimization, campaign.content.variant_a);
  campaign.content.variant_optimized = optimizedContent;
  
  // Select NEW customer IDs from cohort for optimized segment with inactive filtering
  const includeInactive = campaign.parsedBrief.include_inactive || false;
  const customerIds = selectFromCohort(campaign.cohort, [optimization.target_segment], includeInactive);
  
  // RELAUNCH using DYNAMIC API
  const apiResult = await dynamicAPICall('schedule_campaign', {
    campaign_name: `${campaign.parsedBrief.product} - Optimized`,
    customer_ids: customerIds,
    email_subject: optimization.new_subject,
    email_body: optimizedContent.body,
    schedule_time: optimization.send_time
  }, campaignId);
  
  campaign.apiCalls.push({ ...apiResult, sent_to: customerIds, iteration: optimization.iteration, include_inactive: includeInactive });
  optimization.status = 'approved';
  campaign.status = 'running';
  await campaign.save();
  
  return campaign;
}

export async function checkCohortCoverage(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  const allSentTo = campaign.apiCalls.map(call => call.sent_to || []);
  const coverage = checkFullCoverage(campaign.cohort, allSentTo);
  return coverage;
}
