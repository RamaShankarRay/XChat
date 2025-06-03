# XChat - Modern Real-time Chat Application

XChat is a full-stack real-time chat application built with modern web technologies, offering a feature-rich experience similar to WhatsApp.

## Features

- Real-time messaging
- User authentication with Firebase
- File sharing
- Emoji support
- Real-time typing indicators
- Call functionality
- Status updates
- Modern UI with dark/light mode
- Responsive design (mobile-first)

## Tech Stack

- Frontend:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn/ui components
  - React Query for data fetching

- Backend:
  - Firebase Authentication
  - Firebase Realtime Database
  - Firebase Storage
  - Firebase Analytics

## Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xchat.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
