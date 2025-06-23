import { items } from './data.js';
export default function handler(req, res) {
  const { configurationId } = req.query;
  const filtered = configurationId ? items.filter(i => String(i.configurationId) === String(configurationId)) : items;
  res.status(200).json({ items: filtered });
}
