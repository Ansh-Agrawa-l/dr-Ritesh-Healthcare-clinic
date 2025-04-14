# Healthcare Clinic Management System

A comprehensive healthcare management system for clinics, hospitals, and medical practices.

## Features

- Patient Management
- Doctor Management
- Appointment Scheduling
- Lab Test Management
- Medicine Inventory
- User Authentication
- Role-based Access Control

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Set your MongoDB connection string
   - Configure JWT secret
   - Set up email configuration if needed

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Set the API URL
   - Configure other services as needed

5. Start the frontend development server:
   ```bash
   npm start
   ```

## Deployment Instructions

### Backend Deployment

1. Set up your production environment:
   ```bash
   cp .env.example .env.production
   ```
   Update `.env.production` with your production values:
   - Use production MongoDB URI
   - Set strong JWT secret
   - Configure production CORS settings

2. Install production dependencies:
   ```bash
   npm install --production
   ```

3. Build and start the server:
   ```bash
   npm run build
   npm start
   ```

4. For production, use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "healthcare-backend" -- start
   ```

### Frontend Deployment

1. Set up your production environment:
   ```bash
   cp .env.example .env.production
   ```
   Update `.env.production` with your production values:
   - Set production API URL
   - Configure production uploads URL

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Deploy the contents of the `build` directory to your hosting service.

### Production Checklist

1. Security:
   - [ ] Use HTTPS in production
   - [ ] Set strong JWT secrets
   - [ ] Configure proper CORS settings
   - [ ] Implement rate limiting
   - [ ] Set up proper file upload security

2. Performance:
   - [ ] Enable compression
   - [ ] Configure caching
   - [ ] Optimize database queries
   - [ ] Set up proper logging

3. Monitoring:
   - [ ] Set up error tracking
   - [ ] Configure performance monitoring
   - [ ] Set up uptime monitoring

4. Backup:
   - [ ] Set up database backups
   - [ ] Configure file upload backups
   - [ ] Set up regular backup testing

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRE`: JWT expiration time
- `UPLOAD_DIR`: File upload directory
- `MAX_FILE_SIZE`: Maximum file size for uploads
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_UPLOADS_URL`: File uploads URL

## Security Considerations

1. Always use strong, unique passwords for all accounts
2. Keep your JWT secret secure and never commit it to version control
3. Use HTTPS in production
4. Regularly update dependencies
5. Implement rate limiting for API endpoints
6. Use environment variables for sensitive information

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Healthcare Management System - Deployment Guide

## Vercel Deployment Instructions

### Prerequisites
- Vercel account
- MongoDB Atlas account
- Git repository

### Backend Deployment
1. Push your code to a Git repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Configure the following environment variables in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `UPLOAD_DIR`
   - `MAX_FILE_SIZE`
6. Deploy

### Frontend Deployment
1. Push your code to a Git repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Configure the following environment variables in Vercel:
   - `REACT_APP_API_URL`
   - `REACT_APP_UPLOADS_URL`
6. Deploy

### Post-Deployment
1. Update CORS settings in backend with your frontend domain
2. Test all functionalities
3. Monitor error logs
4. Set up proper error tracking

### Important Notes
- Keep your environment variables secure
- Use strong JWT secrets
- Configure proper CORS settings
- Monitor your MongoDB connection
- Set up proper error handling 