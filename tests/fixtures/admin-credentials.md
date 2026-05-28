# Test Admin Credentials

For testing admin features and E2E tests:

**Email:** admin@vintagedago.com  
**Password:** admin123

## Setup

The admin user is automatically created when you run:

```bash
docker-compose up -d
npm run db:reset
```

Or manually run the migration:

```bash
docker-compose exec mysql mysql -uvintagedago -pvintagedago vintagedago_db < database/add_users_table.sql
```

## Security Note

?? **IMPORTANT**: These are test credentials only. In production:
- Use strong passwords
- Store JWT_SECRET in environment variables (not hardcoded)
- Implement password reset functionality
- Add rate limiting on login endpoint
- Consider adding 2FA for admin accounts
