#!/usr/bin/env bash
set -e
if command -v docker >/dev/null 2>&1; then docker compose up -d db; fi
npm install
npm run db:seed
npm run dev
