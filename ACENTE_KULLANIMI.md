# 📋 Acente Kullanım Kılavuzu

## 🎯 Platform Amacı

EES Sigorta Platform, sigorta acentelerinin müşterilerine hızlı ve kolay bir şekilde birden fazla sigorta şirketinden teklif almasını ve poliçe kesmesini sağlar.

## 🚀 İlk Kurulum

### 1. Sisteme Giriş

1. Tarayıcıda `http://localhost:3000` adresini açın
2. İlk kullanımda **Kayıt Ol** butonuna tıklayın
3. Acente bilgilerinizi girin:
   - **E-posta**: Kurumsal e-posta adresiniz
   - **Şifre**: Güçlü bir şifre (min 6 karakter)
   - **Ad Soyad**: Acente yetkilisi adı
   - **Telefon**: İletişim numaranız
4. **Kayıt Ol** butonuna tıklayın

### 2. Dashboard

Giriş yaptıktan sonra ana sayfada (Dashboard) şunları görürsünüz:
- Toplam aldığınız teklif sayısı
- Kesilen poliçe sayısı
- Son teklifler
- Son poliçeler

## 💼 Günlük İş Akışı

### Adım 1: Müşteri Teklif Talebi

Bir müşteri trafik sigortası teklifi istediğinde:

1. **Sol menüden** → **Trafik Sigortası**'na tıklayın

2. **Müşteri Bilgileri** bölümünü doldurun:
   ```
   Ad Soyad: Ahmet Yılmaz
   TC Kimlik: 12345678901
   Telefon: 5551234567
   ```

3. **Araç Bilgileri** bölümünü doldurun:
   ```
   Plaka: 34ABC123
   ```

4. **Teklif Alınacak Şirketler** seçin:
   - ✅ Sompo Sigorta
   - ✅ Quick Sigorta
   - ✅ Axa Sigorta
   - ✅ Anadolu Sigorta
   
   > 💡 **İpucu**: Birden fazla şirket seçin, en iyi fiyatı bulun!

5. **"X Şirketten Teklif Al"** butonuna tıklayın

### Adım 2: Teklifleri Bekleyin

- Sistem seçtiğiniz tüm şirketlere **aynı anda** gider
- Her şirket için ayrı ayrı sonuç gösterilir
- ⏱️ **1-2 dakika** sürebilir (şirkete göre değişir)

Loading ekranında şunları görürsünüz:
```
🔄 Teklifler alınıyor...
4 şirket sorgulanıyor
Bu işlem 1-2 dakika sürebilir
```

### Adım 3: Teklifleri Karşılaştırın

Sonuçlar geldiğinde sağ tarafta şirketler listelenecek:

```
┌─────────────────────────────┐
│ Sompo Sigorta        ✅     │
│ Net Prim: ₺3,500.00        │
│ Brüt Prim: ₺4,130.00       │
│ [Poliçe Kes]               │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Quick Sigorta        ✅     │
│ Net Prim: ₺3,200.00        │
│ Brüt Prim: ₺3,776.00       │
│ [Poliçe Kes]               │
└─────────────────────────────┘
```

> 💰 **En ucuz teklif yeşil renkte vurgulanır**

### Adım 4: Müşteriye Göster

1. Müşteriye tüm teklifleri gösterin
2. Fiyat ve teminatları açıklayın
3. Müşterinin seçim yapmasını bekleyin

### Adım 5: Poliçe Kesin

Müşteri karar verdikten sonra:

1. Seçilen şirketin yanındaki **"Poliçe Kes"** butonuna tıklayın
2. Sistem otomatik olarak poliçe oluşturur
3. Başarı mesajı görürsünüz:
   ```
   ✅ Sompo Sigorta için poliçe oluşturuldu!
   ```

### Adım 6: Poliçe Takibi

1. **Sol menüden** → **Poliçelerim**'e gidin
2. Kestiğiniz tüm poliçeleri görün
3. Poliçe detaylarını kontrol edin:
   - Şirket adı
   - Poliçe numarası (gelince)
   - Başlangıç tarihi
   - Bitiş tarihi
   - Durum (Beklemede/Aktif)

## 📊 Diğer Özellikler

### Tekliflerim

- **Sol menü** → **Tekliflerim**
- Aldığınız tüm teklifler
- Poliçeye dönüşenler
- Poliçeye dönüşmeyenler

### Ayarlar

- **Sol menü** → **Ayarlar**
- Profil bilgilerinizi güncelleyin
- Şifre değiştirin
- İletişim bilgilerini düzenleyin

### Admin Panel (Sadece Yöneticiler)

Eğer admin kullanıcıysanız:

1. **Sol menü** → **Admin** → **İstatistikler**
   - Toplam kullanıcı sayısı
   - Toplam teklif sayısı
   - Toplam poliçe sayısı

2. **Admin** → **Kullanıcılar**
   - Tüm acente kullanıcıları
   - Kullanıcı rolleri
   - Kayıt tarihleri

## 💡 İpuçları ve Püf Noktaları

### ⚡ Hızlı Teklif Alma

- **Çoklu seçim**: Tüm şirketleri aynı anda seçin
- **Paralel işlem**: Sistem hepsinden aynı anda teklif alır
- **Zaman kazanın**: 4 şirket = 1-2 dakika (sırayla değil!)

### 🎯 En İyi Fiyat Bulma

- Her zaman en az 3-4 şirket seçin
- Fiyatları karşılaştırın
- Müşteriye seçenekleri gösterin

### 📱 Müşteri Bilgileri

- TC Kimlik **11 haneli** olmalı
- Plaka **doğru formatta** olmalı (34ABC123)
- Telefon **0 olmadan** başlamalı (5xxxxxxxxx)

### 🔄 Tekrar Teklif

- Aynı müşteri için tekrar teklif alabilirsiniz
- Farklı günlerde farklı fiyatlar olabilir
- Her teklif sistem kayıtlarına

 geçer

## ❓ Sık Sorulan Sorular

### Teklif almak ne kadar sürer?

Şirket başına 30-120 saniye. 4 şirket seçerseniz yaklaşık 1-2 dakika.

### Poliçe hemen kesilir mi?

Sistemde poliçe kaydı hemen oluşur, ancak sigorta şirketinden onay 1-2 saat sürebilir.

### Birden fazla kullanıcı olabilir mi?

Evet! Her acente çalışanı kendi hesabını oluşturabilir.

### Geçmiş teklifler kaybolur mu?

Hayır, tüm teklifler **Tekliflerim** bölümünde kalıcı olarak saklanır.

### Fiyatlar gerçek mi?

Hayır, test ortamında çalışıyorsunuz. Gerçek fiyatlar için production ortamı gerekir.

## 🆘 Yardım ve Destek

### Teknik Sorun

1. Sayfayı yenileyin (F5)
2. Çıkış yapıp tekrar giriş yapın
3. Tarayıcı cache'ini temizleyin

### Teklif Alamıyorum

1. İnternet bağlantınızı kontrol edin
2. Bilgileri doğru girdiğinizden emin olun
3. Farklı bir şirket deneyin

### Poliçe Kesemiyorum

1. Teklifin başarılı geldiğinden emin olun
2. Yetkilerinizi kontrol edin
3. Admin ile iletişime geçin

## 📞 İletişim

Sorun yaşarsanız:
- **E-posta**: destek@eesigorta.com
- **Telefon**: 0850 XXX XX XX
- **WhatsApp**: +90 5XX XXX XX XX

---

**Başarılı satışlar dileriz!** 🎉

