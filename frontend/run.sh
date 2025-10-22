#!/bin/bash
set -e

echo "🚀 EES Sigorta Frontend Başlatılıyor..."

# Dependencies yükle
if [ ! -d "node_modules" ]; then
    echo "📦 Dependencies yükleniyor..."
    npm install
fi

# .env.local dosyasını kontrol et
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local dosyası bulunamadı, env.local.example'dan kopyalayın"
    echo "cp env.local.example .env.local"
fi

# Development server başlat
echo "✅ Frontend başlatılıyor (Port 3000)..."
npm run dev

