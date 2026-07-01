import { NextRequest, NextResponse } from 'next/server'

interface PlannerRequest {
  duration: number
  style: string[]
  crowdTolerance: 'sepi' | 'normal' | 'ramai'
  budget: 'hemat' | 'standard' | 'premium'
}

// Mock itinerary templates - replace with real AI generation in production
const generateItinerary = (params: PlannerRequest) => {
  const days = []

  const activities = {
    pagi: [
      {
        time: '05:00',
        type: 'destination',
        name: 'Sunrise Gunung Bromo',
        location: 'Penanjakan, Probolinggo',
        duration: '3 jam',
        cost: { min: 35000, max: 50000 },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6nvRT9qevJ_cAP60HwiYPEw3QbtFOc_IZGmp0AofS96Hd9mNRFhk-YP8pmKF4dIT-izHMI1o_JncKSHdLMylKS0Q1JU2EmO_rn1qhA1rPqOl5F5aABQVTuaJ5sSASvgHWTZca1x5nhuCYO3ZPlc1kE3EFe666oKP9rz1HIZOYeQgc0x4TqRfG-shqLdMDOBtJVtskw6-Nmv50gZOsFX1G1U5nJJ6MP_GwYR-_ShC2w9qmVM5zgnpdlj81YOa71ipQ9HfFBM5R8w',
        tips: 'Berangkat pukul 02:30 dari Malang kota untuk sampai tepat waktu',
        crowdLevel: 'sedang',
        photoSpot: 'Bukit Kingkong dengan latar belakang Gunung Batok',
        weatherAlternative: 'Jika hujan, tunggu di warung sekitar Cemoro Lawang'
      },
      {
        time: '07:00',
        type: 'meal',
        name: 'Sarapan di Warung Lokal Bromo',
        location: 'Cemoro Lawang',
        duration: '1 jam',
        cost: { min: 25000, max: 40000 },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHCiOtiuJPWDHUUSoF2HSeSr4ura60obud3aWMZnKqEkDix1cOFk-DlnSlDCtF-oYC3gHhZ5PRsPnimg9eqryOmB0C8OhnaGa7ELCc55jjyiMpuBWlsWmos8amAEa66uInZAgh_ISgE42vaTyyBNZN1heUelvmiKjbnd9nnWf0Xa7uExU-FXkXQcXxHy6Kc0Z05gZ8as6MQPgu5Xgigce8X7yku7_DWlvD-S_dIct-wlAtC1e1vHe2sycPeCUYRFb9Xp6pP4wHlA',
        tips: 'Coba nasi pecel + telur rebus. Hangat dan kenyang untuk trekking.',
        crowdLevel: 'rendah',
        mustTry: 'Nasi Pecel Hangat'
      },
    ],
    siang: [
      {
        time: '10:00',
        type: 'destination',
        name: 'Trekking Coban Pelangi',
        location: 'Poncokusumo, Malang',
        duration: '4 jam',
        cost: { min: 15000, max: 20000 },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6cmmz7BEcdCiu3YWBaT_w09654FkbNa7fn7uKc4uMnPHzyb7OocUw2-osfSUm5F8mER7xGeYeqNvazVnkoihO8pjOo4FOUx8Dm82LswY-ZMdRalN2j1_tp_AbANfekmLk9zGqEnpnJJ0dB8WZ4N5u-27zzibQucnhdqicnmq7c4zvEIjUl67NphosM9ysKPkZ9BCUCdOj_K4dyqJFuWeTpi8qoY3h-JNf1NtsJFmxOnjvo7om0MqmREUf8Ffveq0fxeTeY1G__w',
        tips: 'Pakai sandal gunung, jalur cukup terjal di 1 km pertama.',
        crowdLevel: 'sedang',
      },
      {
        time: '12:30',
        type: 'meal',
        name: 'Makan Siang: Warung Bambu',
        location: 'Pujon, Malang',
        duration: '1.5 jam',
        cost: { min: 45000, max: 75000 },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHCiOtiuJPWDHUUSoF2HSeSr4ura60obud3aWMZnKqEkDix1cOFk-DlnSlDCtF-oYC3gHhZ5PRsPnimg9eqryOmB0C8OhnaGa7ELCc55jjyiMpuBWlsWmos8amAEa66uInZAgh_ISgE42vaTyyBNZN1heUelvmiKjbnd9nnWf0Xa7uExU-FXkXQcXxHy6Kc0Z05gZ8as6MQPgu5Xgigce8X7yku7_DWlvD-S_dIct-wlAtC1e1vHe2sycPeCUYRFb9Xp6pP4wHlA',
        tips: 'Masakan khas Jawa Timur dengan view sawah. Rekomendasi UMKM Lokal.',
        crowdLevel: 'sepi',
      },
    ],
    sore: [
      {
        time: '15:00',
        type: 'destination',
        name: 'Eksplorasi Sumber Sirah',
        location: 'Kepanjen, Malang',
        duration: '2 jam',
        cost: { min: 10000, max: 15000 },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN02vMiqvaGnOa6efcPEmXwrm50s8OcLGrDJf0MYIeilX88Yn-h3EJjZWIrkLlz1qvrCcTBjgFbcpvPExplRCYOBJ1CqzgrfwEqqTAdogaF3NnzdYQfzXu6WmHPoL20FhVhNNJ_z1CS5EmguKlFMmwOVHryQR_5qt-tW8B7O8QWSXThn_UGU84OWUhuQfV19ziVQaRhWx2CUr0_z6xfRXenLZUUXR0pywcEkYkNBJ9eXbOAthVmalj53vSfqGxQXUpDFEajluUJA',
        tips: 'Air jernih dan segar, cocok untuk berenang. Bawa baju ganti!',
        crowdLevel: 'rendah',
      },
      {
        time: '17:00',
        type: 'destination',
        name: 'Sunset di Candi Singosari',
        location: 'Singosari, Malang',
        duration: '1.5 jam',
        cost: { min: 5000, max: 10000 },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6nvRT9qevJ_cAP60HwiYPEw3QbtFOc_IZGmp0AofS96Hd9mNRFhk-YP8pmKF4dIT-izHMI1o_JncKSHdLMylKS0Q1JU2EmO_rn1qhA1rPqOl5F5aABQVTuaJ5sSASvgHWTZca1x5nhuCYO3ZPlc1kE3EFe666oKP9rz1HIZOYeQgc0x4TqRfG-shqLdMDOBtJVtskw6-Nmv50gZOsFX1G1U5nJJ6MP_GwYR-_ShC2w9qmVM5zgnpdlj81YOa71ipQ9HfFBM5R8w',
        tips: 'Lokasi foto terbaik ada di sisi barat candi saat golden hour.',
        crowdLevel: 'sepi',
      },
    ],
  }

  for (let i = 0; i < Math.min(params.duration, 7); i++) {
    const dayActivities = []
    if (i === 0) {
      dayActivities.push(activities.pagi[0], activities.siang[1], activities.sore[0])
    } else if (i === 1) {
      dayActivities.push(activities.pagi[1], activities.siang[0], activities.sore[1])
    } else {
      dayActivities.push(
        activities.pagi[i % 2],
        activities.siang[i % 2],
        activities.sore[i % 2]
      )
    }

    const totalCostMin = dayActivities.reduce((sum, a) => sum + a.cost.min, 0)
    const totalCostMax = dayActivities.reduce((sum, a) => sum + a.cost.max, 0)
    
    // Create dates dynamically based on current day
    const dateObj = new Date()
    dateObj.setDate(dateObj.getDate() + i + 1)
    const dateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })

    const extra = params.budget === 'premium' ? 200000 : params.budget === 'hemat' ? 50000 : 100000

    days.push({
      day: i + 1,
      date: dateStr,
      theme: i === 0 ? 'Alam & Petualangan' : i === 1 ? 'Budaya & Kuliner' : 'Eksplorasi Santai',
      weather: 'Cerah, 24°C',
      activities: dayActivities as any,
      dailyBudget: { min: totalCostMin + extra, max: totalCostMax + extra + 50000 },
      highlights: ['Spot Foto', 'Kuliner Lokal', 'Wisata Alam']
    })
  }

  const summaryCost = days.reduce((sum, d) => sum + d.dailyBudget.min, 0)
  const transportCost = params.duration * 85000

  return {
    title: `Malang ${params.style.includes('Petualang') ? 'Heritage & Nature' : 'Santai Explore'} ${params.duration}D`,
    duration: params.duration,
    style: params.style,
    crowdTolerance: params.crowdTolerance,
    days,
    summary: {
      transport: transportCost,
      activities: summaryCost,
      food: params.duration * 75000,
      total: transportCost + summaryCost + params.duration * 75000,
    },
    aiTips: [
      'Gunakan motor sewa untuk fleksibilitas maksimal (Rp 80.000/hari)',
      'Bawa uang cash cukup, banyak wisata alam belum terima QRIS',
      params.crowdTolerance === 'sepi'
        ? 'Hindari berkunjung saat weekend dan hari libur nasional'
        : 'Semua destinasi dalam rute ini ramah untuk keluarga',
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PlannerRequest = await request.json()

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const itinerary = generateItinerary(body)
    return NextResponse.json({ success: true, itinerary })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to generate itinerary' }, { status: 500 })
  }
}
