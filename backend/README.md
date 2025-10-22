# Backend - Rust Axum Server

## Hızlı Başlangıç

### 1. Environment Variables

```bash
# .env dosyası oluştur
cat > .env << 'EOF'
DATABASE_URL=sqlite://ees.db
JWT_SECRET=super-secret-change-in-production-12345
PORT=8099
EOF
```

### 2. Database Kurulumu

Database ve migration'lar otomatik olarak ilk çalıştırmada yapılır. Manuel yapmak isterseniz:

```bash
# Database oluştur
touch ees.db

# Migration'ları çalıştır
sqlite3 ees.db < migrations/001_init.sql

# SQLx tracking tablosu (otomatik yapılır, manuel gerekli değil)
sqlite3 ees.db "CREATE TABLE IF NOT EXISTS _sqlx_migrations (
    version BIGINT PRIMARY KEY,
    description TEXT NOT NULL,
    installed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL,
    checksum BLOB NOT NULL,
    execution_time BIGINT NOT NULL
);"
```

### 3. Çalıştır

```bash
# Development
cargo run

# Release (daha hızlı)
cargo run --release
```

Backend `http://localhost:8099` adresinde başlayacak.

## API Endpoints

### Public (Authentication gerektirmez)

- `POST /api/v1/auth/register` - Yeni kullanıcı kaydı
- `POST /api/v1/auth/login` - Giriş yap
- `GET /health` - Sağlık kontrolü

### Protected (JWT Token gerekli)

**Header:**

```
Authorization: Bearer <your-jwt-token>
```

**User Endpoints:**

- `GET /api/v1/users/profile` - Profil bilgisi
- `PUT /api/v1/users/profile` - Profil güncelle
- `PUT /api/v1/users/password` - Şifre değiştir

**Quote Endpoints:**

- `POST /api/v1/quotes` - Yeni teklif al
- `GET /api/v1/quotes` - Kullanıcının tüm teklifleri

**Policy Endpoints:**

- `POST /api/v1/policies` - Poliçe oluştur
- `GET /api/v1/policies` - Kullanıcının tüm poliçeleri

### Admin Only (JWT Token + role=admin gerekli)

- `GET /api/v1/admin/stats` - Sistem istatistikleri
- `GET /api/v1/admin/users` - Tüm kullanıcılar

## Test

```bash
cargo test
```

## Database Reset

```bash
rm ees.db
cargo run  # Otomatik olarak yeniden oluşturulur
```

## İlk Admin Kullanıcısı Oluşturma

1. Önce normal kullanıcı olarak kayıt ol (frontend veya API ile)
2. SQLite'da role'ü admin yap:

```bash
sqlite3 ees.db "UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';"
```

## Python Scraper Entegrasyonu

Backend, Python scraper'ları subprocess olarak çağırır:

```rust
// Örnek kullanım (src/scraper/python_bridge.rs)
let response = call_python_scraper("sompo", request).await?;
```

Python scraper'lar stdin'den JSON alır, stdout'a JSON döner:

```bash
echo '{"product_type":"trafik","vehicle_plate":"34ABC123","tckn":"12345678901"}' | \
  python3 ../scrapers/sompo/main.py
```

## Dependencies

### Rust Crates

- **axum** - Web framework
- **tokio** - Async runtime
- **sqlx** - Database driver
- **jsonwebtoken** - JWT authentication
- **argon2** - Password hashing
- **serde** - Serialization

## Production Notları

1. **JWT_SECRET**: Üretimde güçlü, rastgele bir key kullanın
2. **Database**: SQLite yerine PostgreSQL kullanmayı düşünün
3. **HTTPS**: Reverse proxy (nginx/traefik) ile HTTPS ekleyin
4. **Rate Limiting**: Tower middleware ile ekleyin
5. **Logging**: Tracing level'ı ayarlayın (RUST_LOG env var)

```bash
# Logging level ayarlama
RUST_LOG=debug cargo run
```
