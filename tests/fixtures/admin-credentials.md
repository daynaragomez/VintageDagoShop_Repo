# Local Test Admin

Local/staging E2E fixture credentials only:

- Email: `admin@vintagedago.com`
- Password: `admin123`

On a newly initialized local/staging MySQL volume, `database/dev_fixtures.sql` inserts this account. Existing volumes are not reseeded automatically. Do not load this fixture or use these credentials in a publicly accessible environment or production.

Production admin accounts must be provisioned through a separate secure procedure. `database/add_users_table.sql` creates the users table only; it does not insert an account.
