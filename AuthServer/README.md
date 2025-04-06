# JWT Authentication Server for Finance Tracker App

This is an ASP.NET 8 backend server that provides secure JWT authentication for the Finance Tracker frontend web application. It uses HttpOnly cookies to securely store JWT tokens and implements CSRF protection.

## Features

- Secure JWT token-based authentication
- HttpOnly cookies for token storage (protected against XSS attacks)
- CSRF protection with tokens
- Refresh token mechanism
- User validation endpoints
- In-memory database with test users

## Prerequisites

- .NET 8 SDK
- Visual Studio 2022 or VS Code

## Getting Started

1. Clone the repository
2. Navigate to the AuthServer directory
3. Run the server:

```bash
dotnet restore
dotnet run
```

The server will be available at `https://localhost:5001` and `http://localhost:5000`.

## API Endpoints

### Authentication

- **POST /api/auth/login** - Login with email and password
- **POST /api/auth/validate** - Validate if a user exists in the database
- **GET /api/auth/verify** - Verify if the current token is valid
- **POST /api/auth/refresh** - Refresh the JWT token
- **POST /api/auth/logout** - Logout and invalidate the token
- **GET /api/auth/check** - Check if the user is authenticated (protected route)

## Test Users

The database is seeded with the following test users:

1. **Regular User**
   - Email: test@example.com
   - Password: password123

2. **Admin User**
   - Email: admin@example.com
   - Password: admin123

## Frontend Integration

In your React frontend app's `src/services/authService.ts`, update the `API_URL` constant to point to this server:

```typescript
const API_URL = 'http://localhost:5000/api'; // Update with your backend server URL
```

## Security Considerations

- The server uses HttpOnly cookies to store JWT tokens, which provides protection against XSS attacks
- CSRF protection is implemented with a separate token
- Passwords are hashed (in a production environment, consider using a stronger hashing algorithm like BCrypt)
- Token expiration is set to 15 minutes by default, with refresh tokens valid for 7 days

## Production Deployment

Before deploying to production:

1. Update the JWT secret key in appsettings.json
2. Enable HTTPS and set RequireHttpsMetadata to true
3. Update CORS settings to allow only your frontend domain
4. Consider using a persistent database instead of the in-memory database
5. Implement proper password hashing using BCrypt or similar
6. Set up proper logging and monitoring 