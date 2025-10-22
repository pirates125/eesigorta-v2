- Rust 1.70+
- Python 3.10+
- Node.js 18+
- SQLite 3

## 1

```bash
cd backend

# .env dosyası oluştur
cp env.template .env
# dğzenle

# Dependencies yükle ve çalıştır
cargo build --release
cargo run --release
```

Backend `http://localhost:8099` adresinde çalışacak.

## 2

```bash
cd scrapers

# Virtual environment oluştur
python3 -m venv venv
source venv/bin/activate

# Dependencies yükle
pip install -r requirements.txt

# Playwright browser yükle
playwright install chromium

# .env dosyası oluştur (sompo credentials için)
cp env_example.txt .env
```

### 3

```bash
cd frontend

# Dependencies yükle
npm install

# .env.local dosyası oluştur
cp env.local.example .env.local

# Development server başlat
npm run dev
```

### Backend Test

```bash
cd backend
cargo test
```

### Python Scraper Test

```bash
cd scrapers
python3 test_sompo.py
```

### Frontend Test

```bash
cd frontend
npm test
```

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Sompo scraper için `.env` dosyasına credentials ekle

```env
SOMPO_USER=your_username
SOMPO_PASS=your_password
SOMPO_SECRET=your_totp_secret
```

```bash
# Backend build
cd backend
cargo build --release
./target/release/ees-sigorta-server

# Frontend build
cd frontend
npm run build
npm start
```
