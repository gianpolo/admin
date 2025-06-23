import { configurations } from '../../data.js';
export default function handler(req, res) {
  const { id } = req.query;
  const cfg = configurations.find(c => String(c.id) === String(id));
  if (!cfg) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  cfg.isRunning = true;
  res.status(200).json(cfg);
}
