import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

// Fake data generators
let nextConfigId = 3;
const cities = [
  { id: 1, name: 'Rome' },
  { id: 2, name: 'Milan' },
  { id: 3, name: 'Florence' }
];

const tours = [
  { id: 1, name: 'Colosseum Tour', cityId: 1 },
  { id: 2, name: 'Vatican Museums', cityId: 1 },
  { id: 3, name: 'Duomo Visit', cityId: 2 }
];

const guides = [
  { guide: { id: 1, name: 'Mario Rossi' }, cityId: 1 },
  { guide: { id: 2, name: 'Luigi Bianchi' }, cityId: 2 },
  { guide: { id: 3, name: 'Anna Verdi' }, cityId: 1 }
];

let configurations = [
  {
    id: 1,
    description: 'Summer Tours',
    schedulingWindowStart: '2024-06-01',
    schedulingWindowEnd: '2024-06-10',
    toursPeriodStart: '2024-07-01',
    toursPeriodEnd: '2024-07-31',
    cityId: 1,
    experienceIds: [1,2],
    guideIds: [1],
    isRunning: true
  },
  {
    id: 2,
    description: 'Winter Tours',
    schedulingWindowStart: '2024-12-01',
    schedulingWindowEnd: '2024-12-10',
    toursPeriodStart: '2025-01-01',
    toursPeriodEnd: '2025-01-31',
    cityId: 2,
    experienceIds: [3],
    guideIds: [2],
    isRunning: false
  }
];

const items = [
  { id: 1, name: 'Colosseum Tour', tourDate: '2024-07-10', availableSlots: 10, configurationId: 1 },
  { id: 2, name: 'Vatican Museums', tourDate: '2024-07-11', availableSlots: 8, configurationId: 1 },
  { id: 3, name: 'Duomo Visit', tourDate: '2025-01-15', availableSlots: 12, configurationId: 2 }
];

// Auth signin
router.post('/auth/signin', (req, res) => {
  res.json({ accessToken: 'fake-token' });
});

// Cities
router.get('/cities', (req, res) => {
  res.json(cities);
});

// Tours
router.get('/tours', (req, res) => {
  const { cityName } = req.query;
  const filtered = cityName
    ? tours.filter(t =>
        cities.find(c => c.id === t.cityId)?.name.toLowerCase().includes(cityName.toLowerCase())
      )
    : tours;
  res.json({ items: filtered });
});

// Guides
router.get('/guides', (req, res) => {
  const { cityId } = req.query;
  const filtered = cityId ? guides.filter(g => g.cityId == cityId) : guides;
  res.json({ items: filtered });
});

// List configurations
router.get('/configurations', (req, res) => {
  res.json(configurations);
});

// Create configuration
router.post('/configuration', (req, res) => {
  const newCfg = { id: nextConfigId++, ...req.body, isRunning: false };
  configurations.push(newCfg);
  res.json(newCfg);
});

// Get configuration by id
router.get('/configurations/:id', (req, res) => {
  const cfg = configurations.find(c => c.id == req.params.id);
  if (!cfg) return res.status(404).end();
  res.json(cfg);
});

// Open configuration
router.post('/configurations/:id/open', (req, res) => {
  const cfg = configurations.find(c => c.id == req.params.id);
  if (!cfg) return res.status(404).end();
  cfg.isRunning = true;
  res.json({ id: cfg.id });
});

// Close configuration
router.post('/configurations/:id/close', (req, res) => {
  const cfg = configurations.find(c => c.id == req.params.id);
  if (!cfg) return res.status(404).end();
  cfg.isRunning = false;
  res.json({ id: cfg.id });
});

// Items
router.get('/items', (req, res) => {
  const { configurationId } = req.query;
  const filtered = configurationId ? items.filter(i => i.configurationId == configurationId) : items;
  res.json({ items: filtered });
});

app.use('/api/v1', router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});
