#!/bin/bash

echo "🧹 Limpando cache do Prisma..."
rm -rf node_modules/.prisma
rm -rf prisma/migrations

echo "📦 Reinstalando dependências do Prisma..."
npm uninstall @prisma/client prisma
npm install @prisma/client prisma

echo "🔄 Regenerando cliente Prisma..."
npx prisma generate

echo "🗄️ Aplicando schema ao banco (resetando dados)..."
npx prisma db push --force-reset

echo "🌱 Executando seed..."
node scripts/seed.js

echo "✅ Prisma resetado com sucesso!"
