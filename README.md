# VintageDagoShop

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

E-commerce platform for vintage clothing. Built with Clean Architecture for web and future React Native mobile.

## Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18 + Vite                   |
| Styles      | CSS Modules                       |
| Routing     | React Router v6                   |
| State       | Context API + Hooks               |
| Backend     | Node.js + Express                 |
| Database    | MySQL 8.0 (Docker)                |
| DB Admin    | phpMyAdmin (Docker)               |
| Testing     | Vitest                            |
| Code Quality| ESLint + Prettier                 |
| Mobile      | React Native (planned)            |

## Architecture

Clean Architecture with four layers:

```
Presentation  →  Application  →  Domain  ←  Infrastructure
  (React)        (Services)    (Entities)    (MySQL / API)
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for details.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker Desktop >= 4.0

## Setup

```bash
git clone https://github.com/username/VintageDagoShop_Repo.git
cd VintageDagoShop
npm install
cd backend && npm install && cd ..
cp .env.example .env
docker-compose up -d
npm run dev
```

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:5173        |
| Backend API| http://localhost:3000/api    |
| phpMyAdmin | http://localhost:8080        |

## Scripts

```bash
npm run dev           # Start frontend dev server
npm run build         # Production build
npm run lint          # Run ESLint
npm run format        # Run Prettier
npm run test          # Run tests
npm run test:coverage # Run tests with coverage
```

## Naming Conventions

| Type        | Convention    | Example                    |
|-------------|---------------|----------------------------|
| Components  | PascalCase    | `ProductCard.jsx`          |
| Functions   | camelCase     | `calculateTotal`           |
| Constants   | UPPER_SNAKE   | `MAX_CART_ITEMS`           |
| CSS Modules | kebab-case    | `product-card.module.css`  |
| Env vars    | UPPER_SNAKE   | `DB_HOST`, `JWT_SECRET`    |

## Security

- Never commit `.env`
- Validate all user inputs
- Use HTTPS in production

## Roadmap

### Phase 1 — MVP ✅
- [x] Product catalog
- [x] Shopping cart (LocalStorage)
- [x] Checkout flow
- [x] Inventory management

### Phase 2 — Backend + MySQL + Docker 🚧
- [ ] Node.js + Express REST API
- [ ] MySQL 8.0 database (Docker)
- [ ] JWT authentication
- [ ] Payment gateway integration

### Phase 3 — Advanced Features
- [ ] Search and filters
- [ ] Reviews and ratings
- [ ] Wishlist
- [ ] Order history

### Phase 4 — Mobile
- [ ] React Native iOS
- [ ] React Native Android

## License

MIT — see [LICENSE](./LICENSE)

## Documentation

See [docs/](./docs/) for full documentation.
