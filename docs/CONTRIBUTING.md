# Contributing Guide - VintageDagoShop

## How to Contribute

```bash
git clone https://github.com/username/VintageDagoShop_Repo.git
cd VintageDagoShop
git checkout -b feature/my-new-feature
```

1. Write clean, readable code following project conventions.
2. Add tests if needed.
3. Update documentation if needed.
4. Commit and open a pull request.

```bash
git add .
git commit -m "feat: add new feature X"
git push origin feature/my-new-feature
```

## Environment Setup

### Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Docker Desktop >= 4.0

### Full Setup

```bash
git clone https://github.com/username/VintageDagoShop_Repo.git
cd VintageDagoShop
npm install
cd backend && npm install && cd ..
cp .env.example .env
docker-compose up -d
npm run dev
```

Available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **phpMyAdmin**: http://localhost:8080

### Environment Variables (.env)

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vintagedago
DB_USER=vintagedago_user
DB_PASSWORD=yourpassword
DB_ROOT_PASSWORD=rootpassword
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
VITE_API_URL=http://localhost:3000/api
```

### Docker Commands

```bash
docker-compose ps
docker-compose logs -f backend
docker-compose restart backend
docker-compose stop
docker-compose down
docker-compose down -v
```

### Verify Setup

```bash
npm run lint
npm test
cd backend && npm test
curl http://localhost:3000/api/products
```

## Code Standards

### Naming Conventions

| Type | Convention |
|------|------------|
| Components | PascalCase |
| Functions | camelCase |
| Constants | UPPER_SNAKE_CASE |
| Files | PascalCase for components, camelCase for others |

### Component Structure

```javascript
import React from 'react';
import styles from './ComponentName.module.css';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState();
  const handleClick = () => {};
  return <div className={styles.container}>{/* JSX */}</div>;
}
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

### Tests

- Write tests for new logic.
- Keep coverage > 70%.
- Unit tests for services, integration tests for flows.

## Pull Request Process

### Checklist

- [ ] `npm run lint` passes
- [ ] `npm test` (frontend) and `cd backend && npm test` pass
- [ ] `docker-compose up -d` starts without errors
- [ ] API endpoints respond correctly
- [ ] SQL migrations documented in `database/migrations/` if applicable
- [ ] Documentation updated
- [ ] Commits follow convention
- [ ] Branch up to date with main

### PR Format

```
Title: type(scope): short description

Description:
- What this PR changes
- Why it is needed
- How to test it

Related: #issue-number
```

- Wait for at least 1 reviewer approval.
- Respond constructively to comments.

## Commit Convention

```
feat: new feature
fix: bug fix
docs: documentation change
style: formatting
refactor: code refactor
test: add tests
chore: maintenance
```

Examples:
```
feat(cart): add remove item button
fix(checkout): fix card validation
docs(readme): update setup instructions
```

## Bug Reports

```
Title: [BUG] Short description

1. What you expected to happen
2. What actually happened
3. Steps to reproduce
4. Screenshots if applicable
5. Environment (OS, browser, version)
```

## Feature Requests

```
Title: [FEATURE] Feature description

1. Problem it solves
2. Proposed solution
3. Alternatives considered
4. Impact on users
```

## Areas That Need Help

- Unit tests
- Documentation
- UI/UX improvements
- Performance optimization
- Accessibility

## Contact

- Email: contact@vintagedagoshop.com
- Issues: GitHub Issues
