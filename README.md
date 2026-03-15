# CID-Cell — Collaborative Innovation & Development Cell

> Official website for the **Collaborative Innovation & Development Cell (CID-Cell)**, Department of Computer Science & Engineering. A structured platform for hands-on learning, real-world projects, and innovation-driven growth.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-9.3-13AA52?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Overview

CID-Cell is a full-stack web application featuring:
- A **React-based frontend** with Neo-Brutalist design and interactive components
- A **Node.js/Express backend** with RESTful API for managing users, projects, events, and members
- **MongoDB database** for persistent data storage
- **JWT authentication** for secure user sessions
- **Google OAuth integration** for seamless login

---

## Features

### Frontend Features
- **Neo-Brutalist Design** — Bold borders, solid shadows, vibrant accent colors, and playful typography
- **Fully Responsive** — Optimized for mobile, tablet, and desktop viewports
- **Multi-Page SPA** — Client-side routing with React Router v7
- **Component-Based Architecture** — Reusable, modular React components
- **Semester Roadmap Timeline** — Interactive visual timeline from Sem 1 to Capstone
- **Project Portfolio** — Filterable grid of Micro, Macro, Capstone, and Open Source projects
- **Events & Activities** — Categorized events with status indicators (Upcoming / Completed)
- **Team Page** — Showcase of CID-Cell members and leadership
- **Contact Page** — Reach out and join the community
- **Admin Dashboard** — User, project, event, and member management (admin only)

### Backend Features
- **RESTful API** with proper HTTP status codes and error handling
- **JWT-based Authentication** with token refresh support
- **Google OAuth 2.0** integration for secure login
- **Role-based Access Control** (Admin, Coordinator, Member)
- **Full CRUD Operations** for users, projects, events, and members
- **Database Migrations & Cleanup** utilities
- **CORS support** for cross-origin requests

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Vite | 6 | Build tool & dev server |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| Lucide React | Latest | Icon library |
| PostCSS + Autoprefixer | - | CSS processing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥18 | JavaScript runtime |
| Express | 5.2 | Web application framework |
| MongoDB | 9.3 (Mongoose) | NoSQL database |
| JWT | 9.0 | Token-based authentication |
| CORS | 2.8 | Cross-Origin Resource Sharing |
| Google Auth | 10.6 | OAuth 2.0 authentication |
| dotenv | 17.3 | Environment variables |
| Nodemon | 3.1 | Development auto-reload |

---

## Project Structure

```
CID-Cell/
├── frontend/                   # React frontend application
│   ├── public/
│   │   └── slideshow/          # Slideshow images
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutPreview.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── VisionMission.jsx
│   │   │   ├── KeyActivities.jsx
│   │   │   ├── Benefits.jsx
│   │   │   ├── CTASection.jsx
│   │   │   ├── SectionHeading.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── ScrollReveal.jsx
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Developers.jsx
│   │   │   └── Roadmap.jsx
│   │   ├── admin/              # Admin dashboard components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── components/
│   │   │   │   ├── AdminHeader.jsx
│   │   │   │   ├── AdminFooter.jsx
│   │   │   │   └── AdminSidebar.jsx
│   │   │   └── pages/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       ├── ProjectManagement.jsx
│   │   │       ├── EventManagement.jsx
│   │   │       └── MemberManagement.jsx
│   │   ├── context/            # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── utils/              # Utility functions
│   │   │   └── formatTime.js
│   │   ├── App.jsx             # Root component with routes
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles & Tailwind layers
│   ├── index.html
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.cjs      # PostCSS plugins
│   ├── vite.config.js          # Vite build configuration
│   └── package.json

├── backend/                    # Node.js/Express backend API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── eventController.js
│   │   └── memberController.js
│   ├── middleware/             # Custom middleware
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Event.js
│   │   ├── EventRegistration.js
│   │   └── Member.js
│   ├── routes/                 # API route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── eventRoutes.js
│   │   └── memberRoutes.js
│   ├── server.js              # Main application entry
│   ├── cleanupDB.js           # Database cleanup utility
│   ├── promoteUser.js         # User promotion utility
│   ├── package.json
│   └── .env                   # Environment variables (not in repo)

└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** (local or cloud instance, e.g., MongoDB Atlas)
- **Git** for version control

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/CID-Cell.git
cd CID-Cell
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # (create if doesn't exist)
```

#### Backend Environment Variables (.env)

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/cidcell
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cidcell

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Install Backend Dependencies

```bash
npm install
# Installs: express, mongoose, cors, dotenv, jsonwebtoken, google-auth-library, nodemon
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

#### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend/` directory (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

#### Install Frontend Dependencies

```bash
npm install
# Installs: react, react-router-dom, tailwindcss, lucide-react, vite, and more
```

---

## Running the Application

### Option 1: Run Both Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Application will run on http://localhost:5173
```

### Option 2: Run Backend Only (for API testing)

```bash
cd backend
npm run dev
# Access API at http://localhost:5000
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Outputs to dist/ directory
```

---

## Database Schema

### Models

#### User
- `_id`: MongoDB ObjectId
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String
- `role`: String (Admin, Coordinator, Member)
- `joinDate`: Date
- `googleId`: String (optional)
- `phone`: String (optional)
- `photo`: String (optional)
- `createdAt`: Date
- `updatedAt`: Date

#### Project
- `_id`: MongoDB ObjectId
- `title`: String
- `description`: String
- `category`: String (Micro, Macro, Capstone, Open Source)
- `technologies`: Array
- `members`: Array of User references
- `status`: String (Active, Completed, On Hold)
- `startDate`: Date
- `endDate`: Date
- `repositoryUrl`: String
- `createdAt`: Date
- `updatedAt`: Date

#### Event
- `_id`: MongoDB ObjectId
- `title`: String
- `description`: String
- `date`: Date
- `location`: String
- `category`: String (Workshop, Hackathon, Seminar, Meetup)
- `registrations`: Array of EventRegistration references
- `maxAttendees`: Number
- `status`: String (Upcoming, Completed, Cancelled)
- `createdAt`: Date
- `updatedAt`: Date

#### Member
- `_id`: MongoDB ObjectId
- `user`: User reference
- `semester`: Number
- `specialization`: String
- `joinDate`: Date
- `status`: String (Active, Inactive, Graduated)
- `achievements`: Array
- `createdAt`: Date
- `updatedAt`: Date

#### EventRegistration
- `_id`: MongoDB ObjectId
- `event`: Event reference
- `user`: User reference
- `registrationDate`: Date
- `attended`: Boolean
- `feedback`: String (optional)

---

## API Routes

### Authentication Routes (`/api/auth`)
- `POST /register` — Register a new user
- `POST /login` — Login with email and password
- `POST /google-login` — Login with Google OAuth
- `POST /refresh-token` — Refresh JWT token
- `POST /logout` — Logout user

### User Routes (`/api/users`)
- `GET /` — Get all users (admin only)
- `GET /:id` — Get user by ID
- `PUT /:id` — Update user profile
- `DELETE /:id` — Delete user (admin only)
- `GET /:id/profile` — Get user profile with details

### Project Routes (`/api/projects`)
- `GET /` — Get all projects
- `GET /:id` — Get project by ID
- `POST /` — Create new project (admin)
- `PUT /:id` — Update project (admin)
- `DELETE /:id` — Delete project (admin)
- `POST /:id/members` — Add member to project

### Event Routes (`/api/events`)
- `GET /` — Get all events
- `GET /:id` — Get event by ID
- `POST /` — Create new event (admin)
- `PUT /:id` — Update event (admin)
- `DELETE /:id` — Delete event (admin)
- `POST /:id/register` — Register for event
- `DELETE /:id/unregister/:userId` — Unregister from event

### Member Routes (`/api/members`)
- `GET /` — Get all members
- `GET /:id` — Get member by ID
- `POST /` — Create new member (admin)
- `PUT /:id` — Update member (admin)
- `DELETE /:id` — Delete member (admin)

---

## Utility Scripts

### Database Cleanup
```bash
cd backend
node cleanupDB.js
# Removes duplicate entries and orphaned records
```

### Promote User to Admin
```bash
cd backend
node promoteUser.js <userId>
# Grants admin privileges to specified user
```

---

## Authentication Flow

1. **User Registration/Login** → JWT token issued
2. **Client stores JWT** → Local storage or cookies
3. **API requests include JWT** → Authorization header
4. **Middleware validates JWT** → authMiddleware.js
5. **Request proceeds or fails** → Based on token validity
6. **Token expires** → Client uses refresh token to get new JWT

---

## Development Workflow

### Adding a New Feature

1. **Backend**:
   - Create model in `models/`
   - Create controller in `controllers/`
   - Create routes in `routes/`
   - Add to `server.js` middleware

2. **Frontend**:
   - Create component in `components/` or `pages/`
   - Add route in `App.jsx` if page-level
   - Use context/API for state management
   - Style with Tailwind CSS

###

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Design System

The website follows a **Neo-Brutalist** design language:

| Token | Value | Usage |
|---|---|---|
| `bg` | `#FFFDF5` | Page background (soft cream) |
| `primary` | `#1A1A1A` | Text, borders, dark elements |
| `highlight-yellow` | `#FFDE59` | Primary accent / CTA |
| `highlight-purple` | `#C0B6F2` | Secondary accent |
| `highlight-blue` | `#87CEEB` | Info accent |
| `highlight-green` | `#98FB98` | Success accent |
| `highlight-pink` | `#FFA6C9` | Decorative accent |
| `highlight-orange` | `#FF914D` | Warning / energy accent |
| `highlight-teal` | `#7ED9CE` | Cool accent |

**Shadows:** `shadow-neo` (4px 4px solid black), `shadow-neo-lg`, `shadow-neo-sm`  
**Borders:** 2–3px solid black  
**Fonts:** Anton (headings), Inter (body)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## License

This project is private and maintained by the CID-Cell team, Department of CSE.

---

## Testing & Debugging

### Backend Testing

```bash
cd backend

# Run tests (if configured)
npm test

# Test API endpoints using curl or Postman
curl http://localhost:5000/api/projects

# Check server logs
# Logs will appear in terminal where npm run dev is running
```

### Frontend Debugging

- Open **DevTools**: Press `F12` or Right-click → Inspect
- **React DevTools**: Browser extension for component debugging
- **Network Tab**: Monitor API requests and responses
- **Console**: Check for JavaScript errors

### Common Issues & Solutions

#### MongoDB Connection Error
```
Error: Cannot connect to MongoDB
Solution:
1. Verify MONGO_URI in .env is correct
2. Check if MongoDB service is running: mongod --version
3. For MongoDB Atlas, verify IP whitelist includes your machine
```

#### CORS Error
```
Error: Cross-Origin Request Blocked
Solution:
1. Verify CORS_ORIGIN in backend .env matches frontend URL
2. Check authMiddleware.js allows proper headers
3. Ensure preflight requests are handled
```

#### Port Already in Use
```
Error: EADDRINUSE: address already in use :::5000
Solution:
# On Windows (PowerShell):
netstat -ano | findstr :5000
taskkill /PID <ProcessId> /F

# On macOS/Linux:
lsof -i :5000
kill -9 <ProcessId>
```

#### JWT Token Expired
```
Error: JWT token expired
Solution:
1. Clear localStorage/cookies
2. Log out and log back in
3. Use refresh token endpoint to get new JWT
```

---

## Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend

# Create production build
npm run build

# Deploy dist/ folder to Vercel or Netlify
# Vercel: vercel deploy
# Netlify: netlify deploy --prod --dir=dist
```

**Vercel Setup:**
1. Push code to GitHub
2. Log in to [Vercel](https://vercel.com)
3. Connect GitHub repository
4. Configure build settings:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables (VITE_API_URL)
6. Deploy!

### Backend Deployment (Railway/Heroku/Render)

```bash
cd backend

# Create Procfile for Heroku/Render
echo "web: node server.js" > Procfile

# Create .env.production with production values
```

**Environmental Variables for Production:**
```env
PORT=5000
NODE_ENV=production
MONGO_URI=<production-mongodb-uri>
JWT_SECRET=<strong-secret-key>
GOOGLE_CLIENT_ID=<google-oauth-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
CORS_ORIGIN=<production-frontend-url>
```

**Render Setup:**
1. Push code to GitHub
2. Log in to [Render](https://render.com)
3. Create new Web Service from GitHub
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add environment variables
6. Deploy!

---

## Contributing

### Contributing Guidelines

1. **Fork the repository** to your GitHub account
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit with clear messages:
   ```bash
   git commit -m "Add feature: description"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request** with a detailed description

### Code Style

- **JavaScript:** Use semicolons, camelCase naming
- **React:** Use functional components and hooks
- **CSS:** Use Tailwind utility classes
- **Commits:** Follow conventional commits (`feat:`, `fix:`, `docs:`, etc.)

### Branch Naming Convention

- `feature/<feature-name>` — New features
- `bugfix/<bug-name>` — Bug fixes
- `docs/<doc-name>` — Documentation updates
- `refactor/<refactor-name>` — Code refactoring

---

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement lazy loading with React.lazy and Suspense
- Optimize images and assets
- Enable gzip compression
- Monitor with Lighthouse audits

### Backend
- Index MongoDB collections
- Use pagination for large datasets
- Implement caching strategies
- Rate limiting for API endpoints
- Enable compression middleware

---

## Security Best Practices

1. ✅ Use HTTPS in production
2. ✅ Hash passwords with bcrypt
3. ✅ Validate and sanitize all user inputs
4. ✅ Use environment variables for sensitive data
5. ✅ Implement JWT with short expiration times
6. ✅ Set secure CORS policies
7. ✅ Use rate limiting on authentication endpoints
8. ✅ Keep dependencies updated: `npm audit fix`
9. ✅ Implement HTTPS redirects
10. ✅ Use Content Security Policy headers

---

## File Size Limits

- **MongoDB Documents:** 16MB max size
- **Event Cover Image:** Recommended 2-5MB
- **User Profile Photo:** Recommended 500KB-1MB

---

## Browser Support

- ✅ Chrome/Edge: Latest 2 versions
- ✅ Firefox: Latest 2 versions
- ✅ Safari: Latest 2 versions
- ✅ Mobile browsers: iOS Safari 13+, Chrome Android 90+

---

## Maintenance

### Regular Tasks

- **Weekly:** Monitor server logs and error rates
- **Monthly:** Review and update dependencies (`npm outdated`)
- **Quarterly:** Perform security audit (`npm audit`)
- **Annually:** Review and update Node.js/MongoDB versions

### Backup Strategy

```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://..." --out ./backups

# Backup code
git push origin main  # Always maintain remote backup
```

---

## FAQ

**Q: How do I reset my password?**  
A: Use the "Forgot Password" link on the login page. You'll receive an email with a reset link.

**Q: Can I upload images?**  
A: Yes, in your profile and project pages (PNG, JPEG, GIF up to 5MB).

**Q: How do I become an admin?**  
A: Contact the CID-Cell coordinators. Use the `promoteUser.js` script to grant admin privileges.

**Q: What if the API is not responding?**  
A: Check if the backend server is running (`npm run dev` in the backend folder).

**Q: How do I report a bug?**  
A: Create an issue on GitHub with detailed reproduction steps.

---

## Contact & Support

**For issues, suggestions, or inquiries:**
- 📧 Email: cidcell@department.edu
- 🐦 Twitter: [@CIDCell](https://twitter.com/cidcell)
- 💬 Discord: [Join Server](https://discord.gg/cidcell)

**Development Team:**
- Lead Developer: Engineering Team
- Backend Architect: API Development Team
- UI/UX Designer: Design Team

---

## Resources & References

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT.io Introduction](https://jwt.io/introduction)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

## Changelog

### Version 1.0.0
- ✅ Initial release of CID-Cell website
- ✅ Complete user authentication system
- ✅ Project and event management
- ✅ Admin dashboard
- ✅ Member onboarding workflow
- ✅ Neo-Brutalist design implementation

---

**Last Updated:** March 2026  
**Maintained By:** CID-Cell Development Team

<p align="center">
  Built with ❤️ by <strong>CID-Cell</strong> — CSE Department
</p>
