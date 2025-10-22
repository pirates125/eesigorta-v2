#!/bin/bash
set -e

echo "🚀 EES Sigorta Backend Başlatılıyor..."

# .env dosyasını kontrol et
if [ ! -f .env ]; then
    echo "⚠️  .env dosyası bulunamadı, env.template'den kopyalayın"
    echo "cp env.template .env"
    exit 1
fi

# Database migration
echo "📦 Database migration çalıştırılıyor..."
cargo run --bin sqlx -- database create || true
cargo run --bin sqlx -- migrate run || true

# Backend'i başlat
echo "✅ Backend başlatılıyor (Port 8099)..."
cargo run --release

