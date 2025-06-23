export const cities = [
  { id: 1, name: 'Rome' },
  { id: 2, name: 'Milan' },
  { id: 3, name: 'Florence' }
];

export const tours = [
  { id: 1, name: 'Colosseum Tour', cityName: 'Rome' },
  { id: 2, name: 'Duomo Tour', cityName: 'Milan' },
  { id: 3, name: 'Uffizi Tour', cityName: 'Florence' }
];

export const guides = [
  { guide: { id: 1, name: 'Mario Rossi' }, cityId: 1 },
  { guide: { id: 2, name: 'Luigi Verdi' }, cityId: 2 },
  { guide: { id: 3, name: 'Anna Bianchi' }, cityId: 3 }
];

export let configurations = [
  {
    id: 1,
    cityId: 1,
    description: 'Sample configuration',
    schedulingWindowStart: '2025-01-01',
    schedulingWindowEnd: '2025-01-07',
    toursPeriodStart: '2025-02-01',
    toursPeriodEnd: '2025-02-10',
    experienceIds: [1],
    guideIds: [1],
    isRunning: false
  }
];

export let items = [
  { id: 1, configurationId: 1, name: 'Colosseum Morning', tourDate: '2025-02-01', availableSlots: 10 },
  { id: 2, configurationId: 1, name: 'Colosseum Evening', tourDate: '2025-02-02', availableSlots: 8 }
];

export const users = [
  { userName: 'admin', password: 'password', accessToken: 'mock-token' }
];
