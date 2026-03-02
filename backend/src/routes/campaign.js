import express from 'express';
import * as workflow from '../orchestrator/workflow.js';
import Campaign from '../models/campaign.js';

const router = express.Router();

// Create campaign from brief
router.post('/campaigns', async (req, res) => {
  try {
    const { brief } = req.body;
    const campaign = await workflow.createCampaign(brief);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get campaign details
router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve brief and generate strategy
router.post('/campaigns/:id/strategy', async (req, res) => {
  try {
    const campaign = await workflow.approveAndGenerateStrategy(req.params.id);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve strategy and generate content
router.post('/campaigns/:id/content', async (req, res) => {
  try {
    const campaign = await workflow.approveAndGenerateContent(req.params.id);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Launch campaign
router.post('/campaigns/:id/launch', async (req, res) => {
  try {
    const campaign = await workflow.launchCampaign(req.params.id);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch performance
router.get('/campaigns/:id/performance', async (req, res) => {
  try {
    const campaign = await workflow.fetchPerformance(req.params.id);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate optimization
router.post('/campaigns/:id/optimize', async (req, res) => {
  try {
    const campaign = await workflow.optimizeCampaign(req.params.id);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve optimization
router.post('/campaigns/:id/optimize/:index/approve', async (req, res) => {
  try {
    const campaign = await workflow.approveOptimization(req.params.id, req.params.index);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRITICAL: Check cohort coverage
router.get('/campaigns/:id/coverage', async (req, res) => {
  try {
    const coverage = await workflow.checkCohortCoverage(req.params.id);
    res.json(coverage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
