# EcoWaste - Waste Management Platform

A modern web application connecting waste collection companies with customers, built with React, TypeScript, and Flask.

![EcoWaste Platform](https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750)

## Features

- 🔍 Search and filter waste collection companies by region
- 🏢 Company registration and profile management
- 📊 Admin dashboard for platform management
- 🌐 Region-based service area management
- 📱 Fully responsive design
- 🔒 Secure authentication system

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- React Hook Form
- Lucide React Icons

### Backend
- Python Flask
- SQLAlchemy
- JWT Authentication
- SQLite Database

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start Flask server:
```bash
flask run
```

## Default Accounts

### Admin Access
- Email: admin@ecowaste.example
- Password: admin123

### Sample Company
- Email: greenbin@example.com
- Password: password123

## Project Structure

```
ecowaste/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React context providers
│   ├── pages/         # Page components
│   └── types/         # TypeScript definitions
├── backend/
│   ├── app.py         # Flask application
│   └── requirements.txt
└── public/            # Static assets
```

## Key Features

### For Companies
- Company profile management
- Service area configuration
- Contact information management

### For Customers
- Search companies by region
- View company profiles
- Direct contact options

### For Administrators
- Company management
- Region management
- Platform statistics
- User management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide React](https://lucide.dev)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)
- Photos from [Pexels](https://www.pexels.com)