# Error Register (Historical)

This record captures workstation issues observed on 2026-09-15. Treat its resolutions and pending items as historical until reproduced.

Current runtime evidence: [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md). Active priorities: [ROADMAP.md](ROADMAP.md).

During the latest local Docker run, MySQL reported healthy but the backend could not authenticate to the existing MySQL volume and `/api/products` failed. Preserve that volume while investigating; initialization SQL does not rerun on an existing data directory.
