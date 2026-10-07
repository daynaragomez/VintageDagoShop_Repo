# Deployment and Local Operations

## Local development

1. Crea un `.env` no rastreado desde `.env.example` y usa secretos solo locales.
2. Inicia MySQL, backend y phpMyAdmin:

```powershell
docker compose up -d --build
docker compose ps
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://localhost:3000/api/products
```

3. En otra terminal, ejecuta `npm install` y `npm run dev`; abre `http://localhost:5173`. phpMyAdmin está en `http://localhost:8080`.

## Base de datos

Compose local monta `database/schema.sql`, `database/catalog.sql` y `database/dev_fixtures.sql`. MySQL ejecuta esos scripts solo al inicializar un directorio de datos vacío. Un volumen existente conserva usuarios/contraseñas anteriores y no se migra al cambiar `.env` o SQL.

Para un volumen existente, haz backup y aplica una migración revisada usando credenciales válidas. `database/add_users_table.sql` crea la tabla auth, no una cuenta admin. No uses `docker compose down -v` salvo que quieras borrar deliberadamente los datos.

## Staging local

`docker-compose.staging.yml` usa los puertos 5173, 5000 y 3307. Detén Vite local antes de iniciar staging porque ambos stacks necesitan 5173.

```powershell
npm run staging:up
$env:STAGING_URL='http://localhost:5173'
npm run test:e2e:staging
npm run staging:down
```

Las credenciales incluidas en Compose staging son solo para pruebas locales; no publiques ese stack.

## Producción

`docker-compose.prod.yml` es un punto de partida, no un despliegue validado. Antes de usarlo, configura secretos, almacenamiento persistente, TLS/proxy, backups, monitoreo, provisión admin y migraciones/rollback probados. El frontend usa `API_UPSTREAM` como upstream NGINX.

Ver [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) para gates y [docs/DATABASE.md](docs/DATABASE.md) para el esquema.
