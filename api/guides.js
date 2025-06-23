import { guides } from './data.js';
export default function handler(req, res) {
  const { cityId } = req.query;
  const filtered = cityId ? guides.filter(g => String(g.cityId) === String(cityId)) : guides;
  res.status(200).json({ items: filtered });
}
