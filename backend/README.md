# Secure eCommerce Backend

Production-oriented Express + MongoDB backend for eCommerce auth, RBAC, and admin product management.

## Features

- Access and refresh JWTs with refresh-token rotation
- Password hashing with bcrypt
- Email verification and password reset flows using expiring, hashed tokens
- RBAC for `admin` and `user`
- Helmet, CORS, rate limiting, input validation, Mongo sanitization, XSS cleanup, HPP, centralized error handling
- Hashed refresh token storage and token revocation on logout / reuse detection
- Structured logging with Winston and request logging with Morgan

## Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    validators/
```

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally or point `MONGODB_URI` at your cluster
4. Run the API:

```bash
npm run dev
```

## Important Security Notes

- Use HTTPS in production so bearer tokens and credentials are never transmitted over plain HTTP.
- Generate long random secrets for all JWT keys.
- Refresh tokens are stored hashed in MongoDB to reduce impact if the database is exposed.
- The sample email sender logs verification/reset links instead of sending them; wire it to SES, SendGrid, or another provider before production.
- CSRF middleware is intentionally omitted because the reference implementation keeps tokens out of browser cookies. If you move refresh tokens into cookies, add CSRF protection and same-site cookie policy.
