# Roadmap

Prioridades basadas en código y comprobaciones locales del 2026-10-07. Este es el único backlog activo.

## P0: Runtime local repetible

- [ ] Reconciliar las credenciales del volumen MySQL existente con `.env` sin borrar datos.
- [ ] Confirmar que `GET /api/products` devuelve el catálogo por medio del backend.
- [ ] Confirmar que Vite responde correctamente en `localhost:5173` y que `/api` llega al backend.
- [x] Staging aislado sirve el catálogo por NGINX y completa checkout manual; ver [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md).
- [ ] Definir y probar una migración revisada para bases existentes; los scripts de inicialización solo corren sobre un volumen vacío.

## P1: Confianza de release

- [ ] Ejecutar Playwright completo contra el staging aislado sano y registrar resultados. Checkout manual y smoke de API admin pasaron.
- [x] `npm run lint` pasa con el umbral configurado de cero warnings.
- [ ] Revisar los borrados locales de `.github/workflows/ci-cd.yml` y `deploy.yml` antes de commit.
- [ ] Verificar producción con secretos seguros, persistencia, TLS/proxy y provisión segura de admin.

## Implementado y probado

- Login administrativo JWT y rutas protegidas por rol.
- API de catálogo, carrito/checkout/pedidos y transacción de inventario.
- Agregación de líneas repetidas de producto antes de verificar stock.
- Catálogo SQL separado de fixtures de desarrollo.
- Última suite Vitest: 24 tests pasan; build frontend pasa.

## Diferido

Búsqueda/paginación server-side, cuentas de clientes, historial de pedidos, notificaciones, pagos, baseline de carga y auditorías ampliadas de accesibilidad/seguridad.

Evidencia: [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md). Gates: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).
