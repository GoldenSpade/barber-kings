# Barber Kings

Modern barbershop management system with online booking and administrative panel integrated with Google Sheets backend.

## 🚀 Live Demo

- **Client Website**: [https://barberkings.digitalunion.io](https://barberkings.digitalunion.io)
- **Admin Panel**: [https://barberkings.digitalunion.io/admin](https://barberkings.digitalunion.io/admin)

## 📱 Features

### Client Portal
- Browse services and pricing
- Online appointment booking
- Location selection (Martinkovac, Adamiceva)
- Time slot availability checking
- Multi-language support (English/Croatian)
- Responsive design for all devices
- Real-time booking validation

### Administrative Panel
- Complete booking management (view, edit, delete)
- Real-time booking status updates
- Service management (add, edit, delete services)
- User authentication system
- WhatsApp notifications for new bookings
- Booking statistics and analytics
- Multi-location support

### Google Sheets Integration
- Real-time data synchronization
- Automated booking storage
- Service catalog management
- User management system
- WhatsApp notification system via Twilio API
- Time slot management with duration support

## 🛠️ Technology Stack

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **UI Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Internationalization**: Vue I18n
- **Form Validation**: Vuelidate
- **Build Tool**: Vite
- **Authentication**: SHA-256 hashing

### Backend & Integration
- **Database**: Google Sheets
- **API**: Google Apps Script
- **Notifications**: Twilio WhatsApp API
- **Hosting**: Hostinger (Apache server)
- **Domain**: Custom domain with SSL

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 20.18.2+)
- npm (version 10.8.2+)
- Google Account (for Google Sheets integration)
- Twilio Account (for WhatsApp notifications)

### Clone Repository
```bash
git clone https://github.com/GoldenSpade/barber-kings.git
cd barber-kings
```

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## ⚙️ Configuration

### Google Sheets Setup
1. Create a new Google Sheet
2. Set up the following sheets:
   - **Main sheet**: Booking data (id, Timestamp, Name, Phone, Location, Date, Time, Status, Service)
   - **Users sheet**: Admin users (username, passwordHash, role, status)
   - **Services sheet**: Service catalog (id, name, description, duration, price)
3. Copy the Google Sheet ID and update `SHEET_ID` in `google-apps-script.js`

### Google Apps Script Setup
1. Open Google Apps Script (script.google.com)
2. Create a new project
3. Copy the contents of `google-apps-script.js` to the script editor
4. Configure Twilio credentials:
   - Update `TWILIO_ACCOUNT_SID`
   - Update `TWILIO_AUTH_TOKEN` 
   - Update `TWILIO_WHATSAPP_FROM`
   - Update `ADMIN_WHATSAPP_NUMBERS`
5. Deploy as web app with "Execute as: Me" and "Who has access: Anyone"
6. Copy the deployment URL for API integration

### Environment Configuration
Update API endpoints in the Vue.js application to point to your Google Apps Script deployment URL.

## 🌐 Deployment

### Hostinger (Current Setup)
The project is currently deployed on Hostinger with Apache server:

1. Build the project: `npm run build`
2. Upload the contents of `dist` folder to your hosting
3. The `.htaccess` file is included for SPA routing support

### GitHub Pages
For GitHub Pages deployment:

```bash
npm run build
git add .
git commit -m "Update build"
git subtree push --prefix dist origin gh-pages
```

### Server Configuration for SPA Routing

#### Apache (.htaccess)
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📁 Project Structure

```
barber-kings/
├── src/
│   ├── components/         # Vue components
│   ├── pages/             # Application pages
│   │   ├── HomePage.vue   # Landing page
│   │   ├── BookingPage.vue # Booking interface
│   │   ├── AdminPage.vue  # Admin dashboard
│   │   └── LoginPage.vue  # Authentication
│   ├── stores/            # Pinia state management
│   │   └── auth.js        # Authentication store
│   ├── router/            # Vue Router configuration
│   ├── config/            # Application configuration
│   ├── i18n/              # Internationalization
│   ├── utils/             # Utility functions
│   └── assets/            # Static assets
├── public/                # Public assets
│   ├── .htaccess         # Apache server configuration
│   └── favicon.png       # Application icon
├── dist/                  # Production build
└── google-apps-script.js  # Backend integration script
```

## 🔧 API Endpoints

### Booking Management
- `GET /?action=add` - Create new booking
- `GET /?action=updateStatus` - Update booking status  
- `GET /?action=updateBooking` - Update booking details
- `GET /?action=deleteBooking` - Delete booking
- `GET /` - Get all bookings (admin=true for full data)

### Service Management
- `GET /?action=getServices` - Get all services
- `GET /?action=addService` - Add new service
- `GET /?action=updateService` - Update service
- `GET /?action=deleteService` - Delete service

### Authentication
- `GET /?action=verifyUser` - User authentication

## 🎨 Design Features

- **Responsive Design**: Perfect display on all devices
- **Modern UI**: Clean and elegant interface
- **Bootstrap Integration**: Consistent design system
- **Multi-language**: English and Croatian support
- **Real-time Updates**: Live booking status updates
- **WhatsApp Integration**: Instant notifications

## 🚀 Performance Features

- **Vite Build System**: Fast development and optimized builds
- **Code Splitting**: Optimized loading
- **Console Removal**: Clean production builds
- **Asset Optimization**: Minified CSS and JS
- **Caching Strategy**: Static asset caching

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security

- SHA-256 password hashing
- Input validation and sanitization
- CORS handling
- Secure API communication
- Authentication middleware

## 📞 Support

For questions and suggestions, please contact the development team.

## 📄 License

MIT License - feel free to use this project for your own barbershop business!