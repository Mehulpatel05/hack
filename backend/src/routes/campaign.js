import express from 'express';
import * as workflow from '../orchestrator/workflow.js';
import Campaign from '../models/campaign.js';

const router = express.Router();
const ROUTE_TIMEOUT_MS = Number(process.env.ROUTE_TIMEOUT_MS || 25000);

async function withRouteTimeout(task, label) {
  return Promise.race([
    task(),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ROUTE_TIMEOUT_MS}ms`)), ROUTE_TIMEOUT_MS))
  ]);
}

async function respond(res, task, label) {
  try {
    const result = await withRouteTimeout(task, label);
    res.json(result);
  } catch (error) {
    const isTimeout = /timed out/i.test(error.message);
    res.status(isTimeout ? 504 : 500).json({ error: error.message });
  }
}

router.post('/campaigns', async (req, res) => {
  const { brief } = req.body;
  await respond(res, () => workflow.createCampaign(brief), 'Create campaign');
});

router.get('/campaigns/:id', async (req, res) => {
  await respond(res, () => Campaign.findById(req.params.id), 'Get campaign');
});

router.post('/campaigns/:id/strategy', async (req, res) => {
  await respond(res, () => workflow.approveAndGenerateStrategy(req.params.id), 'Generate strategy');
});

router.post('/campaigns/:id/content', async (req, res) => {
  await respond(res, () => workflow.approveAndGenerateContent(req.params.id), 'Generate content');
});

router.post('/campaigns/:id/launch', async (req, res) => {
  await respond(res, () => workflow.launchCampaign(req.params.id), 'Launch campaign');
});

router.get('/campaigns/:id/performance', async (req, res) => {
  await respond(res, () => workflow.fetchPerformance(req.params.id), 'Fetch performance');
});

router.post('/campaigns/:id/optimize', async (req, res) => {
  await respond(res, () => workflow.optimizeCampaign(req.params.id), 'Optimize campaign');
});

router.post('/campaigns/:id/optimize/:index/approve', async (req, res) => {
  await respond(
    res,
    () => workflow.approveOptimization(req.params.id, req.params.index),
    'Approve optimization'
  );
});

router.get('/campaigns/:id/coverage', async (req, res) => {
  await respond(res, () => workflow.checkCohortCoverage(req.params.id), 'Check coverage');
});

export default router;
