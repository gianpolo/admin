import { configurations } from '../data.js';
export default function handler(req, res) {
  const { id } = req.query;
  const config = configurations.find(c => String(c.id) === String(id));
  if (!config) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json(config);
}
