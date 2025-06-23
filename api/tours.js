import { tours } from './data.js';
export default function handler(req, res) {
  const { cityName = '' } = req.query;
  const filtered = cityName ? tours.filter(t => t.cityName.toLowerCase() === cityName.toLowerCase()) : tours;
  res.status(200).json({ items: filtered });
}
