const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const devices = [
  {
    id: "10025426-1",
    name: "Рециркуляционная вентиляция, Trox, xcube, Приточно-рециркуляционная установка 2С-ПР10.1",
    room: "101",
    state: "free",
    image: "ventilation",
    alarms: 0,
    warnings: 0
  },
  {
    id: "10025426-2",
    name: "Осмометр Киви Осмометрия ОСКР-1М",
    room: "2.5.03/2",
    state: "busy",
    image: "osmometer",
    alarms: 0,
    warnings: 0
  },
  {
    id: "10025426-3",
    name: "Рециркуляционная вентиляция, Trox, xcube, Приточно-рециркуляционная установка 2С-ПР10.1",
    room: "101",
    state: "free",
    image: "ventilation",
    alarms: 0,
    warnings: 0
  },
  {
    id: "10025426-4",
    name: "Система щелочи, Watertown, NaOH",
    room: "2.5.03/2",
    state: "free",
    image: "alkali",
    alarms: 0,
    warnings: 0
  },
  {
    id: "10025426-5",
    name: "Осмометр Киви Осмометрия ОСКР-1М",
    room: "2.5.03/2",
    state: "busy",
    image: "osmometer",
    alarms: 0,
    warnings: 0
  },
  {
    id: "10025426-6",
    name: "Осмометр Киви Осмометрия ОСКР-1М",
    room: "101",
    state: "busy",
    image: "osmometer",
    alarms: 0,
    warnings: 0
  },
  {
    id: "00-024004",
    name: "Бокс биологической безопасности",
    room: "507",
    state: "busy",
    image: "biosafety",
    alarms: 0,
    warnings: 0
  },
  {
    id: "10025426-7",
    name: "Рециркуляционная вентиляция, Trox, xcube, Приточно-рециркуляционная установка 2С-ПР10.1",
    room: "010",
    state: "free",
    image: "ventilation",
    alarms: 0,
    warnings: 0
  }
];

app.get('/api/devices', (req, res) => {
  res.json(devices);
});

app.post('/api/devices/:id/state', (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  const device = devices.find(d => d.id === id);
  if (device) {
    device.state = state;
    res.json(device);
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

function generateAnalyticsData(deviceId, count = 25) {
  const workTypes = ['Проверка', 'Обработка', 'Калибровка', 'Тестирование', 'Обслуживание', 'Ремонт', 'Инспекция'];
  const users = ['kharinskaia', 'ivanov', 'petrov', 'sidorov', 'smirnov', 'kozlov', 'novikov', 'morozov'];
  const results = ['успешно', 'не удалось', 'требует внимания', 'в процессе'];
  const samples = ['113-22', '114-23', '115-24', '116-25', '117-26', '118-27'];
  
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const workType = workTypes[Math.floor(Math.random() * workTypes.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const result = results[Math.floor(Math.random() * results.length)];
    const sample = samples[Math.floor(Math.random() * samples.length)];
    
    let additional = '';
    if (workType === 'Проверка') {
      additional = `Образец/серия: ${sample}`;
    } else if (workType === 'Обработка') {
      additional = `Результат: ${result}`;
    } else if (workType === 'Калибровка') {
      additional = `Параметры: ${Math.floor(Math.random() * 100)}%`;
    } else if (workType === 'Тестирование') {
      additional = `Тест #${Math.floor(Math.random() * 1000)}`;
    } else {
      additional = `Статус: ${result}`;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    data.push({
      date: `${day}.${month}.${year}`,
      time: `${hours}:${minutes}`,
      workType: workType,
      additional: additional,
      user: user
    });
  }
  
  return data.sort((a, b) => {
    const dateA = new Date(`${a.date.split('.').reverse().join('-')} ${a.time}`);
    const dateB = new Date(`${b.date.split('.').reverse().join('-')} ${b.time}`);
    return dateB - dateA;
  });
}

function generateDescriptionData(device) {
  const serialNumbers = ['37767108', '37767109', '37767110', '37767111', '37767112'];
  const passportIds = ['18941', '18942', '18943', '18944', '18945'];
  const manufacturers = {
    'ventilation': 'Trox',
    'osmometer': 'Киви Осмометрия',
    'alkali': 'Watertown',
    'biosafety': 'BioSafety Systems'
  };
  
  return {
    id: `28fedb4b-85a1-11e8-80e5-${Math.random().toString(36).substr(2, 12)}`,
    serialNumber: serialNumbers[Math.floor(Math.random() * serialNumbers.length)],
    passportId: passportIds[Math.floor(Math.random() * passportIds.length)],
    eo: device.id,
    name: device.name,
    manufacturer: manufacturers[device.image] || 'Unknown'
  };
}

app.get('/api/detailed-data/:id', (req, res) => {
  const { id } = req.params;
  const device = devices.find(d => d.id === id);
  
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  const analyticsData = generateAnalyticsData(id, 25);
  const descriptionData = generateDescriptionData(device);
  
  res.json({
    analytics: analyticsData,
    description: descriptionData
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboards.html'));
});

app.get('/dashboards', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboards.html'));
});

app.get('/device-detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'device-detail.html'));
});

app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.redirect('/error');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
