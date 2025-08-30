# Barber Kings

Современная система управления барбершопом с онлайн записью и административной панелью.

## 🚀 Демо

- **Клиентская часть**: [https://goldenspade.github.io/barber-kings/](https://goldenspade.github.io/barber-kings/)
- **Админ панель**: [https://goldenspade.github.io/barber-kings/admin](https://goldenspade.github.io/barber-kings/admin)

## 📱 Функционал

### Клиентская часть
- Просмотр услуг и цен
- Онлайн запись на прием
- Выбор мастера и времени
- Адаптивный дизайн для всех устройств

### Административная панель
- Управление записями клиентов
- Календарь с расписанием
- Статистика и аналитика
- Управление услугами и ценами

## 🛠️ Технологии

- **Frontend**: Vue.js 3, Vue Router, Pinia
- **Build**: Vite
- **Стили**: Bootstrap 5, SCSS
- **Иконки**: Bootstrap Icons
- **Деплой**: GitHub Pages

## 📦 Установка и запуск

### Предварительные требования
- Node.js (версия 20.19+ или 22.12+)
- npm или yarn

### Клонирование репозитория
```bash
git clone https://github.com/GoldenSpade/barber-kings.git
cd barber-kings
```

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшн
```bash
npm run build
```

### Предварительный просмотр сборки
```bash
npm run preview
```

## 🌐 Деплой

### GitHub Pages
Проект настроен для автоматического деплоя на GitHub Pages:

```bash
npm run build
git add .
git commit -m "Update build"
git subtree push --prefix dist origin gh-pages
```

### Обычный хостинг
Для деплоя на обычный хостинг:

1. Измените `base` в `vite.config.js` на `'/'`
2. Соберите проект: `npm run build`
3. Загрузите содержимое папки `dist` на сервер
4. Настройте сервер для SPA маршрутизации

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 📁 Структура проекта

```
src/
├── components/          # Vue компоненты
│   ├── admin/          # Компоненты админ панели
│   ├── client/         # Клиентские компоненты
│   └── ui/             # UI компоненты
├── views/              # Страницы приложения
├── stores/             # Pinia хранилища
├── router/             # Конфигурация маршрутизации
├── assets/             # Статические ресурсы
└── styles/             # Глобальные стили
```

## 🎨 Особенности дизайна

- **Адаптивный дизайн**: Корректное отображение на всех устройствах
- **Современный UI**: Минималистичный и элегантный интерфейс
- **Темная тема**: Поддержка темного режима в админ панели
- **Анимации**: Плавные переходы и микро-анимации

## 📧 Контакты

Для вопросов и предложений обращайтесь к разработчику.

## 📄 Лицензия

MIT License