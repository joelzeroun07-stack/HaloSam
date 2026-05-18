# Halo Sam! — Malang Smart Tourism Platform

Platform wisata cerdas untuk menjelajahi permata tersembunyi di Malang Raya. Rekomendasi berbasis AI, laporan keramaian real-time, perencanaan itinerary otomatis, dan komunitas traveler.

## ✨ Fitur Utama

- **Home** — Dashboard cuaca, info lalu lintas, rekomendasi AI personal
- **Explore** — Jelajahi destinasi dengan filter kategori, pencarian, dan sorting
- **AI Planner** — Generate itinerary otomatis berdasarkan preferensi
- **Community** — Forum diskusi, laporan keramaian real-time, voting posts
- **Profile** — Rencana tersimpan, pencapaian, XP system

## 🚀 Setup Lokal

### Prerequisites
- Node.js 18+
- npm atau yarn

### Instalasi

```bash
# Clone repository
git clone https://github.com/username/halo-sam.git
cd halo-sam

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
halo-sam/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── globals.css         # Global styles
│   ├── page.tsx            # Home page
│   ├── HomeScreen.tsx      # Home screen (client)
│   ├── explore/
│   │   ├── page.tsx
│   │   └── ExploreScreen.tsx
│   ├── planner/
│   │   ├── page.tsx
│   │   └── PlannerScreen.tsx
│   ├── community/
│   │   ├── page.tsx
│   │   └── CommunityScreen.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── api/
│       ├── destinations/route.ts   # GET destinations with filter
│       ├── community/route.ts      # GET posts & crowd reports
│       ├── weather/route.ts        # GET weather & traffic
│       └── planner/route.ts        # POST generate itinerary
├── components/
│   ├── Sidebar.tsx         # Desktop sidebar navigation
│   ├── MobileNav.tsx       # Mobile bottom navigation
│   └── DestinationCard.tsx # Reusable destination card
├── lib/
│   └── data.ts             # Data layer (destinations, posts, etc.)
├── public/
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🌐 Deploy ke Vercel

### Cara 1: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Cara 2: Via GitHub + Vercel Dashboard

1. Push ke GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Halo Sam! Smart Tourism"
git remote add origin https://github.com/username/halo-sam.git
git push -u origin main
```

2. Buka [vercel.com](https://vercel.com) → Import GitHub repo
3. Pilih repo `halo-sam` → Deploy otomatis!

### Environment Variables (opsional)
Untuk fitur produksi penuh, tambahkan di Vercel dashboard:

```env
# OpenWeatherMap (untuk cuaca real)
NEXT_PUBLIC_WEATHER_API_KEY=your_key_here

# Database (jika pakai Neon/PlanetScale)
DATABASE_URL=your_db_url_here
```

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/destinations` | List destinasi, support `?category=&search=&sort=` |
| GET | `/api/weather` | Cuaca Malang + info lalu lintas |
| GET | `/api/community` | Posts + crowd reports |
| POST | `/api/planner` | Generate itinerary AI |

### Contoh Request Planner:
```json
POST /api/planner
{
  "duration": 3,
  "style": ["petualang", "kuliner"],
  "crowdTolerance": "sepi",
  "budget": "standard"
}
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Google Material Symbols
- **Fonts**: Playfair Display + DM Sans
- **Language**: TypeScript
- **Deploy**: Vercel

## 📈 Pengembangan Selanjutnya

- [ ] Integrasi OpenWeatherMap API untuk cuaca real
- [ ] Database (Neon/Supabase) untuk data persisten
- [ ] Auth dengan NextAuth.js
- [ ] Google Maps integration
- [ ] Push notifications untuk crowd alerts
- [ ] PWA (Progressive Web App)
- [ ] Integrasi Claude AI untuk itinerary yang lebih cerdas

## 📄 Lisensi

MIT
