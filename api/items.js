import { items } from "./data.js";
export default function handler(req, res) {
  const { selfSchedulingId } = req.query;
  const filtered = selfSchedulingId
    ? items.filter(
        (i) => String(i.selfSchedulingId) === String(selfSchedulingId)
      )
    : items;
  res.status(200).json({ items: filtered });
}
