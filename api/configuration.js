import { selfschedulings } from './data.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const body = req.body;
  const newId = selfschedulings.length
    ? Math.max(...selfschedulings.map((c) => c.id)) + 1
    : 1;
  const config = {
    id: newId,
    ...body,
    isRunning: false
  };
  selfschedulings.push(config);
  res.status(200).json(config);
}
