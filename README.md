# Attendance & Payroll Management System

A modern, responsive web application for employer-only attendance and payroll management built with Next.js and MongoDB.

## Features

### 👥 Employee Management

- Complete employee directory with status tracking
- Add/edit employee profiles with base pay rates
- Employee avatars with initials-based generation

### 📅 Attendance Tracking

- Multi-employee attendance logging with checkboxes
- Daily attendance with full/half day options
- Support for different attendance types: Present, Absent, Leave, Holiday
- Date-based attendance records (no time tracking)

### 📊 Dashboard & Analytics

- Real-time KPIs: total employees, daily attendance, monthly statistics
- Individual employee performance metrics
- Monthly attendance summaries with visual cards
- Responsive dashboard with mobile-first design

### 💰 Payroll Management

- Daily-based payment calculation (full day/half day)
- Automatic payroll computation based on attendance records
- Support for overtime, allowances, and deductions

### 🎨 Modern UI/UX

- **Teal & Mint Theme**: Professional and fresh color scheme
- **Fully Responsive**: Optimized for mobile devices (320px+)
- **Component-Based**: Reusable UI components with Tailwind CSS
- **Accessible**: WCAG-compliant design patterns

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4 (Admin-only access)
- **Styling**: Tailwind CSS v4 with custom theme variables
- **State Management**: Redux Toolkit + React-Redux
- **Validation**: Zod schemas
- **Date Handling**: React DatePicker

## Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or hosted)
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd attendance
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file in the root directory:

   ```env
   MONGODB_URI="mongodb://username:password@localhost:27017/attendance?authSource=admin"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="your-admin-password"
   ```

4. **Start MongoDB**
   Ensure your MongoDB instance is running and accessible.

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Admin Login

- Navigate to `/login`
- Use the credentials set in your `.env.local` file
- Single-tenant admin access (no employee logins)

### Managing Employees

1. Go to **Employees** page
2. Add new employees with their details and base pay
3. View the complete employee directory

### Recording Attendance

1. Navigate to **Attendance** page
2. Select multiple employees using checkboxes
3. Choose date, attendance type, and portion (full/half day)
4. Save attendance records

### Dashboard Overview

- View real-time attendance statistics
- Monitor individual employee performance
- Track monthly attendance patterns
- Quick access to all major functions

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── attendance/    # Attendance management
│   │   ├── employees/     # Employee directory
│   │   ├── payroll/       # Payroll calculations
│   │   └── timesheets/    # Timesheet reviews
│   ├── api/               # API routes
│   └── login/             # Authentication page
├── components/            # Reusable UI components
│   └── ui/                # Base UI components
├── lib/                   # Utility functions
├── models/                # Mongoose schemas
├── server/                # Server-side configurations
└── store/                 # Redux store setup
```

## Database Schema

### Employee

- Personal information (name, email)
- Employment details (base pay, status)
- Timestamps

### Attendance

- Employee reference
- Date and attendance type
- Portion (full/half day)
- Optional notes

### Payroll

- Employee reference
- Pay period and calculations
- Overtime and deductions

## API Endpoints

- `GET/POST /api/employees` - Employee management
- `GET/POST /api/attendance` - Attendance records
- `GET /api/payroll` - Payroll calculations
- `GET /api/timesheets` - Timesheet summaries
- `POST /api/auth/[...nextauth]` - Authentication

## Mobile Responsiveness

The application is fully optimized for mobile devices:

- **Breakpoints**: 320px (mobile) → 768px (tablet) → 1024px (desktop)
- **Layout**: Responsive grid systems with proper overflow handling
- **Navigation**: Collapsible mobile navigation with horizontal scrolling
- **Forms**: Touch-friendly inputs with appropriate sizing
- **Tables**: Horizontal scrolling containers for data tables

## Development

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint        # ESLint checks
npm run type-check  # TypeScript validation
```

### Database Operations

The app automatically creates indexes and handles database connections. Ensure your MongoDB instance has the required permissions for the specified user.

## Deployment

### Environment Variables

Set all required environment variables in your hosting platform:

- `MONGODB_URI`: Your production MongoDB connection string
- `NEXTAUTH_URL`: Your production domain
- `NEXTAUTH_SECRET`: Strong secret for JWT signing
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Admin credentials

### Recommended Platforms

- **Vercel**: Native Next.js support with automatic deployments
- **Netlify**: Good alternative with edge functions
- **DigitalOcean**: Full control with App Platform
- **Railway**: Simple deployment with MongoDB hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the repository
- Review the documentation
- Check the troubleshooting section below

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**

- Verify your connection string format
- Check MongoDB service status
- Ensure network connectivity and firewall settings

**Build Errors**

- Clear `.next` folder and `node_modules`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version compatibility

**Mobile Layout Issues**

- The app uses extensive overflow controls
- Test on actual devices when possible
- Use browser dev tools for responsive testing

**Authentication Issues**

- Verify environment variables are set correctly
- Check NEXTAUTH_URL matches your domain
- Ensure NEXTAUTH_SECRET is properly generated

---

Built with ❤️ using Next.js and modern web technologies.
