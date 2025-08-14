# Mini_Linkedin ✨

A full-stack LinkedIn clone built with the MERN stack, featuring real-time social networking capabilities, professional networking tools, and a modern responsive design.

## 🚀 Live Demo

**[View Live Application](https://mini-linkedin-frontend-enib.onrender.com/)**

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure login/logout system with JSON Web Tokens
- **Password Security**: Bcrypt password hashing for enhanced security
- **Protected Routes**: Route protection for authenticated users only
- **Session Management**: Persistent user sessions with token validation

### 👤 User Management
- **Profile Creation**: Complete user profile setup with personal and professional details
- **Profile Updates**: Edit profile information, skills, experience, and education
- **Profile Pictures**: Upload and update profile images with Cloudinary integration
- **User Discovery**: Suggested users feature to help build professional networks

### 🤝 Social Networking
- **Connection System**: Send, accept, and reject connection requests
- **Network Building**: View and manage your professional connections
- **Connection Suggestions**: Algorithm-based user suggestions for networking
- **Connection Status**: Track pending, accepted, and rejected connections

### 📝 Content Management
- **Post Creation**: Create and share professional posts with rich text
- **Image Uploads**: Add images to posts with drag-and-drop functionality
- **Post Interactions**: Like and comment on posts from your network
- **News Feed**: Personalized feed showing posts from connections
- **Post Management**: Edit and delete your own posts

### ✉️ Communication
- **Welcome Emails**: Automated welcome emails for new users via Mailtrap
- **Email Notifications**: System notifications for important activities
- **Professional Messaging**: Clean email templates for user communications

### 🎨 User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface using Tailwind CSS and DaisyUI
- **Smooth Animations**: Subtle animations and transitions for better UX
- **Loading States**: Professional loading indicators and skeleton screens

## 🛠 Tech Stack

### Frontend
- **React.js**: Frontend framework for building user interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **DaisyUI**: Component library built on Tailwind CSS
- **React Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API requests
- **React Query/TanStack Query**: Data fetching and state management

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing library
- **Multer**: Middleware for file uploads
- **Cloudinary**: Cloud-based image and video management

### Additional Services
- **Mailtrap**: Email testing and delivery service
- **Render**: Cloud hosting platform for deployment

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or later)
- **npm** (v6.0.0 or later)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ITSAMARHERE/Mini_Linkedin.git
cd Mini_Linkedin
```

### 2. Install Dependencies

#### Install Backend Dependencies
```bash
npm install
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory and add the following variables:

```bash
# Server Configuration
PORT=5000
MONGO_URI=<your_mongo_uri>

JWT_SECRET=<yourjwtsecret>

NODE_ENV=development

MAILTRAP_TOKEN=<your_mailtrap_token>
EMAIL_FROM=mailtrap@demomailtrap.com
EMAIL_FROM_NAME=<Your_Name>

CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>

CLIENT_URL=http://localhost:5173
```

### 4. Build and Start the Application

#### Development Mode
```bash
# Start backend server
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Build the application
npm run build

# Start the application
npm run start
```

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port number | Yes | `5000` |
| `MONGO_URI` | MongoDB connection string | Yes | `` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `your_jwt_secret_key` |
| `NODE_ENV` | Environment mode | Yes | `development` or `production` |
| `MAILTRAP_TOKEN` | Mailtrap API token for emails | Yes | `your_mailtrap_token` |
| `EMAIL_FROM` | Sender email address | Yes | `noreply@yourapp.com` |
| `EMAIL_FROM_NAME` | Sender name for emails | Yes | `Your App Name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | `your_api_secret` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | `your_cloud_name` |
| `CLIENT_URL` | Frontend application URL | Yes | `` |

## 🔌 API Endpoints

### Authentication Routes
```
POST   /api/auth/signup          # User registration
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
GET    /api/auth/me              # Get current user
```

### User Routes
```
GET    /api/users/suggestions    # Get suggested users
GET    /api/users/:id            # Get user profile
PUT    /api/users/profile        # Update user profile
```

### Connection Routes
```
POST   /api/connections/request/:userId     # Send connection request
PUT    /api/connections/accept/:requestId   # Accept connection request
PUT    /api/connections/reject/:requestId   # Reject connection request
GET    /api/connections                     # Get user connections
GET    /api/connections/requests            # Get connection requests
```

### Post Routes
```
GET    /api/posts                # Get all posts (news feed)
POST   /api/posts                # Create new post
GET    /api/posts/:id            # Get specific post
PUT    /api/posts/:id            # Update post
DELETE /api/posts/:id            # Delete post
POST   /api/posts/:id/like       # Like/unlike post
POST   /api/posts/:id/comment    # Add comment to post
```

## 📁 Project Structure

```
Mini_Linkedin/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── connection.controller.js
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Connection.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── connection.routes.js
│   │   ├── post.routes.js
│   │   └── user.routes.js
│   ├── utils/               # Utility functions
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── sendEmail.js
│   └── server.js            # Express server setup
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── common/      # Shared components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── profile/     # Profile-related components
│   │   │   └── posts/       # Post-related components
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── NetworkPage.js
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── context/         # React context providers
│   │   └── App.js           # Main App component
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 📱 Usage

### Getting Started
1. **Sign Up**: Create a new account with your email and professional details
2. **Complete Profile**: Add your profile picture, experience, skills, and education
3. **Connect**: Send connection requests to other professionals
4. **Share**: Create posts to share your professional updates and insights
5. **Engage**: Like and comment on posts from your network

### Key Features Usage

#### Profile Management
- Navigate to your profile to edit personal information
- Upload a professional profile picture
- Add your work experience, education, and skills
- Update your headline and summary

#### Building Your Network
- Use the "My Network" section to discover suggested connections
- Send personalized connection requests
- Accept or reject incoming connection requests
- View your existing connections

#### Creating Content
- Use the post composer on the homepage
- Add text content and images to your posts
- Tag connections and add hashtags
- Share professional updates and insights

#### Staying Engaged
- Browse your personalized news feed
- Like posts that resonate with you
- Leave thoughtful comments on posts
- Share valuable content with your network

## 🎯 Future Enhancements

- [ ] Real-time messaging system
- [ ] Job posting and application features
- [ ] Company pages and following
- [ ] Advanced search and filtering
- [ ] Video content support
- [ ] Mobile application
- [ ] Analytics dashboard
- [ ] Event creation and management
- [ ] Skill endorsements
- [ ] Content recommendations

## 🐛 Known Issues

- Image upload may be slow on slower connections
- Email notifications might end up in spam folders
- Mobile responsiveness needs minor adjustments on some devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [MongoDB](https://www.mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for image management
- [Mailtrap](https://mailtrap.io/) for email testing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [DaisyUI](https://daisyui.com/) for UI components

## 📞 Contact

**Developer**: ITSAMARHERE  
**GitHub**: [@ITSAMARHERE](https://github.com/ITSAMARHERE)  
**Project Link**: [https://github.com/ITSAMARHERE/Mini_Linkedin](https://github.com/ITSAMARHERE/Mini_Linkedin)

---

⭐ If you found this project helpful, please give it a star on GitHub!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
