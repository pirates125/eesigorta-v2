# 🚀 Hızlı Başlangıç Rehberi

## ⚡ 3 Adımda Başlat

### 1️⃣ Backend (Rust)

```bash
cd backend

# .env dosyası oluştur
cat > .env << 'EOF'
DATABASE_URL=sqlite://ees.db
JWT_SECRET=super-secret-change-in-production-12345
PORT=8099
EOF

# Çalıştır
cargo run
```

Backend `http://localhost:8099` adresinde başlayacak.

### 2️⃣ Frontend (Next.js)

```bash
cd frontend

# .env.local dosyası oluştur
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8099/api/v1
EOF

# Çalıştır
npm run dev
```

Frontend `http://localhost:3000` adresinde başlayacak.

### 3️⃣ Python Scraper Dependencies

```bash
cd scrapers

# Virtual environment (opsiyonel)
python3 -m venv venv
source venv/bin/activate

# Dependencies
pip install -r requirements.txt
playwright install chromium
```

## 📝 İlk Kullanım

1. **Tarayıcıda aç**: http://localhost:3000
2. **Kayıt ol**: Yeni hesap oluştur
3. **Giriş yap**: E-posta ve şifrenle giriş yap
4. **Teklif al**: Trafik > Form doldur > Sompo seç

## 🔧 İlk Admin Kullanıcısı

```bash
# Backend çalışırken, SQLite'a bağlan
sqlite3 backend/ees.db

# Kullanıcıyı admin yap
UPDATE users SET role = 'admin' WHERE email = 'senin@email.com';
.quit
```

## 🧪 Test

### Backend Test

```bash
cd backend
cargo test
```

### Scraper Test

```bash
cd scrapers
python3 test_sompo.py
```

### Frontend Type Check

```bash
cd frontend
npm run build
```

## 🐛 Sorun Giderme

### Backend başlamıyor

- `.env` dosyasının olduğundan emin ol
- SQLite yüklü mü kontrol et: `sqlite3 --version`

### Frontend başlamıyor

- `.env.local` dosyasının olduğundan emin ol
- `node_modules` sil ve tekrar yükle: `rm -rf node_modules && npm install`

### Scraper çalışmıyor

- Playwright browser yüklü mü: `playwright install chromium`
- Python dependencies yüklü mü: `pip list | grep playwright`

## 📊 Durum

### ✅ Tamamlandı

- Backend (Rust + Axum + SQLite)
- Frontend (Next.js 15 + Tailwind + shadcn/ui)
- Auth (JWT + Argon2)
- User management
- Teklif alma (Sompo template hazır)
- Admin panel

### 🚧 Geliştiriliyor

- Sompo gerçek entegrasyonu (mevcut kod var, test edilmeli)
- Quick, Axa, Anadolu provider'ları
- Kasko modülü
- Şifre değiştirme UI

## 🔗 API Endpoints

### Public

- `POST /api/v1/auth/register` - Kayıt
- `POST /api/v1/auth/login` - Giriş

### Protected (JWT required)

- `GET /api/v1/users/profile` - Profil
- `PUT /api/v1/users/profile` - Profil güncelle
- `POST /api/v1/quotes` - Teklif al
- `GET /api/v1/quotes` - Teklifler
- `POST /api/v1/policies` - Poliçe oluştur
- `GET /api/v1/policies` - Poliçeler

### Admin Only

- `GET /api/v1/admin/stats` - İstatistikler
- `GET /api/v1/admin/users` - Kullanıcılar

## 💡 İpuçları

1. **Development**: Her iki terminal'de de (backend + frontend) çalışmalı
2. **Loglara bak**: Backend console'da Rust logları, browser console'da frontend logları
3. **Database reset**: `rm backend/ees.db` sonra backend'i yeniden başlat
4. **Port değiştir**: `.env` ve `.env.local` dosyalarını düzenle

## 📚 Daha Fazla Bilgi

Detaylı dokümantasyon için `README.md` dosyasına bakın.
