# Biocad 2026 Test Project

Веб-приложение с дашбордами устройств.

## Технологии

- Node.js
- Express.js
- Нативный JavaScript
- HTML5
- SCSS (Sass)

## Структура проекта

```
biocad-2026-test/
├── server.js              # Node.js сервер
├── package.json           # Зависимости проекта
├── links.json            # Файл с ссылками на деплой и код
├── scss/                 # SCSS исходники
│   ├── _variables.scss  # Переменные (цвета, типографика, отступы)
│   ├── _mixins.scss     # Миксины (переиспользуемые стили)
│   ├── _base.scss       # Базовые стили
│   ├── _header.scss     # Стили шапки
│   ├── _layout.scss     # Стили layout
│   ├── _device-card.scss # Стили карточек устройств
│   ├── _device-detail.scss # Стили детального просмотра
│   ├── _error.scss      # Стили страницы ошибки
│   ├── _responsive.scss # Адаптивные стили
│   └── main.scss        # Главный файл (импортирует все модули)
├── public/               # Статические файлы
│   ├── dashboards.html  # Страница дашбордов
│   ├── device-detail.html # Страница детального просмотра
│   ├── error.html       # Страница ошибки
│   ├── css/
│   │   └── styles.css   # Скомпилированные стили (генерируется из SCSS)
│   ├── images/
│   │   └── devices/     # Изображения устройств (см. README.md в папке)
│   └── js/
│       ├── dashboards.js # Логика дашбордов
│       └── device-detail.js # Логика детального просмотра
└── README.md
```

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Скомпилируйте SCSS в CSS:
```bash
npm run build:css
```

Или для автоматической компиляции при изменениях:
```bash
npm run watch:css
```

3. Запустите сервер:
```bash
npm start
```

4. Откройте в браузере:
```
http://localhost:3000
```
