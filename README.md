# ClinicQueue - Patient Queue Management System

A modern, production-ready clinic queue and appointment management system built with Next.js, Prisma, and PostgreSQL. Designed for hospitals and clinics to manage patient flow efficiently.

## Features

- **Public Queue Display** - Large, TV-friendly display showing current patient and waiting queue with real-time updates (3-second polling)
- **Appointment Registration** - Patients can register for appointments with Turkish ID (TC Kimlik No) validation and duplicate prevention
- **Doctor Dashboard** - Secure dashboard for doctors to manage queue operations
- **Queue Management** - Call next patient, finish current patient, skip, and recall functionality
- **Real-time Updates** - All screens update automatically with live queue status
- **Sound Notifications** - Audio alert when a new patient is called
- **User Authentication** - Username/password login via Better Auth with session management
- **Responsive Design** - Works on TV screens, tablets, and mobile devices

## Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **TypeScript** - Type-safe code
- **TailwindCSS v4** - Utility-first CSS
- **shadcn/ui** - High-quality UI components
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Server Actions** - Type-safe server-side operations
- **Better Auth 1.4.18** - Authentication with username plugin
- **Prisma 5.22** - ORM for database management
- **PostgreSQL 17** - Relational database

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16+ (macOS: `brew install postgresql@17`)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/appointment-app.git
   cd appointment-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL** (macOS with Homebrew)
   ```bash
   brew services start postgresql@17
   createdb patient_queue
   ```

4. **Configure environment variables**

   Create `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username@localhost/blabla"
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

5. **Set up database**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed default doctor account**

   Start the dev server first:
   ```bash
   npm run dev
   ```

   In another terminal, run:
   ```bash
   npx tsx prisma/seed.ts
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
```

## Project Structure

```
appointment-app/
├── app/                              # Next.js App Router
│   ├── api/auth/[...all]/route.ts   # Better Auth API handler
│   ├── dashboard/                    # Doctor dashboard (protected)
│   │   ├── layout.tsx               # Auth-protected layout
│   │   └── page.tsx                 # Dashboard page
│   ├── login/                        # Doctor login
│   │   └── page.tsx                 # Login form
│   ├── globals.css                   # Tailwind styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Public queue display
├── actions/
│   └── queue.ts                      # Server actions for queue operations
├── components/
│   ├── ui/                           # shadcn components
│   ├── appointment-dialog.tsx        # Appointment registration form
│   ├── dashboard-header.tsx          # Doctor dashboard header
│   ├── doctor-dashboard.tsx          # Queue management panel
│   ├── header.tsx                    # Public page header
│   └── queue-display.tsx             # TV display component
├── hooks/
│   └── use-queue.ts                  # Real-time queue polling hook
├── lib/
│   ├── auth.ts                       # Better Auth configuration
│   ├── auth-client.ts               # Better Auth client
│   ├── prisma.ts                     # Prisma client singleton
│   └── utils.ts                      # Utility functions
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── seed.ts                       # Database seeding script
├── middleware.ts                     # Route protection middleware
├── next.config.ts                    # Next.js configuration
└── tsconfig.json                     # TypeScript configuration
```

## Database Schema

### User
- `id` - Unique identifier
- `username` - Unique username (doctor)
- `email` - Email address
- `name` - Full name
- `role` - User role (default: "doctor")
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### PatientQueue
- `id` - Unique identifier
- `tc` - Turkish ID (11 digits)
- `firstName` - Patient first name
- `lastName` - Patient last name
- `queueNumber` - Queue position number
- `status` - Status (waiting, called, completed, skipped)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Session & Account
- Managed by Better Auth for authentication

### Password Hashing
Passwords are securely hashed using Better Auth's internal hashing algorithm. Never store plain text passwords.

## API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - Create new doctor account
- `POST /api/auth/sign-in/username` - Login with username/password
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session

### Server Actions (Called from UI)
- `getQueueStatus()` - Get current queue status
- `createAppointment(data)` - Register new patient
- `callNextPatient()` - Call next waiting patient
- `finishPatient()` - Mark current patient as completed
- `skipPatient()` - Skip current patient
- `recallPatient(patientId)` - Recall a completed patient

## Routes

### Public Routes
- `/` - Queue display (TV screen)
- `/login` - Doctor login page

### Protected Routes
- `/dashboard` - Doctor queue management dashboard

## Usage

### For Patients (Public Screen)
1. View the live queue display
2. Click "Get Appointment"
3. Enter TC kimlik ID, first name, and last name
4. Receive queue number
5. Wait for your number to be called

### For Doctors (Dashboard)
1. Login as a doctor
2. View current patient being served
3. See waiting queue list
4. Operations:
   - **Call Next Patient** - Move next waiting patient to "now serving"
   - **Finish Patient** - Mark current patient as completed
   - **Skip** - Move current patient to end of queue
   - **Recall** - Re-call a completed patient

## Real-time Updates

- Queue display updates every 3 seconds via polling
- Doctor dashboard refreshes automatically
- Sound notification plays when new patient is called
- No page refresh needed - data updates in background

## Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### Database Connection (PostgreSQL on macOS)

```
postgresql://username@localhost/blabla
```

## Development

### Database Management
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset --force
```

### Linting
```bash
npm run lint
```

## Production Deployment

### Building
```bash
npm run build
```

### Environment Setup
1. Set production environment variables in `.env.production`
2. Use a production PostgreSQL instance
3. Generate a strong `BETTER_AUTH_SECRET`
4. Set `BETTER_AUTH_URL` to your production domain


## Performance Considerations

- Real-time updates use 3-second polling (adjustable in `hooks/use-queue.ts`)
- Database queries are indexed on `status` and `createdAt` for performance
- Session caching reduces database hits
- Static pages pre-rendered at build time

## Security

- All routes except public display require authentication
- Passwords securely hashed with Better Auth
- Session cookies with httpOnly flag
- CSRF protection via Better Auth
- Input validation with Zod
- Database migrations manage schema safely

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `brew services list`
- Verify database exists: `psql -l`
- Check connection string in `.env`
- On macOS with Homebrew, use `&host=/tmp` in connection string

### Authentication Issues
- Ensure dev server is running when seeding
- Clear browser cookies if login fails
- Check `BETTER_AUTH_SECRET` is set

### Real-time Updates Not Working
- Check browser console for errors
- Verify polling interval in `hooks/use-queue.ts`
- Ensure server is responding to API calls

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Support

For issues, questions, or suggestions, please open an issue on GitHub.


