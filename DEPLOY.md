# Деплой на GitHub Pages

## Важно: Ограничения GitHub Pages

GitHub Pages поддерживает **только статические файлы** (HTML, CSS, JS, изображения). Node.js сервер не может работать на GitHub Pages.

## Решение: Статические JSON файлы

Проект был адаптирован для работы со статическими JSON файлами вместо API endpoints.

## Шаги для деплоя

### 1. Подготовка репозитория

1. Создайте репозиторий на GitHub (если еще не создан)
2. Закоммитьте и запушьте код:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### 2. Генерация статических данных

Перед деплоем нужно сгенерировать статические JSON файлы:

```bash
npm install
node scripts/generate-static-data.js
```

Это создаст папку `public/api/` с JSON файлами:
- `public/api/devices.json` - список всех устройств
- `public/api/detailed-data/{deviceId}.json` - детальные данные для каждого устройства

### 3. Настройка GitHub Pages

#### Вариант A: Автоматический деплой через GitHub Actions (рекомендуется)

**Важно:** Сначала нужно включить GitHub Pages в настройках репозитория!

1. В репозитории перейдите в **Settings** → **Pages**
2. В разделе **Source** выберите **GitHub Actions**
3. Нажмите **Save** (если кнопка доступна)
4. Если опция "GitHub Actions" недоступна, выберите любую ветку (например, `main`) и папку `/public`, затем переключитесь обратно на **GitHub Actions**
5. После этого при каждом push в ветку `main` или `master` будет автоматически запускаться workflow из `.github/workflows/deploy.yml`
6. Workflow автоматически:
   - Установит зависимости
   - Сгенерирует статические данные
   - Скомпилирует SCSS
   - Задеплоит на GitHub Pages

#### Вариант B: Ручной деплой

1. В репозитории перейдите в **Settings** → **Pages**
2. В разделе **Source** выберите ветку (например, `main`) и папку `/public`
3. Нажмите **Save**

⚠️ **Важно:** При ручном деплое нужно:
- Сгенерировать статические данные локально
- Скомпилировать SCSS
- Закоммитить все файлы (включая `public/api/` и `public/css/styles.css`)

### 4. Файл .nojekyll

В проекте уже создан файл `public/.nojekyll`, который отключает обработку Jekyll на GitHub Pages. Это необходимо для корректной работы API endpoints и файлов, начинающихся с подчеркивания.

### 5. Изменение путей в коде (если нужно)

Если ваш репозиторий находится не в корне GitHub (например, `username.github.io/repo-name`), нужно обновить пути в JavaScript файлах:

1. Создайте файл `public/js/config.js`:
   ```javascript
   export const BASE_PATH = '/repo-name'; // замените на имя вашего репозитория
   ```

2. Обновите файлы, использующие API:
   ```javascript
   import { BASE_PATH } from './config.js';
   const devices = await safeFetch(`${BASE_PATH}/api/devices`);
   ```

### 5. Проверка деплоя

После деплоя ваш сайт будет доступен по адресу:
- `https://username.github.io/repo-name/` (если репозиторий не в корне)
- `https://username.github.io/` (если репозиторий называется `username.github.io`)

## Структура после генерации

```
public/
├── api/
│   ├── devices.json
│   └── detailed-data/
│       ├── 10025426-1.json
│       ├── 10025426-2.json
│       └── ...
├── css/
│   └── styles.css (скомпилированный)
├── js/
│   └── ...
└── ...
```

## Обновление данных

Если нужно обновить данные устройств:

1. Отредактируйте массив `devices` в `scripts/generate-static-data.js`
2. Запустите скрипт: `node scripts/generate-static-data.js`
3. Закоммитьте изменения:
   ```bash
   git add public/api/
   git commit -m "Update device data"
   git push
   ```

## Альтернативные решения

Если вам нужен полноценный Node.js сервер, рассмотрите:

- **Vercel** - бесплатный хостинг для Node.js приложений
- **Netlify** - бесплатный хостинг с поддержкой serverless функций
- **Railway** - платформа для деплоя Node.js приложений
- **Heroku** - классический вариант (платный для production)
- **Render** - бесплатный хостинг для Node.js

## Troubleshooting

### Проблема: 404 на API endpoints

**Решение:** Убедитесь, что:
- Файлы в `public/api/` закоммичены
- GitHub Actions workflow выполнился успешно
- Пути в коде правильные (относительные, без `/api/` в начале, если используется base path)

### Проблема: Стили не применяются

**Решение:** 
- Убедитесь, что `public/css/styles.css` скомпилирован и закоммичен
- Проверьте пути к CSS в HTML файлах

### Проблема: Изображения не загружаются

**Решение:**
- Проверьте пути к изображениям (они должны быть относительными)
- Убедитесь, что все файлы в `public/images/` закоммичены
