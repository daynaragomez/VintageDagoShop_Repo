# VintageDagoShop

E-commerce para ropa vintage: React/Vite, API Express y MySQL 8.

## Estado verificado (2026-10-07)

- Vitest: 24 tests pasan.
- `npm run build`: pasa.
- `npm run lint`: pasa con el umbral configurado de cero warnings.
- Compose local/staging/producción: configuración validada.
- La última prueba de runtime encontró incompatibilidad entre las credenciales del backend y el volumen MySQL local existente; `/api/products` no quedó validado. No se borró el volumen.
- El stack staging aislado funciona en `http://127.0.0.1:5173`; catálogo, autenticación admin y compra manual verificados.
- E2E completo y despliegue de producción: pendientes.

Prioridades: [ROADMAP.md](ROADMAP.md). Evidencia y límites: [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md).

## Requisitos

- Node.js 20+.
- Docker Desktop con Linux containers.
- `.env` local basado en `.env.example`.

## Inicio local

```powershell
Copy-Item .env.example .env # primera configuración solamente
# Completa variables locales; no uses estos valores en producción.
docker compose up -d --build
npm install
npm run dev
```

Vite: `http://localhost:5173`; API: `http://localhost:3000`; phpMyAdmin: `http://localhost:8080`.

MySQL ejecuta los SQL de inicialización solo al crear un volumen vacío. Un volumen existente no se actualiza por cambiar `.env` o los scripts SQL. No uses `docker compose down -v` si necesitas conservar datos.

## Rutas

| Ruta | Uso |
|---|---|
| `/` | Catálogo y búsqueda básica |
| `/product/:id` | Detalle del producto |
| `/cart` | Carrito |
| `/checkout` | Checkout |
| `/confirmation` | Confirmación |
| `/admin/login` | Login administrativo |
| `/admin/orders` | Gestión de pedidos protegida |
| `/admin/orders/:id` | Detalle de pedido protegido |

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm test -- --run
npm run test:e2e
npm run staging:up
npm run staging:down
```

Consulta [docs/TESTING.md](docs/TESTING.md) para requisitos E2E.

## Documentación

- [MASTER_INDEX.md](MASTER_INDEX.md): mapa único de documentación.
- [ROADMAP.md](ROADMAP.md): lista priorizada de trabajo.
- [docs/README.md](docs/README.md): catálogo técnico.
- [DEPLOYMENT.md](DEPLOYMENT.md): operación local y límites de producción.
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md): gates de release.
