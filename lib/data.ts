// lib/data.ts - Central data store (can be replaced with a real DB later)

export interface Destination {
  id: string
  name: string
  slug: string
  category: 'alam' | 'kuliner' | 'budaya' | 'pantai' | 'desa' | 'umkm'
  location: string
  distance: string
  crowdLevel: 'low' | 'medium' | 'high'
  rating: number
  reviewCount: number
  image: string
  tags: string[]
  description: string
  tips: string
  coordinates: { lat: number; lng: number }
  matchScore?: number
}

export interface Post {
  id: string
  author: string
  avatar: string
  badge: string
  time: string
  category: string
  title: string
  body: string
  image?: string
  votes: number
  comments: number
  tags: string[]
}

export interface CrowdReport {
  name: string
  level: 'rendah' | 'sedang' | 'padat' | 'lancar'
  color: string
  trend: 'up' | 'down' | 'stable'
}

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Sumber Sirah',
    slug: 'sumber-sirah',
    category: 'alam',
    location: 'Kepanjen, Malang',
    distance: '28 km dari Kota',
    crowdLevel: 'low',
    rating: 4.8,
    reviewCount: 234,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN02vMiqvaGnOa6efcPEmXwrm50s8OcLGrDJf0MYIeilX88Yn-h3EJjZWIrkLlz1qvrCcTBjgFbcpvPExplRCYOBJ1CqzgrfwEqqTAdogaF3NnzdYQfzXu6WmHPoL20FhVhNNJ_z1CS5EmguKlFMmwOVHryQR_5qt-tW8B7O8QWSXThn_UGU84OWUhuQfV19ziVQaRhWx2CUr0_z6xfRXenLZUUXR0pywcEkYkNBJ9eXbOAthVmalj53vSfqGxQXUpDFEajluUJA',
    tags: ['#AirJernih', '#ProdukLokal', '#Hidden'],
    description: 'Wisata air jernih dengan ekosistem laut tawar yang memukau. Airnya berwarna biru kehijauan dan sangat jernih.',
    tips: 'Datang sebelum jam 8 pagi untuk menghindari keramaian.',
    coordinates: { lat: -8.1845, lng: 112.5595 },
    matchScore: 98,
  },
  {
    id: '2',
    name: 'Coban Pelangi',
    slug: 'coban-pelangi',
    category: 'alam',
    location: 'Poncokusumo, Malang',
    distance: '35 km dari Kota',
    crowdLevel: 'medium',
    rating: 4.7,
    reviewCount: 891,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6cmmz7BEcdCiu3YWBaT_w09654FkbNa7fn7uKc4uMnPHzyb7OocUw2-osfSUm5F8mER7xGeYeqNvazVnkoihO8pjOo4FOUx8Dm82LswY-ZMdRalN2j1_tp_AbANfekmLk9zGqEnpnJJ0dB8WZ4N5u-27zzibQucnhdqicnmq7c4zvEIjUl67NphosM9ysKPkZ9BCUCdOj_K4dyqJFuWeTpi8qoY3h-JNf1NtsJFmxOnjvo7om0MqmREUf8Ffveq0fxeTeY1G__w',
    tags: ['#Pelangi', '#Trekking', '#Fotografi'],
    description: 'Air terjun pelangi yang megah di kaki Semeru. Terkenal karena fenomena pelangi yang muncul setiap hari.',
    tips: 'Waktu terbaik antara 10-12 siang saat matahari tinggi untuk melihat pelangi.',
    coordinates: { lat: -8.0632, lng: 112.9075 },
    matchScore: 92,
  },
  {
    id: '3',
    name: 'Pantai Licin',
    slug: 'pantai-licin',
    category: 'pantai',
    location: 'Sumbermanjing Wetan',
    distance: '65 km dari Kota',
    crowdLevel: 'low',
    rating: 4.9,
    reviewCount: 67,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqJ_RH94gXNL6XjiNQcrFrxzJyT2BRBDpDf0KjX44tI6Q5e33ZHYb4x9q7SRZ0Z29swr2NMrDeBx90YmAEEYpyJBtd3B5BUihOtlb303WSb7e8T45-acSxxcW80vUd3ufW3dyMA-fRMRiOGKBlJBdqJGWfhM35xzCanNoXHFEt5R0Y58cg6XlkM777ZJQYVqSPPCyKw1cPLtO4z7xS1TRffzIKXorZAVEHzPru0kLGtLjK4eTX23nrwJEAlqps_I8MfGnOydccKQ',
    tags: ['#PasirHitam', '#Terpencil', '#Surfing'],
    description: 'Pasir hitam legam yang kontras dengan buih laut putih. Surga tersembunyi para petualang sejati.',
    tips: 'Bawa kendaraan 4WD atau motor trail. Jalan menuju ke sana masih belum diaspal.',
    coordinates: { lat: -8.4512, lng: 112.7234 },
  },
  {
    id: '4',
    name: 'Desa Wisata Gubugklakah',
    slug: 'gubugklakah',
    category: 'desa',
    location: 'Poncokusumo, Malang',
    distance: '30 km dari Kota',
    crowdLevel: 'low',
    rating: 4.6,
    reviewCount: 312,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEKl5TVmT6eR4gMULrwwD4JnOWRiEaUO1OCYtbRARKWHfz3FctkAGRwvD5x_AIkLw5NnRs8x_hRFOh_u4Xridv7qUZq2lkzezCBu0tCoH4NyBOH8F-6k4BViN6KTEwRpfJgOKvKO4dgzPAdH3YaqQk5DV4MZkbKtzRSw7W5hPwdk2Ac83HG5OG-uVJ8qh4z6wp7kOk9O731m9ME6MzNL7QMh2T7T-l0-6RwCh4Je6XNwO2UPeCsx2Hib7WsYl5V9i6y9vbdxH-fw',
    tags: ['#KulturLokal', '#Homestay', '#Pertanian'],
    description: 'Desa wisata agraris dengan view Semeru yang memukau. Nikmati hidup sebagai petani sehari penuh.',
    tips: 'Pesan homestay minimal H-3. Tersedia paket petik apel langsung dari kebun.',
    coordinates: { lat: -8.0124, lng: 112.8876 },
  },
  {
    id: '5',
    name: 'Candi Singosari',
    slug: 'candi-singosari',
    category: 'budaya',
    location: 'Singosari, Malang',
    distance: '10 km dari Kota',
    crowdLevel: 'low',
    rating: 4.5,
    reviewCount: 456,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6nvRT9qevJ_cAP60HwiYPEw3QbtFOc_IZGmp0AofS96Hd9mNRFhk-YP8pmKF4dIT-izHMI1o_JncKSHdLMylKS0Q1JU2EmO_rn1qhA1rPqOl5F5aABQVTuaJ5sSASvgHWTZca1x5nhuCYO3ZPlc1kE3EFe666oKP9rz1HIZOYeQgc0x4TqRfG-shqLdMDOBtJVtskw6-Nmv50gZOsFX1G1U5nJJ6MP_GwYR-_ShC2w9qmVM5zgnpdlj81YOa71ipQ9HfFBM5R8w',
    tags: ['#Sejarah', '#SpiritualTrail', '#KerajaanKuno'],
    description: 'Peninggalan megah Kerajaan Singosari abad ke-13. Nilai sejarah yang luar biasa di pinggir kota.',
    tips: 'Kunjungi saat senja hari untuk pencahayaan foto terbaik.',
    coordinates: { lat: -7.9087, lng: 112.6659 },
  },
  {
    id: '6',
    name: 'Warung Kopi Pak Ndut',
    slug: 'warung-kopi-pak-ndut',
    category: 'kuliner',
    location: 'Jl. Ijen, Malang Kota',
    distance: '3 km dari Pusat',
    crowdLevel: 'medium',
    rating: 4.9,
    reviewCount: 1203,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHCiOtiuJPWDHUUSoF2HSeSr4ura60obud3aWMZnKqEkDix1cOFk-DlnSlDCtF-oYC3gHhZ5PRsPnimg9eqryOmB0C8OhnaGa7ELCc55jjyiMpuBWlsWmos8amAEa66uInZAgh_ISgE42vaTyyBNZN1heUelvmiKjbnd9nnWf0Xa7uExU-FXkXQcXxHy6Kc0Z05gZ8as6MQPgu5Xgigce8X7yku7_DWlvD-S_dIct-wlAtC1e1vHe2sycPeCUYRFb9Xp6pP4wHlA',
    tags: ['#KopiLokal', '#UMKM', '#IconikMalang'],
    description: 'Warung kopi legendaris yang sudah 40 tahun melayani warga Malang. Kopi robusta lokal dengan citarasa unik.',
    tips: 'Coba kopi item panas dengan pisang goreng. Buka dari jam 6 pagi.',
    coordinates: { lat: -7.9666, lng: 112.6209 },
  },
]

export const posts: Post[] = [
  {
    id: '1',
    author: 'Sam_Ganteng',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBx9RRZfW5AQu2mXgxSOHG6fvOKFXRjbBMTOqhuhnXwHlGC1ziB7rp1SCcL5KMdnwSO9TVnz9DGFzBRoftPYjbfs6UdWDDuTQaXHHdhjA8uLyW7vzGgdmgRREAa93UHR687dx1jo3CT6QjU2_r3NpgNEiXcrb2EeRdn7pey_pJn28bHgfMt30HtED7KT6qWZYb7OmwTTwWLlS7LbMmIXJquNhK_6xdrDy0EV8o5TpQGQrZe-5NzeBoT5B-k0mxY4U_govx_gBcgg',
    badge: 'Local Expert',
    time: '2 jam lalu',
    category: 'Tips Lokal',
    title: 'Jalur ke Bromo saat ini cerah, keramaian rendah!',
    body: 'Baru saja turun dari Penanjakan 1. Cuaca sangat mendukung, tidak ada kabut tebal. Untuk yang mau naik sekarang, jalannya lancar jaya tapi tetep waspaya pasir licin ya Sam!',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh4kt9kSgB7jg5ItFY8B9GbxIiWr2yI9mRzpzrdsSZcrOKP_xpv03_6yEA9RmLqC5F47G0-zPmOEcffIGVMFly0OOQfUSzDtsR022OL9KUzao8ui3-UaSdETC25wH7h1_H5hD9Y3hcY9SFVcOD6nSwS2JHM0YK9jqxyR93ak2liDxiT5CLSzOumXaA3EMOc6BqLccV_TBFKOgN7RauocSXYDx2ZfmrhQu-BTdJhHFiVjSVpUCaxT37rzf-Nvfl82lmqq5vckVGww',
    votes: 1247,
    comments: 89,
    tags: ['bromo', 'cuaca', 'tips'],
  },
  {
    id: '2',
    author: 'Dewi_Malang',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWtoxROcMHgUeoZf2sW7SCevSVcFVIRxCpponRQK-7acvqsN-U9B_JEDQrmB7DC1In6e3ML7FfN7EC0M2PIjYWVyH0Sr2eka0rW0opT0edC9vQqAdSgBjwb_hlFVYl0R2Dg4lSiYCym77gIACBF4OoADjKbj1nWfH8WU5GoJys4c6brq7H-9uAKRweUP4TPzxNMBIq00MoelCkMsyrwu0qdRG9cFH416w0o0H1XQ5mjQTeQ76zrCtjg7RvKoABdLfum0IjgtmrLA',
    badge: 'Foodie',
    time: '5 jam lalu',
    category: 'Kuliner',
    title: 'Nemu hidden gem kuliner di Pecinan! Wajib dikunjungi',
    body: 'Warung Es Krim Toko Oen Malang masih tetap legend sampe sekarang. Coba es krim vanila sambil nikmatin interior kolonial yang masih orisinal dari 1930-an.',
    votes: 823,
    comments: 47,
    tags: ['kuliner', 'pecinan', 'sejarah'],
  },
  {
    id: '3',
    author: 'TrekkingBro',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBx9RRZfW5AQu2mXgxSOHG6fvOKFXRjbBMTOqhuhnXwHlGC1ziB7rp1SCcL5KMdnwSO9TVnz9DGFzBRoftPYjbfs6UdWDDuTQaXHHdhjA8uLyW7vzGgdmgRREAa93UHR687dx1jo3CT6QjU2_r3NpgNEiXcrb2EeRdn7pey_pJn28bHgfMt30HtED7KT6qWZYb7OmwTTwWLlS7LbMmIXJquNhK_6xdrDy0EV8o5TpQGQrZe-5NzeBoT5B-k0mxY4U_govx_gBcgg',
    badge: 'Adventurer',
    time: '1 hari lalu',
    category: 'Petualangan',
    title: 'Review jujur: Trekking Coban Pelangi Atas 5 jam',
    body: 'Perjalanan 5 jam yang benar-benar worth it! Pemandangan di puncak benar-benar tidak ada tandingannya. Bawa air minimal 2 liter dan snack banyak.',
    votes: 654,
    comments: 112,
    tags: ['trekking', 'coban-pelangi', 'review'],
  },
]

export const crowdReports: CrowdReport[] = [
  { name: 'Bromo', level: 'rendah', color: '#1FAF8F', trend: 'down' },
  { name: 'Jatim Park 3', level: 'padat', color: '#EF4444', trend: 'up' },
  { name: 'Kampung Warna', level: 'sedang', color: '#EAB308', trend: 'stable' },
  { name: 'BNS', level: 'lancar', color: '#1FAF8F', trend: 'down' },
  { name: 'Coban Pelangi', level: 'sedang', color: '#EAB308', trend: 'up' },
  { name: 'Selecta', level: 'padat', color: '#EF4444', trend: 'up' },
]
