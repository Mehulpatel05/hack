export function log(campaignId, agent, action, data) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    campaignId,
    agent,
    action,
    data
  };
  console.log(`[${timestamp}] [${agent}] ${action}:`, JSON.stringify(data, null, 2));
  return logEntry;
}
