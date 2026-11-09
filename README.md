# Nexam — University Entrance Exam Simulator

> **Your Next Step to University** — Platform simulasi ujian masuk kuliah (UTBK/SNBT & TPA) berbasis web dengan sistem timer realistis, analisis performa komprehensif, dan pembahasan terperinci.

---

## 🚀 Fitur Utama

- **Dua Mode Ujian**:
  - **Simulasi UTBK / SNBT**: 6 subtes terstandar (Penalaran Umum, Penalaran Matematika, Literasi Bahasa Indonesia, Literasi Bahasa Inggris, Pengetahuan Kuantitatif, Pemahaman Bacaan & Menulis) dengan skala penilaian 0 - 1000.
  - **Tes Potensi Akademik (TPA)**: 3 subtes (Verbal, Numerik, Figural) dengan skala standar 200 - 800 dan sistem penalti.
- **Sistem Ujian Realistis**:
  - Timer countdown per subtes & auto-submit saat waktu habis.
  - Navigasi nomor soal fleksibel dengan penandaan ragu-ragu.
  - Mendukung Pilihan Ganda (A-E) dan Isian Singkat angka.
  - Auto-save progres pengerjaan agar aman terhadap refresh browser.
- **Hasil & Analisis Mendalam**:
  - Ringkasan skor total dan akurasi jawaban.
  - Benchmark percentile ranking dibandingkan peserta lain.
  - Grafik distribusi skor dan indikator performa kecepatan.
  - Pembahasan detail langkah-demi-langkah untuk setiap soal.
- **User Experience Premium**:
  - Dark mode & Light mode dengan tema Slate & Indigo.
  - Bilingual (Bahasa Indonesia & English).
  - Animasi transisi halus bertenaga GSAP.
  - Desain 100% responsif (Desktop, Tablet, Mobile).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: GSAP (GreenSock)
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel & GitHub Actions

---

## 🏁 Memulai Pengembangan Lokal

### 1. Prasyarat
- Node.js >= 18
- pnpm >= 8

### 2. Instalasi
```bash
git clone https://github.com/<username>/nexam.git
cd nexam
pnpm install
```

### 3. Konfigurasi Environment
Salin `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Menjalankan Server Dev
```bash
pnpm dev
```
Akses [http://localhost:3000](http://localhost:3000) di browsermu.

---

## 🧪 Pengujian & Verifikasi

```bash
# Menjalankan unit tests
pnpm test

# Menjalankan type checking
pnpm type-check

# Menjalankan linter
pnpm lint

# Verifikasi production build
pnpm build
```

---

## 📄 Lisensi
MIT License © 2026 Nexam Team.
