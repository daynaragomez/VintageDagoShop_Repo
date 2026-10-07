# Start Here

1. Lee [README.md](README.md) y configura `.env` desde `.env.example`.
2. Arranca MySQL y la API con `docker compose up -d --build`.
3. Arranca Vite en otra terminal con `npm run dev`.
4. Comprueba `http://localhost:3000/api/health` y abre `http://localhost:5173`.
5. Antes de editar, ejecuta `npm test -- --run`.

## Enlaces

- Diseño: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- Persistencia: [docs/DATABASE.md](docs/DATABASE.md).
- Tests: [docs/TESTING.md](docs/TESTING.md).
- Prioridades: [ROADMAP.md](ROADMAP.md).
- Índice: [MASTER_INDEX.md](MASTER_INDEX.md).

Los volúmenes MySQL existentes no vuelven a ejecutar scripts de inicialización. Conserva el volumen; no uses `docker compose down -v` salvo que quieras borrar los datos.
