# Release Checklist

Marcar un punto solo después de registrar el comando y el resultado del entorno objetivo.

## Staging

- [ ] `.env` no rastreado contiene `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD` y un `JWT_SECRET` fuerte.
- [ ] El volumen usa credenciales compatibles; no borrarlo para evitar investigar el mismatch.
- [ ] `docker compose config --quiet` pasa.
- [ ] `docker compose up -d --build` pasa y MySQL queda healthy.
- [ ] `GET /api/health` responde correctamente.
- [ ] `GET /api/products` devuelve el catálogo.
- [ ] `npm run build` y `npm test -- --run` pasan.
- [ ] `npm run lint` sale con código 0 y cero warnings.
- [ ] `npm run test:e2e` pasa con el stack activo.

## Producción

- [ ] Secretos privados y distintos de los fixtures locales.
- [ ] Admin aprovisionado de forma segura; no cargar `database/dev_fixtures.sql`.
- [ ] Migración/rollback de volúmenes existentes probados con backup.
- [ ] Proxy frontend, TLS, CORS, health checks y storage persistente verificados en infraestructura destino.
- [ ] Backup/restore y monitoreo comprobados.
- [ ] API niega acceso anónimo a admin; login y flujo de pedidos probado end-to-end.

## Post-deploy

- [ ] Verificar health, catálogo, checkout y permisos admin.
- [ ] Revisar logs, backups y alertas.
- [ ] Registrar versión, salida de verificación y referencia de rollback.
