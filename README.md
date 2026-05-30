# Monopoly React - Modern Board Game

Sebuah permainan papan Monopoly modern yang dibangun dengan React, Vite, TypeScript, dan Tailwind CSS. Game ini mendukung AI Opponent dengan perilaku cerdas dan pengaturan kustom yang mendalam.

## 🚀 Fitur Baru & Modifikasi
- **AI Early-Game Caution**: AI tidak lagi membeli properti secara agresif di 5 ronde pertama untuk menjaga likuiditas cash.
- **Custom Player Names**: Ubah nama pemain (Human & AI) langsung dari menu settings.
- **Dynamic Board Scaling**: Atur multiplier untuk harga properti, sewa, dan biaya bangun rumah.
- **Round Tracking**: AI mengambil keputusan berdasarkan jumlah ronde yang sudah berjalan.
- **UI Rounding**: Semua harga dinamis dibulatkan ke kelipatan $50 agar pengalaman bermain lebih rapi.

## 🛠️ Cara Mengubah Settings & Perilaku AI
1. Klik tombol **Start Game** atau **Advanced Settings** saat game dimulai/dipause.
2. **Section Players**: Ketik nama di kolom input. Untuk AI, pilih tingkat kesulitan (Easy, Medium, Hard) yang mempengaruhi kecepatan respon.
3. **Section Finance**: Geser slider *Starting Cash*. Harga properti akan otomatis menyesuaikan (Starting Cash / 1500).
4. **Section Board Rules**: Gunakan slider multiplier (0.5x - 3.0x) untuk mengubah ekonomi game secara instan.
5. **Section AI Behavior**:
   - *Early Caution (Rds)*: Berapa ronde awal AI harus berhati-hati.
   - *Caution Level*:
     - **Low**: AI menyisakan 40% cash.
     - **Medium**: AI menyisakan 50% cash.
     - **High**: AI menyisakan 60% cash.

## 💻 Teknologi
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion (Animasi)
- **State Management**: Zustand
- **Type Safety**: TypeScript Strict Mode

## 🚢 Deployment (Render.com)
Proyek ini siap dideploy ke Render sebagai Static Site:
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Routes**: Rewrite `/*` ke `/index.html` (untuk SPA routing)
