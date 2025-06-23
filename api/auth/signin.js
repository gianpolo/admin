import { users } from '../data.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { userName, password } = req.body || {};
  const user = users.find(u => u.userName === userName && u.password === password);
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  res.status(200).json({ accessToken: user.accessToken });
}
